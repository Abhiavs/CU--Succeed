# syntax=docker/dockerfile:1

# ============================================================
# CU Succeed — development container
#
# Purpose: give a collaborator a working dev environment without
# installing Node, npm or PostgreSQL on their own machine. Run it
# with `docker compose up` (see docker-compose.yml and DOCKER.md).
#
# Production is hosted on Vercel and builds from the repo, so this
# image deliberately covers development only.
#
# Debian slim rather than Alpine: Prisma's engines want glibc and
# OpenSSL, which musl images make fiddly.
# ============================================================

FROM node:22-bookworm-slim AS base

# Prisma's query engine links against OpenSSL at run time.
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1


# ------------------------------------------------------------
# Dependencies
#
# Installed in their own layer so editing source does not
# re-run npm. package.json's `postinstall` calls
# `prisma generate`, so the schema must be in place before
# `npm ci` runs.
# ------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci


# ------------------------------------------------------------
# dev — the target docker-compose builds
#
# The source copied here is shadowed at run time by the bind
# mount of the developer's checkout. node_modules is NOT
# shadowed (see the volumes in docker-compose.yml), so the Linux
# binaries installed above are the ones that actually run.
# ------------------------------------------------------------
FROM deps AS dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
