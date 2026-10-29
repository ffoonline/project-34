import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { T } from "@/components/T";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete a Thirty Four order.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">
        <T k="checkout" />
      </p>
      <h1 className="mt-3 text-5xl md:text-6xl">
        <T k="placeTheOrder" />
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">
        <T k="checkoutIntro" />
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
