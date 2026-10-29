"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/Price";
import type { Product } from "@/lib/types";
import { categoryLabel } from "@/lib/site";
import { useLanguage } from "@/context/LanguageContext";
import { isCategoryKey } from "@/lib/i18n";
import { colorLabel, localizeProduct } from "@/lib/copy-catalog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProductConfigure({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { t, language } = useLanguage();
  const shown = localizeProduct(product, language);
  const lineLabel = isCategoryKey(product.category)
    ? t(product.category)
    : categoryLabel(product.category);
  const router = useRouter();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const saved = has(product.id);

  function buyNow() {
    if (product.stock < 1) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
    });
    router.push("/checkout");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16">
      <div>
        <div className="-mx-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:-mx-6 lg:mx-0 lg:hidden [&::-webkit-scrollbar]:hidden">
          {product.images.map((src, index) => (
            <div key={src} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-muted">
              <Image
                src={src}
                alt={`${shown.name}, ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        {product.images.length > 1 ? (
          <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-muted-foreground uppercase lg:hidden">
            {product.images.length} {t("viewsSwipe")}
          </p>
        ) : null}

        <div className="hidden gap-3 lg:grid">
          {product.images.map((src, index) => (
            <div key={src} className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={src}
                alt={shown.name}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="55vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="kicker">
          THIRTY FOUR · {lineLabel}
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl">{shown.name}</h1>
        <div className="mt-5 flex items-baseline gap-4">
          <Price amount={product.price} compareAt={product.compareAt} className="text-base" />
          <span className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {product.stock < 1 ? t("outOfStock") : product.stock <= 8 ? t("lowStock") : t("inStock")}
          </span>
        </div>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">{shown.description}</p>

        <fieldset className="mt-10">
          <legend className="text-[11px] tracking-[0.2em] uppercase">{t("colour")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((entry) => (
              <button
                key={entry.name}
                type="button"
                aria-pressed={color === entry.name}
                onClick={() => setColor(entry.name)}
                className={`flex items-center gap-2 border px-3 py-2 text-sm ${
                  color === entry.name ? "border-foreground" : "border-border"
                }`}
              >
                <span className="size-2.5 rounded-full border border-black/10" style={{ background: entry.hex }} />
                {colorLabel(entry.name, language)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-[11px] tracking-[0.2em] uppercase">{t("size")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((entry) => (
              <button
                key={entry}
                type="button"
                aria-pressed={size === entry}
                onClick={() => setSize(entry)}
                className={`min-w-12 border px-3 py-2 text-sm ${
                  size === entry ? "border-foreground bg-foreground text-background" : "border-border"
                }`}
              >
                {entry}
              </button>
            ))}
          </div>
        </fieldset>
        <Dialog>
          <DialogTrigger className="mt-3 text-xs text-muted-foreground underline">{t("sizeGuide")}</DialogTrigger>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle>{t("sizeGuide")}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t("sizeGuideBody")}
            </p>
            <table className="mt-4 w-full text-start text-sm">
              <thead>
                <tr className="border-b border-border">
                    <th className="py-2">{t("size")}</th>
                  <th>{t("chest")}</th>
                  <th>{t("waist")}</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {product.sizes.map((entry) => (
                  <tr key={entry} className="border-b border-border/70">
                    <td className="py-2">{entry}</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogContent>
        </Dialog>

        <div className="mt-10 grid gap-3">
          <AddToCartButton product={product} size={size} color={color} />
          <Button
            variant="outline"
            className="h-12 text-[12px] font-semibold tracking-[0.16em] uppercase"
            disabled={product.stock < 1}
            onClick={buyNow}
          >
            {t("buyNow")}
          </Button>
          <Link
            href={`/checkout/pay/${product.id}`}
            className="text-center text-[11px] font-semibold tracking-[0.16em] uppercase underline"
          >
            {t("cardStripe")}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase"
            onClick={() => toggle(product.id)}
          >
            <Heart className={`size-4 ${saved ? "fill-current" : ""}`} strokeWidth={1.5} />
            {saved ? t("saved") : t("save")}
          </button>
        </div>
        <p className="mt-5 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {t("kabulDelivery")}
        </p>

        <Accordion type="single" collapsible className="mt-10 border-t border-border">
          <AccordionItem value="details">
            <AccordionTrigger>{t("details")}</AccordionTrigger>
            <AccordionContent>{shown.story}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>{t("materialCare")}</AccordionTrigger>
            <AccordionContent>
              {shown.fabric}. {shown.care}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>{t("shipping")}</AccordionTrigger>
            <AccordionContent>
              {t("kabulShipping")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>{t("returns")}</AccordionTrigger>
            <AccordionContent>
              {t("returnsBody")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
