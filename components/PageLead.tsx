"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PageLead({
  kicker,
  title,
  body,
  className,
  kickerClassName,
  titleClassName,
  bodyClassName,
}: {
  kicker: CopyKey;
  title: CopyKey;
  body?: CopyKey;
  className?: string;
  kickerClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className={className}>
      <p className={cn("kicker", kickerClassName)}>{t(kicker)}</p>
      <h1 className={cn("mt-3 text-4xl font-semibold tracking-tight", titleClassName)}>{t(title)}</h1>
      {body ? (
        <p className={cn("mt-4 text-sm leading-7 text-muted-foreground", bodyClassName)}>{t(body)}</p>
      ) : null}
    </div>
  );
}
