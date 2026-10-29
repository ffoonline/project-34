import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Card checkout is not configured. Set STRIPE_SECRET_KEY, or pay on delivery." },
      { status: 503 },
    );
  }
  const body = (await request.json()) as {
    items?: { name: string; price: number; quantity: number }[];
    currency?: string;
  };
  if (!body.items?.length) {
    return NextResponse.json({ error: "The bag is empty." }, { status: 400 });
  }
  const currency = (body.currency || "usd").toLowerCase();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/checkout/payment`,
      line_items: body.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency,
          product_data: { name: item.name },
          unit_amount: item.price,
        },
      })),
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe could not open a session.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
