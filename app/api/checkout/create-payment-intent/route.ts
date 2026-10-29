import { NextResponse } from "next/server";
import { getStripe, stripe } from "@/lib/stripe";
import { convert } from "@/lib/money";
import { getProductById, getProductBySlug } from "@/lib/store";
import type { CurrencyCode } from "@/lib/types";

export const dynamic = "force-dynamic";

class OrderAmountError extends Error {}

export async function POST(request: Request) {
  try {
    if (!getStripe()) {
      return NextResponse.json(
        { error: "Card checkout is not configured. Set STRIPE_SECRET_KEY, or pay on delivery." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      items?: { id: string; quantity: number }[];
      currency?: string;
    };
    const items = body.items ?? [];
    if (!items.length) {
      return NextResponse.json({ error: "The bag is empty." }, { status: 400 });
    }

    const currency = normalizeCurrency(body.currency);
    const amount = await calculateOrderAmountInCents(items, currency);

    if (amount < 50) {
      return NextResponse.json(
        { error: "The bag total is too small for a card charge." },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({ id: item.id, quantity: item.quantity })),
        ).slice(0, 500),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    if (err instanceof OrderAmountError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to create payment intent" },
      { status: 500 },
    );
  }
}

function normalizeCurrency(value: string | undefined): CurrencyCode {
  const code = (value || "usd").toUpperCase();
  if (code === "EUR" || code === "GBP" || code === "USD") return code;
  return "USD";
}

async function calculateOrderAmountInCents(
  items: { id: string; quantity: number }[],
  currency: CurrencyCode,
): Promise<number> {
  let total = 0;
  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!item.id || !Number.isFinite(quantity) || quantity < 1) {
      throw new OrderAmountError("Invalid bag line.");
    }
    const product =
      (await getProductById(item.id)) ?? (await getProductBySlug(item.id));
    if (!product) {
      throw new OrderAmountError("A piece in the bag is no longer on the rail.");
    }
    const unitCents = Math.round(convert(product.price, currency) * 100);
    total += unitCents * quantity;
  }
  return total;
}
