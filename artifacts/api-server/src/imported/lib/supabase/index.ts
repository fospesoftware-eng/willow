import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SECRET = process.env.SUPABASE_SECRET_KEY;

/** Minimal structural type for Next's cookie store (avoids version-specific imports). */
type CookieStore = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options?: Record<string, unknown>): void;
};

/**
 * Server-only Supabase client with the SECRET (service) key.
 * Bypasses RLS — only import inside Server Components / Route Handlers.
 * Singleton per module to avoid multiple GoTrue instances.
 */
let adminClientInstance: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!URL || !SECRET) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  }
  if (!adminClientInstance) {
    adminClientInstance = createClient(URL, SECRET, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClientInstance;
}

/**
 * Cookie-based server client (publishable key) — reads the admin user session
 * and enforces RLS. Pass the cookie store from a Route Handler or Server Action.
 */
export async function supabaseServer(cookieStore: CookieStore) {
  if (!URL || !PUBLISHABLE) {
    throw new Error("Supabase is not configured.");
  }
  let cachedCookies = cookieStore.getAll();

  return createServerClient(URL, PUBLISHABLE, {
    cookies: {
      getAll() {
        return cachedCookies;
      },
      setAll(cookiesToSet) {
        cachedCookies = cookiesToSet;
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component without writable cookies — middleware
          // refreshes the session, so this can be safely ignored.
        }
      },
    },
  });
}

/** Browser-side client singleton (publishable key only). */
let browserClientInstance: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (!URL || !PUBLISHABLE) {
    throw new Error("Supabase is not configured.");
  }
  if (!browserClientInstance) {
    browserClientInstance = createClient(URL, PUBLISHABLE, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClientInstance;
}
