# Willow Garth Country Park

Website for a country park and fishery, with lake and experience pages, sauna booking, contact forms, and a protected content-management dashboard.

## Run & Operate

- Start `artifacts/willow: web` and `artifacts/api-server: API Server` using the managed workflows.
- `pnpm test` — Playwright migration regression checks against the running shared proxy.
- `pnpm run typecheck` — workspace type checking.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API helpers.
- Do not run `pnpm dev` at the workspace root.

## Stack and source

- pnpm workspace; React + Vite frontend at `/`; Express API at `/api`.
- The original Next.js import is preserved in `.migration-backup/`.
- Frontend: `artifacts/willow/`. Server handlers and stores: `artifacts/api-server/src/imported/`.
- OpenAPI contract: `lib/api-spec/openapi.yaml`.
- Original images, typography, page content, external booking links, and styles are preserved.

## External services

- Keep the existing Supabase database, authentication, and media storage. This migration does not replace them with Replit PostgreSQL.
- Required server-only configuration: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`; optional admin allowlist: `ADMIN_EMAILS`.
- Existing Stripe configuration can be stored in Supabase by the admin dashboard, or supplied as `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- These legacy environment names are intentionally retained on the server only. No service keys are bundled into the frontend.
- Credentials were not included in the import. Public pages retain the source app's bundled CMS defaults. Real bookings, admin access, CMS edits and payment verification require restoring configuration. Restart the API workflow after configuring secrets.
- The source contact endpoint validates input but does not deliver email; its email-provider integration was already unfinished before import.

## Migration behavior

- Server API handlers use native Web Request/Response through an Express bridge, retaining multipart uploads, raw Stripe webhook bodies, dynamic parameters and per-request cookie handling.
- Content reads are request-fresh rather than Next cache-backed. The browser loads the public CMS bootstrap at startup.
- Page titles and social metadata update client-side. The original sitemap and robots rules are retained; JavaScript-free crawlers see the shared HTML metadata.
- Browser tests use `/repl/tools/bin/chromium` by default; set `PLAYWRIGHT_CHROMIUM_PATH` for a different local Chromium binary.
