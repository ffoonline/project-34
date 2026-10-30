# THIRTY FOUR — T.F.G / Thirty Four Global

Official house site for **THIRTY FOUR**: Men, Women, Kids, fragrance, and accessories. Kabul-first, built to travel. Production domain: [thirtyfourglobal.com](https://www.thirtyfourglobal.com/).

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui. Deploys on Vercel.

Frontend map: [docs/FRONTEND.md](docs/FRONTEND.md). API and env: [docs/BACKEND.md](docs/BACKEND.md).

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43134](http://127.0.0.1:43134).

The shop runs with empty env: catalogue and orders stay in memory (no filesystem database). Admin fallback login is disabled until `ADMIN_PASSWORD` is explicitly configured. OTP codes print to the server console; Stripe calls fail until `STRIPE_SECRET_KEY` is set. Cash on delivery, bank transfer, and WhatsApp orders still work.

Storefront chrome is **English**, **Dari (دری)**, and **Pashto (پښتو)** from the flag menu or the mobile sheet. Dari and Pashto set right-to-left layout and Noto Naskh Arabic. Product names and journal bodies stay in English.

| Env | Purpose | Local fallback |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Optional atelier login fallback when Supabase is unset | unset (login disabled) |
| `ADMIN_EMAIL` | First account promoted to admin | unset |
| `CUSTOMER_SESSION_SECRET` | Encrypts/authenticates 30-day customer identity cookies (at least 32 random bytes) | required for customer sign-in |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL | `http://127.0.0.1:43134` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp digits, no plus | `4915217251813` |
| `STRIPE_SECRET_KEY` | Card checkout | fails until set |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | OTP in production | in-memory Map |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | unset = in-memory shop |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon key | browser + RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Never `NEXT_PUBLIC_*` | order RPC, seed, admin writes |
| `POSTHOG_ANALYTICS_API_KEY` / `HOST` | PostHog (Stripe Projects) | `stripe projects env --pull` |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | Vercel project (Stripe Projects) | `stripe projects env --pull` |
| `GLOBAL_CONFIG` | Vercel Global Config connection string (quote it) | local flags: open shop, house announcement, sale on |
| `CRON_SECRET` | Vercel Cron `Authorization: Bearer` | local `GET /api/cron` allowed in `next dev` |

Contact: [sales@thirtyfourglobal.com](mailto:sales@thirtyfourglobal.com) · WhatsApp [(+49) 1521 7251813](https://wa.me/4915217251813).

## Auth

Browse, product pages, and add to bag work as a guest. The bag is stored in `localStorage`. Login or sign-up is offered at checkout; guest checkout remains available.

- `/register` — email / password (Supabase Auth when configured)
- `/account/login` — customer sign-in
- `/account/signup` — identifier → OTP → password (phone still works locally)
- `/login` — atelier. Email + password when Supabase is set; house password `ADMIN_PASSWORD` otherwise. Unauthenticated `/admin` redirects here. Signed-in non-admins are sent home.

Customer sign-in requires a separate `CUSTOMER_SESSION_SECRET` containing at least 32 random bytes. The encrypted customer identity cookie expires after 30 days; rotating the secret invalidates existing customer sessions.

`proxy.ts` (Next.js 16 session layer; there is no `middleware.js`) refreshes Supabase cookies and checks admin role via JWT `app_metadata.role` plus the house cookie. The shop stays open.

Supabase clients live in `lib/supabase/` (browser, server, service-role admin). The service role is used only on the server for `place_order`, catalogue seed, and admin writes.

## Deploy on Vercel

1. Create a Supabase project. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) (tables, RLS, `shop.place_order` transaction).
2. Confirm **Email** auth is on. Turn off “Confirm email” if you want local sign-up without a mailer.
3. Set `ADMIN_EMAIL` to the first atelier address. That account is promoted to `profiles.role = admin` and `app_metadata.role = admin` on sign-in.
4. In Vercel: import the repo, Framework Preset **Next.js**, then add the keys from `.env.example`. Do not add `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable.
5. Deploy. Route Handlers are serverless — there is no Express process and no `data/runtime.json`.
6. Optional: `stripe projects env --pull` if hosting / PostHog were provisioned with Stripe Projects.

Hosting (Vercel) and product analytics (PostHog) are provisioned with Stripe Projects when that CLI is available. Add the publishable URL and key from [the Connect modal](https://supabase.com/dashboard) to `.env.local` until the Supabase provider is linked.

Storefront flags (`announcement`, `maintenance`, `saleEnabled`) read from Vercel Global Config via `createClient(process.env.GLOBAL_CONFIG, { cache: 'force-cache' })` in `lib/global-config.ts`. Without `GLOBAL_CONFIG` (or the legacy `EDGE_CONFIG` name), the shop stays open with the house announcement. Wrap the connection string in single quotes so `$` in the token is not expanded — the same trap the Vite `dotenv-expand` example is written to avoid. Writes go through the Vercel REST API or `vercel global-config`, not the SDK.

## Cron

Vercel invokes `GET /api/cron` daily at 04:00 UTC (`vercel.json` `crons`). That is the App Router form of the classic Pages handler that returns `Hello Cron!`. The run also sweeps expired in-memory OTP codes and reads storefront flags from Global Config. Set `CRON_SECRET` on the Vercel project; Vercel sends it as `Authorization: Bearer …`. The shop is not gated by this route.

```bash
curl http://127.0.0.1:43134/api/cron
```

## Payments

`startCheckoutSession` in `app/actions/stripe.ts` opens an embedded Checkout Session for one catalogue piece (`/checkout/pay/[id]`). Amounts come from the rail, never the browser. `/checkout/payment` still creates a Payment Intent from the live bag. `/api/webhooks/stripe` verifies the raw body with `stripe.webhooks.constructEvent` (no JSON body parser) and records a confirmed house order on `payment_intent.succeeded`. `/checkout/success` clears the bag only after the Payment Intent (or Checkout Session) is verified as paid. The Stripe client in `lib/stripe.ts` is server-only and throws if `STRIPE_SECRET_KEY` is missing when a charge is attempted. Without keys, no card is charged; pay on delivery still works.

Forward events locally with:

```bash
stripe listen --forward-to 127.0.0.1:43134/api/webhooks/stripe
```

## Routes

- `/` `/shop` `/shop/[line]/[category]` `/products/[slug]` `/collections/[slug]`
- `/wishlist` `/cart` `/checkout` `/checkout/payment` `/checkout/pay/[id]` `/checkout/success` `/checkout/confirmation`
- `/account` `/account/login` `/account/signup` `/account/reset-password` `/account/orders` `/register`
- `/about` `/journal` `/contact` `/faq` `/shipping` `/returns` `/terms` `/privacy` `/cookies`
- `/login` `/admin` `/admin/products` `/admin/orders`
- `/maintenance` (shown when Global Config `maintenance` is true; atelier stays open)
- `GET /api/cron` (Vercel Cron; `Hello Cron!`)
- `POST /api/webhooks/stripe` (raw body; `STRIPE_WEBHOOK_SECRET`)

## Design

Warm ivory, ink, and gold used sparingly. Official interlocking 34 mark. Manrope for interface, Cormorant for editorial headlines. Catalogue photography is house-supplied. Reviews are not fabricated. The storefront is built as a fashion house: photography first, quiet commerce, no mock testimonials or statistics.

## Ownership

Website, domain, hosting, design files, admin accounts, and source belong to THIRTY FOUR / Thirty Four Global.
