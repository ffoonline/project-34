"use client";

import { useLanguage } from "@/context/LanguageContext";
import { formatMoney } from "@/lib/money";
import { orderStatusKey } from "@/lib/i18n";
import type { CurrencyCode } from "@/lib/types";

export function AccountOverviewCopy({ count }: { count: number }) {
  const { t } = useLanguage();
  if (count === 0) {
    return <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t("noOrdersYet")}</p>;
  }
  return (
    <p className="max-w-xl text-sm leading-7 text-muted-foreground">
      {count} {count === 1 ? t("oneOrderOnFile") : t("ordersOnFile")}
    </p>
  );
}

export function AccountOrdersList({
  orders,
}: {
  orders: { id: string; status: string; total: number; currency: CurrencyCode }[];
}) {
  const { t } = useLanguage();
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noOrdersTied")}</p>;
  }
  return (
    <ul className="divide-y divide-border border border-border">
      {orders.map((order) => (
        <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm">
          <span>{order.id}</span>
          <span className="text-muted-foreground">{t(orderStatusKey(order.status))}</span>
          <span>{formatMoney(order.total, order.currency)}</span>
        </li>
      ))}
    </ul>
  );
}

export function AccountSoon({ k }: { k: "addressesSoon" | "settingsSoon" }) {
  const { t } = useLanguage();
  return <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t(k)}</p>;
}
