"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/HouseIcons";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm() {
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        message: String(data.get("message") || ""),
      }),
    });
    setPending(false);
    if (!res.ok) {
      toast.error(t("couldNotSendNote"));
      return;
    }
    setDone(true);
    toast.success(t("atelierHasNote"));
    event.currentTarget.reset();
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          className="border border-border p-5 hover:border-foreground"
          href={whatsappLink("Hello Thirty Four — I have a question from the contact page.")}
          target="_blank"
          rel="noreferrer"
        >
          <p className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase">
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </p>
          <p className="mt-2 font-heading text-2xl">{site.whatsappDisplay}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("liveThread")}</p>
        </a>
        {site.email ? (
          <a className="border border-border p-5 hover:border-foreground" href={`mailto:${site.email}`}>
            <p className="text-[11px] tracking-[0.22em] uppercase">{t("email")}</p>
            <p className="mt-2 font-heading text-2xl break-all">{site.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("lookbooksWholesale")}</p>
          </a>
        ) : null}
      </div>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" name="name" required className="h-11 rounded-none" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" name="email" type="email" required className="h-11 rounded-none" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" className="h-11 rounded-none" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea id="message" name="message" required className="min-h-32 rounded-none" />
        </div>
        <Button type="submit" disabled={pending} className="h-12 rounded-none uppercase tracking-[0.22em]">
          {done ? t("sent") : pending ? t("sending") : t("sendToAtelier")}
        </Button>
      </form>
    </div>
  );
}
