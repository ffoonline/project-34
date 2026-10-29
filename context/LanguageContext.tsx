"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { isRtlLang, isLangCode, translate, type CopyKey } from "@/lib/i18n";

const STORAGE_KEY = "tf-lang";
let memory: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function applyDocumentLang(code: string) {
  if (typeof document === "undefined") return;
  const rtl = isRtlLang(code);
  document.documentElement.lang = code === "en" ? "en" : code;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.documentElement.setAttribute("data-lang", code);
  document.cookie = `tf-lang=${encodeURIComponent(code)};path=/;max-age=31536000;samesite=lax`;
}

function isEnabledLanguage(code: string) {
  return site.languages.some((item) => item.code === code && item.enabled);
}

function read() {
  if (memory) return memory;
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) || "en";
  if (isLangCode(stored) && isEnabledLanguage(stored)) {
    memory = stored;
  } else {
    memory = "en";
    window.localStorage.setItem(STORAGE_KEY, "en");
  }
  return memory;
}

function write(code: string) {
  if (!isLangCode(code) || !isEnabledLanguage(code)) return;
  memory = code;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, code);
    applyDocumentLang(code);
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type LanguageContextValue = {
  language: string;
  setLanguage: (code: string) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, read, () => "en");

  useEffect(() => {
    applyDocumentLang(language);
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage: write }),
    [language],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  const current = site.languages.find((row) => row.code === ctx.language) ?? site.languages[0];
  const t = (key: CopyKey) => translate(ctx.language, key);
  const rtl = isRtlLang(ctx.language);
  return { ...ctx, current, t, rtl, dir: rtl ? "rtl" : "ltr" };
}
