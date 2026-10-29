import type { LangCode } from "./i18n";
import { isLangCode } from "./i18n";

export type Triple = Record<LangCode, string>;

export function langOf(value: string): LangCode {
  return isLangCode(value) ? value : "en";
}

export function tr(pack: Triple, lang: string) {
  return pack[langOf(lang)] ?? pack.en;
}
