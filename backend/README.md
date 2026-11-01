# NEXUS Conf — API

NestJS API for accounts, the program, tickets, agenda, and check-in. Install, environment, and deploy notes are in the [repository README](../README.md).

```bash
npm install
cp .env.example .env
npm run db:setup
npm run start:dev
```

The API listens on [http://localhost:4000/api](http://localhost:4000/api). `GET /api/health` reports the service status. Postgres must already be running before `db:setup`.
