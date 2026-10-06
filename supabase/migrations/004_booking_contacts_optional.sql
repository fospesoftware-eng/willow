-- Booking contact details are collected by Stripe Checkout after the booking
-- is provisioned (and populated by the webhook). The mandatory health & safety
-- declaration is completed separately via Sentinel — onsite, before the
-- activity — so it must not block a booking. Health answers are therefore not
-- captured at checkout any more (health_form keeps its '{}' default).

alter table public.sauna_bookings
  alter column customer_name  drop not null,
  alter column customer_email drop not null,
  alter column customer_phone drop not null;
