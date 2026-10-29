"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeRedirect } from "@/lib/paths";
import { PasswordField } from "@/components/PasswordField";
import { useLanguage } from "@/context/LanguageContext";

type Stage = "otp" | "password";

export function ResetPasswordForm({
  identifier: initialIdentifier,
  redirect = "/account",
}: {
  identifier: string;
  redirect?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [stage, setStage] = useState<Stage>("otp");
  const [hasSent, setHasSent] = useState(false);
  const [pending, setPending] = useState(false);
  const next = safeRedirect(redirect, "/account");

  async function sendCode(target: string) {
    setPending(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: target }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string; identifier?: string };
    if (!res.ok) {
      toast.error(body.error || t("couldNotSendCode"));
      return false;
    }
    setIdentifier(body.identifier || target);
    setHasSent(true);
    setStage("otp");
    toast.message(t("codeInLog"));
    return true;
  }

  async function onIdentifier(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("identifier") || "");
    await sendCode(value);
  }

  async function onOtp(event: React.FormEvent<HTMLFormElement>) {
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
    setStage("password");
  }

  async function onPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password !== confirm) {
      toast.error(t("passwordsMismatch"));
      return;
    }
    setPending(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    setPending(false);
    const body = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast.error(body.error || t("couldNotUpdatePassword"));
      return;
    }
    toast.success(t("passwordUpdated"));
    router.push(next);
    router.refresh();
  }

  if (!hasSent && !initialIdentifier) {
    return (
      <form onSubmit={onIdentifier} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="identifier">{t("emailOrPhone")}</Label>
          <Input id="identifier" name="identifier" required className="h-12 rounded-none" />
        </div>
        <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
          {pending ? t("sending") : t("sendCode")}
        </Button>
      </form>
    );
  }

  if (stage === "otp") {
    return (
      <form onSubmit={onOtp} className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          {t("enterTheCodeFor")} <span className="text-foreground">{identifier}</span>.
        </p>
        <div className="grid gap-2">
          <Label htmlFor="code">{t("sixDigitCode")}</Label>
          <Input
            id="code"
            name="code"
            required
            minLength={6}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="h-12 rounded-none tracking-[0.4em]"
          />
        </div>
        <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.18em]">
          {pending ? t("checking") : t("verify")}
        </Button>
        <button
          type="button"
          className="text-xs text-muted-foreground underline"
          onClick={() => sendCode(identifier)}
        >
          {t("sendNewCode")}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onPassword} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
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
        {pending ? t("saving") : t("updatePassword")}
      </Button>
    </form>
  );
}
