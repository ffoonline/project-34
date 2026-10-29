"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarInput, StaticStars } from "@/components/StarRating";
import { initialReviews, type Review } from "@/lib/reviews-data";
import { useLanguage } from "@/context/LanguageContext";

export function ReviewsSection({ productId }: { productId: string }) {
  const { t } = useLanguage();
  const seeded = useMemo(
    () => initialReviews.filter((review) => review.productId === productId),
    [productId],
  );
  const [reviews, setReviews] = useState<Review[]>(seeded);
  const [rating, setRating] = useState(5);
  const [pending, setPending] = useState(false);

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
    const review: Review = {
      id: `rev-${Date.now()}`,
      productId,
      name,
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    setReviews((current) => [review, ...current]);
    setPending(false);
    event.currentTarget.reset();
    setRating(5);
    toast.success(t("thankYouNote"));
  }

  return (
    <section id="reviews" className="mt-16 scroll-mt-24 border-t border-border pt-12">
      <p className="kicker">{t("reviews")}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t("fromTheWardrobe")}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{t("onlyRealNotes")}</p>

      {reviews.length === 0 ? (
        <p className="mt-8 py-8 text-sm text-muted-foreground">{t("noReviewsYet")}</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-border pb-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">{review.name}</p>
                <StaticStars rating={review.rating} size="sm" />
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{review.text}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} className="mt-10 grid max-w-lg gap-4">
        <div className="grid gap-2">
          <Label htmlFor="review-name">{t("name")}</Label>
          <Input id="review-name" name="name" required className="h-11 rounded-none" />
        </div>
        <div className="grid gap-2">
          <Label>{t("rating")}</Label>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="review-text">{t("note")}</Label>
          <Textarea id="review-text" name="text" required className="rounded-none" rows={4} />
        </div>
        <Button type="submit" disabled={pending} className="h-12 w-fit rounded-none uppercase tracking-[0.18em]">
          {pending ? t("sending") : t("submitReview")}
        </Button>
      </form>
    </section>
  );
}
