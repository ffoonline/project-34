"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField, authInputClass } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { safeRedirect } from "@/lib/paths";

export function RegisterForm({ redirect = "/account" }: { redirect?: string }) {
  const router = useRouter();
  const { setIdentifier } = useAuth();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const next = safeRedirect(redirect, "/account");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password !== confirm) {
      toast.error(t("passwordsMismatch"));
      return;
    }
    setPending(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(data.get("email") || ""),
        password,
      }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string; identifier?: string; role?: string };
    if (!res.ok) {
      toast.error(body.error || t("couldNotRegister"));
      return;
    }
    setIdentifier(body.identifier || String(data.get("email") || ""));
    toast.success(t("houseIsOpen"));
    router.push(body.role === "admin" ? "/admin" : next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={authInputClass}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordField id="password" name="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm">{t("confirmPassword")}</Label>
        <PasswordField id="confirm" name="confirm" required minLength={8} autoComplete="new-password" />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
        {pending ? t("saving") : t("createTheAccount")}
      </Button>
    </form>
  );
}
