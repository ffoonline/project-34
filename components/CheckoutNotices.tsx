"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { orderStatusKey } from "@/lib/i18n";
import { PaymentForm } from "@/components/PaymentForm";

export function CheckoutConfirmation({
  order,
}: {
  order: { id: string; customer: { name: string }; status: string } | null;
}) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="kicker">{t("confirmation")}</p>
      <h1 className="font-heading mt-3 text-6xl">{t("houseHasIt")}</h1>
      {order ? (
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {t("orderWord")} <span className="text-foreground">{order.id}</span> {t("forWord")} {order.customer.name}.{" "}
          {t("willConfirm")} {t(orderStatusKey(order.status))}.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t("checkYourEmail")}</p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild className="h-11 rounded-none uppercase tracking-[0.22em]">
          <Link href="/shop">{t("continueShopping")}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-none uppercase tracking-[0.22em]">
          <Link href="/contact">{t("contact")}</Link>
        </Button>
      </div>
    </div>
  );
}

export function CheckoutSuccessNotice({
  paid,
  failed,
}: {
  paid: boolean;
  failed: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="kicker">{t("stripe")}</p>
      <h1 className="font-heading mt-3 text-6xl">{paid ? t("paidTitle") : t("waitingStripe")}</h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {paid ? t("paidBody") : failed ? t("failedRedirect") : t("waitingStripeBody")}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild className="h-11 rounded-none uppercase tracking-[0.22em]">
          <Link href="/shop">{t("continueShopping")}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-none uppercase tracking-[0.22em]">
          <Link href="/contact">{t("contact")}</Link>
        </Button>
      </div>
    </div>
  );
}

export function CardPaymentPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="kicker">{t("checkout")}</p>
      <h1 className="font-heading mt-3 text-6xl">{t("card")}</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">{t("cardPaymentLede")}</p>
      <div className="mt-10">
        <PaymentForm />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/checkout" className="underline">
          {t("backToCheckout")}
        </Link>
      </p>
    </div>
  );
}
