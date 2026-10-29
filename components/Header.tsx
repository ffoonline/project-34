"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { site } from "@/lib/site";
import type { CopyKey } from "@/lib/i18n";
import type { CurrencyCode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchOverlay } from "@/components/SearchOverlay";

const nav: { href: string; key: CopyKey }[] = [
  { href: "/shop?sort=new", key: "newArrivals" },
  { href: "/shop/men", key: "men" },
  { href: "/shop/women", key: "women" },
  { href: "/shop/kids", key: "kids" },
  { href: "/shop/fragrance", key: "fragrance" },
  { href: "/shop/beauty", key: "beauty" },
  { href: "/shop/accessories", key: "accessories" },
];

const iconBtn = "size-10 sm:size-11 [&_svg]:size-[18px]";

function TwoLineMenu() {
  return (
    <span className="flex h-6 w-7 flex-col justify-center gap-[7px]" aria-hidden>
      <span className="block h-px w-full bg-current" />
      <span className="block h-px w-full bg-current" />
    </span>
  );
}

export function Header({ saleEnabled = true }: { saleEnabled?: boolean }) {
  const { ids } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isLoggedIn } = useAuth();
  const { t, rtl, setLanguage, language } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const night = resolvedTheme === "dark" || theme === "dark";

  const onHome = pathname === "/";
  const overlay = onHome && !scrolled;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-hero-overlay", overlay);
    return () => document.documentElement.removeAttribute("data-hero-overlay");
  }, [overlay]);

  const wordmark = (
    <Link
      href="/"
      className="wordmark font-heading whitespace-nowrap text-[15px] font-medium tracking-[0.28em] uppercase sm:text-base sm:tracking-[0.36em]"
      aria-label={t("thirtyFourHome")}
    >
      THIRTY FOUR
    </Link>
  );

  return (
    <header
      data-site-header
      data-overlay={overlay ? "true" : undefined}
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        overlay ? "bg-transparent text-[#f7f4ef]" : "bg-background text-foreground",
        scrolled && !overlay && "border-b border-border/70",
      )}
    >
      <div className="mx-auto flex h-[3.75rem] max-w-[1440px] items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("size-11 shrink-0", overlay && "hover:bg-white/10 hover:text-[#f7f4ef]")}
                aria-label={t("openMenu")}
                aria-expanded={menuOpen}
              >
                <TwoLineMenu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={rtl ? "right" : "left"}
              className="w-full gap-0 bg-background p-0 sm:max-w-sm"
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <SheetHeader className="flex-row items-center gap-2 px-3 py-3 pr-12">
                <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
                <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                  <Logo size={36} className="h-9 w-9 shrink-0" />
                  <span className="font-heading text-sm tracking-[0.22em] uppercase">THIRTY FOUR</span>
                </Link>
                <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                  <SelectTrigger size="sm" className="ms-auto h-8 w-[4.5rem] shrink-0 bg-transparent" aria-label={t("currencyLabel")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {site.currencies.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SheetHeader>

              <nav className="mt-6 flex flex-1 flex-col gap-5 overflow-y-auto px-6 pb-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-3xl tracking-[-0.03em]"
                    aria-current={pathname.startsWith(item.href.split("?")[0]) ? "page" : undefined}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                {saleEnabled ? (
                  <Link href="/shop/sale" onClick={() => setMenuOpen(false)} className="font-heading text-3xl text-oxblood">
                    {t("sale")}
                  </Link>
                ) : null}
                <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
                  <Link href="/journal" onClick={() => setMenuOpen(false)}>
                    {t("journal")}
                  </Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)}>
                    {t("about")}
                  </Link>
                  <Link href="/contact" onClick={() => setMenuOpen(false)}>
                    {t("contact")}
                  </Link>
                  <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
                    {t("wishlist")}
                  </Link>
                  <Link href="/cart" onClick={() => setMenuOpen(false)}>
                    {t("bag")}
                  </Link>
                </div>
                <div className="mt-8 border-t border-border pt-6">
                  <p className="kicker">{t("language")}</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {site.languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        disabled={!item.enabled}
                        onClick={() => setLanguage(item.code)}
                        className={
                          language === item.code
                            ? "flex items-center gap-3 text-start text-foreground"
                            : "flex items-center gap-3 text-start text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        }
                      >
                        <span>
                          <span className="block text-base">{item.display}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.enabled ? item.label : "Coming soon"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>

              <SheetFooter className="mt-auto flex flex-col gap-2 p-4 pb-8">
                {isLoggedIn ? (
                  <Button asChild className="h-12 w-full text-[12px] tracking-[0.16em] uppercase">
                    <Link href="/account" onClick={() => setMenuOpen(false)}>
                      {t("account")}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild className="h-12 w-full text-[12px] tracking-[0.16em] uppercase">
                      <Link href="/account/login" onClick={() => setMenuOpen(false)}>
                        {t("login")}
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="h-12 w-full text-[12px] tracking-[0.16em] uppercase">
                      <Link href="/account/signup" onClick={() => setMenuOpen(false)}>
                        {t("signUp")}
                      </Link>
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {wordmark}
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors",
                overlay
                  ? "text-[#f7f4ef]/70 hover:text-[#f7f4ef]"
                  : pathname.startsWith(item.href.split("?")[0]) && item.href !== "/shop?sort=new"
                    ? "text-foreground"
                    : "text-foreground/55 hover:text-foreground",
              )}
              aria-current={
                pathname.startsWith(item.href.split("?")[0]) && item.href !== "/shop?sort=new"
                  ? "page"
                  : undefined
              }
            >
              {t(item.key)}
            </Link>
          ))}
          {saleEnabled ? (
            <Link
              href="/shop/sale"
              className={cn(
                "text-[11px] font-semibold tracking-[0.18em] uppercase",
                overlay ? "text-[#e8d2c8]" : "text-oxblood",
              )}
            >
              {t("sale")}
            </Link>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconBtn, overlay && "hover:bg-white/10 hover:text-[#f7f4ef]")}
            aria-label={t("searchTheHouse")}
            onClick={() => setSearchOpen(true)}
          >
            <Search strokeWidth={1.6} />
          </Button>
          <LanguageSwitcher compact align="end" invert={overlay} />
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconBtn, overlay && "hover:bg-white/10 hover:text-[#f7f4ef]")}
            aria-label={night ? t("lightTheme") : t("darkTheme")}
            onClick={() => setTheme(night ? "light" : "dark")}
          >
            <Sun className="size-[18px] dark:hidden" strokeWidth={1.6} />
            <Moon className="hidden size-[18px] dark:block" strokeWidth={1.6} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(iconBtn, "relative hidden lg:inline-flex", overlay && "hover:bg-white/10 hover:text-[#f7f4ef]")}
            asChild
          >
            <Link href="/wishlist" aria-label={t("wishlist")}>
              <Heart className="size-[18px]" strokeWidth={1.6} />
              {ids.length > 0 ? (
                <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-current" />
              ) : null}
            </Link>
          </Button>
        </div>
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
