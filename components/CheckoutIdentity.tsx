"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function CheckoutIdentity() {
  const { isLoggedIn, identifier } = useAuth();
  const { t } = useLanguage();

  if (isLoggedIn) {
    return (
      <p className="mb-10 max-w-xl text-sm leading-7 text-muted-foreground">
        {t("signedInAs")} {identifier}.{" "}
        <Link href="/account" className="text-foreground underline">
          {t("account")}
        </Link>
      </p>
    );
  }

  return (
    <div className="mb-10 max-w-xl text-sm">
      <p>{t("checkingOutGuest")}</p>
      <p className="mt-2 text-muted-foreground">{t("guestBagHint")}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold tracking-[0.16em] uppercase">
        <Link href="/account/login?redirect=/checkout">{t("login")}</Link>
        <Link href="/account/signup?redirect=/checkout">{t("signUp")}</Link>
      </div>
    </div>
  );
}
