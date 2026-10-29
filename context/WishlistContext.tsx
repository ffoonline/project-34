"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "tf-wishlist";
const empty: string[] = [];
let memory: string[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function read(): string[] {
  if (memory) return memory;
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    memory = [];
  }
  return memory;
}

function write(next: string[]) {
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

type WishlistContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, read, () => empty);
  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      has: (id) => read().includes(id),
      toggle: (id) => {
        const current = read();
        write(current.includes(id) ? current.filter((row) => row !== id) : [...current, id]);
      },
    }),
    [ids],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
