# THIRTY FOUR — Backend notes

Companion to [FRONTEND.md](./FRONTEND.md). The shop is meant to run locally
with empty secrets. Do not commit `.env` or `.env.local`.

## Env

Copy `.env.example` → `.env.local`. Quote `GLOBAL_CONFIG` if you set it — the
connection token can contain `$`.

| Key | Used by |
|---|---|
| `STRIPE_SECRET_KEY` | Server-only `lib/stripe.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_PUBLISHABLE_KEY` | Payment Element |
| `STRIPE_WEBHOOK_SECRET` | `POST /api/webhooks/stripe` (raw body) |
| `ADMIN_PASSWORD` | `/login` house-key fallback |
| `ADMIN_EMAIL` | Promoted to admin on sign-in |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Session refresh + RLS; does not gate the shop |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only: `place_order`, seed, admin writes |
| `GLOBAL_CONFIG` | Announcement, maintenance, sale |
| `CRON_SECRET` | `GET /api/cron` in production |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | OTP in production; else in-memory |
| `POSTHOG_ANALYTICS_*` | Mapped to `NEXT_PUBLIC_POSTHOG_*` in `next.config.ts` |

## Routes that matter

| Method | Path | Notes |
|---|---|---|
| POST | `/api/checkout/create-payment-intent` | Catalogue prices, not the browser |
| POST | `/api/webhooks/stripe` | `req.text()` + `constructEvent`. Records a confirmed order on `payment_intent.succeeded` |
| POST | `/api/checkout/create-session` | Hosted Checkout Session (legacy path) |
| GET | `/api/cron` | Daily 04:00 UTC |
| POST | `/api/orders` | Server-priced totals; stock locked in `place_order` |
| GET / POST | `/api/products` | Public list/search; admin create |
| POST | `/api/newsletter` | Unique email |
| POST | `/api/auth/signup` | Email / password |
| POST | `/api/auth/login` | Staff email/password or house key |
| POST | `/api/auth/signout` | Clears Supabase session + cookies |
| POST | `/api/auth/*` | OTP + customer session cookie `tf_customer` |

`proxy.ts` refreshes Supabase cookies, requires an admin JWT or the atelier
cookie on `/admin`, and leaves the shop open to guests. Apply
`supabase/schema.sql` before pointing production at a live project.

## Stripe locally

```bash
stripe listen --forward-to 127.0.0.1:43134/api/webhooks/stripe
```
