"use client";
import Link from "next/link";
import { faqItems } from "@/lib/copy-pages";
import { useLanguage } from "@/context/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export function HomeFaq() {
  const { t, language } = useLanguage();
  const items = faqItems(language).slice(0, 4);
  return (
    <section className="house-section border-t border-border">
      <div className="house-wrap grid gap-8 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="kicker">{t("faq")}</p>
          <h2 className="mt-3 max-w-[12ch] text-4xl sm:text-5xl">{t("faqHeading")}</h2>
          <Link href="/faq" className="text-link mt-7">{t("viewAll")}</Link>
        </div>
        <Accordion type="single" collapsible defaultValue="item-0" className="mt-1">
          {items.map((item, index) => (
            <AccordionItem key={item.q} value={`item-${index}`}>
              <AccordionTrigger className="py-4 text-start text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
