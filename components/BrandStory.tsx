"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function BrandStory() {
  const { t } = useLanguage();

  return (
    <section className="brand-story">
      <div className="brand-story__media">
        <Image
          src="/editorial/flagship-store.jpg"
          alt={t("atelierAlt")}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
        />
      </div>
      <div className="brand-story__content">
        <p className="section-label">{t("theHouse")}</p>
        <h2>{t("aNumberYouCanKeep")}</h2>
        <p>{t("houseStory")}</p>
        <Link href="/about" className="text-link">
          {t("readTheStory")}
          <span aria-hidden className="inline-block rtl:rotate-180">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
