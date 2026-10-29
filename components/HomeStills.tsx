"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/lib/catalog";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";

const audience = [
  { slug: "men", key: "men" as CopyKey, src: lookbook.men },
  { slug: "women", key: "women" as CopyKey, src: lookbook.women },
  { slug: "kids", key: "kids" as CopyKey, src: lookbook.kids },
] as const;

export function HomeStills() {
  const { t } = useLanguage();

  return (
    <section className="house-section pt-0" aria-labelledby="audience-collections-heading">
      <div className="house-wrap sm:px-6">
        <p className="kicker">{t("theHouse")}</p>
        <h2 id="audience-collections-heading" className="mt-3 text-4xl sm:text-5xl">
          {t("men")} · {t("women")} · {t("kids")}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {audience.map((tile) => (
            <Link
              key={tile.slug}
              href={`/shop/${tile.slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={tile.src}
                  alt={`${t(tile.key)} collection at THIRTY FOUR`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <h3 className="absolute inset-x-0 bottom-0 p-6 text-3xl text-white sm:text-4xl">
                  {t(tile.key)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
