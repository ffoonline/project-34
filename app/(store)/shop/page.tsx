import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description: "The Thirty Four collection — Men, Women, Kids, fragrance, and accessories.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string; sale?: string; sort?: string }>;
}) {
  const query = await searchParams;
  return (
    <ShopView titleKey="collection" descriptionKey="collectionDesc" query={query} />
  );
}
