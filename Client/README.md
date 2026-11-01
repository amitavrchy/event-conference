# NEXUS Conf — site

Next.js app for NEXUS Conf 2026. Setup, environment variables, and deploy notes are in the [repository README](../README.md).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local`. Use [https://nexus-conf-api.onrender.com/api](https://nexus-conf-api.onrender.com/api) for the deployed API. The live site is [https://nexus-conf-162.netlify.app](https://nexus-conf-162.netlify.app).
