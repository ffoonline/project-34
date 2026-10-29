"use client";

import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  initialIdentifier,
}: {
  children: React.ReactNode;
  initialIdentifier: string | null;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider initialIdentifier={initialIdentifier}>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
