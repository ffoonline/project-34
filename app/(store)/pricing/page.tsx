import type { Metadata } from "next";
import { PricingTable } from "@/components/PricingTable";
import { listProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Every Thirty Four price, sale, and demand signal.",
};

export default async function PricingPage() {
  const products = (await listProducts()).sort((a, b) => a.price - b.price);
  return <PricingTable products={products} />;
}
