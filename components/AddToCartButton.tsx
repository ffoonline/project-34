"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { flyProductToCart } from "@/lib/fly-to-cart";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

export function AddToCartButton({
  product,
  size,
  color,
}: {
  product: Product;
  size: string;
  color: string;
}) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);

  function onAdd(event: MouseEvent<HTMLButtonElement>) {
    if (!size || !color) {
      toast.error(t("chooseSizeColour"));
      return;
    }
    if (product.stock < 1) {
      toast.error(t("waitingNextCut"));
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
    });
    flyProductToCart(product.images[0], event.currentTarget);
    setPending(true);
    setTimeout(() => setPending(false), 400);
  }

  return (
    <Button
      type="button"
      onClick={onAdd}
      disabled={pending || product.stock < 1}
      className="h-14 w-full text-[13px] font-semibold tracking-[0.2em] uppercase"
      size="lg"
    >
      {product.stock < 1 ? t("soldThrough") : pending ? t("added") : t("addToBag")}
    </Button>
  );
}
