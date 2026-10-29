"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarInput } from "@/components/StarRating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

function hiddenOn(pathname: string) {
  return (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account") ||
    pathname === "/login" ||
    pathname === "/cart"
  );
}

export function ReviewButton() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [pending, setPending] = useState(false);

  if (hiddenOn(pathname)) return null;

  function openReview() {
    const section = document.getElementById("reviews");
    const field = document.getElementById("review-name");
    if (section && field) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => field.focus(), 350);
      return;
    }
    setOpen(true);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const text = String(data.get("text") || "").trim();
    if (!name || !text) {
      toast.error(t("nameAndWords"));
      return;
    }
    setPending(true);
    setPending(false);
    event.currentTarget.reset();
    setRating(5);
    setOpen(false);
    toast.success(t("thankYouNote"));
  }

  return (
    <div className="border-t border-border">
      <div className="house-wrap flex items-center justify-between gap-4 py-8 sm:px-6">
        <p className="kicker">{t("fromTheWardrobe")}</p>
        <Button
          type="button"
          variant="outline"
          className="h-12 min-w-36 rounded-none text-[11px] font-semibold tracking-[0.2em] uppercase"
          onClick={openReview}
        >
          {t("review")}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-3xl tracking-[-0.03em]">{t("review")}</DialogTitle>
            <DialogDescription>{t("reviewDialogCopy")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="house-review-name">{t("name")}</Label>
              <Input id="house-review-name" name="name" required className="h-11 rounded-none" />
            </div>
            <div className="grid gap-2">
              <Label>{t("rating")}</Label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="house-review-text">{t("note")}</Label>
              <Textarea id="house-review-text" name="text" required className="rounded-none" rows={4} />
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="h-12 rounded-none text-[11px] tracking-[0.18em] uppercase"
            >
              {pending ? t("sending") : t("submitReview")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
