# Shine Me — Face Score backend (dev)

Minimal backend implementing the real two-call AI pipeline from the Face
Score PRD: Call 1 (the scan, Claude Haiku 4.5, forced tool-call JSON) and
Call 2 (the glow-up guide, Claude Sonnet 5, streamed).

This is a dev-only vertical slice: no auth, no Postgres/S3, no payments or
analytics. Scan history is a local SQLite file in `server/data/`.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste a real ANTHROPIC_API_KEY
npm start
```

The server listens on `http://localhost:4000` by default. The Expo app
(`src/config/api.ts`) expects it there for web and iOS Simulator; for a
physical device on Expo Go, change `DEV_LAN_HOST` in that file to your
computer's LAN IP so the phone can reach it.

## Endpoints

- `GET /api/health` — `{ ok, hasApiKey }`
- `POST /api/scan` — `{ imageBase64, mediaType, profile }` → `{ scanId, scan }`. Validates the model's response against the schema in `src/schema.js`, retries once on failure, and returns `422 { error: "retake_needed" }` if the image itself is unusable.
- `GET /api/guide/:scanId` — server-sent events streaming the Mago glow-up guide (`event: delta` chunks, then `event: done`).
- `GET /api/scan/:scanId` — fetch a stored scan by id.

## What's intentionally not built here

Per the PRD, but out of scope for this slice:
- On-device MediaPipe landmark measurement (needs a native build via EAS Build — this container can't compile native modules). The scan call currently sends the photo alone; adding real ratio grounding is a follow-up once someone runs a native build.
- Auth (Supabase/Clerk), Postgres, S3, RevenueCat, PostHog — the PRD's full stack, each needing its own hosted account.
- Rate limiting, retention/deletion policies, and the legal/consent copy — needed before any real launch, not before a working demo.
