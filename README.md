# THIRTY FOUR — T.F.G / Thirty Four Global

[![CI / CD](https://github.com/ffoonline/maseehullah-project-34-a0e06e9/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/ffoonline/maseehullah-project-34-a0e06e9/actions/workflows/ci-cd.yml)

Official house storefront for **THIRTY FOUR**: men’s, women’s and kids’ fashion, fragrance, and accessories. Kabul-first, built to travel. Production domain: [thirtyfourglobal.com](https://www.thirtyfourglobal.com/).

The application is a guest-friendly fashion storefront with product discovery, cart and wishlist, checkout, customer accounts, an atelier admin area, and optional Supabase, Stripe, PostHog, Upstash, and Vercel integrations.

## At a glance

- **Framework:** Next.js 16 App Router, React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, shadcn/ui and Radix UI
- **Hosting:** Vercel
- **Database/auth (optional):** Supabase
- **Payments (optional):** Stripe
- **Languages:** English, Dari, and Pashto storefront chrome; Dari and Pashto use right-to-left layout
- **Default local port:** `43134`
- **CI:** GitHub Actions runs lint and a production build for pull requests and pushes to `main`
- **CD:** the workflow can deploy `main` to Vercel after CI succeeds when the Vercel GitHub Actions secrets are configured

## Storefront capabilities

- Guest browsing, product and category pages, local-storage cart, and wishlist
- Checkout by cash on delivery, bank transfer, WhatsApp, or Stripe card payment
- Customer sign-in, registration, OTP verification, password reset, and order history
- Atelier admin pages for products and orders
- English, Dari, and Pashto interface labels, theme selection, currency display, and cookie consent
- Editorial journal, contact and FAQ pages, and separate shipping, returns, terms, privacy, and cookie pages
- Optional Supabase-backed sessions and order persistence, Stripe payments/webhooks, PostHog analytics, Upstash OTP storage, and Vercel Global Config storefront flags

Some features intentionally use local or in-memory state when their service is not configured. See [Known behavior and limitations](#known-behavior-and-limitations).

## Getting started

### Requirements

- Node.js **22.x** (Node.js 20.9+ is required by the Next.js version in use)
- npm (the repository includes `package-lock.json`)

### Install and run

```bash
git clone https://github.com/ffoonline/maseehullah-project-34-a0e06e9.git
cd maseehullah-project-34-a0e06e9
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43134](http://127.0.0.1:43134). The development server is configured to bind to `127.0.0.1` on port `43134`.

The project can start without production service credentials. Configure only the integrations you intend to exercise; never commit `.env.local`.

## Commands

| Command | Description |
| --- | --- |
| `npm ci` | Install the exact dependencies from the lockfile |
| `npm run dev` | Start the local Next.js development server on port `43134` |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Create a production Next.js build |
| `npm run start` | Serve the production build on port `43134` |

There is no automated unit-test script configured yet. CI currently validates the project with lint and a production build.

## Configuration

Copy `.env.example` to `.env.local`, then set the values you need. All secrets belong in local environment files or the hosting provider’s secret store—not in source control.

| Variable | Purpose | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | Defaults to the local URL in `.env.example` |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp phone digits | Digits only; no leading `+` |
| `ADMIN_PASSWORD` | House-password login when Supabase is not used | **No default password is shipped.** Set a unique value before enabling this login path. |
| `ADMIN_EMAIL` | Email promoted to atelier admin on Supabase sign-in | Use with the Supabase server-side service-role key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Without a configured Supabase connection, local fallback behavior is used |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key | Safe for browser use when protected by Supabase RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase admin operations | **Secret. Never prefix it with `NEXT_PUBLIC_`.** |
| `STRIPE_SECRET_KEY` | Server-side Stripe API calls | **Secret.** Card payments are unavailable until configured. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js / Payment Element | Publishable key; configure for card checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification | **Secret.** Used by `/api/webhooks/stripe`. |
| `UPSTASH_REDIS_REST_URL` | Production OTP storage endpoint | Optional; local development can use in-memory OTP storage |
| `UPSTASH_REDIS_REST_TOKEN` | Production OTP storage credential | **Secret.** |
| `CRON_SECRET` | Authorizes production Vercel Cron requests | **Secret.** Vercel sends it as a Bearer token. |
| `GLOBAL_CONFIG` | Vercel Global Config connection string | Optional; quote values containing `$` in shell files. |
| `POSTHOG_ANALYTICS_API_KEY` | Optional PostHog analytics key | Keep the ingestion key in server/deployment configuration; see `next.config.ts` for public mapping. |
| `POSTHOG_ANALYTICS_HOST` | Optional PostHog host | Optional analytics configuration. |

Optional/legacy aliases such as `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `EDGE_CONFIG` are referenced in project code or documentation for compatibility; prefer the primary variable names above.

### Admin access

When Supabase is configured, customer email/password sign-in is handled by Supabase Auth. Set `ADMIN_EMAIL` to the first atelier account; the server promotes that account to admin using the service-role configuration. Without Supabase, the house-password login path compares against `ADMIN_PASSWORD`. Since the app has no built-in default for this value, the local password login path is unavailable until you set one.

## Architecture and repository map

```text
app/
├── (store)/          Guest-facing storefront routes and shared store layout
├── admin/            Atelier admin pages
├── actions/          Server actions (including Stripe checkout)
├── api/              Auth, checkout, orders, products, contact, newsletter, cron, webhooks
└── layout.tsx        Root layout, providers, fonts, cookie consent, analytics
components/           Storefront, checkout, auth, admin, and UI components
context/              Cart, currency, wishlist, language, and auth providers
data/                 Local catalogue/runtime data
lib/                  Domain logic, validation, integrations, and Supabase clients
public/               Brand marks, product photography, and static assets
supabase/schema.sql   Supabase schema, RLS policies, and order RPC
.github/workflows/    GitHub Actions CI and conditional Vercel production deployment
docs/                 Detailed frontend and backend notes
```

The Next.js 16 request/session layer is implemented in `proxy.ts`. The guest shop remains available without login; `/admin` is protected separately.

Useful project documentation:

- [Frontend map and interaction flows](docs/FRONTEND.md)
- [Backend, API routes, and service configuration](docs/BACKEND.md)
- [Supabase schema](supabase/schema.sql)

## Main routes

| Area | Routes |
| --- | --- |
| Shop | `/`, `/shop`, `/shop/[line]/[category]`, `/products/[slug]`, `/collections/[slug]` |
| Shopping | `/cart`, `/wishlist`, `/checkout`, `/checkout/payment`, `/checkout/pay/[id]`, `/checkout/success`, `/checkout/confirmation` |
| Customer | `/register`, `/account/login`, `/account/signup`, `/account/reset-password`, `/account/orders` |
| Company and policies | `/about`, `/journal`, `/contact`, `/faq`, `/shipping`, `/returns`, `/terms`, `/privacy`, `/cookies` |
| Atelier | `/login`, `/admin`, `/admin/products`, `/admin/orders` |
| Service routes | `/api/cron`, `/api/webhooks/stripe`, and the auth, checkout, order, product, contact, and newsletter API routes |

## Data, authentication, and payments

### Supabase

To use persistent Supabase-backed behavior:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor. It defines the tables, row-level security policies, and the `shop.place_order` transaction.
3. Set the Supabase URL and publishable key in the deployment environment.
4. Add the server-only `SUPABASE_SERVICE_ROLE_KEY` where server-side order placement, catalogue seeding, or admin writes require it.
5. Configure Supabase Auth and `ADMIN_EMAIL` for the first admin account.

Do not expose the service-role key to the browser or commit it to the repository.

### Stripe

Card checkout requires `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. The webhook endpoint is `POST /api/webhooks/stripe`; set `STRIPE_WEBHOOK_SECRET` for signature verification. The server calculates prices from the catalogue rather than trusting client-submitted amounts. Without Stripe keys, card checkout is not available; cash on delivery, bank transfer, and WhatsApp ordering remain available.

For local webhook testing, install the Stripe CLI and run:

```bash
stripe listen --forward-to 127.0.0.1:43134/api/webhooks/stripe
```

Use the signing secret printed by the Stripe CLI as the local `STRIPE_WEBHOOK_SECRET`.

### OTP and analytics

In local development, OTP codes can be emitted to the server console and held in memory. Configure both Upstash REST variables for production OTP storage. Analytics are optional; cookie consent controls when analytics can run.

## CI/CD with GitHub Actions

The workflow is [`/.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml):

- **Pull requests:** install from the lockfile, run ESLint, and build the application.
- **Pushes to `main`:** run the same checks, then attempt a Vercel production deployment only after they pass.
- **Manual runs:** `workflow_dispatch` is available. Production deployment is limited to the `main` branch.
- **No Vercel secrets configured:** CI still runs; the deployment step is skipped with a setup message.

To enable the Vercel deployment step, add these as **GitHub Actions repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `VERCEL_TOKEN` | A Vercel account token with access to the project |
| `VERCEL_ORG_ID` | The Vercel team/account scope ID |
| `VERCEL_PROJECT_ID` | The linked Vercel project ID |

The workflow links to the configured Vercel project and deploys to production using the Vercel CLI. Set the application’s runtime environment variables in Vercel as well; GitHub repository secrets above are only for deployment authentication and project selection. Protect the `production` GitHub environment with required reviewers if production deploy approval is desired.

If Vercel’s native Git integration already deploys this repository to production, use one deployment mechanism to avoid duplicate production builds—either disable native auto-deploys or leave the workflow’s Vercel secrets unset.

## Vercel deployment and scheduled route

For a manual initial deployment, import the repository in Vercel and select the **Next.js** framework preset. Configure the application environment variables in the Vercel project before enabling production checkout or admin features. Route handlers run as serverless functions; there is no persistent Express server.

`vercel.json` schedules `GET /api/cron` daily at **04:00 UTC**. Set `CRON_SECRET` in Vercel so the production route can authenticate scheduled calls. The route also performs its documented cleanup/flag work; it is not the mechanism that gates the storefront.

## Known behavior and limitations

- Without a configured persistent backend, catalogue/order behavior can fall back to in-memory state; in-memory data is not durable across serverless invocations or deployments.
- OTP storage is in-memory locally unless Upstash is configured; local OTPs may be printed to the development server console.
- Review submissions are component/session state until a persistent reviews API is implemented; no fabricated review count is shown.
- Dari and Pashto translate interface chrome and switch layout direction; editorial and product copy remain in English.
- Currency selection is display-oriented; server-side catalogue prices remain authoritative at checkout.
- There is no unit/integration test suite configured yet. The current CI gate is lint plus production build.

## Security and contribution notes

- Never commit `.env`, `.env.local`, API tokens, service-role keys, private keys, or production credentials.
- Use a unique `ADMIN_PASSWORD` if the non-Supabase house-password path is enabled; do not reuse the former example value or a password from another system.
- Keep service-role credentials server-only. Use Supabase RLS and validate server-side order/payment data.
- Local provider/account metadata is excluded by `.gitignore`; do not force-add it.
- For code changes, open a pull request and ensure the GitHub Actions checks pass before merging to `main`.

## Ownership and contact

Website, domain, hosting, design files, admin accounts, and source belong to THIRTY FOUR / Thirty Four Global.

Contact: [sales@thirtyfourglobal.com](mailto:sales@thirtyfourglobal.com) · WhatsApp [(+49) 1521 7251813](https://wa.me/4915217251813).
