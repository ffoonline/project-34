"use client";

import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  align = "end",
  invert = false,
  compact = false,
}: {
  align?: "start" | "center" | "end";
  invert?: boolean;
  compact?: boolean;
}) {
  const { language, setLanguage, current, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            compact ? "h-10 min-w-10 px-2 sm:h-11" : "h-8 gap-1.5 px-2",
            invert &&
              "text-white hover:bg-white/10 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white",
          )}
          aria-label={`${t("language")}, ${current.label}`}
        >
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase">
            {current.display}
          </span>
          {compact ? null : <ChevronDown className="size-3 opacity-60" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-52 rounded-none p-1">
        <DropdownMenuLabel className="px-2 py-2 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          {t("language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {site.languages.map((item) => (
            <DropdownMenuRadioItem
              key={item.code}
              value={item.code}
              disabled={!item.enabled}
              className="rounded-none py-2.5 pr-8"
            >
              <span className="flex flex-col">
                <span className="text-sm">{item.display}</span>
                <span className="text-[11px] tracking-[0.12em] text-muted-foreground">
                  {item.enabled ? item.label : "Coming soon"}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
