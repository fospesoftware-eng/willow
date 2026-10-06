import type { JsonRequest as Request } from "@/native-request";
import { migrationLogger as log } from "@/migration-logger";
import {
  bookSlot,
  createPass,
  ensureSlot,
  getSaunaConfig,
} from "@/imported/lib/store/booking";
import { getStripeRuntime, getStripeClient } from "@/imported/lib/stripe";
import {
  SAUNA_TICKETS,
  passEndDate,
  ticketAllowedOnDate,
  timeGrid,
  ukNow,
  type TicketType,
} from "@/imported/lib/cms/sauna";

type Payload = {
  ticketType?: TicketType;
  date?: string; // session date for singles, start date for passes
  time?: string; // session start for singles
  quantity?: number;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { ticketType, date, time, quantity } = body;

  if (!ticketType || !(ticketType in SAUNA_TICKETS)) {
    return Response.json({ error: "Choose a ticket type." }, { status: 400 });
  }
  if (!date || !DATE_RE.test(date)) {
    return Response.json({ error: "Choose a date." }, { status: 400 });
  }

  const config = await getSaunaConfig();
  const stripe = await getStripeRuntime();
  const def = SAUNA_TICKETS[ticketType];
  const pricePence = config.prices[ticketType];
  const now = ukNow();

  // No back-dated bookings
  if (date < now.date) {
    return Response.json(
      { error: "You can't book a date in the past." },
      { status: 400 }
    );
  }

  // Contact details and the health declaration are NOT collected here:
  // Stripe Checkout captures name/email/phone (written back via webhook),
  // and the mandatory health & safety form is completed onsite via Sentinel.

  // ----- Passes: Weekly / Monthly -----------------------------------------
  if (def.kind === "pass") {
    const quantityNum = Number(quantity ?? 1);
    if (!Number.isInteger(quantityNum) || quantityNum < 1) {
      return Response.json({ error: "Invalid quantity." }, { status: 400 });
    }
    const validityDays = def.validityDays ?? 0;
    const endDate = passEndDate(date, ticketType);

    const result = await createPass({
      startDate: date,
      validityDays,
      ticketType,
      unitPricePence: pricePence,
      status: stripe.enabled && stripe.secretKey ? "pending" : "requested",
    }).catch((err) => {
      log.error("[checkout] pass RPC failed", err);
      return null;
    });

    if (!result) {
      return Response.json(
        { error: "We couldn't reach the booking service. Please try again." },
        { status: 503 }
      );
    }
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 409 });
    }

    return finalise(
      req,
      result.booking,
      {
        productName: `${def.name} — Willow Garth`,
        description: `Valid ${date} to ${endDate} (${validityDays} consecutive days).`,
        unitAmount: pricePence,
        quantity: quantityNum,
      },
      stripe
    );
  }

  // ----- Single sessions: Sauna & Plunge / Plunge Only --------------------
  if (!time || !TIME_RE.test(time)) {
    return Response.json({ error: "Choose a session time." }, { status: 400 });
  }
  if (!timeGrid(config).includes(time)) {
    return Response.json(
      { error: `Sessions run ${config.openTime}–${config.closeTime}. Please pick a valid time.` },
      { status: 400 }
    );
  }
  // Sauna is only fired on configured days (currently Thu/Sat/Sun)
  if (!ticketAllowedOnDate(ticketType, date, config)) {
    return Response.json(
      {
        error:
          "The wood-fired sauna is only available on Thursday, Saturday and Sunday. Choose Plunge Only for other days.",
      },
      { status: 400 }
    );
  }
  // Same-day: start time must still be in the future
  if (date === now.date && time <= now.time) {
    return Response.json(
      { error: "That session time has already passed. Please choose a later time." },
      { status: 400 }
    );
  }

  const size = Number(quantity);
  if (!Number.isInteger(size) || size < 1) {
    return Response.json({ error: "Quantity must be at least 1." }, { status: 400 });
  }
  if (size > config.maxParty) {
    return Response.json(
      { error: `A maximum of ${config.maxParty} people can be booked per session.` },
      { status: 400 }
    );
  }

  // Provision (or reuse) the shared hourly capacity pool, then book atomically
  const slot = await ensureSlot({ date, time, capacity: config.capacity }).catch(
    (err) => {
      log.error("[checkout] ensure slot failed", err);
      return null;
    }
  );
  if (!slot) {
    return Response.json(
      { error: "We couldn't reach the booking service. Please try again." },
      { status: 503 }
    );
  }

  const result = await bookSlot({
    slotId: slot.id,
    partySize: size,
    ticketType,
    unitPricePence: pricePence,
    status: stripe.enabled && stripe.secretKey ? "pending" : "requested",
  }).catch((err) => {
    log.error("[checkout] booking RPC failed", err);
    return null;
  });

  if (!result) {
    return Response.json(
      { error: "We couldn't reach the booking service. Please try again." },
      { status: 503 }
    );
  }
  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.code === "NOT_FOUND" ? 404 : 409 }
    );
  }

  return finalise(
    req,
    result.booking,
    {
      productName: `${def.name} — Willow Garth`,
      description: `${date} at ${time}. ${size} ${size === 1 ? "person" : "people"}.`,
      unitAmount: pricePence,
      quantity: size,
    },
    stripe
  );
}

async function finalise(
  req: Request,
  booking: { id: number; ref: string },
  line: { productName: string; description: string; unitAmount: number; quantity: number },
  stripe: Awaited<ReturnType<typeof getStripeRuntime>>
) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  // Manual request mode (Stripe not configured)
  if (!stripe.enabled || !stripe.secretKey) {
    return Response.json({
      ok: true,
      requested: true,
      ref: booking.ref,
      redirectUrl: `${origin}/book/sauna/confirmation?ref=${booking.ref}`,
    });
  }

  try {
    const client = getStripeClient(stripe.secretKey);
    const session = await client.checkout.sessions.create({
      mode: "payment",
      client_reference_id: booking.ref,
      // Contact details are captured here (no form on the booking site):
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      line_items: [
        {
          quantity: line.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: line.unitAmount,
            product_data: {
              name: line.productName,
              description: line.description,
            },
          },
        },
      ],
      success_url: `${origin}/book/sauna/confirmation?ref=${booking.ref}`,
      cancel_url: `${origin}/book/sauna/cancelled?ref=${booking.ref}`,
      metadata: {
        booking_id: String(booking.id),
      },
    });

    const { setStripeSession } = await import("@/imported/lib/store/booking");
    await setStripeSession(booking.id, session.id);

    return Response.json({ ok: true, checkoutUrl: session.url, ref: booking.ref });
  } catch (err) {
    log.error("[checkout] Stripe session creation failed", err);
    return Response.json(
      { error: "We couldn't start payment. Please try again or contact us." },
      { status: 502 }
    );
  }
}
