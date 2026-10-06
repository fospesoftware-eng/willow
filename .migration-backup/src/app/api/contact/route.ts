import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * To connect a real email provider, set the following environment variables
 * and wire the provider inside `sendEmail`. The endpoint validates and
 * sanitises input before forwarding.
 *
 * Example providers: Resend, Postmark, SendGrid, Nodemailer (SMTP).
 */

type Payload = {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
  consent: boolean;
};

const ALLOWED_TYPES = [
  "General Enquiry",
  "Fishing",
  "Sauna & Dip",
  "Events",
  "Camping",
  "Other",
];

export async function POST(req: Request) {
  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, phone, enquiryType, message, consent } = body;

  if (!name || !email || !message || !consent) {
    return NextResponse.json(
      { error: "Please complete all required fields and accept consent." },
      { status: 400 }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
  if (!emailOk) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(String(enquiryType))) {
    return NextResponse.json(
      { error: "Invalid enquiry type." },
      { status: 400 }
    );
  }

  // Sanitise
  const clean = {
    name: String(name).slice(0, 120),
    email: String(email).slice(0, 200),
    phone: String(phone || "").slice(0, 40),
    enquiryType: String(enquiryType),
    message: String(message).slice(0, 5000),
  };

  try {
    // TODO: wire your chosen email provider here.
    // await sendEmail(clean);
    console.info("[contact] form submission received", clean);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't send your message. Please try again or contact us directly.",
      },
      { status: 502 }
    );
  }
}
