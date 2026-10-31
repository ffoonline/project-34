import "server-only";

import Stripe from "stripe";

function stripeIsLivemode() {
  const mode = process.env.STRIPE_MODE?.trim().toLowerCase();
  return mode === "live" || mode === "livemode";
}

function configuredStripeSecretKey() {
  const modeKey = stripeIsLivemode()
    ? process.env.STRIPE_LIVEMODE_SECRET_KEY
    : process.env.STRIPE_SANDBOX_SECRET_KEY;
  return modeKey || process.env.STRIPE_SECRET_KEY;
}

function stripeSecretKey() {
  const key = configuredStripeSecretKey();
  if (!key) {
    const expectedKey = stripeIsLivemode()
      ? "STRIPE_LIVEMODE_SECRET_KEY"
      : "STRIPE_SANDBOX_SECRET_KEY";
    throw new Error(`Missing ${expectedKey} or legacy STRIPE_SECRET_KEY environment variable`);
  }
  return key;
}

let client: Stripe | undefined;

function createStripe() {
  client ??= new Stripe(stripeSecretKey());
  return client;
}

// Secret-key selection stays server-only; next.config.ts publishes only the selected publishable key.
// Instantiation is deferred so the house still boots when the secret is unset (COD / WhatsApp).
export const stripe = new Proxy({} as Stripe, {
  get(_target, property, receiver) {
    const instance = createStripe();
    const value = Reflect.get(instance, property, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export function getStripe() {
  if (!configuredStripeSecretKey()) return null;
  return createStripe();
}

export function stripePublishableKey() {
  const modeKey = stripeIsLivemode()
    ? process.env.NEXT_PUBLIC_STRIPE_LIVEMODE_PUBLISHABLE_KEY ||
      process.env.STRIPE_LIVEMODE_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_SANDBOX_PUBLISHABLE_KEY ||
      process.env.STRIPE_SANDBOX_PUBLISHABLE_KEY;
  return (
    modeKey ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    ""
  );
}
