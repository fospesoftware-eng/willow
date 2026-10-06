-- ============================================================================
-- WILLOW GARTH — Migration 002: WordPress-style pages CMS, SEO, media storage
-- Run once in Supabase SQL Editor. Idempotent.
-- ============================================================================

-- ---------- Pages ----------------------------------------------------------
create table if not exists public.pages (
  slug            text primary key,
  label           text not null,
  path            text not null,
  seo_title       text,
  seo_description text,
  og_image        text,
  content         jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

alter table public.pages enable row level security;

drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
  for select to anon, authenticated using (true);

-- ---------- SEO columns on experiences & lakes -----------------------------
alter table public.experiences
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_image text;

alter table public.lakes
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_image text;

-- ---------- Media storage bucket -------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Public read of media files
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

-- NOTE: upload/update/delete are intentionally NOT granted to anon or
-- authenticated roles. All media writes go through the Next.js server using
-- the SUPABASE_SECRET_KEY (service role), which bypasses RLS.

-- ---------- updated_at trigger for pages -----------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pages_touch on public.pages;
create trigger trg_pages_touch before update on public.pages
for each row execute function public.touch_updated_at();
