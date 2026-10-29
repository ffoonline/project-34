"use client";

import { Logo } from "@/components/Logo";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <Logo size={64} className="mx-auto h-16 w-16" />
      <p className="kicker mt-6">{t("fault")}</p>
      <h1 className="font-heading mt-3 text-5xl">{t("slippedStitch")}</h1>
      <p className="mt-4 text-sm text-muted-foreground">{t("tryAgainOrWrite")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 bg-primary px-6 py-3 text-[11px] tracking-[0.22em] text-primary-foreground uppercase"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
