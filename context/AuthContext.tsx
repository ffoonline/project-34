"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const GUEST_KEY = "tf-guest";
const listeners = new Set<() => void>();

function emitGuest() {
  listeners.forEach((listener) => listener());
}

function readGuest() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(GUEST_KEY) === "1";
}

function writeGuest() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(GUEST_KEY, "1");
  emitGuest();
}

function subscribeGuest(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type AuthContextValue = {
  identifier: string | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  ready: boolean;
  continueAsGuest: () => void;
  setIdentifier: (value: string | null) => void;
  refreshIdentifier: (value: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialIdentifier,
}: {
  children: React.ReactNode;
  initialIdentifier: string | null;
}) {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [serverIdentifier, setServerIdentifier] = useState(initialIdentifier);
  if (initialIdentifier !== serverIdentifier) {
    setServerIdentifier(initialIdentifier);
    setIdentifier(initialIdentifier);
  }
  const isGuest = useSyncExternalStore(subscribeGuest, readGuest, () => false);

  const continueAsGuest = useCallback(() => {
    writeGuest();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      identifier,
      isLoggedIn: Boolean(identifier),
      isGuest,
      ready: true,
      continueAsGuest,
      setIdentifier,
      refreshIdentifier: setIdentifier,
    }),
    [identifier, isGuest, continueAsGuest],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
