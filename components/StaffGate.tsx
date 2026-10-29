"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function StaffGate({ next = "/admin" }: { next?: string }) {
  const { t } = useLanguage();
  const [atDesk, setAtDesk] = useState(false);

  if (!atDesk) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Logo size={88} className="h-[88px] w-[88px]" />
        <p className="kicker mt-6">{t("staff")}</p>
        <h1 className="font-heading mt-3 text-5xl">{t("staffDeskTitle")}</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{t("staffDeskBody")}</p>
        <div className="mt-8 grid gap-3">
          <Button asChild className="h-12 rounded-none uppercase tracking-[0.18em]">
            <Link href="/">{t("goBack")}</Link>
          </Button>
          <button
            type="button"
            className="h-12 text-sm font-bold hover:underline"
            onClick={() => setAtDesk(true)}
          >
            {t("iWorkWith34")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={88} className="h-[88px] w-[88px]" />
      <p className="kicker mt-6">{t("staff")}</p>
      <h1 className="font-heading mt-3 text-5xl">{t("houseLogin")}</h1>
      <p className="mt-4 text-sm text-muted-foreground">{t("houseLoginBody")}</p>
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
