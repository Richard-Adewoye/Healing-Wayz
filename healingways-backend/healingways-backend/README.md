# HealingWays Backend

A real backend for the critical items from the go-live gap analysis: authentication,
role-based access control, payments, and document storage. Built and tested — see
"What's been verified" below.

## Quick start (local)

```bash
npm install
cp .env.example .env
# generate a real secret and put it in .env:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
npm run migrate
npm start
```

Server runs on `http://localhost:4000` by default. `GET /api/health` should return `{"ok":true}`.

### Creating the first admin account

There is deliberately no public "sign up as admin" endpoint — that would be a
privilege-escalation hole. Create the first admin directly:

```js
node -e "
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const db = require('./db/connection');
(async () => {
  const hash = await bcrypt.hash('CHANGE-THIS-PASSWORD', 12);
  db.prepare(\"INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, 'admin')\")
    .run(randomUUID(), 'you@healingwayz.com', hash, 'Your Name');
})();
"
```

After that, sign in as that admin and use `POST /api/staff` to create coordinator
and account_officer accounts through the API.

## What's implemented and tested

- **Auth** — real bcrypt password hashing (12 rounds), JWT sessions (12h expiry),
  generic error messages on login failure (doesn't reveal whether the email exists).
- **Privilege escalation blocked** — the public `/api/auth/register` endpoint hardcodes
  `role = 'patient'` no matter what's in the request body. Staff accounts can only be
  created by an existing admin via `/api/staff`.
- **Server-enforced data isolation** — every case/message/document/billing endpoint
  checks that the requester is either the owning patient or a staff member, on the
  server, on every request. Verified: a second patient gets a 403 trying to read,
  message, or upload to a case that isn't theirs, even with a valid token.
- **Server-enforced RBAC** — role checks happen in middleware, not just the UI.
  Verified: a patient token gets 403 on staff-only routes.
- **Payments** — Stripe Checkout (hosted, redirect-based). Card numbers never reach
  this server. A payment is only ever marked `paid` from a signature-verified webhook
  event, never from a client-reported "success" redirect — so a user can't fake a
  payment by just visiting the success URL.
- **Document uploads** — real files on disk, random storage filenames (the original
  filename is never trusted for anything other than display), MIME-type allowlist,
  15MB size cap, ownership-checked download.
- **Audit log** — every sensitive action (login, login failure, register, case
  create/update, document upload/status change, staff creation, billing) is recorded
  with actor, action, target, and timestamp.
- **Rate limiting** on `/api/auth/login` and `/api/auth/register` (20 requests / 15 min)
  to blunt credential-stuffing attempts.
- **Security headers** via `helmet`; CORS restricted to your configured frontend origin.

All of the above was tested end-to-end with real HTTP requests during development —
not just read for correctness. See the go-live readiness doc for what's still open.

## What's deliberately NOT done yet

This covers the "Critical" row of the gap analysis (auth, payments, data isolation,
RBAC, document storage foundation) — not a full migration of every feature in the
existing frontend prototype. Specifically still open:

- The rest of the data model (tasks, recommendations, accommodation, treatment plans,
  reports) — the existing patterns here (ownership checks, staff-only mutation routes,
  audit logging) are the template to extend the same way.
- Real email/SMS/WhatsApp sending (still just needs a provider chosen and wired in).
- A first-admin bootstrap script (currently a manual one-liner, shown above).
- Deploying this somewhere persistent — I can't host this for you from my working
  environment; it needs a real host (Render, Railway, Fly.io, your own infra, etc.)
  with a persistent volume for the SQLite file and the uploads folder.
- Postgres migration, if/when you outgrow SQLite (the schema in `db/migrate.js` is
  close to standard SQL and was written with that move in mind).
- Regional payment processors (Paystack/Flutterwave/Razorpay) — Stripe is the
  reference implementation; same pattern, different SDK, once you tell me which ones.

## Environment variables

See `.env.example` for the full list with explanations. The server refuses to start
if `JWT_SECRET` is missing or under 32 characters — that's intentional, not a bug.

## Deploying

Any Node host works. Two things matter more than the platform choice:

1. **Persistent storage** — `db/healingways.db` and the `uploads/` folder must survive
   restarts and redeploys. Some platforms wipe local disk on every deploy; if yours
   does, mount a persistent volume for both, or move to Postgres + S3 sooner rather
   than later.
2. **Real secrets** — set `JWT_SECRET`, `STRIPE_SECRET_KEY`, and
   `STRIPE_WEBHOOK_SECRET` as actual environment variables on the host, never
   committed to a repo.
