import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";
import { CheckoutSuccessNotice } from "@/components/CheckoutNotices";

export const metadata: Metadata = {
  title: "Payment received",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    payment_intent?: string;
    redirect_status?: string;
  }>;
}) {
  const {
    session_id: sessionId,
    payment_intent: paymentIntentId,
    redirect_status: redirectStatus,
  } = await searchParams;
  const stripe = getStripe();
  let paid = false;
  if (stripe && paymentIntentId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      paid = intent.status === "succeeded";
    } catch {
      paid = false;
    }
  } else if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
    } catch {
      paid = false;
    }
  } else if (stripe) {
    const storedId = (await cookies()).get("tf_checkout_session")?.value;
    if (storedId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(storedId);
        paid = session.payment_status === "paid";
      } catch {
        paid = false;
      }
    }
  }

  return (
    <>
      <ClearCartOnSuccess allowed={paid} />
      <CheckoutSuccessNotice paid={paid} failed={redirectStatus === "failed"} />
    </>
  );
}
