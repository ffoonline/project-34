"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { CopyKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const frames: { src: string; href: string; title: CopyKey; className: string }[] = [
  { src: "/editorial/tfg-streetwear.jpg", href: "/shop/men", title: "galleryStreet", className: "md:col-span-2 md:row-span-2" },
  { src: "/editorial/afghan-heritage.jpg", href: "/shop/accessories", title: "galleryHeritage", className: "" },
  { src: "/editorial/beauty-ritual.jpg", href: "/shop/fragrance", title: "galleryBeauty", className: "" },
  { src: "/editorial/street-rail.jpg", href: "/shop?sort=new", title: "galleryRail", className: "" },
  { src: "/editorial/house-collection.jpg", href: "/shop", title: "galleryCollection", className: "" },
  { src: "/editorial/house-essentials.jpg", href: "/shop", title: "galleryEssentials", className: "" },
];

export function HouseGallery() {
  const { t } = useLanguage();

  return (
    <section className="house-section border-t border-border">
      <div className="house-wrap sm:px-6">
        <div className="mb-8">
          <p className="kicker">{t("houseGalleryKicker")}</p>
          <h2 className="mt-3 max-w-[14ch] text-4xl sm:text-5xl">{t("houseGalleryTitle")}</h2>
        </div>
        <div className="grid auto-rows-[minmax(14rem,1fr)] gap-px bg-border sm:grid-cols-2 md:grid-cols-4">
          {frames.map((frame) => (
            <Link key={frame.src} href={frame.href} className={cn("group relative overflow-hidden bg-muted", frame.className)}>
              <Image
                src={frame.src}
                alt={t(frame.title)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden />
              <span className="absolute inset-x-0 bottom-0 p-5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase">
                {t(frame.title)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
