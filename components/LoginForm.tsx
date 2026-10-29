"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PasswordField, authInputClass } from "@/components/PasswordField";
import { useLanguage } from "@/context/LanguageContext";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeRedirect } from "@/lib/paths";

export function LoginForm({ next = "/admin" }: { next?: string }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const supabaseReady = isSupabaseConfigured();
  const dest = safeRedirect(next, "/admin");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(data.get("email") || ""),
        password: String(data.get("password") || ""),
      }),
    });
    setPending(false);
    if (!res.ok) {
      setInvalid(true);
      toast.error(t("badAtelierPassword"));
      return;
    }
    setInvalid(false);
    const body = (await res.json()) as { role?: string };
    router.push(body.role === "admin" ? dest : "/account");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {supabaseReady ? (
        <div className="grid gap-2">
          <Label htmlFor="email">{t("staffEmail")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            aria-invalid={invalid}
            className={authInputClass}
            onChange={() => setInvalid(false)}
          />
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="password">{t("atelierPassword")}</Label>
        <PasswordField
          id="password"
          name="password"
          required
          autoComplete="current-password"
          aria-invalid={invalid}
          onChange={() => setInvalid(false)}
        />
      </div>
      <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.22em]">
        {pending ? t("opening") : t("enter")}
      </Button>
      <p className="text-xs text-muted-foreground">
        {supabaseReady ? t("staffEmailNote") : t("staffDoorNote")}
      </p>
    </form>
  );
}
