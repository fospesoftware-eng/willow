import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  getStripeRuntime,
  getStripeSettingsRow,
  type StripeMode,
} from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

type ModeSecrets = {
  secretKey: string | null;
  publishableKey: string | null;
  webhookSecret: string | null;
};

function mask(value: string | null | undefined): string | null {
  if (!value) return null;
  const parts = value.split("_");
  const prefix = parts.length > 1 ? parts.slice(0, -1).join("_") : "";
  return `${prefix ? `${prefix}_` : ""}••••${value.slice(-4)}`;
}

/** Secrets arrive from the client masked; only replace when a fresh key was typed. */
function isNewValue(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0 && !v.includes("•");
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const row = await getStripeSettingsRow();
  const rt = await getStripeRuntime();

  const live: ModeSecrets = {
    secretKey: mask(row?.live_secret_key),
    publishableKey: row?.live_publishable_key ?? null,
    webhookSecret: mask(row?.live_webhook_secret),
  };
  const test: ModeSecrets = {
    secretKey: mask(row?.test_secret_key),
    publishableKey: row?.test_publishable_key ?? null,
    webhookSecret: mask(row?.test_webhook_secret),
  };

  return NextResponse.json({
    enabled: rt.enabled,
    testMode: rt.mode === "test",
    live,
    test,
    active: {
      mode: rt.mode,
      keySource: rt.keySource,
      secretKey: mask(rt.secretKey),
    },
    envFallback: {
      secretKey: Boolean(process.env.STRIPE_SECRET_KEY),
      webhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    webhookPath: "/api/stripe/webhook",
  });
}

export async function PUT(req: Request) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const current = (await getStripeSettingsRow()) ?? {
    enabled: null,
    test_mode: true,
    live_secret_key: null,
    live_publishable_key: null,
    live_webhook_secret: null,
    test_secret_key: null,
    test_publishable_key: null,
    test_webhook_secret: null,
  };

  const pick = (mode: StripeMode, field: keyof ModeSecrets): string | null => {
    const incoming = body?.[mode]?.[field];
    if (isNewValue(incoming)) return incoming.trim();
    return current[
      field === "secretKey"
        ? mode === "test"
          ? "test_secret_key"
          : "live_secret_key"
        : field === "publishableKey"
        ? mode === "test"
          ? "test_publishable_key"
          : "live_publishable_key"
        : mode === "test"
        ? "test_webhook_secret"
        : "live_webhook_secret"
    ];
  };

  const { error } = await supabaseAdmin()
    .from("stripe_settings")
    .upsert({
      id: true,
      enabled: typeof body.enabled === "boolean" ? body.enabled : null,
      test_mode: body.testMode !== false,
      live_secret_key: pick("live", "secretKey"),
      live_publishable_key: pick("live", "publishableKey"),
      live_webhook_secret: pick("live", "webhookSecret"),
      test_secret_key: pick("test", "secretKey"),
      test_publishable_key: pick("test", "publishableKey"),
      test_webhook_secret: pick("test", "webhookSecret"),
      updated_at: new Date().toISOString(),
    });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

/** Verifies the active secret key against the Stripe API (account details). */
export async function POST() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const rt = await getStripeRuntime();
  if (!rt.secretKey) {
    return NextResponse.json(
      { ok: false, error: "No secret key configured." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/account", {
      headers: { Authorization: `Bearer ${rt.secretKey}` },
    });
    const acct = (await res.json().catch(() => null)) as
      | {
          id?: string;
          livemode?: boolean;
          email?: string | null;
          country?: string | null;
          charges_enabled?: boolean | null;
          payouts_enabled?: boolean | null;
          business_profile?: { name?: string | null } | null;
          settings?: { dashboard?: { display_name?: string | null } | null } | null;
          error?: { message?: string } | null;
        }
      | null;

    if (!res.ok || !acct?.id) {
      return NextResponse.json(
        { ok: false, error: acct?.error?.message ?? "Stripe rejected this key." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: acct.livemode ? "live" : "test",
      keySource: rt.keySource,
      account: {
        id: acct.id,
        email: acct.email ?? null,
        name: acct.settings?.dashboard?.display_name ?? acct.business_profile?.name ?? null,
        country: acct.country ?? null,
        chargesEnabled: acct.charges_enabled ?? null,
        payoutsEnabled: acct.payouts_enabled ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not reach Stripe. Check the server's network access." },
      { status: 400 }
    );
  }
}
