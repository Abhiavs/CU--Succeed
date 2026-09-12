# Deploying CU Succeed (Railway / Render / Fly)

This project runs **identically** in local development and in the cloud — the two
environments differ only in environment variables and databases. There is **no code
difference** between local and hosted.

- **Local dev** → uses your local PostgreSQL (`DATABASE_URL` in `.env`, see README).
- **Production / host** → uses the platform's **own hosted PostgreSQL** and its own
  secrets. Local dev data and hosted data never mix.

---

## 1. Create a separate production database

Each of these platforms can provision a PostgreSQL database for you. Create one per app
(the plan is **separate dev & prod DBs** — do not point production at your local DB).

| Platform | How to create Postgres |
| --- | --- |
| **Railway** | New project → `PostgreSQL` plugin → copy the `DATABASE_URL` it generates |
| **Render** | New → `PostgreSQL` → after it's created, copy the *Internal* or *External* DB URL |
| **Fly.io** | `fly postgres create` then attach with `fly postgres attach` (or use a managed add-on) |

## 2. Set environment variables on the host

Set these in the platform dashboard (do **not** commit real secrets, and do **not**
copy your local `.env` to the host):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | The **hosted** Postgres connection string from step 1 |
| `NEXTAUTH_URL` | The app's public URL, e.g. `https://<your-app>.up.railway.app`, `https://<your-app>.onrender.com`, `https://<your-app>.fly.dev` |
| `NEXTAUTH_SECRET` | A **fresh** secret, generated on the host machine: `openssl rand -base64 32` (different from your dev secret) |

## 3. Build & start commands

Use the app's production scripts (already in `package.json`):

- **Build:** `npm ci && npm run build:prod`  →  this runs `prisma generate` then `next build`.
  *(Keep devDependencies installed during build — `prisma` CLI is a devDependency.)*
- **Start:** `npm start`

Platform fields:
- **Railway:** Start Command `npm start` (build runs automatically from `package.json`).
- **Render:** Build Command `npm ci && npm run build:prod`, Start Command `npm start`.
- **Fly.io:** a `Dockerfile` is easiest; alternatively `fly deploy` with a custom start
  command `npm start`.

## 4. Sync the schema + seed on first deploy

This project currently syncs the schema with `prisma db push` (it has no `migrations/`
folder yet). On the **hosted** database, once the app is deployed and `DATABASE_URL` is
set, run once:

```bash
npx prisma db push          # creates tables in the hosted DB
```

Then create the admin account and assessments once:

```bash
curl -X POST https://<your-app-url>/api/seed
```

Default admin (change immediately): `admin@cusucceed.com` / `admin123`.

> **Note for later:** `prisma db push` is fine during early development. When the schema
> becomes stable, switch to Prisma Migrations (`prisma migrate dev` locally → commit the
> generated `prisma/migrations/` folder → `prisma migrate deploy` on the host).

## 5. Verify after deploy

- Open the public URL — landing page loads.
- `https://<your-app-url>/login` and `/admin-login` load.
- `GET /api/wheel/dimensions` returns JSON (proves the hosted Postgres round-trip).
- Sign in with the seeded admin and confirm `/admin` loads.

Then, when you're ready, we can run the **1000-student load test** against this
production URL (separate step).
