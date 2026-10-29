"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { colorLabel, productName } from "@/lib/copy-catalog";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, subtotal, setQty, remove } = useCart();
  const { currency } = useCurrency();
  const { t, language } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-sm tracking-[0.18em] uppercase">{t("bag")}</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="font-heading text-2xl">{t("bagWaiting")}</p>
            <Link href="/shop" className="text-link mt-8" onClick={() => onOpenChange(false)}>
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ul className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="relative h-24 w-18 shrink-0 overflow-hidden bg-muted">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="72px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-lg leading-snug">
                      {productName(item.slug, language, item.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} / {colorLabel(item.color, language)}
                    </p>
                    <p className="mt-1 text-sm">{formatMoney(item.price, currency)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={t("decreaseQty")}
                        onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)}
                      >
                        −
                      </button>
                      <span className="text-sm" aria-live="polite">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label={t("increaseQty")}
                        onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ms-auto text-xs text-red-700 hover:text-red-800"
                        onClick={() => remove(item.productId, item.size, item.color)}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-4">
              <p className="flex justify-between text-sm">
                <span>{t("subtotal")}</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("shippingAtCheckout")}
              </p>
              <Button asChild className="mt-4 h-[52px] w-full rounded-none tracking-[0.16em] uppercase">
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  {t("checkout")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
