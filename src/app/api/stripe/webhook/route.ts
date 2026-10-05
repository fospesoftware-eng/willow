import { NextResponse } from "next/server";
import {
  getBookingById,
  getBookingByRef,
  getBookingByStripeSession,
  markBookingPaid,
} from "@/lib/store/booking";
import { getStripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        client_reference_id?: string | null;
        payment_intent?: string | null;
        metadata?: { booking_id?: string };
      };

      const booking =
        (await getBookingByStripeSession(session.id)) ||
        (session.client_reference_id
          ? await getBookingByRef(session.client_reference_id)
          : null) ||
        (session.metadata?.booking_id
          ? await getBookingById(Number(session.metadata.booking_id))
          : null);

      if (booking) {
        await markBookingPaid(booking.id, session.payment_intent ?? null);
        console.info(
          `[webhook] Booking ${booking.ref} marked paid (session ${session.id})`
        );
      } else {
        console.warn(`[webhook] No booking found for session ${session.id}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Event handling failed", err);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
