import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const stripe = getStripe();
  const id = new URL(request.url).searchParams.get("session_id");
  if (!stripe || !id) {
    return NextResponse.json({ paid: false, configured: Boolean(stripe) });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      configured: true,
      id: session.id,
    });
  } catch {
    return NextResponse.json({ paid: false, configured: true }, { status: 400 });
  }
}
