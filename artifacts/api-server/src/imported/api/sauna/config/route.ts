import { migrationLogger as log } from "@/migration-logger";
import { getSaunaConfig } from "@/imported/lib/store/booking";
import { getStripeRuntime } from "@/imported/lib/stripe";

export const revalidate = 60;

export async function GET() {
  try {
    const [config, stripe] = await Promise.all([getSaunaConfig(), getStripeRuntime()]);
    return Response.json({ config, stripeEnabled: stripe.enabled && Boolean(stripe.secretKey) });
  } catch (err) {
    log.error("[sauna-config] failed", err);
    return Response.json(
      { error: "Booking service is starting up. Please try again in a moment." },
      { status: 503 }
    );
  }
}
