"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "tf-cart";
const empty: CartItem[] = [];
let memory: CartItem[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function read(): CartItem[] {
  if (memory) return memory;
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    memory = [];
  }
  return memory;
}

function write(next: CartItem[]) {
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function sameLine(a: CartItem, productId: string, size: string, color: string) {
  return a.productId === productId && a.size === size && a.color === color;
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  remove: (productId: string, size: string, color: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, read, () => empty);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return {
      items,
      count,
      subtotal,
      addItem(item, qty = 1) {
        const current = read();
        const index = current.findIndex((row) =>
          sameLine(row, item.productId, item.size, item.color),
        );
        if (index === -1) write([...current, { ...item, qty }]);
        else
          write(
            current.map((row, i) =>
              i === index ? { ...row, qty: row.qty + qty } : row,
            ),
          );
      },
      setQty(productId, size, color, qty) {
        const current = read();
        write(
          qty <= 0
            ? current.filter((row) => !sameLine(row, productId, size, color))
            : current.map((row) =>
                sameLine(row, productId, size, color) ? { ...row, qty } : row,
              ),
        );
      },
      remove(productId, size, color) {
        write(read().filter((row) => !sameLine(row, productId, size, color)));
      },
      clear() {
        write([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
