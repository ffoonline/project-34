"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const HERO_IMAGE_SRC = "/images/placeholders/hero-editorial.jpg"; // TODO: Replace with a TFG-owned photo of a model wearing THIRTY FOUR clothing.

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero__media">
        <Image
          src={HERO_IMAGE_SRC}
          alt="Unbranded THIRTY FOUR editorial hero placeholder"
          fill
          preload
          sizes="100vw"
        />
      </div>
      <div className="hero__veil" aria-hidden />
      <div className="hero__content">
        <p className="eyebrow wordmark">THIRTY FOUR</p>
        <h1>{t("modernLuxury")}</h1>
        <Link href="/shop?sort=new" className="text-link">
          {t("shopTheHouse")}
        </Link>
      </div>
    </section>
  );
}
