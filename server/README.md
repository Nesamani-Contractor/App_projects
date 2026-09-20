# Shine Me face-analysis server

Holds the Perfect Corp and AWS API secrets and exposes one endpoint the app
calls: `POST /api/analyze`. This must run as a separate backend - the API
keys involved must never be embedded in the mobile app bundle, since a
mobile build can always be unpacked and its secrets extracted.

## Why this exists

The app's camera screen captures a photo and uploads it here. This server
calls out to the real providers and returns one normalized JSON response:

```json
{
  "makeupReview": {
    "summary": "…",
    "overallScore": 82,
    "touchUps": [{ "id": "…", "area": "Under-eye", "issue": "…", "suggestion": "…" }]
  },
  "skin": {
    "overallScore": 78,
    "concerns": [{ "id": "…", "label": "Hydration", "severity": "moderate", "score": 68, "recommendation": "…" }]
  },
  "celebrityMatches": [{ "name": "…", "similarity": 91, "imageUrl": "https://…" }]
}
```

## Run it locally (mock providers, no API keys needed)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

By default both providers are `mock`, so you get realistic-looking fake
responses immediately - useful for building/testing the app UI before you
have real credentials.

## Switching on the real skin/makeup provider (Perfect Corp YouCam API)

1. Create an account and API key at https://yce.perfectcorp.com/ai-api.
2. Set `SKIN_MAKEUP_PROVIDER=perfectcorp`, `PERFECTCORP_CLIENT_ID`,
   `PERFECTCORP_CLIENT_SECRET` in `.env`.
3. **Before relying on it**: read the comment block at the top of
   `src/providers/skinMakeup/perfectCorpProvider.js`. This sandbox's network
   egress blocked `docs.perfectcorp.com`, so the auth handshake and endpoint
   paths were written from documentation summaries, not a live-tested
   session. Confirm the auth flow and field names against your console /
   the live docs and adjust the three functions there (`getAccessToken`,
   `uploadImage`, `runTask`) and the two `normalize*Result` functions if
   anything doesn't match.

## Switching on the real celebrity look-alike provider (AWS Rekognition)

Rekognition doesn't ship a celebrity database for look-alike matching (that's
a different feature - `RecognizeCelebrities` only detects celebrities who are
*already in* a photo, not a look-alike for a regular person). You build your
own small collection:

1. Create an IAM user/role with `rekognition:CreateCollection`,
   `rekognition:IndexFaces`, and `rekognition:SearchFacesByImage`, and put
   its keys in `.env` as `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.
2. **You need the rights to use whatever photos you index** - this is a
   licensing/legal decision, not a code one. Don't scrape images without
   checking usage rights.
3. Put one clear-face photo per celebrity in `server/celebrity-photos/`,
   named e.g. `Zendaya.jpg` or `Emma_Stone.jpg` (the filename becomes the
   display name).
4. Run `npm run build-celebrity-collection`. This indexes each face into a
   Rekognition collection, copies the photos into `public/celebrities/` (so
   the app can display them), and writes `data/celebrities.manifest.json`
   mapping each indexed face back to a name + photo.
5. Set `CELEBRITY_MATCH_PROVIDER=rekognition` in `.env` and restart.

Re-run step 4 any time you add or remove celebrity photos.

## Deploying

Any Node host works (Fly.io, Render, a small EC2/Lightsail box, AWS Lambda
behind API Gateway, etc.) - there's nothing framework-specific here beyond
plain Express. Whichever you pick:

- Set `PUBLIC_BASE_URL` to the server's real public URL (used to build the
  celebrity photo URLs returned to the app).
- Set the app's `API_BASE_URL` (see `src/config/env.ts` in the root project)
  to that same URL.
