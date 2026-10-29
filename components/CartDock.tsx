"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { CartIcon } from "@/components/HouseIcons";
import { CartDrawer } from "@/components/CartDrawer";

export function CartDock() {
  const { count } = useCart();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/checkout") || pathname === "/cart") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        data-cart-dock
        className="fixed top-[4.75rem] end-3 z-30 flex size-12 items-center justify-center bg-transparent sm:top-[5.25rem] sm:end-6"
        aria-label={`${t("bag")}, ${count}`}
        onClick={() => setOpen(true)}
      >
        <CartIcon className="size-7" />
        {count > 0 ? (
          <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-semibold text-background">
            {count}
          </span>
        ) : null}
      </button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
