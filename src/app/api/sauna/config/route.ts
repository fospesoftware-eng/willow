import { NextResponse } from "next/server";
import { getSaunaConfig } from "@/lib/store/booking";
import { getStripeRuntime } from "@/lib/stripe";

export const revalidate = 60;

export async function GET() {
  try {
    const [config, stripe] = await Promise.all([getSaunaConfig(), getStripeRuntime()]);
    return NextResponse.json({ config, stripeEnabled: stripe.enabled && Boolean(stripe.secretKey) });
  } catch (err) {
    console.error("[sauna-config] failed", err);
    return NextResponse.json(
      { error: "Booking service is starting up. Please try again in a moment." },
      { status: 503 }
    );
  }
}
