"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
export function HomeHero() {
  const { t, rtl } = useLanguage();
  return (
    <section className="hero">
      <div className="hero__media"><Image src="/editorial/thirty-four-hero.png" alt="" fill priority sizes="100vw" /></div>
      <div className="hero__veil" aria-hidden />
      <div className="hero__content">
        <p className="hero__eyebrow">{t("cutForKabul")}</p>
        <h1>{t("modernLuxury")}</h1>
        <p className="hero__lede">{t("tagline")}</p>
        <Link href="/shop?sort=new" className="hero__cta"><span>{t("shopTheHouse")}</span><ArrowRight aria-hidden className="hero__cta-arrow" size={18} strokeWidth={1.5} /></Link>
        <form action="/shop" method="get" role="search" dir={rtl ? "rtl" : "ltr"} className="hero__search">
          <label htmlFor="hero-search" className="sr-only">{t("search")}</label>
          <Input id="hero-search" type="search" name="q" required placeholder={t("searchTheHouse")} className="hero__search-input" />
          <button type="submit" aria-label={t("search")} className="hero__search-submit"><Search aria-hidden size={18} strokeWidth={1.8} /><span>{t("search")}</span></button>
        </form>
      </div>
    </section>
  );
}
