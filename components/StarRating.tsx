"use client";

export function StaticStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span className={`inline-flex gap-0.5 ${dim}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return (
          <span key={index} className={filled ? "text-foreground" : "text-border"} aria-hidden>
            ★
          </span>
        );
      })}
    </span>
  );
}

export function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }, (_, index) => {
        const star = index + 1;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className={`text-xl ${star <= value ? "text-foreground" : "text-border"}`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
