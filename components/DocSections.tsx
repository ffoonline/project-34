"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";

export type DraftPolicyKind = "impressum" | "privacy" | "terms" | "cookies" | "shipping" | "returns";

const pendingMessage: Record<DraftPolicyKind, CopyKey> = {
  impressum: "merchantDetailsPending",
  privacy: "privacyDetailsPending",
  terms: "termsDetailsPending",
  cookies: "cookieDetailsPending",
  shipping: "shippingDetailsPending",
  returns: "returnsDetailsPending",
};

export function DocPage({
  kicker,
  title,
  date,
  kind,
}: {
  kicker: CopyKey;
  title: CopyKey;
  date?: boolean;
  kind: DraftPolicyKind;
}) {
  const { t } = useLanguage();

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="kicker">{t(kicker)}</p>
      <h1 className="font-heading mt-3 max-w-3xl text-5xl leading-[0.98] sm:text-6xl md:text-7xl">{t(title)}</h1>
      {date ? <p className="mt-4 text-sm text-muted-foreground">{t("draftOnly")}</p> : null}

      <div className="mt-8 border border-[#E3B15B]/60 bg-[#E3B15B]/[0.08] p-5 sm:p-7" role="note">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A5B1F] uppercase dark:text-[#E3B15B]">{t("draftOnly")}</p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground">{t("draftNotice")}</p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{t("officialCopyPending")}</p>
      </div>

      <section className="mt-10 grid gap-5 border-b border-border pb-8 md:grid-cols-[0.65fr_1.35fr] md:gap-10">
        <div>
          <p className="kicker">{t("detailsPending")}</p>
          <h2 className="font-heading mt-3 text-3xl sm:text-4xl">{t("detailsPending")}</h2>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{t(pendingMessage[kind])}</p>
      </section>
      <p className="mt-6 max-w-3xl text-xs leading-6 text-muted-foreground">{t("legalReviewPending")}</p>

      <nav aria-label={t("legal")} className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm">
        <Link href="/impressum" className="underline underline-offset-4">{t("impressum")}</Link>
        <Link href="/privacy" className="underline underline-offset-4">{t("privacy")}</Link>
        <Link href="/cookies" className="underline underline-offset-4">{t("cookies")}</Link>
        <Link href="/terms" className="underline underline-offset-4">{t("terms")}</Link>
        <Link href="/shipping" className="underline underline-offset-4">{t("shipping")}</Link>
        <Link href="/returns" className="underline underline-offset-4">{t("returns")}</Link>
      </nav>
    </article>
  );
}

export function FaqView() {
  const { t } = useLanguage();

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="kicker">{t("faq")}</p>
      <h1 className="font-heading mt-3 text-5xl sm:text-6xl md:text-7xl">{t("faqHeading")}</h1>
      <div className="mt-8 border border-[#E3B15B]/60 bg-[#E3B15B]/[0.08] p-5 sm:p-7" role="note">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A5B1F] uppercase dark:text-[#E3B15B]">{t("draftOnly")}</p>
        <p className="mt-3 text-sm leading-7 text-foreground">{t("faqDetailsPending")}</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{t("officialCopyPending")}</p>
      </div>
      <Link href="/contact" className="text-link mt-8 inline-flex">{t("contactUs")}</Link>
    </article>
  );
}
