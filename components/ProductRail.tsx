"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";

export function ProductRail({
  children,
  label,
  labelKey,
  className,
}: {
  children: ReactNode;
  label?: string;
  labelKey?: CopyKey;
  className?: string;
}) {
  const { t } = useLanguage();
  const railRef = useRef<HTMLDivElement>(null);
  const aria = labelKey ? t(labelKey) : label ?? "";

  useEffect(() => {
    const node = railRef.current;
    if (!node) return;

    function onWheel(event: WheelEvent) {
      if (!node) return;
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const horizontalIntent =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (horizontalIntent) {
        node.scrollLeft += event.deltaX !== 0 ? event.deltaX : event.deltaY;
        event.preventDefault();
        return;
      }
      window.scrollBy(0, event.deltaY);
      event.preventDefault();
    }

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={railRef}
      data-rail="new-arrivals"
      role="region"
      aria-label={aria}
      className={cn(
        "mx-auto mt-10 flex max-w-[1440px] snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-1 [touch-action:pan-x_pan-y] [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:snap-none md:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:block",
        className,
      )}
    >
      {children}
    </div>
  );
}
