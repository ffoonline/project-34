"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { colorLabel, productName } from "@/lib/copy-catalog";
import { formatMoney } from "@/lib/money";
import type { CartItem, CurrencyCode } from "@/lib/types";
import { StripeCheckoutForm } from "@/components/StripeCheckoutForm";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function PaymentForm() {
  const { items, subtotal } = useCart();
  const { currency } = useCurrency();
  const { t, language } = useLanguage();
  const bagKey = useMemo(
    () => items.map((item) => `${item.productId}:${item.qty}`).join("|") + currency,
    [items, currency],
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("bagEmptyCard")}</p>;
  }

  return (
    <div className="max-w-lg">
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4">
            <span>
              {item.qty} × {productName(item.slug, language, item.name)}
              <span className="block text-xs text-muted-foreground">
                {item.size} / {colorLabel(item.color, language)}
              </span>
            </span>
            <span>{formatMoney(item.price * item.qty, currency)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex justify-between text-sm font-medium">
        <span>{t("subtotal")}</span>
        <span>{formatMoney(subtotal, currency)}</span>
      </p>
      {publishableKey ? (
        <PaymentIntentDesk key={bagKey} items={items} currency={currency} />
      ) : (
        <p className="mt-8 text-sm text-oxblood">{t("cardNotConfigured")}</p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{t("amountsPriced")}</p>
    </div>
  );
}

function PaymentIntentDesk({
  items,
  currency,
}: {
  items: CartItem[];
  currency: CurrencyCode;
}) {
  const { t, language } = useLanguage();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency,
        items: items.map((item) => ({
          id: item.productId,
          quantity: item.qty,
        })),
      }),
    })
      .then(async (res) => {
        const body = (await res.json()) as { clientSecret?: string; error?: string };
        if (cancelled) return;
        if (!res.ok || !body.clientSecret) {
          setError(body.error || t("unablePaymentIntent"));
          return;
        }
        setClientSecret(body.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setError(t("unablePaymentIntent"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currency, items, language]);

  if (loading) {
    return <p className="mt-8 text-sm text-muted-foreground">{t("openingCardDesk")}</p>;
  }
  if (error) {
    return (
      <p className="mt-8 text-sm text-oxblood">
        {error} {t("guestsPayDelivery")}
      </p>
    );
  }
  if (!clientSecret || !stripePromise) return null;

  return (
    <div className="mt-8">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#111111",
              colorBackground: "#faf9f6",
              colorText: "#111111",
              colorDanger: "#6b1e23",
              fontFamily: "Manrope, sans-serif",
              borderRadius: "0px",
            },
          },
        }}
      >
        <StripeCheckoutForm />
      </Elements>
    </div>
  );
}
