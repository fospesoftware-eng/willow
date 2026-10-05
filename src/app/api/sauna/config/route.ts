import { NextResponse } from "next/server";
import { getSaunaConfig } from "@/lib/store/booking";

export const revalidate = 60;

export async function GET() {
  try {
    const config = await getSaunaConfig();
    return NextResponse.json({ config });
  } catch (err) {
    console.error("[sauna-config] failed", err);
    return NextResponse.json(
      { error: "Booking service is starting up. Please try again in a moment." },
      { status: 503 }
    );
  }
}
