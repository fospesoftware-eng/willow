-- ============================================================================
-- WILLOW GARTH — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (idempotent).
-- ============================================================================

-- ---------- Extensions -----------------------------------------------------
create extension if not exists pgcrypto;

-- ---------- Tables ---------------------------------------------------------

create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  slug             text primary key,
  name             text not null,
  accent           text,
  category         text,
  description      text,
  image            text,
  gallery          jsonb not null default '[]'::jsonb,
  intro            jsonb not null default '[]'::jsonb,
  highlights       jsonb not null default '[]'::jsonb,
  note             text,
  cta              text,
  href             text,
  booking_url      text,
  booking_label    text,
  booking_external boolean not null default false,
  in_house_href    text,
  in_house_label   text,
  active           boolean not null default true,
  sort             int not null default 0,
  updated_at       timestamptz not null default now()
);

create table if not exists public.lakes (
  slug           text primary key,
  number         text,
  name           text not null,
  tagline        text,
  category       text,
  description    text,
  image          text,
  species        jsonb not null default '[]'::jsonb,
  features       jsonb not null default '[]'::jsonb,
  status         text not null default 'open',   -- open | renovation
  status_note    text,
  booking_url    text,
  booking_label  text,
  sort           int not null default 0,
  updated_at     timestamptz not null default now()
);

