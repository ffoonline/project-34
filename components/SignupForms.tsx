"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { safeRedirect } from "@/lib/paths";
import { PasswordField } from "@/components/PasswordField";

export function SignupIdentifierForm({ redirect = "/account" }: { redirect?: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const next = safeRedirect(redirect, "/account");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = String(new FormData(event.currentTarget).get("identifier") || "");
    setPending(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string; identifier?: string };
    if (!res.ok) {
      toast.error(body.error || t("couldNotSendCode"));
      return;
    }
    toast.message(t("codeInLog"));
    const params = new URLSearchParams({
      identifier: body.identifier || identifier,
      redirect: next,
    });
    router.push(`/account/signup/verify?${params.toString()}`);
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
          className="h-12 rounded-none"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
        {pending ? t("sending") : t("sendCode")}
      </Button>
    </form>
  );
}

export function SignupVerifyForm({
  identifier,
  redirect = "/account",
}: {
  identifier: string;
  redirect?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const next = safeRedirect(redirect, "/account");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("code") || "");
    setPending(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, code }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast.error(body.error || t("codeDoesNotMatch"));
      return;
    }
    const params = new URLSearchParams({ identifier, redirect: next });
    router.push(`/account/signup/password?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        {t("codeSentTo")} <span className="text-foreground">{identifier}</span>. {t("checkServerConsole")}
      </p>
      <div className="grid gap-2">
        <Label htmlFor="code">{t("sixDigitCode")}</Label>
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          minLength={6}
          maxLength={6}
          className="h-12 rounded-none tracking-[0.4em]"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
        {pending ? t("checking") : t("verify")}
      </Button>
    </form>
  );
}

export function SignupPasswordForm({
  identifier,
  redirect = "/account",
}: {
  identifier: string;
  redirect?: string;
}) {
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
    const res = await fetch("/api/auth/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string; identifier?: string };
    if (!res.ok) {
      toast.error(body.error || t("couldNotOpenAccount"));
      return;
    }
    setIdentifier(body.identifier || identifier);
    toast.success(t("houseIsOpen"));
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        {t("passwordFor")} {identifier}.
      </p>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordField
          id="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm">{t("confirmPassword")}</Label>
        <PasswordField
          id="confirm"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
        {pending ? t("saving") : t("createTheAccount")}
      </Button>
    </form>
  );
}
