# pulso-concept

Website of the Pulso Concept training studio: landing page, public forms (`/aula-experimental`) and the admin page (`/admin`) that tracks every response. Rules and architecture: [`CLAUDE.md`](CLAUDE.md). Product status: [`project/features.md`](project/features.md).

```
apps/web        React + Vite + TanStack Router/Query + Tailwind (Vercel)
apps/api        Elysia + Drizzle (Railway)
packages/db     Drizzle schema and migrations (Supabase Postgres)
packages/forms  Shared form definitions
```

## Local development

```bash
bun install
cp apps/api/.env.example apps/api/.env   # fill ADMIN_PASSWORD and ADMIN_SESSION_SECRET
bun run db:up        # local Postgres 17 (Docker)
bun run db:migrate
bun run dev          # API on :3000, web on :5173 (Vite proxies /api)
```

Checks: `bun run lint`, `bun run typecheck`, `bun test`.

## Deploy

**Railway (API)**: project `pulso-concept`, service `pulso-concept`, defined in [`.railway/railway.ts`](.railway/railway.ts) (Dockerfile build, migrations before each deploy, health check, non-secret variables). Change it, then `railway config plan` and `railway config apply`. Ship code with `railway up -s pulso-concept` from the repo root (or connect GitHub: `railway service source connect --repo yuri-nicolau/pulso --branch main --service pulso-concept`). Secrets, set once with `railway variable set KEY --stdin -s pulso-concept`:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Session pooler as the `pulso_api` role: `postgres://pulso_api.hvpqpdgcbesmjfxblseg:<password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `ADMIN_PASSWORD` | the admin page password |
| `ADMIN_SESSION_SECRET` | `openssl rand -base64 32` |

`pulso_api` is a dedicated Supabase role that owns the app's tables (RLS on, no access for the Data API's anon/authenticated keys).

**Vercel (web)**: root directory `/` (it reads `vercel.json`). Variable `VITE_API_URL` = the Railway public URL (no trailing slash). Redeploy after setting it.
