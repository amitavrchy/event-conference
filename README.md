# NEXUS Conf 2026

**Site:** [https://nexus-conf-162.netlify.app](https://nexus-conf-162.netlify.app)

**API:** [https://nexus-conf-api.onrender.com](https://nexus-conf-api.onrender.com)

Public site and API for a three-day design and technology conference at NEXUS Arena, Dhaka, September 18–20, 2026.

## Overview

Attendees browse the program, save a personal agenda, and buy a pass. Staff check people in from a QR ticket. The Next.js app in `Client/` renders the site. The NestJS API in `Server/` stores accounts, sessions, tickets, and agenda items in PostgreSQL through Prisma.

## Features

- Homepage with the lineup teaser, themes, partners, venue, FAQ, and ticket call to action
- Speaker index and profile pages
- Schedule with day and track filters, session details, and a saved agenda
- Ticket tiers (Early Bird, Regular, VIP, Remote), Stripe Checkout, and a paid fallback when Stripe keys are absent
- QR ticket pass and a staff check-in desk at `/admin/check-in`
- Registration and sign-in with JWT
- Venue page and a live view of sessions happening now

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

The interface also uses Redux Toolkit, TanStack Query, React Hook Form, Zod, Framer Motion, and Axios. The API uses Passport JWT for auth.

## Project structure

```
.
├── Client/            Next.js site (App Router)
├── Server/            NestJS API, Prisma schema, and Docker image
├── scripts/           Launcher that starts the site and API together
├── netlify.toml       Netlify base directory and build
├── start-nexus.cmd    Windows shortcut for the launcher
└── README.md
```

`scripts/` and `start-nexus.cmd` stay at the repository root because they start both apps. `netlify.toml` stays at the root because Netlify reads `base = "Client"` from that file.

## Getting started

Use Node.js 22 and npm. The API needs PostgreSQL.

### Client

```bash
cd Client
npm ci
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local`. The sample value is a same-origin path; `Client/next.config.ts` rewrites that path to the API. Point `NEXT_PUBLIC_API_URL` at [https://nexus-conf-api.onrender.com/api](https://nexus-conf-api.onrender.com/api) to use the deployed API. An absolute URL skips the rewrite.

The deployed site is [https://nexus-conf-162.netlify.app](https://nexus-conf-162.netlify.app).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

### Server

```bash
cd Server
npm install
cp .env.example .env
```

`npm ci` fails here because `package-lock.json` does not include `magicast@0.3.5`. Use `npm install`. `Dockerfile.render` already does.

Start Postgres, then load the schema and seed data:

```bash
docker compose up -d
npm run db:setup
npm run start:dev
```

Set `DATABASE_URL`, `JWT_SECRET`, `QR_HMAC_SECRET`, `PORT`, `HOST`, `CLIENT_ORIGIN`, and `CORS_ORIGIN` in `.env`. For the deployed site, set `CLIENT_ORIGIN` and `CORS_ORIGIN` to [https://nexus-conf-162.netlify.app](https://nexus-conf-162.netlify.app).

The API is [https://nexus-conf-api.onrender.com](https://nexus-conf-api.onrender.com). `GET /api/health` returns `{ "ok": true, "event": "NEXUS Conf 2026" }`.

`docker compose` creates a database named `event_conference`. `.env.example` uses `nexus_conf`. Point `DATABASE_URL` at the database you actually create before `db:setup`. The Render image (`Dockerfile.render`) creates `nexus_conf` itself and does not use the compose file.

Demo accounts use the password `nexus2026`:

| Email | Role |
| --- | --- |
| `demo@nexusconf.dev` | Attendee |
| `staff@nexusconf.dev` | Door staff |
| `admin@nexusconf.dev` | Admin |

Stripe is optional. Without `STRIPE_SECRET_KEY`, checkout marks the ticket paid in the API. With `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, checkout redirects to Stripe and returns to `/ticket/pass`. Point the Stripe webhook at [https://nexus-conf-api.onrender.com/api/tickets/stripe/webhook](https://nexus-conf-api.onrender.com/api/tickets/stripe/webhook).

| Script | Purpose |
| --- | --- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run `node dist/main` |
| `npm run lint` | Oxlint |
| `npm test` | Unit tests |
| `npm run db:setup` | Push the schema and seed |

### Both apps on Windows

From the repository root, `start-nexus.cmd` runs `scripts/start-local.mjs`. Install Client dependencies and build the API first (`npm run build` inside `Server/`). The launcher prefers ports 3010 and 4010, then opens the site. Leave that window open. Ctrl+C stops both processes.

## Deploy

The live site is already deployed. This repository does not change the Netlify or Render settings those deploys use.

Netlify builds `Client/` from the root `netlify.toml` (`base = "Client"`, `npm ci && npm run build`, publish `.next`, Node 22). The frontend build directory stays `Client`.

Render is a Docker web service with an empty Root Directory, so the build starts at the repository root. The image definition stays `Server/Dockerfile.render`: Node 22, Postgres in the same container, Prisma migrate, seed, then the Nest process on port 4000. Set `CLIENT_ORIGIN` to [https://nexus-conf-162.netlify.app](https://nexus-conf-162.netlify.app) so the API accepts browser requests from the site.

## Author

Amitav Roy Chowdhury — [github.com/amitavrchy](https://github.com/amitavrchy)
