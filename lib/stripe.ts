import "server-only";

import Stripe from "stripe";

function stripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  return key;
}

let client: Stripe | undefined;

function createStripe() {
  client ??= new Stripe(stripeSecretKey());
  return client;
}

// Official App Router client: `import "server-only"` + `new Stripe(process.env.STRIPE_SECRET_KEY)`.
// Instantiation is deferred so the house still boots when the secret is unset (COD / WhatsApp).
export const stripe = new Proxy({} as Stripe, {
  get(_target, property, receiver) {
    const instance = createStripe();
    const value = Reflect.get(instance, property, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return createStripe();
}

export function stripePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    ""
  );
}
