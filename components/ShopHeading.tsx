"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { isCategoryKey, isCopyKey, type CopyKey } from "@/lib/i18n";

export function ShopHeading({
  line,
  title,
  titleKey,
  subcategory,
}: {
  line?: string;
  title?: string;
  titleKey?: CopyKey;
  subcategory?: string;
}) {
  const { t } = useLanguage();
  if (line && isCategoryKey(line)) {
    if (subcategory && isCopyKey(subcategory)) {
      return (
        <>
          {t(line)} · {t(subcategory)}
        </>
      );
    }
    return <>{t(line)}</>;
  }
  if (titleKey) return <>{t(titleKey)}</>;
  return <>{title}</>;
}

export function ShopLede({ k, className }: { k?: CopyKey; className?: string }) {
  const { t } = useLanguage();
  if (!k) return null;
  return <p className={className}>{t(k)}</p>;
}

export function PieceCount({ count }: { count: number }) {
  const { t } = useLanguage();
  return (
    <>
      {count} {count === 1 ? t("piece") : t("pieces")}
    </>
  );
}

export function ShopSubNav({
  line,
  subs,
  activeSub,
}: {
  line: string;
  subs: { slug: string; label: string }[];
  activeSub?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="mt-8 flex flex-wrap gap-5 text-[11px] font-semibold tracking-[0.18em] uppercase">
      <Link href={`/shop/${line}`} aria-current={!activeSub ? "page" : undefined}>
        {t("all")}
      </Link>
      {subs.map((item) => (
        <Link
          key={item.slug}
          href={`/shop/${line}/${item.slug}`}
          className={
            activeSub === item.slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }
          aria-current={activeSub === item.slug ? "page" : undefined}
        >
          {isCopyKey(item.slug) ? t(item.slug) : item.label}
        </Link>
      ))}
    </div>
  );
}

export function ShopHeroImage({
  src,
  line,
  title,
}: {
  src: string;
  line?: string;
  title?: string;
}) {
  const { t } = useLanguage();
  const alt = line && isCategoryKey(line) ? t(line) : title || line || "";
  return <Image src={src} alt={alt} fill priority sizes="100vw" />;
}

export function RelatedHeading({ category }: { category: string }) {
  const { t } = useLanguage();
  return (
    <>
      <p className="kicker">{t("alsoOnThisRail")}</p>
      <h2 className="mt-3 text-4xl">
        {t("moreFrom")} {isCategoryKey(category) ? t(category) : category}
      </h2>
    </>
  );
}
