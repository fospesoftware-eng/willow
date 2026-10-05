import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripeEnabled = Boolean(secretKey);

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!secretKey) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-05-27.basil" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeInstance;
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
