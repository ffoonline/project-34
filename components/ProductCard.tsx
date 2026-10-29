"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Price } from "./Price";
import { categoryLabel } from "@/lib/site";
import { isCategoryKey } from "@/lib/i18n";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { flyProductToCart } from "@/lib/fly-to-cart";
import { localizeProduct } from "@/lib/copy-catalog";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  align = "start",
}: {
  product: Product;
  align?: "start" | "center";
}) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const shown = localizeProduct(product, language);
  const lineLabel = isCategoryKey(product.category)
    ? t(product.category)
    : categoryLabel(product.category);
  const saved = has(product.id);
  const second = product.images[1];
  const soldOut = product.stock < 1;

  function addToBag(event: MouseEvent<HTMLButtonElement>) {
    if (soldOut) {
      toast.error(t("waitingNextCut"));
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0] ?? "OS",
      color: product.colors[0]?.name ?? "Default",
    });
    flyProductToCart(product.images[0], event.currentTarget);
  }

  return (
    <article className="group">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="product-frame relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={product.images[0]}
              alt={shown.name}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover ${second ? "primary" : ""}`}
            />
            {second ? (
              <Image
                src={second}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="secondary object-cover opacity-0 group-hover:opacity-100"
              />
            ) : null}
            {product.compareAt && product.compareAt > product.price ? (
              <span className="absolute top-3 start-3 text-[10px] font-semibold tracking-[0.18em] text-oxblood uppercase">
                {t("sale")}
              </span>
            ) : product.newArrival ? (
              <span className="absolute top-3 start-3 text-[10px] font-semibold tracking-[0.18em] uppercase">
                {t("new")}
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          className="absolute top-3 end-3 text-background mix-blend-difference"
          aria-label={saved ? t("removeFromWishlist") : t("saveToWishlist")}
          onClick={() => toggle(product.id)}
        >
          <Heart className={`size-4 ${saved ? "fill-current" : ""}`} strokeWidth={1.5} />
        </button>
      </div>
      <div
        className={cn(
          "mt-4",
          align === "center" && "flex flex-col items-center text-center",
        )}
      >
        <Link
          href={`/products/${product.slug}`}
          className={cn("block", align === "center" && "flex w-full flex-col items-center")}
        >
          <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{lineLabel}</p>
          <h3 className="mt-1 text-[1.15rem] leading-snug">{shown.name}</h3>
          <Price
            amount={product.price}
            compareAt={product.compareAt}
            className={cn(
              "mt-1.5 text-sm text-muted-foreground",
              align === "center" && "justify-center",
            )}
          />
        </Link>
        <Button
          type="button"
          onClick={addToBag}
          disabled={soldOut}
          className="mt-4 h-11 min-w-[7rem] px-6 text-[12px] font-semibold tracking-[0.16em] uppercase"
          aria-label={soldOut ? t("soldThrough") : t("addToBag")}
        >
          {soldOut ? t("soldThrough") : t("add")}
        </Button>
      </div>
    </article>
  );
}
