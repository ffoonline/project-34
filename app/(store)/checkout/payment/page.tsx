import type { Metadata } from "next";
import { CardPaymentPage } from "@/components/CheckoutNotices";

export const metadata: Metadata = {
  title: "Card payment",
  description: "Stripe checkout for the live bag.",
};

export default function PaymentPage() {
  return <CardPaymentPage />;
}
