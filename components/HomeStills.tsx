"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";

const stills = [
  {
    src: "/editorial/vanity.jpg",
    href: "/shop/fragrance",
    kicker: "fragrance" as CopyKey,
    title: "vanity" as CopyKey,
    altKey: "beautyStillAlt" as CopyKey,
  },
  {
    src: "/editorial/tote.jpg",
    href: "/shop/accessories",
    kicker: "accessories" as CopyKey,
    title: "carried" as CopyKey,
    altKey: "toteStillAlt" as CopyKey,
  },
] as const;

export function HomeStills() {
  const { t } = useLanguage();

  return (
    <section className="hero-stills" aria-label={t("theHouse")}>
      {stills.map((still) => (
        <Link key={still.src} href={still.href} className="hero-stills__cell">
          <Image
            src={still.src}
            alt={t(still.altKey)}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            className="hero-stills__image"
          />
          <span className="hero-stills__scrim" aria-hidden />
          <span className="hero-stills__caption">
            <span className="hero-stills__kicker">{t(still.kicker)}</span>
            <span className="hero-stills__title">{t(still.title)}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
