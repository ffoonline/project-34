"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { CurrencyCode } from "@/lib/types";
import { site } from "@/lib/site";

const STORAGE_KEY = "tf-currency";
let memory: CurrencyCode | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function read(): CurrencyCode {
  if (memory) return memory;
  if (typeof window === "undefined") return site.defaultCurrency;
  const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
  memory =
    stored && site.currencies.includes(stored) ? stored : site.defaultCurrency;
  return memory;
}

function write(code: CurrencyCode) {
  memory = code;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, code);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(subscribe, read, () => site.defaultCurrency);
  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency: write }),
    [currency],
  );
  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
