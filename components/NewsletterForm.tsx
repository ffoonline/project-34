"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
export function NewsletterForm({ compact = false, invert = false }: { compact?: boolean; invert?: boolean }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault(); setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) { const body = (await res.json()) as { error?: string }; throw new Error(body.error || t("couldNotSubscribe")); }
      setStatus("done"); setEmail(""); toast.success(t("onTheHouseList"));
    } catch (error) { setStatus("idle"); toast.error(error instanceof Error ? error.message : t("couldNotSubscribe")); }
  }
  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row sm:items-center"}>
      <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("emailNextCut")} className={`h-10 min-w-0 rounded-md ${compact ? "flex-1" : "w-full sm:flex-1"} ${invert ? "border-white/20 bg-white text-black" : "bg-background"}`} aria-label={t("emailAddress")} />
      <Button type="submit" disabled={status === "loading"} className={`h-9 w-fit min-w-[8rem] rounded-md px-4 text-[10px] tracking-[0.14em] uppercase ${invert ? "bg-white text-black hover:bg-white/90" : ""}`}>
        {status === "done" ? t("onTheList") : status === "loading" ? t("sending") : t("subscribe")}
      </Button>
    </form>
  );
}
