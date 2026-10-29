"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";
import Link from "next/link";

export function WishlistView({ products }: { products: Product[] }) {
  const { ids } = useWishlist();
  const { t } = useLanguage();
  const saved = useMemo(
    () => products.filter((product) => ids.includes(product.id)),
    [products, ids],
  );

  if (ids.length === 0 || saved.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-3xl">{t("nothingSaved")}</p>
        <Link href="/shop" className="text-link mt-8">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
      {saved.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
