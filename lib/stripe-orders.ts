import type Stripe from "stripe";
import { getProductById, getProductBySlug, findOrderByPaymentIntent, placeHouseOrder } from "@/lib/store";
import type { CurrencyCode } from "@/lib/types";

function asCurrency(value: string): CurrencyCode {
  const code = value.toUpperCase();
  if (code === "EUR" || code === "GBP" || code === "USD") return code;
  return "USD";
}

function parseBag(metadata: Stripe.Metadata | null) {
  const raw = metadata?.items;
  if (!raw) return [] as { id: string; quantity: number }[];
  try {
    const parsed = JSON.parse(raw) as { id?: string; quantity?: number }[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => row.id && Number(row.quantity) > 0) as {
      id: string;
      quantity: number;
    }[];
  } catch {
    return [];
  }
}

export async function recordPaidPaymentIntent(pi: Stripe.PaymentIntent) {
  const existing = await findOrderByPaymentIntent(pi.id);
  if (existing) return existing;

  const bag = parseBag(pi.metadata);
  const items: { productId: string; slug: string; qty: number }[] = [];
  for (const line of bag) {
    const product = (await getProductById(line.id)) ?? (await getProductBySlug(line.id));
    if (!product) continue;
    items.push({
      productId: product.id,
      slug: product.slug,
      qty: Math.floor(Number(line.quantity)),
    });
  }
  if (!items.length) {
    throw new Error("A piece in the bag is no longer on the rail.");
  }

  const address = pi.shipping?.address;
  return placeHouseOrder({
    items,
    customer: {
      name: pi.shipping?.name || "Guest",
      email: pi.receipt_email || "unspecified@thirtyfourglobal.com",
      phone: "",
      city: address?.city || "",
      country: address?.country || "",
      address: [address?.line1, address?.line2, address?.postal_code].filter(Boolean).join(", "),
    },
    currency: asCurrency(pi.currency),
    city: address?.city || "Kabul",
    paymentMethod: "stripe",
    channel: "checkout",
    stripePaymentIntentId: pi.id,
  });
}

export async function recordPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status && session.payment_status !== "paid") {
    return null;
  }
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (paymentIntentId) {
    const existing = await findOrderByPaymentIntent(paymentIntentId);
    if (existing) return existing;
  }
  const existingSession = await findOrderByPaymentIntent(session.id);
  if (existingSession) return existingSession;

  const bag = parseBag(session.metadata);
  if (!bag.length && session.metadata?.productId) {
    bag.push({ id: session.metadata.productId, quantity: 1 });
  }
  const items: { productId: string; slug: string; qty: number }[] = [];
  for (const line of bag) {
    const product = (await getProductById(line.id)) ?? (await getProductBySlug(line.id));
    if (!product) continue;
    items.push({
      productId: product.id,
      slug: product.slug,
      qty: Math.floor(Number(line.quantity)),
    });
  }
  if (!items.length) {
    throw new Error("A piece in the bag is no longer on the rail.");
  }

  const address = session.collected_information?.shipping_details?.address;
  const shippingName = session.collected_information?.shipping_details?.name;
  return placeHouseOrder({
    items,
    customer: {
      name: shippingName || session.customer_details?.name || "Guest",
      email: session.customer_details?.email || "unspecified@thirtyfourglobal.com",
      phone: session.customer_details?.phone || "",
      city: address?.city || "",
      country: address?.country || "",
      address: [address?.line1, address?.line2, address?.postal_code].filter(Boolean).join(", "),
    },
    currency: asCurrency(session.currency || "usd"),
    city: address?.city || "Kabul",
    paymentMethod: "stripe",
    channel: "checkout",
    stripePaymentIntentId: paymentIntentId || session.id,
  });
}
