"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import type { CopyKey } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { NewsletterForm } from "./NewsletterForm";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WhatsAppIcon } from "@/components/HouseIcons";

const columns: { title: CopyKey; links: { href: string; key: CopyKey }[] }[] = [
  {
    title: "shop",
    links: [
      { href: "/shop/men", key: "men" },
      { href: "/shop/women", key: "women" },
      { href: "/shop/kids", key: "kids" },
      { href: "/shop/fragrance", key: "fragrance" },
      { href: "/shop/beauty", key: "beauty" },
      { href: "/shop/accessories", key: "accessories" },
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
      { href: "/about", key: "about" },
      { href: "/journal", key: "journal" },
      { href: "/account", key: "account" },
    ],
  },
  {
    title: "legal",
    links: [
      { href: "/privacy", key: "privacy" },
      { href: "/terms", key: "terms" },
      { href: "/cookies", key: "cookies" },
    ],
  },
];

export function Footer({ showFullAddress = false }: { showFullAddress?: boolean }) {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-[#111111] text-[#faf9f6]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Logo invert size={56} className="h-12 w-12 shrink-0 bg-transparent sm:h-14 sm:w-14" />
          <p className="font-heading text-lg font-semibold tracking-[0.18em] uppercase sm:text-2xl sm:tracking-[0.22em]">
            {site.legal}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-7 text-white/60">{t("tagline")}</p>
            <p className="mt-4 text-sm text-white/55">
              <span className="font-semibold tracking-[0.12em] uppercase">{site.legal}</span>
              <br />
              {showFullAddress ? site.fullAddress : site.address}
              <br />
              <a
                href={`https://wa.me/${site.whatsapp}`}
                className="mt-2 inline-flex items-center gap-2 hover:text-white"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp {site.whatsappDisplay}
              </a>
              {site.email ? (
                <>
                  <br />
                  <a href={`mailto:${site.email}`} className="hover:text-white">
                    {site.email}
                  </a>
                </>
              ) : null}
            </p>
            <div className="mt-10 max-w-sm">
              <p className="mb-4 text-[11px] tracking-[0.2em] uppercase text-white/45">
                {t("nextCut")}
              </p>
              <NewsletterForm invert />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-8 lg:grid-cols-4 lg:gap-8">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase">
                  {t(column.title)}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  {column.links.map((link) => (
                    <li key={link.href + link.key}>
                      <Link href={link.href} className="hover:text-white">
                        {t(link.key)}
                      </Link>
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
          <p>
            © {new Date().getFullYear()} {site.legal}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={site.instagram}>Instagram</a>
            <a href={site.facebook}>Facebook</a>
            <a href={site.tiktok}>TikTok</a>
            <a href={site.x}>X</a>
          </div>
          <div className="flex items-center gap-3 normal-case tracking-normal">
            <LanguageSwitcher invert />
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 pb-6 pt-1 text-[11px] tracking-[0.08em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="uppercase tracking-[0.14em]">{t("allRights")}</p>
          <p className="normal-case">
            {t("digitalExperienceBy")} {" "}
            <a
              href="https://www.finutex.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/55 hover:text-white"
            >
              FINUTEX
            </a>
            {" · "}
            <Link href="/login" className="text-white/55 hover:text-white">
              MD& CEO
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
