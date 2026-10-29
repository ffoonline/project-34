"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/money";

export function Price({
  amount,
  compareAt,
  className = "",
}: {
  amount: number;
  compareAt?: number;
  className?: string;
}) {
  const { currency } = useCurrency();
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span>{formatMoney(amount, currency)}</span>
      {compareAt && compareAt > amount ? (
        <span className="text-muted-foreground line-through decoration-from-font">
          {formatMoney(compareAt, currency)}
        </span>
      ) : null}
    </span>
  );
}
