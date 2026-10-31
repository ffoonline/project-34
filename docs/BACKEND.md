# THIRTY FOUR — Backend notes

Companion to [FRONTEND.md](./FRONTEND.md). The shop is meant to run locally
with empty secrets. Do not commit `.env` or `.env.local`.

## Env

Copy `.env.example` → `.env.local`. Quote `GLOBAL_CONFIG` if you set it — the
connection token can contain `$`.

| Key | Used by |
|---|---|
| `STRIPE_MODE` | `sandbox` by default; `live` or `livemode` selects live credentials |
| `STRIPE_SANDBOX_SECRET_KEY` | Server-only sandbox/test key for `lib/stripe.ts` |
| `STRIPE_LIVEMODE_SECRET_KEY` | Server-only live key for `lib/stripe.ts` |
| `STRIPE_SANDBOX_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_SANDBOX_PUBLISHABLE_KEY` | Sandbox Payment Element key; only the selected publishable key is exposed to the client |
| `STRIPE_LIVEMODE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_LIVEMODE_PUBLISHABLE_KEY` | Live Payment Element key; only the selected publishable key is exposed to the client |
| `STRIPE_SECRET_KEY` | Legacy server-side fallback when the selected mode-specific secret key is empty |
| `STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Legacy publishable-key fallback when the selected mode-specific key is empty |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret matching the currently selected Stripe mode |
| `ADMIN_PASSWORD` | `/login` house-key fallback |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Session refresh + RLS; does not gate the shop |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only: `place_order`, seed, admin writes |
| `GLOBAL_CONFIG` | Announcement, maintenance, sale |
| `CRON_SECRET` | `GET /api/cron` in production |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | OTP in production; else in-memory |
| `POSTHOG_ANALYTICS_*` | Mapped to `NEXT_PUBLIC_POSTHOG_*` in `next.config.ts` |

Public signup and email matching never grant admin access. Provision administrators only through a trusted Supabase admin operation after verifying account ownership; set `app_metadata.role` with the Dashboard or a protected server-side process. Never expose `SUPABASE_SERVICE_ROLE_KEY`.

## Stripe mode and live onboarding

Only `STRIPE_MODE=live` or `STRIPE_MODE=livemode` selects livemode. If `STRIPE_MODE` is unset, set to `sandbox`, or set to any other value, the application uses sandbox keys. The selected mode-specific key takes precedence; legacy key names are used only when the selected mode-specific key is empty.

For sandbox payments, configure the sandbox secret and publishable keys plus `STRIPE_WEBHOOK_SECRET` from the matching sandbox webhook endpoint. The webhook secret is a single environment variable and must always match the mode currently selected for that deployment.

**Live mode remains gated until Stripe account onboarding is complete.** Do not set production to `STRIPE_MODE=live` until the Stripe account is fully onboarded and live payments are enabled. After onboarding, configure the live secret key, live publishable key, and matching live webhook secret together, then set `STRIPE_MODE=live`. `next.config.ts` embeds only the selected publishable key at build time, so changing modes requires a rebuild/redeploy. Secret keys must remain server-only and must never be placed in `next.config.ts` or a `NEXT_PUBLIC_*` variable.

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
| POST | `/api/auth/login` | Supabase login for an explicitly provisioned admin, or house-key fallback |
| POST | `/api/auth/signout` | Clears Supabase session + cookies |
| POST | `/api/auth/*` | OTP + customer session cookie `tf_customer` |

`proxy.ts` refreshes Supabase cookies, requires an admin JWT or the atelier
cookie on `/admin`, and leaves the shop open to guests. Apply
`supabase/schema.sql` before pointing production at a live project.

## Stripe locally

```bash
stripe listen --forward-to 127.0.0.1:43134/api/webhooks/stripe
```
