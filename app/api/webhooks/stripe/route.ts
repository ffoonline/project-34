import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { recordPaidCheckoutSession, recordPaidPaymentIntent } from "@/lib/stripe-orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// IMPORTANT: this route needs the raw request body to verify the Stripe
// signature. Do not add any body-parsing middleware in front of it.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", pi.id, pi.metadata);
      try {
        await recordPaidPaymentIntent(pi);
      } catch (err) {
        console.error("Failed to record paid Payment Intent:", err);
        return NextResponse.json({ error: "Unable to record order" }, { status: 500 });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn("Payment failed:", pi.id);
      break;
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", session.id);
      try {
        await recordPaidCheckoutSession(session);
      } catch (err) {
        console.error("Failed to record Checkout Session:", err);
        return NextResponse.json({ error: "Unable to record order" }, { status: 500 });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