create table if not exists public.sauna_slots (
  id          bigint generated always as identity primary key,
  date        date not null,
  time        text not null,
  capacity    int  not null default 6 check (capacity between 1 and 20),
  price_pence int  not null default 0 check (price_pence >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (date, time)
);

create table if not exists public.sauna_bookings (
  id                    bigint generated always as identity primary key,
  ref                   text not null unique,
  slot_id               bigint not null references public.sauna_slots(id),
  customer_name         text,  -- collected by Stripe Checkout, written back by webhook
  customer_email        text,
  customer_phone        text,
  party_size            int  not null check (party_size >= 1),
  health_form           jsonb not null default '{}'::jsonb,
  status                text not null default 'pending',  -- pending | paid | requested | cancelled
  stripe_session_id     text,
  stripe_payment_intent text,
  created_at            timestamptz not null default now(),
  paid_at               timestamptz
);
create index if not exists idx_sauna_bookings_slot    on public.sauna_bookings(slot_id);
create index if not exists idx_sauna_bookings_session on public.sauna_bookings(stripe_session_id);
create index if not exists idx_sauna_bookings_status  on public.sauna_bookings(status);

-- ---------- Availability view ---------------------------------------------
create or replace view public.sauna_slot_availability as
select
  s.id, s.date, s.time, s.capacity, s.price_pence, s.is_active,
  s.capacity - coalesce(sum(b.party_size) filter (where b.status = 'paid'), 0) as available
from public.sauna_slots s
left join public.sauna_bookings b on b.slot_id = s.id
group by s.id;

-- ---------- Atomic booking RPC --------------------------------------------
-- Locks the slot row, checks remaining PAID capacity and inserts in one txn.
create or replace function public.book_sauna_slot(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot      public.sauna_slots%rowtype;
  v_available int;
  v_ref       text;
  v_booking   public.sauna_bookings%rowtype;
  v_status    text := coalesce(p->>'status', 'pending');
begin
  select * into v_slot
  from public.sauna_slots
  where id = (p->>'slot_id')::bigint and is_active
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'error', 'Session not found.');
  end if;

  if (p->>'party_size')::int < 1 then
    return jsonb_build_object('ok', false, 'code', 'BAD_SIZE', 'error', 'Party size must be at least 1.');
  end if;

  v_available := v_slot.capacity - coalesce(
    (select sum(party_size) from public.sauna_bookings where slot_id = v_slot.id and status = 'paid'), 0);

  if (p->>'party_size')::int > v_available then
    return jsonb_build_object('ok', false, 'code', 'SLOT_FULL',
      'error', 'Sorry, this session has just filled up. Please pick another slot.');
  end if;

  v_ref := 'WG-' || upper(to_char(now(), 'YYYYMMDDHH24MISS')) || '-' ||
           upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into public.sauna_bookings
    (ref, slot_id, customer_name, customer_email, customer_phone,
     party_size, health_form, status)
  values
    (v_ref, v_slot.id, p->>'name', p->>'email', p->>'phone',
     (p->>'party_size')::int, coalesce(p->'health_form', '{}'::jsonb), v_status)
  returning * into v_booking;

  return jsonb_build_object('ok', true, 'booking', to_jsonb(v_booking));
end;
$$;

-- ---------- Mark-booking-paid RPC (idempotent) -----------------------------
create or replace function public.mark_sauna_booking_paid(
  p_booking_id bigint,
  p_payment_intent text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_changed int;
begin
  update public.sauna_bookings
  set status = 'paid',
      paid_at = now(),
      stripe_payment_intent = coalesce(p_payment_intent, stripe_payment_intent)
  where id = p_booking_id and status <> 'paid';
  get diagnostics v_changed = row_count;
  return v_changed > 0;
end;
$$;

-- ---------- Row Level Security --------------------------------------------
alter table public.site_settings   enable row level security;
alter table public.experiences     enable row level security;
alter table public.lakes           enable row level security;
alter table public.sauna_slots     enable row level security;
alter table public.sauna_bookings  enable row level security;

-- Public, read-only access to published CMS content and slot availability.
-- All writes/bookings go through the Next.js server with the SECRET (service) key.
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public read active experiences" on public.experiences;
create policy "public read active experiences" on public.experiences
  for select to anon, authenticated using (active = true);

drop policy if exists "public read lakes" on public.lakes;
create policy "public read lakes" on public.lakes
  for select to anon, authenticated using (true);

drop policy if exists "public read sauna_slots" on public.sauna_slots;
create policy "public read sauna_slots" on public.sauna_slots
  for select to anon, authenticated using (true);

-- NOTE: sauna_bookings intentionally has NO anon/authenticated policies.
-- It can only be touched through the service-role key (server-side), so
-- customer data is never directly readable from the browser.

grant select on public.sauna_slot_availability to anon, authenticated;

-- ============================================================================
-- SEED CONTENT (only if tables are empty)
-- ============================================================================

-- ----- Site settings -----
insert into public.site_settings (key, value) values
  ('site', jsonb_build_object(
    'name', 'Willow Garth Country Park',
    'shortName', 'Willow Garth',
    'tagline', 'Time to relax & unwind',
    'strapline', 'get Powered-up by Nature',
    'complex', '3 Lake, 6 Acre Complex',
    'url', 'https://willowgarthcountrypark.co.uk'))
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('contact', jsonb_build_object(
    'phone', '+44 7951 138579',
    'phoneHref', 'tel:+447951138579',
    'whatsappHref', 'https://wa.me/447951138579',
    'email', 'greenheartdoncaster@gmail.com',
    'eventsEmail', 'gmsoulfood@gmail.com',
    'address', 'Marsh Lane, Arksey, Doncaster, DN5 0SH',
    'mapsUrl', 'https://maps.app.goo.gl/VbiN2McQsLq2Cx6o6',
    'what3words', 'action.take.part'))
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('notice', jsonb_build_object('enabled', false, 'text', ''))
on conflict (key) do nothing;

-- ----- Lakes -----
insert into public.lakes
  (slug, number, name, tagline, category, description, image, species, features, status, booking_url, booking_label, sort)
values
  ('willow', '01', 'Willow Lake', 'Pleasure Fishing / Matches / Education', 'Coarse Fishing',
   'Willow is our match lake, home to Carp, Tench, Bream, Ide, Roach, Rudd and Perch. A welcoming water for pleasure anglers, matches and education sessions — with night fishing, motorhome pitches and wild camping available to make it a night to remember.',
   '/images/willow-lake.jpg',
   '["Carp","Tench","Bream","Ide","Roach","Rudd","Perch"]'::jsonb,
   '["Match & pleasure fishing","Night fishing permitted","Motorhome pitches","Wild camping","Education & coaching sessions"]'::jsonb,
   'open', 'https://swimbooker.com/fishery/13681', 'Make a Fishing Booking', 1),
  ('oak', '02', 'Oak Lake', 'Carp & Predator Lake', 'Specimen Carp & Pike',
   'Oak Lake is our specimen water, stocked with Common, Leather and Mirror carp up to 30lb and Pike up to 28lb. A dedicated destination for carp and predator anglers seeking quality specimens.',
   '/images/carp-lake.jpg',
   '["Common carp","Leather carp","Mirror carp","Pike"]'::jsonb,
   '["Specimen carp up to 30lb","Pike up to 28lb","Predator fishing"]'::jsonb,
   'renovation', 'https://swimbooker.com/fishery/13681', 'Make a Booking on Swimbooker', 2),
  ('pine', '03', 'Pine Lake', 'Sauna & Plunge Lake', 'Wellness & Cold Water',
   'Chill out in a wood-fired sauna, then plunge into a natural dip lake. We provide a safe and welcoming experience with membership options available. You can also hire our Geo-dome and add a wood-fired sauna & plunge to your group booking.',
   '/images/wood-sauna.jpg',
   '[]'::jsonb,
   '["Wood-fired sauna","Natural dip lake & cold-water plunge","Geo-dome hire","Single tickets & group bookings","Contrast therapy coaches on request"]'::jsonb,
   'open', 'https://willowgarthcountrypark.co.uk/sentinal/', 'Make a Safe Booking', 3)
on conflict (slug) do nothing;

-- ----- Experiences -----
insert into public.experiences
  (slug, name, accent, category, description, image, gallery, intro, highlights, note, cta, href,
   booking_url, booking_label, booking_external, in_house_href, in_house_label, active, sort)
values
  ('fishing', 'Fishing', 'the catch.', 'Coarse · Carp · Predator',
   'Three distinct lakes for pleasure, match and specimen angling — from coarse fishing at Willow to 30lb carp at Oak.',
   '/images/fish-angler-sunset.jpg',
   '["/images/willow-lake.jpg","/images/carp-lake.jpg","/images/fish-angler-sunset.jpg"]'::jsonb,
   jsonb_build_array(
     'Angling is at the heart of Willow Garth. Our six acres hold three distinct waters, so whether you are chasing a quiet day of silvers, a net of match-winning bream or a 30lb specimen carp, there is a swim with your name on it.',
     'All fishing is booked through Swimbooker, where you can choose your lake and swim. Night fishing is permitted on Willow Lake, with motorhome pitches and wild camping available to make a night of it.'),
   jsonb_build_array(
     jsonb_build_object('title','Willow Lake','detail','Carp, Tench, Bream, Ide, Roach, Rudd and Perch — a welcoming water for pleasure angling, matches and education sessions.'),
     jsonb_build_object('title','Oak Lake','detail','Our specimen water: Common, Leather and Mirror carp up to 30lb, plus Pike up to 28lb for predator anglers.'),
     jsonb_build_object('title','Fish care first','detail','Barbless hooks, unhooking mats and nets, and antiseptic application — our codes protect fish and habitat.'),
     jsonb_build_object('title','Stay the night','detail','Night fishing on Willow, wild camping and motorhome pitches steps from the water.')),
   'Oak Lake is currently under renovation until November 2026 — Willow and Pine remain open.',
   'Explore Fishing', '/experiences/fishing',
   'https://swimbooker.com/fishery/13681', 'Book Fishing on Swimbooker', true, null, null, true, 1),

  ('sauna-dip', 'Sauna & Dip', 'the plunge.', 'Wellness · Cold Water',
   'Wood-fired sauna and a natural plunge lake. A safe, evidence-backed contrast therapy experience.',
   '/images/wood-sauna.jpg',
   '["/images/wood-sauna.jpg","https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80","/images/willow-lake.jpg"]'::jsonb,
   jsonb_build_array(
     'Chill out in a wood-fired sauna, then plunge into a natural dip lake. In recent years the benefits of cold-water plunging have become well known and evidenced — we provide a safe and welcoming environment to experience them.',
     'Sessions are limited to six people, with buoyancy floats, safety whistles, high-viz ropes and life rings provided. Membership options are available, and you can also hire our Geo-dome and add a wood-fired sauna and plunge to your group booking.'),
   jsonb_build_array(
     jsonb_build_object('title','Wood-fired sauna','detail','A traditional wooden sauna warmed by a wood burner, metres from the lake.'),
     jsonb_build_object('title','Natural dip lake','detail','Cold-water contrast therapy with trained coaches available on request.'),
     jsonb_build_object('title','Six at a time','detail','Limited numbers keep every session calm, personal and properly supervised.'),
     jsonb_build_object('title','Safety equipment','detail','Buoyancy floats and whistles must be worn; emergency blankets, alarm and blood pressure monitor on site.')),
   'ALL USERS must complete the online health & safety form through our partner SENTINAL before visiting. Strictly no children under 16 at the sauna & dip lake.',
   'Book Sauna & Dip', '/experiences/sauna-dip',
   'https://willowgarthcountrypark.co.uk/sentinal/', 'SENTINAL Form', true,
   '/book/sauna', 'Book Now (In-house)', true, 2),

  ('camping', 'Camping', 'the stillness.', 'Wild · Motorhome',
   'Make it a night to remember with wild camping and motorhome pitches beside the lakes.',
   'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
   '["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80","/images/fish-angler-sunset.jpg","/images/willow-lake.jpg"]'::jsonb,
   jsonb_build_array(
     'Make it a night to remember. Willow Lake welcomes night fishing, wild camping and motorhome pitches just a short cast from the water — wake to mist over the lake and the first swim of the day.',
     'Groups can take over the Geo-dome and add a wood-fired sauna and cold-water plunge to the booking. It is off-grid, back-to-nature hospitality for anglers, dippers and gatherings.'),
   jsonb_build_array(
     jsonb_build_object('title','Wild camping','detail','Pitch among the reeds beside Willow Lake — simple, quiet and unpowered.'),
     jsonb_build_object('title','Motorhome pitches','detail','Hard-standing pitches for motorhomes, paired with night fishing on Willow.'),
     jsonb_build_object('title','Night fishing','detail','Evening and dawn sessions permitted for anglers staying on site.'),
     jsonb_build_object('title','Group add-ons','detail','Hire the Geo-dome and add wood-fired sauna and plunge sessions to group stays.')),
   null,
   'Discover Camping', '/experiences/camping',
   '/contact', 'Plan Your Stay', false, null, null, true, 3),

  ('events', 'Events', 'the gathering.', 'Retreats · Workshops',
   'Host your own retreat, workshop or function in our off-grid ecological learning centre and Geo-dome.',
   'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
   '["https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
   jsonb_build_array(
     'Our ecological learning centre, Geo-dome and off-grid classroom host retreats, workshops, coaching and community gatherings — managed by Greenheart Community Group, who provide life skills that help others to learn, share and grow.'),
   jsonb_build_array(
     jsonb_build_object('title','Volunteer days','detail','Meet new people, gain experience and a sense of purpose while improving the site.'),
     jsonb_build_object('title','Learning circles','detail','Environment and well-being gatherings in the off-grid classroom.'),
     jsonb_build_object('title','Life skills','detail','Tailored services building confidence, well-being and job-related skills.'),
     jsonb_build_object('title','Private functions','detail','Geo-dome hire with optional wood-fired sauna, plunge lake and catering add-ons.')),
   null,
   'View Events', '/events', null, null, false, null, null, true, 4)
on conflict (slug) do nothing;

-- ----- Sample sauna sessions (next 6 Saturdays) -----
insert into public.sauna_slots (date, time, capacity, price_pence, is_active)
select s::date, t.time, 6, 0, true
from generate_series(
  date_trunc('day', now())::date
    + (((6 - extract(dow from now())::int) + 7) % 7
       + case when extract(dow from now())::int = 6 then 7 else 0 end),
  date_trunc('day', now())::date
    + (((6 - extract(dow from now())::int) + 7) % 7
       + case when extract(dow from now())::int = 6 then 7 else 0 end) + 35,
  interval '7 days'
) as g(s)
cross join (values ('10:00'), ('13:00'), ('16:00')) as t(time)
on conflict (date, time) do nothing;

-- ============================================================================
-- ADMIN LOGIN:
-- Create your admin user in Supabase Dashboard → Authentication → Users →
-- Add user (email + password, confirm email). Optionally restrict login to
-- specific emails via ADMIN_EMAILS in the app environment.
-- ============================================================================
