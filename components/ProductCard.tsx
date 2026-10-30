"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
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
    toast.success(t("addedToBag"));
  }

  return (
    <article className="group relative">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="product-frame relative aspect-[3/4] overflow-hidden bg-muted transition-all duration-500 group-hover:shadow-2xl">
            <Image
              src={product.images[0]}
              alt={shown.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {second ? (
              <Image
                src={second}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {product.compareAt && product.compareAt > product.price ? (
              <span className="absolute top-3 start-3 rounded-full bg-oxblood px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white uppercase shadow-lg">
                {t("sale")}
              </span>
            ) : product.newArrival ? (
              <span className="absolute top-3 start-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-background uppercase shadow-lg">
                {t("new")}
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          className="absolute top-3 end-3 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-all hover:bg-background"
          aria-label={saved ? t("removeFromWishlist") : t("saveToWishlist")}
          onClick={() => toggle(product.id)}
        >
          <Heart className={`size-4 ${saved ? "fill-oxblood text-oxblood" : "text-foreground"}`} strokeWidth={1.5} />
        </button>
        {!soldOut && (
          <Button
            type="button"
            onClick={addToBag}
            size="sm"
            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 bg-foreground text-background hover:bg-foreground/90"
          >
            <ShoppingBag className="mr-2 size-4" />
            {t("add")}
          </Button>
        )}
      </div>
      <div
        className={cn(
          "mt-5",
          align === "center" && "flex flex-col items-center text-center",
        )}
      >
        <Link
          href={`/products/${product.slug}`}
          className={cn("block", align === "center" && "flex w-full flex-col items-center")}
        >
          <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{lineLabel}</p>
          <h3 className="mt-1.5 text-[1.2rem] font-medium leading-snug tracking-tight">{shown.name}</h3>
          <Price
            amount={product.price}
            compareAt={product.compareAt}
            className={cn(
              "mt-2 text-sm text-muted-foreground",
              align === "center" && "justify-center",
            )}
          />
        </Link>
        {soldOut && (
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("soldThrough")}
          </p>
        )}
      </div>
    </article>
  );
}
