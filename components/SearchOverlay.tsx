"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import { filterProducts } from "@/lib/filter-products";
import { useLanguage } from "@/context/LanguageContext";
import { productName } from "@/lib/copy-catalog";
import { Price } from "./Price";

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    void fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, [open]);

  const results = useMemo(
    () => (query.trim() ? filterProducts(products, { q: query }).slice(0, 8) : products.filter((p) => p.featured).slice(0, 6)),
    [products, query],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[10%] max-w-xl translate-y-0 rounded-lg border border-border p-6 sm:max-w-xl">
        <DialogTitle className="sr-only">{t("search")}</DialogTitle>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onOpenChange(false);
            router.push(`/shop?q=${encodeURIComponent(query)}`);
          }}
        >
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchTheHouse")}
            className="h-12 rounded-md border border-input px-3.5 text-base shadow-none"
          />
        </form>
        <div className="mt-4 grid gap-3">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("nothingOnThisRail")} {t("men")}, {t("women")}, {t("kids")}, {t("fragrance")},{" "}
              {t("accessories")}.
            </p>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex gap-3 rounded-md p-1.5 hover:bg-muted"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-muted">
                  <Image src={product.images[0]} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <span>
                  <span className="block text-sm">{productName(product.slug, language, product.name)}</span>
                  <Price amount={product.price} className="text-xs text-muted-foreground" />
                </span>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
