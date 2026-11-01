# NEXUS Conf — frontend

Next.js site for NEXUS Conf 2026. Install, environment, and deploy notes are in the [repository README](../README.md).

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dev server listens on [http://localhost:3000](http://localhost:3000). With `NEXT_PUBLIC_API_URL=/backend`, Next rewrites that path to the API at `http://localhost:4000/api`.
