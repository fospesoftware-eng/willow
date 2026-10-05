-- ============================================================================
-- 003_sauna_tickets.sql
-- Ticketed sauna bookings:
--   · Sauna & Plunge single  £10  (Thu/Sat/Sun, bathing 07:00–19:00)
--   · Plunge only single     £5   (every day, bathing 07:00–19:00)
--   · Weekly Pass            £20  (7 consecutive days)
--   · Monthly Pass           £40  (30 consecutive days)
-- Slots are provisioned automatically per date+time (capacity pool);
-- passes are not tied to a time slot.
-- Safe to re-run.
-- ============================================================================

-- ---------- sauna_slots: origin of the row ---------------------------------
alter table public.sauna_slots
  add column if not exists source text not null default 'manual'; -- manual | auto

-- ---------- sauna_bookings: ticket model -----------------------------------
alter table public.sauna_bookings
  alter column slot_id drop not null,
  add column if not exists ticket_type      text not null default 'sauna_plunge',
  add column if not exists unit_price_pence int,
  add column if not exists session_date     date,
  add column if not exists session_time     text,
  add column if not exists pass_end         date;

-- Backfill denormalised session info + price snapshot for existing bookings
update public.sauna_bookings b
set session_date = s.date,
    session_time = s.time,
    unit_price_pence = coalesce(b.unit_price_pence, s.price_pence)
from public.sauna_slots s
where b.slot_id = s.id and b.session_date is null;

-- ---------- Availability view (recreate with source column) ----------------
drop view if exists public.sauna_slot_availability;
create view public.sauna_slot_availability as
select
  s.id, s.date, s.time, s.capacity, s.price_pence, s.is_active, s.source,
  s.capacity - coalesce(
    sum(b.party_size) filter (where b.status = 'paid'), 0
  ) as available
from public.sauna_slots s
left join public.sauna_bookings b on b.slot_id = s.id
group by s.id;

grant select on public.sauna_slot_availability to anon, authenticated;

-- ---------- Find-or-create a time slot (auto-provisioned, capacity pool) ---
create or replace function public.ensure_sauna_slot(
  p_date     date,
  p_time     text,
  p_capacity int,
  p_price    int
)
returns public.sauna_slots
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot public.sauna_slots%rowtype;
begin
  -- Existing row (auto or manual override) wins, so admin capacity/closures stick
  select * into v_slot from public.sauna_slots
   where date = p_date and time = p_time;
  if found then
    return v_slot;
  end if;

  insert into public.sauna_slots (date, time, capacity, price_pence, is_active, source)
  values (p_date, p_time, p_capacity, p_price, true, 'auto')
  on conflict (date, time) do nothing
  returning * into v_slot;

  if not found then
    select * into v_slot from public.sauna_slots where date = p_date and time = p_time;
  end if;
  return v_slot;
end;
$$;

-- ---------- Atomic single-ticket booking -----------------------------------
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
  v_ticket    text := coalesce(p->>'ticket_type', 'sauna_plunge');
  v_price     int;
begin
  select * into v_slot
  from public.sauna_slots
  where id = (p->>'slot_id')::bigint and is_active
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'error', 'Session not found.');
  end if;

  if (p->>'party_size')::int < 1 then
    return jsonb_build_object('ok', false, 'code', 'BAD_SIZE', 'error', 'Quantity must be at least 1.');
  end if;

  v_available := v_slot.capacity - coalesce(
    (select sum(party_size) from public.sauna_bookings
      where slot_id = v_slot.id and status = 'paid'), 0);

  if (p->>'party_size')::int > v_available then
    return jsonb_build_object('ok', false, 'code', 'SLOT_FULL',
      'error', 'Sorry, this session has just filled up. Please pick another time.');
  end if;

  v_price := coalesce((p->>'unit_price_pence')::int, v_slot.price_pence);

  v_ref := 'WG-' || upper(to_char(now(), 'YYYYMMDDHH24MISS')) || '-' ||
           upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into public.sauna_bookings
    (ref, slot_id, customer_name, customer_email, customer_phone,
     party_size, health_form, status, ticket_type, unit_price_pence,
     session_date, session_time)
  values
    (v_ref, v_slot.id, p->>'name', p->>'email', p->>'phone',
     (p->>'party_size')::int, coalesce(p->'health_form', '{}'::jsonb), v_status,
     v_ticket, v_price, v_slot.date, v_slot.time)
  returning * into v_booking;

  return jsonb_build_object('ok', true, 'booking', to_jsonb(v_booking));
end;
$$;

-- ---------- Pass booking (no time slot; 7- or 30-day validity) -------------
create or replace function public.create_sauna_pass(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ref     text;
  v_booking public.sauna_bookings%rowtype;
  v_status  text := coalesce(p->>'status', 'pending');
  v_ticket  text := coalesce(p->>'ticket_type', 'weekly_pass');
  v_start   date := (p->>'start_date')::date;
  v_days    int  := (p->>'validity_days')::int;
begin
  if v_start < current_date then
    return jsonb_build_object('ok', false, 'code', 'BAD_DATE', 'error', 'Pass start date cannot be in the past.');
  end if;
  if v_days is null or v_days < 1 then
    return jsonb_build_object('ok', false, 'code', 'BAD_DAYS', 'error', 'Invalid pass duration.');
  end if;

  v_ref := 'WG-' || upper(to_char(now(), 'YYYYMMDDHH24MISS')) || '-' ||
           upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  insert into public.sauna_bookings
    (ref, slot_id, customer_name, customer_email, customer_phone,
     party_size, health_form, status, ticket_type, unit_price_pence,
     session_date, session_time, pass_end)
  values
    (v_ref, null, p->>'name', p->>'email', p->>'phone',
     1, coalesce(p->'health_form', '{}'::jsonb), v_status,
     v_ticket, (p->>'unit_price_pence')::int,
     v_start, null, v_start + (v_days - 1))
  returning * into v_booking;

  return jsonb_build_object('ok', true, 'booking', to_jsonb(v_booking));
end;
$$;

-- ---------- Default sauna schedule + pricing ------------------------------
insert into public.site_settings (key, value) values
  ('sauna', jsonb_build_object(
    'saunaDays', jsonb_build_array(0, 4, 6),
    'openTime', '07:00',
    'closeTime', '19:00',
    'intervalMinutes', 60,
    'capacity', 6,
    'maxParty', 6,
    'prices', jsonb_build_object(
      'sauna_plunge', 1000,
      'plunge_only', 500,
      'weekly_pass', 2000,
      'monthly_pass', 4000)))
on conflict (key) do nothing;
