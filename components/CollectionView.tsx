"use client";

import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { collectionCopyFor } from "@/lib/copy-pages";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";

export function CollectionView({
  slug,
  image,
  products,
}: {
  slug: string;
  image: string;
  products: Product[];
}) {
  const { t, language } = useLanguage();
  const copy = collectionCopyFor(slug, language);
  const title = copy?.title ?? slug;
  const kicker = copy?.kicker ?? t("collection");
  const story = copy?.story ?? "";

  return (
    <div>
      <section className="relative h-[50vh] min-h-80">
        <Image src={image} alt={title} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 py-12 text-white sm:px-8">
          <p className="kicker text-white/70">{kicker}</p>
          <h1 className="mt-3 text-5xl md:text-7xl">{title}</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">{story}</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("betweenCuts")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
