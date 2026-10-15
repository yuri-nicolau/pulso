# PROJECT: pulso-concept (Monorepo)

Website of **Pulso Concept**, a premium training studio: a high-conversion landing page, standalone public forms (e.g. `/aula-experimental`) and a password-protected **admin page** (`/admin`) where the studio tracks every form response through its follow-up (contacted, trial class, enrolled, paid). The official project name is `pulso-concept` (package scope `@pulso-concept/*`, Vercel and Railway projects); the brand in user-facing text is "Pulso Concept". Product docs: `/project/` (§4).

**Language:** all code (identifiers, comments, commit messages, docs) and all communication with Claude are in **English**. Only user-facing frontend content is **pt-BR** (§2.C).

# 0. DOMAINS
The ONLY valid domains, used literally as folder names in `/packages/db/src/schema/{domain}/` and `/apps/api/src/modules/{domain}/`. Never invent, rename or translate one; if a feature doesn't fit, ask first.
- `iam`: admin access (one shared password → signed session token). No tables.
- `leads`: responses to every public form and their follow-up (pipeline status, payment, notes).

**Dependency direction** (`A ← B`: B may import A, only through A's `services.ts` exports, never its tables): `iam` ← `leads`. `iam` imports no domain.

Shared, dependency-free form definitions (form keys, the values each field accepts, trial class hours, phone rules) live in `/packages/forms`, used by `db`, `api` and `web`. It holds values only, never user-facing labels.

# 1. TECH STACK (ABSOLUTE RULES)
- PM/Runtime: `bun` ONLY (NEVER npm/yarn/pnpm, NEVER `node`/`npx`; use `bunx`). Bun loads `.env` by itself: no `dotenv`.
- Lint/Format: `@biomejs/biome` ONLY (NEVER eslint/prettier).
- Backend: ElysiaJS + DrizzleORM (NEVER Prisma, NEVER express). DB: PostgreSQL (Supabase, project "Pulso-Concept").
- Frontend: React + Vite + TanStack Router & Query (NEVER Next.js). Styling: Tailwind CSS (v3, pinned until its v4 migration is done as its own change), icons: Lucide React, animation: Framer Motion.
- Hosting: Vercel (frontend, `vercel.json`) + Railway (API, `.railway/railway.ts` + `Dockerfile`, project "pulso-concept"; change the file, then `railway config plan` and `railway config apply`) + Supabase (DB), same region (US East).
- Free tiers first: ask before adding any paid service, API or plan.
- Time zone: `America/Sao_Paulo` for anything shown or computed as a local date/time.
- Versions: ALWAYS the latest stable version of any library, unless there's an unresolved breaking change or a real incompatibility with this stack; then document the pin reason in the package's `package.json` (`"//"` key).

# 2. ARCHITECTURE AND FOLDER RULES
```
apps/web        React SPA: landing (/), public forms (/aula-experimental), admin (/admin)
apps/api        Elysia API (Railway)
packages/db     Drizzle schema, migrations, client
packages/forms  Shared form definitions (values only)
```
Follow the ubiquitous language: domain names match across DB, API and frontend.

## A. Database (`/packages/db`)
- `/src/schema/{domain}/` split into `enums.ts`, `tables.ts` (and `relations.ts` when there are relations); export them in the domain's `index.ts` and the domains in the root `index.ts`.
- **Every table has RLS enabled** (`.enableRLS()`) and no policies: Supabase's Data API (anon/authenticated keys) must never reach it; only the API, connected as the owner, does.
- Time: `timestamptz` for instants (`created_at`, `updated_at`); `date` for calendar dates. Money (if ever needed): integer minor units + ISO currency code, never floats.
- Migrations: NEVER edit a generated/applied migration; always generate a new one with `bun run db:generate --name <descriptive_name>`. Railway applies them before each deploy (`preDeployCommand`).
- Every column used in a filter, join or `ON CONFLICT` has an index from its first migration.
- `updated_at` is internal: never returned by the API.

## B. Backend (`/apps/api`): Vertical Slice
- `/src/modules/{domain}/` with `routes.ts` (Elysia), `services.ts` (business logic), `schemas.ts` (TypeBox DTOs via `t`; use `oneOf()` from `lib/schema.ts` instead of `t.UnionEnum`). `app.ts` exports `type App` for Eden Treaty.
- **Admin access:** admin routes live under `/api/admin/*` and install `requireAdmin` (from `iam`) as a local `onBeforeHandle`; public routes are rate limited per address (`lib/attempts.ts`, in memory: the API runs as one replica). The admin password exists only in the API's env (`ADMIN_PASSWORD`), never in the frontend.
- Domain errors: typed classes per module extending `DomainError` (e.g. `LeadNotFoundError`), NEVER `throw new Error("string")` for an expected case, never an empty `catch {}`.
- Env: all variables validated in `src/env.ts` (Zod), failing at boot. No scattered `process.env.X`. Never commit `.env`; update `.env.example` with every new variable.
- Logging: the pino logger (`lib/logger.ts`); no `console.log`. Never log passwords, tokens or form answers.
- Input is cleaned in `services.ts` (trim, lowercase emails, digits-only phones) and cross-field rules are checked there, not only in `schemas.ts`.

## C. Frontend (`/apps/web`)
- `/src/pages/` route components (thin); `/src/features/{feature}/` with `components/`, `api.ts` (TanStack Query hooks) and helpers; `/src/components/ui/` small dumb reusable components; `/src/components/sections/` the landing page sections; `/src/hooks/`, `/src/utils/`, `/src/lib/` (API client).
- Routes are code-based in `src/router.tsx`; every page but the landing is lazy-loaded.
- API: Eden Treaty (`api` from `src/lib/api.ts`, wrapped in `unwrap()`) ONLY. NEVER a raw `fetch` to the API, NEVER a hand-written copy of a request/response type: derive types from Eden (`Parameters<typeof api…post>[0]`, `Awaited<ReturnType<…>>`).
- **pt-BR for ALL user-facing text**: labels, buttons, placeholders, messages, empty states, `aria-label`/`sr-only`/`title`, confirm dialogs, toasts, `<title>`. Enum values are shown through explicit pt-BR label maps (`features/admin/labels.ts`, `utils/weekdays.ts`, `utils/schedule.ts`). Dates/numbers use `pt-BR` and `America/Sao_Paulo`. Code and API error messages stay English.
- Feedback: skeletons for loading content, a spinner inside the button for actions, toasts (`useToast`) for results; never a bare "Carregando…" or a silent wait. Empty lists use `EmptyState`; destructive actions use `ConfirmDialog`, never `window.confirm`.
- Overlays: an existing item opens in a right `Sheet` (full screen on phones).
- **Dropdowns:** `components/ui/Select` (listbox), never a native `<select>`. The trigger always shows the field's label (and the value once one is picked, with a clear button); options show the same colored dot as the matching badge and, for filters, a faceted count; a popover from `sm` up, a bottom sheet on phones; full keyboard support (arrows, Home/End, type-to-jump, Enter, Escape). Menus that drop down (e.g. the landing's mobile menu) close on Escape and outside tap, lock the page scroll, move focus in and back, and expose `aria-expanded`/`aria-controls`.
- Responsiveness: EVERY frontend change checked at ~375px, ~768px and ~1280px (`sm`/`md`/`lg`/`xl`), with no horizontal scroll, and with iOS safe areas respected on full-screen pages.

