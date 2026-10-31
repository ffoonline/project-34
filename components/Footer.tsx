"use client";
import Link from "next/link";
import { site } from "@/lib/site";
import type { CopyKey } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { requestCookieSettings } from "@/lib/cookie-consent";

const columns: { title: CopyKey; links: { href: string; key: CopyKey }[] }[] = [
  {
    title: "shop",
    links: [
      { href: "/shop/men", key: "men" },
      { href: "/shop/women", key: "women" },
      { href: "/shop/kids", key: "kids" },
      { href: "/shop/fragrance", key: "beauties" },
      { href: "/shop/accessories", key: "handcraft" },
      { href: "/shop/sale", key: "sale" },
    ],
  },
  {
    title: "customerCare",
    links: [
      { href: "/contact", key: "contact" },
      { href: "/shipping", key: "shipping" },
      { href: "/returns", key: "returns" },
      { href: "/faq", key: "faq" },
    ],
  },
  {
    title: "company",
    links: [
      { href: "/login", key: "theHouseStuff" },
      { href: "/about", key: "about" },
      { href: "/journal", key: "journal" },
    ],
  },
  {
    title: "legal",
    links: [
      { href: "/impressum", key: "impressum" },
      { href: "/privacy", key: "privacy" },
      { href: "/terms", key: "terms" },
      { href: "/cookies", key: "cookies" },
    ],
  },
];

const footerLanguages = [
  { code: "en", label: "EN" },
  { code: "fa-AF", label: "دری" },
  { code: "ps", label: "پښتو" },
] as const;

export function Footer() {
  const { t, language, setLanguage } = useLanguage();
  return (
    <footer className="site-footer mt-auto bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo invert size={56} className="h-12 w-12 shrink-0 bg-transparent sm:h-14 sm:w-14" />
          <p className="footer__heading text-white font-heading text-lg font-semibold tracking-[0.18em] uppercase sm:text-2xl sm:tracking-[0.22em]">{site.legal}</p>
        </div>
        <div className="mt-8 grid gap-9 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-7 text-white/65">{t("tagline")}</p>
            {site.publicContactDetailsConfirmed ? (
              <p className="mt-4 text-sm leading-6 text-white/55">
                {t("atelierAddress")}
                <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a href={`https://wa.me/${site.whatsapp}`} className="inline-flex items-center gap-2 hover:text-white">WhatsApp {site.whatsappDisplay}</a>
                  <span aria-hidden className="text-white/30">·</span>
                  <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
                </span>
              </p>
            ) : null}
            <div className="mt-7 max-w-sm">
              <p className="footer__heading mb-3 text-[11px] tracking-[0.2em] uppercase text-white">{t("nextCut")}</p>
              <NewsletterForm compact invert rounded />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:col-span-8 lg:grid-cols-4 lg:gap-7">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="footer__heading text-white text-[11px] font-semibold tracking-[0.18em] uppercase">{t(column.title)}</p>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  {column.links.map((link) => (
                    <li key={link.href + link.key}>
                      <Link href={link.href} className="hover:text-white">{t(link.key)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 text-[11px] tracking-[0.14em] text-white/45 uppercase sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 THIRTY FOUR GLOBAL V3 · {t("allRights")}</p>
          {site.publicContactDetailsConfirmed ? (
            <div className="flex flex-wrap gap-4 normal-case tracking-normal">
              <a href={site.instagram}>Instagram</a>
              <a href={site.facebook}>Facebook</a>
              <a href={site.tiktok}>TikTok</a>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 normal-case tracking-normal">
            <Button type="button" variant="ghost" onClick={requestCookieSettings} className="h-auto rounded-none px-0 py-1 text-[11px] text-white/65 hover:bg-transparent hover:text-white">
              {t("manageCookies")}
            </Button>
            <div role="group" aria-label={t("language")} className="grid w-full grid-cols-3 gap-2 sm:w-auto">
              {footerLanguages.map((item) => (
                <Button key={item.code} type="button" variant="outline" aria-pressed={language === item.code} lang={item.code} onClick={() => setLanguage(item.code)} className={`h-9 min-w-0 rounded-md px-2 text-[11px] ${language === item.code ? "border-white bg-white text-black hover:bg-white/90 hover:text-black" : "border-white/30 bg-transparent text-white/75 hover:bg-white/10 hover:text-white"}`}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 pb-5 pt-0 text-[11px] tracking-[0.08em] text-white/40 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <p className="normal-case">{t("digitalPartner")} <a href="https://www.finutex.com" target="_blank" rel="noreferrer" className="text-white/65 hover:text-white">FINUTEX</a></p>
        </div>
      </div>
    </footer>
  );
}
