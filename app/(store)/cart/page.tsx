import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { T } from "@/components/T";

export const metadata: Metadata = {
  title: "Bag",
  description: "Your Thirty Four bag.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">
        <T k="bag" />
      </p>
      <h1 className="mt-3 text-5xl md:text-6xl">
        <T k="yourPieces" />
      </h1>
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}
