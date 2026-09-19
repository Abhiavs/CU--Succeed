# Running CU Succeed with Docker

Everything the app needs — Node 22, npm, PostgreSQL 16 — runs inside
containers. You do **not** need to install any of them on your machine.
This is what makes the setup identical on Windows, macOS and Linux, and
it sidesteps the native-build errors Windows tends to throw at
`npm install`.

---

## 1. Install Docker Desktop

Download it from <https://www.docker.com/products/docker-desktop/> and
install with the defaults.

**On Windows:** accept the **WSL 2** backend when the installer offers
it. If it says WSL 2 is missing, open PowerShell **as Administrator**,
run `wsl --install`, and reboot.

Start Docker Desktop and wait for the whale icon in the system tray to
stop animating — the CLI is not usable until it settles.

Confirm it works:

```bash
docker --version
docker compose version
```

---

## 2. Get the code

```bash
git clone https://github.com/Abhiavs/CU--Succeed.git
cd CU--Succeed
```

---

## 3. Start everything

```bash
docker compose up
```

The first run takes a few minutes: it downloads the Node and PostgreSQL
images and installs npm packages. Later runs start in seconds.

Wait for this line:

```
✓ Ready in ...
```

Then open <http://localhost:3000>.

Stop it with `Ctrl+C`, or from another terminal:

```bash
docker compose down
```

Your database survives `down` — it lives in a Docker volume, not in the
container.

---

## 4. Log in

A super-admin account is created automatically on first boot. The
email address and password it uses are the ones hardcoded near the top
of `scripts/seedAdmin.mjs` — read them there, and change the password
after your first login.

Admin sign-in is at **/admin-login**; students use **/login** and can
register at **/signup**.

---

## 5. Load sample content (optional, run once)

The database starts empty apart from the admin account. To load the
sample program, questions and assessment:

```bash
docker compose exec app node scripts/seedData.mjs
```

> Run this **once only**. Unlike the admin seed it is not idempotent —
> running it again creates a second copy of every question.

Competency-wheel dimensions are not seeded. Add them in the admin UI
under **Admin → Wheel Dimensions**, or via `POST /api/wheel/dimensions`.

Do **not** run `npm run setup`. It calls `scripts/enrollStudents.mjs`,
which references a `programs` relation that no longer exists on `User`,
so it fails part-way through.

---

## Day-to-day

Edit files normally in your editor on the host — the source directory is
mounted into the container and the dev server hot-reloads. The two
commands you will actually need:

```bash
docker compose up            # start
docker compose down          # stop
```

### After changing `prisma/schema.prisma`

The Prisma client is generated inside the container, so regenerate it
there and push the schema:

```bash
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
```

Then restart: `docker compose restart app`.

### After someone adds a dependency to `package.json`

`node_modules` lives inside the image, so the image has to be rebuilt:

```bash
docker compose up --build
```

### Other useful commands

```bash
docker compose logs -f app                 # tail the dev server
docker compose exec app sh                 # shell inside the container
docker compose exec app npx prisma studio  # DB browser (then open :5555)
```

To inspect the database with pgAdmin, TablePlus or DBeaver on the host,
connect to `localhost:5432` with user `cu_succeed`, password
`cu_succeed`, database `cu_succeed`.

---

## Starting over

Wipes the database completely, then rebuilds and reseeds:

```bash
docker compose down -v
docker compose up --build
```

---

## Troubleshooting

**`port is already allocated` on 3000 or 5432**
Something on the host already uses that port — often a local PostgreSQL
install on 5432. Either stop it, or change the left-hand number in
`docker-compose.yml` (`"5433:5432"`) and reconnect on the new port.

**Edits do not hot-reload**
Confirm the repo sits on a path Docker Desktop can share. On Windows,
keep the checkout on the `C:` drive (or inside the WSL filesystem) —
network drives and some external volumes do not forward file events.
Polling is already enabled in `docker-compose.yml` to cover the usual
Windows and macOS cases.

**`Cannot find module` or a Prisma engine error after pulling changes**
Someone changed the dependencies. Rebuild: `docker compose up --build`.

**Git turns every file into a change on Windows**
That is line endings, not the code. Fix it once:
`git config --global core.autocrlf input`, then re-clone.

**The app cannot reach the database**
`docker compose ps` should show `db` as `healthy`. If it is restarting,
read `docker compose logs db` — a stale volume from an older PostgreSQL
version is the usual culprit, cleared with `docker compose down -v`.

---

## What is *not* covered here

This stack is for development only. Production runs on Vercel against a
hosted Neon PostgreSQL database and builds straight from the repo — no
container is involved, so there is no production image to keep in sync.

Local credentials in `docker-compose.yml` (the database password and
`NEXTAUTH_SECRET`) are development throwaways. They are deliberately
unrelated to anything used in production.
