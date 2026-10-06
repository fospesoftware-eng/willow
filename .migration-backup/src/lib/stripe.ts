import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

export type StripeMode = "test" | "live";

type StripeSettingsRow = {
  enabled: boolean | null;
  test_mode: boolean;
  live_secret_key: string | null;
  live_publishable_key: string | null;
  live_webhook_secret: string | null;
  test_secret_key: string | null;
  test_publishable_key: string | null;
  test_webhook_secret: string | null;
};

export type StripeRuntime = {
  enabled: boolean;
  mode: StripeMode;
  secretKey: string | null;
  publishableKey: string | null;
  webhookSecret: string | null;
  /** Where the active secret key comes from: admin settings, env, or none. */
  keySource: "settings" | "environment" | "none";
};

const envSecretKey = () => process.env.STRIPE_SECRET_KEY || null;
const envWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET || null;
const envPublishableKey = () => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;

/** Raw admin-managed settings (service-role read). Null when not configured yet. */
export async function getStripeSettingsRow(): Promise<StripeSettingsRow | null> {
  const { data } = await supabaseAdmin()
    .from("stripe_settings")
    .select(
      "enabled,test_mode,live_secret_key,live_publishable_key,live_webhook_secret,test_secret_key,test_publishable_key,test_webhook_secret"
    )
    .eq("id", true)
    .maybeSingle();
  return (data as StripeSettingsRow | null) ?? null;
}

/**
 * Resolves the active Stripe configuration. Admin settings
 * (/admin → Settings → Stripe payments, stored in stripe_settings) take
 * precedence; environment variables are the fallback when a value is unset.
 * `enabled` stored as NULL means "use the environment default".
 */
export async function getStripeRuntime(): Promise<StripeRuntime> {
  const row = await getStripeSettingsRow().catch(() => null);
  const testMode = row?.test_mode ?? true;
  const mode: StripeMode = testMode ? "test" : "live";
  const settingsSecret = (testMode ? row?.test_secret_key : row?.live_secret_key) || null;
  const secretKey = settingsSecret || envSecretKey();
  return {
    enabled: row?.enabled ?? Boolean(envSecretKey()),
    mode,
    secretKey,
    publishableKey:
      (testMode ? row?.test_publishable_key : row?.live_publishable_key) || envPublishableKey(),
    webhookSecret:
      (testMode ? row?.test_webhook_secret : row?.live_webhook_secret) || envWebhookSecret(),
    keySource: settingsSecret ? "settings" : envSecretKey() ? "environment" : "none",
  };
}

const clients = new Map<string, Stripe>();

/** Returns a cached Stripe client for the given secret key. */
export function getStripeClient(secretKey: string): Stripe {
  let client = clients.get(secretKey);
  if (!client) {
    client = new Stripe(secretKey, {
      apiVersion: "2025-05-27.basil" as Stripe.LatestApiVersion,
      typescript: true,
    });
    clients.set(secretKey, client);
  }
  return client;
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}
