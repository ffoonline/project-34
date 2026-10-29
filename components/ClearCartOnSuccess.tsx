"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export function ClearCartOnSuccess({ allowed }: { allowed: boolean }) {
  const { clear, items } = useCart();

  useEffect(() => {
    if (allowed && items.length > 0) {
      clear();
    }
  }, [allowed, clear, items.length]);

  return null;
}
