"use client";

import Image from "next/image";
import Link from "next/link";
import { lookbook } from "@/lib/catalog";

const features = [
  {
    id: "fragrance",
    href: "/shop/fragrance",
    kicker: "FRAGRANCE",
    title: "THIRTY FOUR Fragrance",
    action: "Discover the collection",
    image: lookbook.fragrance,
    alt: "Unbranded fragrance bottle placeholder",
  },
  {
    id: "beauty",
    href: "/shop/beauty",
    kicker: "BEAUTY",
    title: "The vanity",
    action: "Discover the collection",
    image: lookbook.beauty,
    alt: "Unbranded beauty still-life placeholder",
  },
  {
    id: "accessories",
    href: "/shop/accessories",
    kicker: "ACCESSORIES",
    title: "Carried with character.",
    action: "Discover accessories",
    image: lookbook.accessories,
    alt: "Unbranded black leather tote placeholder",
  },
] as const;

export function LineStories() {
  return (
    <div>
      {features.map((feature, index) => (
        <section key={feature.id} className="house-section pt-0" aria-labelledby={`${feature.id}-heading`}>
          <div className="house-wrap grid items-center gap-8 sm:px-6 md:grid-cols-2 md:gap-14">
            <Link
              href={feature.href}
              className={`group relative block aspect-[4/5] overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${
                index % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={feature.image}
                alt={feature.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>
            <div className={index % 2 === 1 ? "md:order-1" : ""}>
              <p className="kicker">{feature.kicker}</p>
              <h2 id={`${feature.id}-heading`} className="mt-3 max-w-[12ch] text-4xl sm:text-5xl">
                {feature.title}
              </h2>
              <Link href={feature.href} className="text-link mt-7">
                {feature.action}
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
