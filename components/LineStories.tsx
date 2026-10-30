"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/lib/catalog";
import { categories } from "@/lib/site";
import { useLanguage } from "@/context/LanguageContext";
import { isCategoryKey } from "@/lib/i18n";

const leads = categories.filter((item) => item.slug === "men" || item.slug === "women");
const rooms = categories.filter((item) => item.slug !== "men" && item.slug !== "women");

function lineImage(slug: string) {
  return lookbook[slug as keyof typeof lookbook] ?? lookbook.atelier;
}

export function LineStories() {
  const { t } = useLanguage();

  function label(slug: string, fallback: string) {
    return isCategoryKey(slug) ? t(slug) : fallback;
  }

  return (
    <section className="house-section">
      <div className="house-wrap sm:px-6">
        <p className="kicker">{t("theHouse")}</p>
        <h2 className="mt-3 max-w-[12ch] text-4xl sm:text-5xl md:text-6xl">{t("cutForKabul")}</h2>
      </div>

      <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
        {leads.map((category, index) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}`}
            className={`group relative block min-h-[70vw] overflow-hidden bg-muted md:min-h-[78vh] ${
              index === 1 ? "md:mt-16" : ""
            }`}
          >
            <Image
              src={lineImage(category.slug)}
              alt={label(category.slug, category.label)}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-[11px] tracking-[0.2em] uppercase opacity-80">
                {category.slug === "kids"
                  ? t("thirtyFourKids")
                  : category.slug === "fragrance"
                    ? t("signature")
                    : category.slug === "accessories"
                      ? t("theExtra")
                      : "THIRTY FOUR"}
              </p>
              <h3 className="mt-2 text-4xl text-white sm:text-5xl">{label(category.slug, category.label)}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-px grid gap-px bg-border md:grid-cols-3">
        {rooms.map((category) => (
          <Link
            key={category.slug}
            href={`/shop/${category.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-muted"
          >
            <Image
              src={lineImage(category.slug)}
              alt={label(category.slug, category.label)}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-3xl text-white">{label(category.slug, category.label)}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
