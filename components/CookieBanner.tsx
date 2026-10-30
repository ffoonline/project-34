"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  cookieConsentFromChoices,
  COOKIE_SETTINGS_EVENT,
  hasCookieConsent,
  readCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CookieBanner() {
  const { t, dir } = useLanguage();
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    () => null,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const choose = useCallback((value: CookieConsent) => {
    writeCookieConsent(value);
  }, []);

  const openPreferences = useCallback(() => {
    setAnalytics(hasCookieConsent(readCookieConsent(), "analytics"));
    setMarketing(hasCookieConsent(readCookieConsent(), "marketing"));
    setPreferencesOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(COOKIE_SETTINGS_EVENT, openPreferences);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openPreferences);
  }, [openPreferences]);

  const savePreferences = () => {
    choose(cookieConsentFromChoices(analytics, marketing));
    setPreferencesOpen(false);
  };

  return (
    <>
      {!consent ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto border-t border-border bg-background shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                {t("cookieBody")} {" "}
                <Link href="/cookies" className="text-foreground underline underline-offset-4">
                  {t("cookiePolicy")}
                </Link>
              </p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-none text-[10px] tracking-[0.12em] uppercase sm:text-[11px]"
                  onClick={() => choose("necessary")}
                >
                  {t("rejectOptional")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-none text-[10px] tracking-[0.12em] uppercase sm:text-[11px]"
                  onClick={openPreferences}
                >
                  {t("customize")}
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-none text-[10px] tracking-[0.12em] uppercase sm:text-[11px]"
                  onClick={() => choose("all")}
                >
                  {t("acceptAll")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent dir={dir} showCloseButton={false} className="w-[calc(100vw-2rem)] max-w-lg rounded-none p-0">
          <DialogHeader className="border-b border-border px-5 py-5 sm:px-7">
            <DialogTitle className="font-heading text-3xl">{t("cookiePreferences")}</DialogTitle>
            <DialogDescription className="leading-6">
              {t("cookiePreferencesDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-0 px-5 sm:px-7">
            <PreferenceRow
              id="cookie-necessary"
              title={t("necessaryCookies")}
              description={t("necessaryCookiesDescription")}
              checked
              disabled
              onChange={() => undefined}
            />
            <PreferenceRow
              id="cookie-analytics"
              title={t("analyticsCookies")}
              description={t("analyticsCookiesDescription")}
              checked={analytics}
              onChange={setAnalytics}
            />
            <PreferenceRow
              id="cookie-marketing"
              title={t("marketingCookies")}
              description={t("marketingCookiesDescription")}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
          <DialogFooter className="border-t border-border px-5 py-4 sm:px-7">
            <Button type="button" variant="outline" className="h-10 rounded-none" onClick={() => { choose("necessary"); setPreferencesOpen(false); }}>
              {t("rejectOptional")}
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-none" onClick={savePreferences}>
              {t("savePreferences")}
            </Button>
            <Button type="button" className="h-10 rounded-none" onClick={() => { choose("all"); setPreferencesOpen(false); }}>
              {t("acceptAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreferenceRow({
  id,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">
          {title}
        </label>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="mt-1 size-4 shrink-0 accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-60"
      />
    </div>
  );
}
