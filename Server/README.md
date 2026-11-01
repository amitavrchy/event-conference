# NEXUS Conf — API

NestJS API for accounts, the program, tickets, agenda, and check-in. Setup, environment variables, and deploy notes are in the [repository README](../README.md).

```bash
npm install
cp .env.example .env
npm run db:setup
npm run start:dev
```

`npm ci` fails because `package-lock.json` does not include `magicast@0.3.5`. Use `npm install`.

Set `DATABASE_URL` before `db:setup`. Postgres must already be running. The deployed API is [https://nexus-conf-api.onrender.com](https://nexus-conf-api.onrender.com). `GET /api/health` reports the service status.
