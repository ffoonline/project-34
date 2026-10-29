"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  readCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";
import { useLanguage } from "@/context/LanguageContext";

export function CookieBanner() {
  const { t } = useLanguage();
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    () => "necessary" as CookieConsent,
  );
  const choose = useCallback((value: CookieConsent) => {
    writeCookieConsent(value);
  }, []);

  if (consent) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div className="pointer-events-auto border-t border-border bg-background">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {t("cookieBody")}{" "}
            <Link href="/cookies" className="text-foreground underline">
              {t("cookiePolicy")}
            </Link>
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-none text-[11px] tracking-[0.16em] uppercase"
              onClick={() => choose("necessary")}
            >
              {t("necessaryOnly")}
            </Button>
            <Button
              type="button"
              className="h-10 rounded-none text-[11px] tracking-[0.16em] uppercase"
              onClick={() => choose("all")}
            >
              {t("acceptAll")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
