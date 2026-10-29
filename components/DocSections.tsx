"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";
import { faqItems, returnsSections, shippingSections } from "@/lib/copy-pages";
import { cookiesSections, privacySections, termsSections } from "@/lib/copy-legal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const docs = {
  shipping: shippingSections,
  returns: returnsSections,
  privacy: privacySections,
  terms: termsSections,
  cookies: cookiesSections,
} as const;

export function DocPage({
  kicker,
  title,
  date,
  kind,
}: {
  kicker: CopyKey;
  title: CopyKey;
  date?: boolean;
  kind: keyof typeof docs;
}) {
  const { t, language } = useLanguage();
  const sections = docs[kind](language);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="kicker">{t(kicker)}</p>
      <h1 className="font-heading mt-3 text-5xl md:text-6xl">{t(title)}</h1>
      {date ? <p className="mt-4 text-sm text-muted-foreground">{t("lastUpdated")}</p> : null}
      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
        {sections.map((section) => (
          <section key={section.h}>
            <h2 className="font-heading text-3xl text-foreground">{section.h}</h2>
            <p className="mt-3">{section.p}</p>
          </section>
        ))}
      </div>
      {kind === "privacy" ? (
        <p className="mt-10 text-sm">
          <Link href="/cookies" className="text-foreground underline">
            {t("seeCookiePolicy")}
          </Link>
        </p>
      ) : null}
      {kind === "cookies" || kind === "terms" ? (
        <p className="mt-10 text-sm">
          <Link href="/privacy" className="text-foreground underline">
            {t("seePrivacyPolicy")}
          </Link>
        </p>
      ) : null}
      {kind === "shipping" ? (
        <p className="mt-10 text-sm">
          <Link href="/contact" className="text-foreground underline">
            {t("contactTheHouse")}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function FaqView() {
  const { t, language } = useLanguage();
  const items = faqItems(language);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="kicker">{t("faq")}</p>
      <h1 className="font-heading mt-3 text-6xl">{t("faqHeading")}</h1>
      <Accordion type="single" collapsible className="mt-10" defaultValue="item-0">
        {items.map((item, index) => (
          <AccordionItem key={item.q} value={`item-${index}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
