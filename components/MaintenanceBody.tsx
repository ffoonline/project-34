"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, whatsappLink } from "@/lib/site";
import { useLanguage } from "@/context/LanguageContext";

export function MaintenanceBody() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <Logo size={88} className="h-[88px] w-[88px]" />
      <p className="kicker mt-8">T.F.G34</p>
      <h1 className="font-heading mt-3 text-5xl">{t("houseClosed")}</h1>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">{t("houseClosedBody")}</p>
      {site.publicContactDetailsConfirmed ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink("Hello THIRTY FOUR — I am writing while the house site is closed.")} className="bg-primary px-6 py-3 text-[11px] tracking-[0.22em] text-primary-foreground uppercase">
            WhatsApp {site.whatsappDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="border border-border px-6 py-3 text-[11px] tracking-[0.22em] uppercase">{site.email}</a>
        </div>
      ) : (
        <p role="note" className="mt-8 max-w-sm border border-border px-5 py-4 text-xs leading-6 text-muted-foreground">{t("contactFormPreviewNote")}</p>
      )}
      <Link href="/login" className="mt-10 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">{t("atelier")}</Link>
    </div>
  );
}
