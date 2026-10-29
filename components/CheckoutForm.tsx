"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cities, site } from "@/lib/site";
import { cityLabel, colorLabel, productName } from "@/lib/copy-catalog";
import { formatMoney, shippingForCity } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckoutIdentity } from "@/components/CheckoutIdentity";

export function CheckoutForm() {
  const { items, subtotal, clear } = useCart();
  const { currency } = useCurrency();
  const { identifier } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [city, setCity] = useState("Kabul");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [pending, setPending] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const shipping = shippingForCity(city);
  const total = subtotal + shipping;

  const empty = items.length === 0;

  useEffect(() => {
    if (!mounted) return;
    if (empty) router.replace("/cart");
  }, [mounted, empty, router]);

  const summary = useMemo(
    () =>
      items
        .map(
          (item) =>
            `${item.qty} × ${productName(item.slug, language, item.name)} (${item.size}/${colorLabel(item.color, language)})`,
        )
        .join(", "),
    [items, language],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (paymentMethod === "stripe") {
      router.push("/checkout/payment");
      return;
    }
    setPending(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        currency,
        city,
        paymentMethod,
        customer: {
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          city,
          country: city === "International" ? String(data.get("country") || "International") : "Afghanistan",
          address: String(data.get("address") || ""),
          notes: String(data.get("notes") || ""),
        },
      }),
    });
    setPending(false);
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      toast.error(body.error || t("couldNotPlace"));
      return;
    }
    const order = (await res.json()) as { id: string };
    clear();
    router.push(`/checkout/confirmation?order=${order.id}`);
  }

  if (!mounted) {
    return <div className="min-h-64" aria-hidden />;
  }
  if (empty) return null;

  return (
    <div>
      <CheckoutIdentity />
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input id="name" name="name" required className="h-11 rounded-none" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={identifier?.includes("@") ? identifier : ""}
              className="h-11 rounded-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{t("phoneWhatsApp")}</Label>
            <Input id="phone" name="phone" required className="h-11 rounded-none" />
          </div>
          <div className="grid gap-2">
            <Label>{t("cityZone")}</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((entry) => (
                  <SelectItem key={entry} value={entry}>
                    {cityLabel(entry, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {city === "International" ? (
            <div className="grid gap-2">
              <Label htmlFor="country">{t("country")}</Label>
              <Input id="country" name="country" className="h-11 rounded-none" />
            </div>
          ) : null}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Textarea id="address" name="address" required className="rounded-none" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea id="notes" name="notes" className="rounded-none" placeholder={t("notesPlaceholder")} />
          </div>
        </div>

        <fieldset>
          <legend className="text-[11px] tracking-[0.22em] uppercase">{t("payment")}</legend>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="mt-4 grid gap-3"
          >
            <label className="flex items-start gap-3 border border-border p-4">
              <RadioGroupItem value="cod" />
              <span>
                <span className="block text-sm">{t("payOnDelivery")}</span>
                <span className="text-xs text-muted-foreground">{t("payOnDeliveryHint")}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 border border-border p-4">
              <RadioGroupItem value="transfer" />
              <span>
                <span className="block text-sm">{t("bankTransfer")}</span>
                <span className="text-xs text-muted-foreground">{t("bankTransferHint")}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 border border-border p-4">
              <RadioGroupItem value="stripe" />
              <span>
                <span className="block text-sm">{t("cardStripe")}</span>
                <span className="text-xs text-muted-foreground">{t("cardStripeHint")}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 border border-border p-4">
              <RadioGroupItem value="whatsapp" />
              <span>
                <span className="block text-sm">{t("whatsappOrder")}</span>
                <span className="text-xs text-muted-foreground">
                  {t("whatsappOrderHint")} {summary || t("yourPieces")}.
                </span>
              </span>
            </label>
          </RadioGroup>
        </fieldset>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <p className="kicker">{t("summary")}</p>
        <ul className="mt-4 space-y-3 text-sm">
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
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <p className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </p>
          <p className="flex justify-between">
            <span>{t("shipping")}</span>
            <span>{shipping === 0 ? t("complimentaryKabul") : formatMoney(shipping, currency)}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>{t("total")}</span>
            <span>{formatMoney(total, currency)}</span>
          </p>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="mt-6 h-12 w-full rounded-none text-[11px] tracking-[0.28em] uppercase"
        >
          {pending ? t("placing") : t("placeOrder")}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          {t("questionsBeforePay")} {site.whatsappDisplay}.
        </p>
      </aside>
    </form>
    </div>
  );
}
