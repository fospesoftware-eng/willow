import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase";

export async function POST() {
  const cookieStore = await cookies();
  const sb = await supabaseServer(cookieStore);
  await sb.auth.signOut();
  return NextResponse.json({ ok: true });
}
