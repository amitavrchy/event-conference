# NEXUS Conf 2026

Flagship design×tech conference site — Next.js client + NestJS API.

## Quick start

### API (port 4000)

```bash
cd Server
npm install
cp .env.example .env
npm run db:setup
npm run start:dev
```

SQLite DB lives at `Server/prisma/dev.db`. Demo users (password `nexus2026`):

- `amitav@nexusconf.dev` — attendee
- `staff@nexusconf.dev` — door staff
- `admin@nexusconf.dev` — admin

### Stripe payments

Set in `Server/.env`:

- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from `stripe listen --forward-to localhost:4000/api/tickets/stripe/webhook`)
- `CLIENT_ORIGIN=http://localhost:3000`

Checkout creates a Stripe Checkout Session and redirects the buyer. Success returns to `/ticket/pass?code=…&session_id=…`. Without Stripe keys, checkout falls back to mock PAID mode for local demos.

### Client (port 3000)

```bash
cd Client
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_URL=/backend` proxies to the Nest API via Next rewrites.

## Spec highlights

- Festival dark/neon design system (min type **14px**)
- Preloader, magnetic speaker cards, schedule now-line, page fades, Embla marquees
- Schedule day/track filters + personal agenda
- Ticket checkout stub → QR pass (`qrcode.react`)
- Staff check-in at `/admin/check-in`
