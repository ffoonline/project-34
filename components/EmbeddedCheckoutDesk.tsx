"use client";

import Checkout from "@/components/Checkout";
import { useLanguage } from "@/context/LanguageContext";

export function EmbeddedCheckoutDesk({ productId }: { productId: string }) {
  const { t } = useLanguage();

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return <p className="mt-8 text-sm text-oxblood">{t("cardNotConfigured")}</p>;
  }

  return (
    <div className="mt-8">
      <Checkout productId={productId} />
    </div>
  );
}
