# NEXUS Conf 2026

Public site and API for NEXUS Conf 2026 — three days of design and technology at NEXUS Arena, Dhaka, September 18–20.

## Live demo

> **TODO:** No public frontend or API URL is recorded in this repository.

The GitHub homepage field is empty. Nothing in the previous README, either `package.json`, `netlify.toml`, `backend/Dockerfile.render`, the env examples, CORS defaults, or `NEXT_PUBLIC_API_URL` points at a deployed host. There is no `render.yaml` or `vercel.json`. Every configured origin is localhost.

| Surface | URL |
| --- | --- |
| Frontend (Netlify) | TODO |
| API (Render) | TODO |

Replace those rows when the deployments have public addresses. Until then, use the local steps below.

## Overview

Attendees browse the program, build a personal agenda, and buy a ticket. Staff check people in from a QR pass. The Next.js app in `frontend/` renders the site. The NestJS API in `backend/` stores accounts, sessions, tickets, and agenda items in PostgreSQL through Prisma.

## Features

- Homepage with a countdown, speaker teaser, themes, sponsors, venue, and FAQ
- Speaker index and profile pages
- Schedule with day and track filters, session details, and a saved agenda
- Ticket tiers, Stripe Checkout, and a local paid fallback when Stripe keys are absent
- QR ticket pass and a staff check-in desk
- Registration and sign-in with JWT
- Venue page with a map embed

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

The interface also uses Redux Toolkit, TanStack Query, React Hook Form, Zod, Framer Motion, GSAP, and Embla. Payments go through Stripe.

## Project structure

```
.
├── frontend/          Next.js site (App Router)
├── backend/           NestJS API, Prisma schema, and Docker image
├── scripts/           Launcher that starts the site and API together
├── netlify.toml       Netlify base directory and build
├── start-nexus.cmd    Windows shortcut for the local launcher
├── PROJECT_SPEC.md    Original product and data spec
└── README.md
```

`scripts/` and `start-nexus.cmd` stay at the repository root because they start both apps. `netlify.toml` stays at the root because Netlify reads the `base` directory from that file. `PROJECT_SPEC.md` describes the whole product, so it stays beside the README.

## Getting started

Use Node.js 22 and npm. The API needs PostgreSQL 16.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL=/backend` keeps API calls on the site origin. `frontend/next.config.ts` rewrites `/backend/*` to `http://localhost:4000/api/*`. When the API is hosted on another origin, set `NEXT_PUBLIC_API_URL` to that full URL ending in `/api`. An absolute URL skips the rewrite.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

The frontend lockfile supports `npm ci`, which is what Netlify runs.

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Start Postgres, then load the schema and seed data:

```bash
docker compose up -d
npm run db:setup
npm run start:dev
```

The API listens on [http://localhost:4000/api](http://localhost:4000/api). `GET /api/health` returns `{ "ok": true, "event": "NEXUS Conf 2026" }`.

`docker compose` creates a database named `event_conference`. `.env.example` uses `nexus_conf`. Point `DATABASE_URL` at the database you actually create. The Render image (`Dockerfile.render`) creates `nexus_conf` itself and does not use the compose file.

`npm ci` currently fails in `backend/` because `package-lock.json` does not include `magicast@0.3.5`. Use `npm install`.

Demo accounts use the password `nexus2026`:

| Email | Role |
| --- | --- |
| `demo@nexusconf.dev` | Attendee |
| `staff@nexusconf.dev` | Door staff |
| `admin@nexusconf.dev` | Admin |

Stripe is optional. Without `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, checkout marks the ticket paid in the API. With both keys set, checkout redirects to Stripe and returns to `/ticket/pass`. For local webhooks, forward Stripe to `http://localhost:4000/api/tickets/stripe/webhook`.

| Script | Purpose |
| --- | --- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run `node dist/main` |
| `npm run lint` | Oxlint |
| `npm test` | Unit tests |
| `npm run db:setup` | Push the schema and seed |

### Both apps on Windows

From the repository root, `start-nexus.cmd` runs `scripts/start-local.mjs`. Install frontend dependencies and build the API first (`npm run build` inside `backend/`). The launcher prefers ports 3010 and 4010, then opens the site. Leave that window open. Ctrl+C stops both processes.

## Deploy

Netlify builds the site from `frontend/` (`base = "frontend"` in `netlify.toml`, publish directory `.next`, Node 22). The API image is `backend/Dockerfile.render`: Node 22, Postgres in the same container, Prisma migrate, seed, then the Nest process on port 4000.

Set `CLIENT_ORIGIN` on the API to the public site origin so browser requests are accepted.

## Author

Amitav Roy Chowdhury — [github.com/amitavrchy](https://github.com/amitavrchy)

## License

This repository has no license file. Both packages are private. The API package is marked `UNLICENSED`.
