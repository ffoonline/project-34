"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { colorLabel, productName } from "@/lib/copy-catalog";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

export function CartView() {
  const { items, subtotal, setQty, remove } = useCart();
  const { currency } = useCurrency();
  const { t, language } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-3xl">{t("bagWaiting")}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("men")}, {t("women")}, {t("kids")}, {t("fragrance")}, {t("accessories")}.
        </p>
        <Link href="/shop" className="text-link mt-8">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1.4fr_0.7fr]">
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}-${item.color}`}
            className="grid grid-cols-[96px_1fr] gap-5 py-8 sm:grid-cols-[120px_1fr_auto]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image src={item.image} alt={productName(item.slug, language, item.name)} fill className="object-cover" sizes="120px" />
            </div>
            <div>
              <Link href={`/products/${item.slug}`} className="text-2xl hover:text-muted-foreground">
                {productName(item.slug, language, item.name)}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.size} / {colorLabel(item.color, language)}
              </p>
              <p className="mt-2 text-sm">{formatMoney(item.price, currency)}</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    aria-label={t("decreaseQty")}
                    onClick={() => setQty(item.productId, item.size, item.color, item.qty - 1)}
                  >
                    −
                  </button>
                  <span aria-live="polite">{item.qty}</span>
                  <button
                    type="button"
                    aria-label={t("increaseQty")}
                    onClick={() => setQty(item.productId, item.size, item.color, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs tracking-[0.16em] text-red-700 uppercase hover:text-red-800"
                  onClick={() => remove(item.productId, item.size, item.color)}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
            <p className="hidden text-right text-sm sm:block">
              {formatMoney(item.price * item.qty, currency)}
            </p>
          </li>
        ))}
      </ul>
      <aside className="h-fit lg:sticky lg:top-24">
        <p className="kicker">{t("bagTotal")}</p>
        <p className="mt-3 text-5xl">{formatMoney(subtotal, currency)}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {t("shippingAtCheckout")}
        </p>
        <Button asChild className="mt-8 h-12 w-full uppercase tracking-[0.2em]">
          <Link href="/checkout">{t("checkout")}</Link>
        </Button>
      </aside>
    </div>
  );
}
