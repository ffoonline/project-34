"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/lib/catalog";
import { aboutExtraCopy } from "@/lib/copy-pages";
import { site } from "@/lib/site";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/components/T";

export function AboutPageBody() {
  const { t, language } = useLanguage();
  const extra = aboutExtraCopy(language);

  return (
    <div>
      <section className="house-wrap house-section sm:px-6">
        <p className="kicker">
          <T k="theHouse" />
        </p>
        <h1 className="mt-4 max-w-[10ch] text-6xl leading-[0.9] sm:text-7xl md:text-8xl">
          <T k="aNumberYouCanKeep" />
        </h1>
        <p className="mt-8 max-w-xl text-[17px] leading-8 text-muted-foreground">
          <T k="houseStory" />
        </p>
        <p className="mt-7 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Founder — Ajmal Arash
        </p>
      </section>

      <div className="relative h-[68vh] min-h-96">
        <Image
          src={lookbook.atelier}
          alt={t("atelierRailAlt")}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <section className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
        <h2 className="text-4xl sm:text-5xl">{extra.whyTitle}</h2>
        <p className="mt-6 text-[16px] leading-8 text-muted-foreground">{extra.whyBody}</p>
        <h2 className="mt-16 text-4xl sm:text-5xl">{extra.firstTitle}</h2>
        <p className="mt-6 text-[16px] leading-8 text-muted-foreground">{extra.firstBody}</p>
        <p className="mt-10 text-sm leading-7 text-muted-foreground">
          {t("atelierAddress")}
          <br />
          WhatsApp {site.whatsappDisplay}
          <br />
          {site.email}
        </p>
        <Link href="/contact" className="text-link mt-8">
          <T k="writeTheHouse" />
        </Link>
      </section>
    </div>
  );
}
