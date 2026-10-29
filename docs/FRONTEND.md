# THIRTY FOUR (34) — Frontend Documentation

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (Radix) · Manrope + Cormorant Garamond · deployed on Vercel.

This is the live house storefront, not the gated mock. **Browse, product pages,
and add to bag work as a guest.** There is no `ShopGateModal`. Login is offered
at checkout; guest checkout stays available. Women is labeled **Women** (not
Royal Fashion / RF34). Contact is `sales@thirtyfourglobal.com` and WhatsApp
[(+49) 1521 7251813](https://wa.me/4915217251813).

---

## 1. Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:43134](http://127.0.0.1:43134).

Runs with empty env: OTP codes print to the server console; Stripe calls fail
until `STRIPE_SECRET_KEY` is set. Cash on delivery, bank transfer, and WhatsApp
orders still work. See [BACKEND.md](./BACKEND.md) for keys.

---

## 2. Folder Structure

```
app/
├── layout.tsx                 Root — fonts, Providers, cookie banner, analytics
├── globals.css                Design tokens (Tailwind v4 + house colors)
├── editorial.css              Homepage .hero / .brand-story (scoped ivory/ink)
├── not-found.tsx
├── maintenance/page.tsx       Closed-house copy when Global Config maintenance is on
├── (store)/                   Guest storefront (Header + Footer)
│   ├── page.tsx               Home
│   ├── shop/…                 Shop, line, category
│   ├── products/[slug]/       Product detail
│   ├── cart/, wishlist/, collections/, journal/
│   ├── checkout/              Place order, card desk, success, confirmation
│   ├── account/…              Login, 3-step signup, reset, orders
│   ├── about/, contact/, faq/, shipping/, returns/
│   ├── terms/, privacy/, cookies/     Distinct legal routes (not a single /policies)
│   └── login/                 Atelier sign-in (not customer login)
├── admin/                     Atelier — products and orders
└── api/                       Route handlers — see BACKEND.md

components/
├── HomeHero.tsx / BrandStory.tsx  Full-bleed dark hero + ivory split brand story
├── Header.tsx / StoreHeader.tsx   Two-line menu, THIRTY FOUR wordmark, globe, theme, saved; sheet Log in / Sign up
├── Footer.tsx                     Shop / care / company / legal + WhatsApp and sales email
├── LanguageSwitcher.tsx           Globe dropdown (EN / Dari / Pashto)
├── AddToCartButton.tsx            Adds to localStorage bag — no login gate
├── CheckoutForm.tsx               COD / transfer / WhatsApp / card (guest strip)
├── CheckoutIdentity.tsx           Login offered at checkout only
├── PaymentForm.tsx                Creates a Payment Intent from the live bag
├── StripeCheckoutForm.tsx         Payment Element — Pay now → /checkout/success
├── ReviewsSection.tsx             Live notes + form (session-only until a backend)
├── StarRating.tsx                 StaticStars + StarInput
└── ui/                            shadcn primitives (Button, Input, Dialog, …)

context/                           Client providers (also re-exported from lib/*-context.tsx)
├── CartContext.tsx
├── CurrencyContext.tsx
├── WishlistContext.tsx
├── LanguageContext.tsx
└── AuthContext.tsx                isLoggedIn from tf_customer cookie, not hardcoded false

lib/
├── catalog.ts / products-data.ts  House catalogue (20 pieces, house photography)
├── site.ts                        Contact, WhatsApp, currencies
├── i18n.ts                        Chrome labels EN / Dari / Pashto (Women = Women / زنان / ښځې)
├── stripe.ts                      Server-only Stripe client
├── global-config.ts               Vercel Global Config (force-cache)
└── supabase/                      Browser + server clients; session refresh without shop gate

public/brand/                      Official interlocking 34 marks only
public/catalog/                    House photography
```

`proxy.ts` (Next.js 16 middleware replacement) refreshes Supabase cookies and
gates `/admin`. It does **not** gate `/shop`.

---

## 3. State Management

No Redux. Providers wrap the tree in `components/Providers.tsx`, mounted from
`app/layout.tsx`. Header and Footer live in `app/(store)/layout.tsx`, not the
root layout (atelier uses a different chrome).

```
ThemeProvider (next-themes)
  LanguageProvider
    AuthProvider (initialIdentifier from tf_customer cookie)
      CurrencyProvider
        WishlistProvider
          CartProvider
            {children}
```

| Context | Persists via | Notes |
|---|---|---|
| `CartProvider` | `localStorage` (`tf-cart`) via `useSyncExternalStore` | Survives refresh. Cleared on `/checkout/success` only after Stripe confirms paid. |
| `WishlistProvider` | `localStorage` | Same pattern as the bag. |
| `CurrencyProvider` | `localStorage` | USD / EUR / GBP. Display only until card desk (server prices from catalogue). |
| Theme | `localStorage` (`next-themes`) | Falls back to `prefers-color-scheme`. |
| `LanguageProvider` | `localStorage` (`tf-lang`) + `tf-lang` cookie | Chrome labels via `lib/i18n.ts`. Dari (`fa-AF`) and Pashto (`ps`) set `dir="rtl"` and Noto Naskh Arabic. Product names and journal bodies stay English. |
| `AuthProvider` | httpOnly `tf_customer` cookie + `sessionStorage` `tf-guest` | `isLoggedIn` is `Boolean(identifier)` from the server cookie, **not** hardcoded `false`. |
| Cookie consent | `localStorage` (`tf-cookie-consent`) | Analytics / PostHog wait for “all”. |

---

## 4. Key Interaction Flows

**Add to bag (product page):**
Choose size and colour → `AddToCartButton` → `useCart().addItem()`. **No login
check.** The guest option is not hidden. ShopGate is gone.

**Entering the shop:**
`/shop` renders for everyone. No `useEffect` login wall.

**Checkout:**
`/checkout` collects address and method. Card sends the guest to
`/checkout/payment` (Payment Intent + Payment Element). COD / transfer /
WhatsApp post `/api/orders`. `CheckoutIdentity` offers Log in / Sign up without
blocking the order.

**Sign-up (3 pages):** each step passes `identifier` and `redirect` on the query
string so a refresh does not lose the door.

- `/account/signup`
- `/account/signup/verify`
- `/account/signup/password`

**Password reset:** `/account/reset-password` is one page with two internal
stages (`otp` → `password`). The OTP result gates the new-password fields
without a second route.

**Card:** `StripeCheckoutForm` calls `stripe.confirmPayment` with
`return_url` `/checkout/success`. Immediate errors (declined card) stay on the
page. Success is a Stripe redirect; the success page verifies the Payment
Intent before clearing the bag.

**Header:** desktop is menu · THIRTY FOUR · navigation · language · theme ·
saved. Mobile is menu · THIRTY FOUR · language · theme. The bag control is
not in the bar (`/cart` remains in the sheet). Home search shows on scroll-up
and hides on scroll-down. Open sheet: 34 mark + name + currency at the top;
**Log in** (primary) and **Sign up** (secondary) stacked at the bottom.

---

## 5. Known Placeholders / Frontend TODOs

Closed relative to the old draft:

- Auth is not hardcoded `false` — it reads `tf_customer`.
- Catalogue is 20 pieces with house photography, not 8 text thumbnails.
- Contact in `lib/site.ts`, Footer, and `/contact` is the real house
  (`sales@thirtyfourglobal.com`, WhatsApp `4915217251813`).
- Legal is three GDPR-style routes: `/terms`, `/privacy`, `/cookies`.
- Women chrome is Women / زنان / ښځې.

Still open:

- `ReviewsSection` — new notes live in component state and vanish on refresh
  until a reviews API exists. Seed list is empty on purpose (no invented stars).
- Language switcher translates chrome only, not editorial body copy.
- Card charges need `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Full page content in Dari and Pashto is not written yet.

Backend, env, Stripe, cron, and webhooks: [BACKEND.md](./BACKEND.md).
