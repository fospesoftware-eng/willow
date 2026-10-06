import { test, expect } from "@playwright/test";
import { toBookingConfirmation } from "../artifacts/api-server/src/lib/booking-confirmation";
import type { Booking } from "../artifacts/api-server/src/imported/lib/store/booking";
import { postAdminMedia } from "../lib/api-client-react/src/generated/api";

test("public booking confirmation strips all private and internal fields", () => {
  const booking = {
    ref: "fixture-reference",
    ticket_type: "sauna_plunge",
    session_date: "2030-01-10",
    session_time: "09:00",
    pass_end: null,
    party_size: 2,
    unit_price_pence: 1000,
    status: "paid",
    id: 123,
    customer_name: "Private Customer",
    customer_email: "private@example.invalid",
    customer_phone: "private-phone",
    health_form: { medical_details: "private-health-data", emergency_contact: "private-contact" },
    stripe_session_id: "private-stripe-session",
    stripe_payment_intent: "private-stripe-intent",
    future_sensitive_column: "private-future-data",
  } as unknown as Booking;
  // Test the actual JSON response serialization used by the public route.
  const response = JSON.parse(JSON.stringify(toBookingConfirmation(booking)));
  expect(response).toEqual({
    ref: "fixture-reference", ticket_type: "sauna_plunge", session_date: "2030-01-10",
    session_time: "09:00", pass_end: null, party_size: 2, unit_price_pence: 1000, status: "paid",
  });
  expect(JSON.stringify(response)).not.toContain("private-");
  for (const field of ["id", "customer_name", "customer_email", "customer_phone",
    "health_form", "stripe_session_id", "stripe_payment_intent", "future_sensitive_column"]) {
    expect(response).not.toHaveProperty(field);
  }
  expect(toBookingConfirmation(null)).toBeNull();
});

test("generated upload client serializes file bytes into multipart form data", async () => {
  const originalFetch = globalThis.fetch;
  let multipart: FormData | undefined;
  globalThis.fetch = async (_input, init) => {
    expect(init?.method).toBe("POST");
    expect(init?.body).toBeInstanceOf(FormData);
    multipart = init?.body as FormData;
    expect(new Headers(init?.headers).get("content-type")).not.toBe("application/json");
    return Response.json({ ok: true });
  };
  try {
    const file = new File(["fixture-image-bytes"], "fixture.png", { type: "image/png" });
    await postAdminMedia({ file });
    const serialized = multipart?.get("file") as File;
    expect(serialized).toBeInstanceOf(File);
    expect(serialized.name).toBe("fixture.png");
    expect(serialized.type).toBe("image/png");
    expect(await serialized.text()).toBe("fixture-image-bytes");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
