"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CopyKey } from "@/lib/i18n";

const links: { href: string; key: CopyKey }[] = [
  { href: "/account", key: "overview" },
  { href: "/account/orders", key: "orders" },
  { href: "/account/addresses", key: "addresses" },
  { href: "/account/settings", key: "settings" },
];

export function AccountFrame({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, identifier, setIdentifier } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/customer-logout", { method: "POST" });
    setIdentifier(null);
    toast.message(t("signedOut"));
    router.push("/account/login");
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <p className="kicker">{t("account")}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("signIn")}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t("guestMayCheckout")}</p>
        <Button asChild className="mt-8 h-12 rounded-none uppercase tracking-[0.18em]">
          <Link href={`/account/login?redirect=${encodeURIComponent(pathname || "/account")}`}>
            {t("continueToSignIn")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">{t("account")}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{identifier}</h1>
      <nav className="mt-8 flex flex-wrap gap-4 text-[12px] font-semibold tracking-[0.16em] uppercase">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "text-foreground" : "text-muted-foreground"}
          >
            {t(link.key)}
          </Link>
        ))}
        <button type="button" onClick={signOut} className="text-muted-foreground">
          {t("signOut")}
        </button>
      </nav>
      <div className="mt-10">{children}</div>
    </div>
  );
}
