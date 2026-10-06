import { NextResponse } from "next/server";
import {
  getBookingById,
  getBookingByRef,
  getBookingByStripeSession,
  markBookingPaid,
  setBookingCustomer,
} from "@/lib/store/booking";
import { getStripeRuntime, getStripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  // Webhooks are processed even when Stripe is temporarily disabled —
  // pending payments already taken must still be confirmed.
  const rt = await getStripeRuntime();
  if (!rt.secretKey || !rt.webhookSecret) {
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
    event = getStripeClient(rt.secretKey).webhooks.constructEvent(
      rawBody,
      signature,
      rt.webhookSecret
    );
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
        customer_details?: {
          name?: string | null;
          email?: string | null;
          phone?: string | null;
        } | null;
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
        if (session.customer_details) {
          await setBookingCustomer(booking.id, {
            name: session.customer_details.name,
            email: session.customer_details.email,
            phone: session.customer_details.phone,
          }).catch((err) =>
            console.error("[webhook] Could not save customer details", err)
          );
        }
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
