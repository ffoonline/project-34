"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-border bg-[#efe8dc] lg:min-h-screen lg:w-60 lg:border-r lg:border-b-0">
      <div className="px-5 py-6">
        <Logo size={56} className="h-14 w-14" />
        <p className="kicker mt-3">T.F.G34</p>
        <p className="font-heading mt-1 text-2xl">Atelier</p>
      </div>
      <nav className="flex gap-2 px-3 pb-4 lg:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 text-[11px] tracking-[0.18em] uppercase ${
              pathname === link.href ? "bg-foreground text-background" : "hover:bg-secondary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex gap-2 px-3 py-4">
        <Button variant="outline" className="rounded-none" asChild>
          <Link href="/">View house</Link>
        </Button>
        <Button variant="ghost" className="rounded-none" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
