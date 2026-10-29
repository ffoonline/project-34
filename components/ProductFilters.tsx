"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/site";
import { useLanguage } from "@/context/LanguageContext";
import { isCategoryKey } from "@/lib/i18n";

export function ProductFilters({ line }: { line?: string }) {
  const { t } = useLanguage();
  const params = useSearchParams();
  const router = useRouter();
  const category = line ?? params.get("category") ?? "";
  const sort = params.get("sort") ?? "featured";
  const q = params.get("q") ?? "";
  const sale = params.get("sale") === "1";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const path = line ? `/shop/${line}` : "/shop";
    const query = next.toString();
    router.push(query ? `${path}?${query}` : path);
  }

  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8">
      <form
        className="max-w-md"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setParam("q", String(data.get("q") || ""));
        }}
      >
        <Input
          name="q"
          defaultValue={q}
          placeholder={t("searchTheHouse")}
          className="h-11 rounded-md border border-input px-3.5 shadow-none"
          aria-label={t("searchTheHouse")}
        />
      </form>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
          <button
            type="button"
            className={!category ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
            onClick={() => router.push("/shop")}
          >
            {t("all")}
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={
                category === item.slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }
              onClick={() => router.push(`/shop/${item.slug}`)}
            >
              {isCategoryKey(item.slug) ? t(item.slug) : item.label}
            </button>
          ))}
          <button
            type="button"
            className={sale ? "text-oxblood" : "text-muted-foreground hover:text-foreground"}
            onClick={() => setParam("sale", sale ? "" : "1")}
          >
            {t("sale")}
          </button>
        </nav>

        <label className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
          {t("sort")}
          <select
            value={sort}
            aria-label={t("sort")}
            onChange={(event) => setParam("sort", event.target.value === "featured" ? "" : event.target.value)}
            className="house-select h-9 bg-transparent text-foreground outline-none"
          >
            <option value="featured">{t("featured")}</option>
            <option value="new">{t("new")}</option>
            <option value="price-asc">{t("priceLow")}</option>
            <option value="price-desc">{t("priceHigh")}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
