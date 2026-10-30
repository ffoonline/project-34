"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/lib/catalog";
import { useLanguage } from "@/context/LanguageContext";

const storySections = ["ourStory", "mission", "vision"] as const;

export function AboutPageBody() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="kicker">{t("about")}</p>
          <h1 className="font-heading mt-4 max-w-[10ch] text-6xl leading-[0.92] sm:text-7xl md:text-8xl">{t("ourStory")}</h1>
        </div>
        <div className="max-w-xl lg:justify-self-end">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A5B1F] uppercase dark:text-[#E3B15B]">{t("draftOnly")}</p>
          <p className="mt-3 text-base leading-8 text-muted-foreground">{t("officialCopyPending")}</p>
        </div>
      </section>

      <div className="relative h-[48vh] min-h-72 max-h-[680px] bg-muted sm:h-[62vh]">
        <Image
          src={lookbook.atelier}
          alt={t("atelierAlt")}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <section className="mx-auto grid max-w-[1440px] gap-px bg-border px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-3">
        {storySections.map((key, index) => (
          <article key={key} className="min-h-52 bg-background p-5 sm:p-8">
            <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">0{index + 1}</p>
            <h2 className="font-heading mt-5 text-3xl sm:text-4xl">{t(key)}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{t("officialCopyPending")}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-5 border-t border-border px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[0.7fr_1.3fr] md:items-center">
        <h2 className="font-heading text-4xl sm:text-5xl">{t("contactUs")}</h2>
        <div className="max-w-2xl">
          <p className="text-sm leading-7 text-muted-foreground">{t("contactFormPreviewNote")}</p>
          <Link href="/contact" className="text-link mt-6 inline-flex">{t("contact")}</Link>
        </div>
      </section>
    </div>
  );
}
