# pulso-concept: features

Status: `[x]` done · `[ ]` to do · ❓ open question (ask before building on it).

## Landing page (`/`)
- [x] Sections: Hero, Services marquee, About, Spaces, Features, Team, Gallery, Testimonials, Contact, Footer.
- [x] Contact form ("Sua evolução começa aqui."): name, WhatsApp, email, interest, frequency, preferred class time. Responses go to the admin page (form `contact`). Google Sheets/Apps Script was removed (2026-10-15).

## Trial class form (`/aula-experimental`)
Standalone page, shared as a direct link (e.g. Instagram bio). Brand backdrop: black with magenta/orange mesh, grain, halftone, the giant Pulso circle with pulsing rings and an outlined marquee.
- [x] Fields: full name, phone (WhatsApp, masked), email, weekday (Monday to Saturday), one-hour period for weight training.
- [x] Periods per day (`packages/forms`, derived from the class grid's first and last class): Mon–Thu 06:00–20:00, Fri 06:00–18:00, Sat 08:00–10:00. ❓ Confirm the weight room's real opening hours with the studio.
- [x] Success state with a WhatsApp shortcut (message prefilled with the chosen day/period).

## Admin page (`/admin`)
- [x] Access with the admin password (`ADMIN_PASSWORD` on Railway). Session: signed token, 7 days, on the device. 5 wrong passwords per address → locked for 15 minutes.
- [x] Every form's responses in one list (newest first): search (name, email, phone), filters (form, status, payment), counters (total, new, trial scheduled, enrolled, enrolled with payment pending).
- [x] Follow-up per response: status (Novo → Em contato → Aula agendada → Matriculado / Não fechou), payment (Pendente / Pago), notes; WhatsApp / call / email shortcuts; delete for good (confirm).
- [x] Export the filtered list as CSV (Excel-friendly).
- [ ] ❓ Email (or other) notification when a new response arrives: the old Apps Script emailed `pulsoconceptstudio@gmail.com`; nothing notifies today. Needs a free email provider (e.g. Resend's free tier).

## Platform
- [x] Monorepo: `apps/web` (Vercel), `apps/api` (Railway, `.railway/railway.ts` + Dockerfile, migrations before deploy), `packages/db` (Drizzle), `packages/forms`.
- [x] Public submissions: 10 per address per hour; honeypot field on every form.
- [ ] Tailwind v4 and Framer Motion 14 migrations (pinned on v3/12 for now).
- [ ] White text on `orange-500` in the landing's primary buttons fails WCAG AA (3.3:1): switch to ink text or a darker orange.

## Decisions
- One shared admin password (no user accounts): requested by the studio; revisit if more than one person needs separate access or an audit trail.
- Form answers are stored as typed `jsonb` (`answers`) next to contact columns, so new forms need no new table.
- A response's history isn't stored: only its current status, payment and notes.
