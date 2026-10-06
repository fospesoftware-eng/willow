import { cookies } from "@/request-context";
import { supabaseServer } from "@/imported/lib/supabase";

export async function POST() {
  const cookieStore = await cookies();
  const sb = await supabaseServer(cookieStore);
  await sb.auth.signOut();
  return Response.json({ ok: true });
}
