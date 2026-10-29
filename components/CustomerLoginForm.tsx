"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { safeRedirect } from "@/lib/paths";
import { PasswordField, authInputClass } from "@/components/PasswordField";

export function CustomerLoginForm({ redirect = "/account" }: { redirect?: string }) {
  const router = useRouter();
  const { setIdentifier } = useAuth();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const next = safeRedirect(redirect, "/account");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    const res = await fetch("/api/auth/customer-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: String(data.get("identifier") || ""),
        password: String(data.get("password") || ""),
      }),
    });
    setPending(false);
    if (!res.ok) {
      setInvalid(true);
      const body = (await res.json()) as { error?: string };
      toast.error(body.error || t("signInMismatch"));
      return;
    }
    setInvalid(false);
    const body = (await res.json()) as { identifier: string };
    setIdentifier(body.identifier);
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="identifier">{t("emailOrPhone")}</Label>
        <Input
          id="identifier"
          name="identifier"
          required
          autoComplete="username"
          aria-invalid={invalid}
          className={authInputClass}
          onChange={() => setInvalid(false)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordField
          id="password"
          name="password"
          required
          autoComplete="current-password"
          aria-invalid={invalid}
          onChange={() => setInvalid(false)}
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
        {pending ? t("opening") : t("login")}
      </Button>
      <Button asChild variant="outline" className="h-12 rounded-none font-bold">
        <Link href={`/register?redirect=${encodeURIComponent(next)}`}>{t("createAccount")}</Link>
      </Button>
      <Button asChild variant="outline" className="h-12 rounded-none font-bold">
        <Link href={`/account/reset-password?redirect=${encodeURIComponent(next)}`}>{t("forgotPassword")}</Link>
      </Button>
    </form>
  );
}
