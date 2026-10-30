"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Heart, Mail, ShoppingBag } from "lucide-react";
import { useTheme } from "next-themes";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { site } from "@/lib/site";
import type { CopyKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/HouseIcons";

const nav: { href: string; key: CopyKey }[] = [
  { href: "/shop?sort=new", key: "newArrivals" },
  { href: "/shop/men", key: "men" },
  { href: "/shop/women", key: "women" },
  { href: "/shop/kids", key: "kids" },
  { href: "/shop/accessories", key: "handcraft" },
  { href: "/shop/fragrance", key: "beauties" },
];
const menuLanguages = [
  { code: "en", label: "ENG" },
  { code: "fa-AF", label: "فارسی" },
  { code: "ps", label: "پشتو" },
] as const;
const iconBtn = "size-10 sm:size-11 [&_svg]:size-[18px]";
function TwoLineMenu() {
  return <span className="flex h-6 w-7 flex-col justify-center gap-[7px]" aria-hidden><span className="block h-px w-full bg-current" /><span className="block h-px w-full bg-current" /></span>;
}
function linkIsActive(href: string, pathname: string) {
  const path = href.split("?")[0];
  return path === "/shop" && href.includes("sort=new") ? pathname === "/shop" : pathname === path || (path !== "/shop" && pathname.startsWith(`${path}/`));
}
export function Header(_props: { saleEnabled?: boolean }) {
  void _props;
  const { ids } = useWishlist();
  const { count } = useCart();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, rtl, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
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
  const brand = (
    <Link href="/" className="header-brand" aria-label={t("thirtyFourHome")}>
      <Logo invert={overlay || night} size={38} priority={onHome} className="header-brand__logo" />
      <span>THIRTY FOUR</span>
    </Link>
  );
  return (
    <header data-site-header data-overlay={overlay ? "true" : undefined} className={cn("sticky top-0 z-40 transition-colors duration-300", overlay ? "bg-transparent text-white" : "bg-background text-foreground", scrolled && !overlay && "border-b border-border/70")}>
      <div className="mx-auto grid h-[3.75rem] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-1 px-3 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("size-11 shrink-0", overlay && "hover:bg-white/10 hover:text-white")} aria-label={t("openMenu")} aria-expanded={menuOpen}><TwoLineMenu /></Button>
            </SheetTrigger>
            <SheetContent side={rtl ? "right" : "left"} className="w-full gap-0 overflow-y-auto bg-background p-0 sm:max-w-sm" onCloseAutoFocus={(event) => event.preventDefault()}>
              <SheetHeader className="items-center gap-0 px-5 pb-4 pt-7">
                <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
                <Link href="/" className="flex flex-col items-center gap-1" onClick={() => setMenuOpen(false)}>
                  <Logo invert={night} size={52} className="size-11" />
                  <span className="font-heading text-xl font-semibold tracking-[0.15em] uppercase">THIRTY FOUR</span>
                </Link>
                <div role="group" aria-label={t("language")} className="mt-4 flex w-full gap-2">
                  {menuLanguages.map((item) => (
                    <Button key={item.code} type="button" variant={language === item.code ? "default" : "outline"} aria-pressed={language === item.code} lang={item.code} onClick={() => setLanguage(item.code)} className="h-10 flex-1 rounded-md px-2 text-sm">{item.label}</Button>
                  ))}
                </div>
              </SheetHeader>
              <nav aria-label={t("menu")} className="mt-2 flex flex-col px-6">
                {nav.map((item) => {
                  const active = linkIsActive(item.href, pathname);
                  return <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)} className="header-menu-link" aria-current={active ? "page" : undefined}><span>{t(item.key)}</span><ArrowRight aria-hidden className="header-menu-link__arrow" size={15} strokeWidth={1.5} /></Link>;
                })}
              </nav>
              <div className="mx-6 mt-7 grid grid-cols-2 gap-2">
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="header-contact-link"><WhatsAppIcon className="size-4" />WhatsApp</a>
                <a href={`mailto:${site.email}`} className="header-contact-link"><Mail aria-hidden size={16} strokeWidth={1.6} />{t("email")}</a>
              </div>
              <div className="mx-6 mt-7 border-t border-border pt-5">
                <p className="kicker">{t("settings")}</p>
                <div className="menu-theme-buttons mt-3 grid grid-cols-3 gap-2">
                  <Button type="button" variant={theme === "light" ? "default" : "outline"} aria-label={t("lightTheme")} aria-pressed={theme === "light"} onClick={() => setTheme("light")} className="h-auto min-h-11 min-w-0 flex-1 break-words whitespace-normal rounded-md px-1 py-2 text-center text-[10px] leading-tight">{t("lightTheme")}</Button>
                  <Button type="button" variant={theme === "dark" ? "default" : "outline"} aria-label={t("darkTheme")} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} className="h-auto min-h-11 min-w-0 flex-1 break-words whitespace-normal rounded-md px-1 py-2 text-center text-[10px] leading-tight">{t("darkTheme")}</Button>
                  <Button type="button" variant={theme === "custom" ? "default" : "outline"} aria-label={t("customTheme")} aria-pressed={theme === "custom"} onClick={() => setTheme("custom")} className="h-auto min-h-11 min-w-0 flex-1 break-words whitespace-normal rounded-md px-1 py-2 text-center text-[10px] leading-tight">{t("customTheme")}</Button>
                </div>
              </div>
              <SheetFooter className="mt-7 p-6 pt-0">
                <Button asChild className="h-12 w-full rounded-[0.9rem] text-[11px] tracking-[0.16em] uppercase"><Link href="/shop" onClick={() => setMenuOpen(false)}>{t("enterTheHouse")}<ArrowRight aria-hidden className="ms-2 size-4" /></Link></Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        {brand}
        <div className="flex shrink-0 items-center justify-end gap-0.5">
          <Button variant="ghost" size="icon" className={cn(iconBtn, "relative hidden lg:inline-flex", overlay && "hover:bg-white/10 hover:text-white")} asChild>
            <Link href="/wishlist" aria-label={t("wishlist")}><Heart strokeWidth={1.6} />{ids.length > 0 ? <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-current" /> : null}</Link>
          </Button>
          <Button variant="ghost" size="icon" className={cn(iconBtn, "relative", overlay && "hover:bg-white/10 hover:text-white")} asChild>
            <Link href="/cart" aria-label={`${t("bag")}${count > 0 ? `, ${count}` : ""}`}><ShoppingBag strokeWidth={1.6} style={{ width: 21, height: 21 }} />{count > 0 ? <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background">{count > 9 ? "9+" : count}</span> : null}</Link>
          </Button>
        </div>
      </div>
      <nav aria-label={t("collections")} className="header-category-row mx-auto hidden max-w-[1440px] items-center justify-center gap-4 px-6 pb-3 lg:flex xl:gap-5">
        {nav.map((item) => {
          const active = linkIsActive(item.href, pathname);
          return <Link key={item.key} href={item.href} className="header-category-link" aria-current={active ? "page" : undefined}><span>{t(item.key)}</span><ArrowRight aria-hidden className="header-category-link__arrow" size={12} strokeWidth={1.6} /></Link>;
        })}
      </nav>
    </header>
  );
}
