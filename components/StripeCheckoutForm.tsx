"use client";

import { useState, type FormEvent } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setMessage(error.message ?? t("paymentFailed"));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={isSubmitting || !stripe || !elements}
        className="h-12 w-full rounded-none uppercase tracking-[0.18em]"
      >
        {isSubmitting ? t("processing") : t("payNow")}
      </Button>
      {message ? <p className="text-sm text-oxblood">{message}</p> : null}
    </form>
  );
}
