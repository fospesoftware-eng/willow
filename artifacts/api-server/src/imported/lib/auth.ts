import { cookies } from "@/request-context";
import { supabaseServer } from "@/imported/lib/supabase";

export type AdminUser = {
  id: string;
  email: string;
};

/**
 * Returns the authenticated admin user (from the Supabase session cookie)
 * or null. If ADMIN_EMAILS is set, only those emails are accepted.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sb = await supabaseServer(cookieStore);
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user || !user.email) return null;

    const allowed = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(user.email.toLowerCase())) {
      return null;
    }
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

/** For Route Handlers — same check, usable per-request. */
export async function requireAdmin(): Promise<AdminUser | Response> {
  const user = await getAdminUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
