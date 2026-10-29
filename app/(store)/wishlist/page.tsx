import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";
import { T } from "@/components/T";
import { listProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const products = await listProducts();
  return (
    <div className="house-wrap house-section sm:px-6">
      <p className="kicker">
        <T k="saved" />
      </p>
      <h1 className="mt-3 text-5xl md:text-6xl">
        <T k="wishlist" />
      </h1>
      <div className="mt-10">
        <WishlistView products={products} />
      </div>
    </div>
  );
}
