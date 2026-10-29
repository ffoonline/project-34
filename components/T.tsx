"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";

export function T({ k }: { k: CopyKey }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}
