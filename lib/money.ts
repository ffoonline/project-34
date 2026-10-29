import { site } from "./site";
import type { CurrencyCode } from "./types";

export function convert(usd: number, currency: CurrencyCode) {
  return usd * site.rates[currency];
}

export function formatMoney(usd: number, currency: CurrencyCode = "USD") {
  const value = convert(usd, currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function shippingForCity(city: string) {
  if (city === "Kabul") return site.shipping.kabul;
  if (city === "International") return site.shipping.international;
  return site.shipping.afghanistan;
}