## D. Design system
- **Colors** (all in `apps/web/tailwind.config.ts`, never raw hex in components): ink (black, text and contrast backgrounds), white, sand (neutral backgrounds), **orange** (the logo's accent: CTAs, icons, selected states) and **magenta** (from the brand art, `logo-meta.png`: gradients, backgrounds and graphics only).
- **Contrast (WCAG AA, 4.5:1 text, 3:1 graphics):** white text on `orange-500` FAILS (3.3:1); on orange fills use `text-ink` (5.6:1), or use an ink button with white text. Orange or magenta text on a light background only from `orange-700`/`magenta-700` up. Status badges are dark text on soft tints (`components/ui/Badge.tsx`). Every new color pair is checked before it ships.
- Typography: Fraunces (`font-display`, headings) + Inter (`font-sans`, body).
- Generous white space; pills for small interactive elements, circles for icon buttons; separate by tone rather than borders; only floating things get a shadow.
- Graphics: the Pulso circle (`assets/optimized/marca-*.png`, `PulseOrb`) as subtle backgrounds, dividers and bullets; texture utilities `bg-grain`, `bg-halftone`, `bg-brand-mesh`, `text-outline` (`src/index.css`).
- Animations respect `prefers-reduced-motion` (`motion-safe:` / `useReducedMotion`).

## E. Adding a public form
1. `packages/forms`: the key in `FORM_KEYS`, the answers type (added to `LeadAnswers`) and the accepted values.
2. `packages/db`: `bun run db:generate --name add_<form>_form` (the `lead_form` enum changes).
3. `apps/api/src/modules/leads`: body schema, a `create<Form>Lead` service (cleaning + cross-field rules), a public `POST /api/leads/<form>` route, tests.
4. `apps/web`: the page/route, its labels in `features/admin/labels.ts` (`FORM_LABELS`, `leadSummary`, `leadAnswers`, `whatsappGreeting`) so the admin page shows it.

# 3. TESTING (MANDATORY)
- **Unit (`bun test`)**: every `services.ts` function, every shared rule in `packages/forms` and every web util with logic (masks, formatting). The most used layer.
- **Integration (`bun test` + Elysia `.handle()`)**: every new/changed route, without a real server, on PGlite (`apps/api/src/test/setup.ts`). Every admin route is also tested **without a session** (refused) and every public route for validation and rate limiting.
- CI never calls a live service.
- Never modify a test just to make it pass. The only exception is a changed requirement, always confirmed with the user first.

# 4. PROJECT DOCS (LIVING)
- `/project/features.md`: what exists, its status, open questions (❓) and decisions. Read it before starting; update it at the end of the work (`[x]` what's done, scope changes, new ideas).
- ❓ marks an open question: ask before implementing anything that depends on one. When it's answered, write the answer into the relevant text and delete the question.
- Keep it short and current: it must reflect the real state of the project at any time.

# 5. DEFINITION OF DONE
In this order, or the task is NOT done:
1. `bun run lint` (Biome) with no errors.
2. `bun run typecheck` with no type errors.
3. `bun test`: the tests for the touched layer (§3) written and passing.
4. Frontend touched: the 3 breakpoints (§2.C) and the contrast rules (§2.D).
5. `/project/features.md` updated (§4).

# 6. AI BEHAVIOR
1. DRY: check the workspace before installing a package or duplicating code.
2. CONTEXT: read `/project/features.md` and the relevant module before coding.
3. NATIVE: prefer Bun APIs (`Bun.file`, `Bun.CryptoHasher`, `bun:test`) over Node's.
4. IMPORTS: workspace packages by name (`@pulso-concept/db`, `@pulso-concept/forms`); relative paths inside a package.
5. ISOLATION: no database access in the frontend; the API is the only thing that talks to Supabase.
6. NO UNDOCUMENTED RULES: if a business rule (opening hours, pipeline, pricing…) isn't in `/project/` or the code, ask before implementing. Never assume behavior.
7. CLOSED SCOPE: never touch a file outside the task (no drive-by refactors) without flagging it and asking.
8. FIXED VOCABULARY: no domain, table or module named outside §0 without asking.
9. PRIVACY (LGPD): forms collect only what they ask; leads can be deleted for good from the admin page; personal data never goes to logs, analytics or third parties.

# 7. COMMANDS
- Install: `bun install`
- Dev (API + web): `bun run db:up && bun run db:migrate && bun run dev` (needs `apps/api/.env`, see `.env.example`)
- Build the web app: `bun run build:web`
- Lint / types / tests: `bun run lint`, `bun run typecheck`, `bun test`
- New migration: `bun run db:generate --name <name>`
