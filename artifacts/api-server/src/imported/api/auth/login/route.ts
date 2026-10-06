import type { JsonRequest as Request } from "@/native-request";
import { cookies } from "@/request-context";
import { supabaseServer } from "@/imported/lib/supabase";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sb = await supabaseServer(cookieStore);

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length > 0 && !allowed.includes(String(email).toLowerCase())) {
    await sb.auth.signOut();
    return Response.json(
      { error: "This account does not have admin access." },
      { status: 403 }
    );
  }

  return Response.json({ ok: true });
}
