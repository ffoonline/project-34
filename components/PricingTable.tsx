"use client";

import Link from "next/link";
import { Price } from "@/components/Price";
import { useLanguage } from "@/context/LanguageContext";
import { demandKey, isCategoryKey } from "@/lib/i18n";
import { productName } from "@/lib/copy-catalog";
import type { Product } from "@/lib/types";

export function PricingTable({ products }: { products: Product[] }) {
  const { t, language } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">{t("pricing")}</p>
      <h1 className="font-heading mt-3 text-6xl">{t("pricingTitle")}</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">{t("pricingLede")}</p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <thead className="border-b border-border text-[11px] tracking-[0.18em] uppercase">
            <tr>
              <th className="py-3 pe-4">{t("piece")}</th>
              <th className="py-3 pe-4">{t("ward")}</th>
              <th className="py-3 pe-4">{t("priceLabel")}</th>
              <th className="py-3 pe-4">{t("sale")}</th>
              <th className="py-3">{t("demand")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/70">
                <td className="py-4 pe-4">
                  <Link href={`/products/${product.slug}`} className="hover:text-primary">
                    {productName(product.slug, language, product.name)}
                  </Link>
                </td>
                <td className="py-4 pe-4">
                  {isCategoryKey(product.category) ? t(product.category) : product.category}
                </td>
                <td className="py-4 pe-4">
                  <Price amount={product.price} compareAt={product.compareAt} />
                </td>
                <td className="py-4 pe-4">
                  {product.compareAt && product.compareAt > product.price ? t("yes") : "—"}
                </td>
                <td className="py-4">{t(demandKey(product.demand))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
