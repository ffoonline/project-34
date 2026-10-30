import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductRail";
import { HomeHero } from "@/components/HomeHero";
import { HomeStills } from "@/components/HomeStills";
import { BrandStory } from "@/components/BrandStory";
import { HouseGallery } from "@/components/HouseGallery";
import { LineStories } from "@/components/LineStories";
import { Reveal } from "@/components/Reveal";
import { T } from "@/components/T";
import { listProducts } from "@/lib/store";
import { HomeJournalList } from "@/components/JournalViews";
import { HomeSocial } from "@/components/HomeSocial";
import { HomeFaq } from "@/components/HomeFaq";
import { categories } from "@/lib/site";
import { lookbook } from "@/lib/catalog";
import Image from "next/image";

export default async function HomePage() {
  const products = await listProducts();
  const arrivals = products.filter((product) => product.newArrival).slice(0, 8);

  return (
    <div>
      <HomeHero />
      <HomeStills />

      <section className="house-section border-b border-border">
        <div className="house-wrap grid gap-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="kicker">The house / V2.0</p>
            <h2 className="mt-3 max-w-[11ch] text-4xl sm:text-5xl md:text-6xl">A considered wardrobe, cut in Kabul.</h2>
          </div>
          <p className="max-w-xl text-[15px] leading-8 text-muted-foreground lg:justify-self-end">
            THIRTY FOUR GLOBAL brings modern luxury into the everyday: strong lines, tactile cloth, and pieces designed to stay in rotation. Explore the house by line.
          </p>
        </div>
      </section>

      <section className="house-section pt-0">
        <div className="house-wrap sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="kicker">Shop the lines</p>
              <h2 className="mt-3 text-4xl sm:text-5xl">Find your cut.</h2>
            </div>
            <Link href="/shop" className="text-link shrink-0">View all pieces <span aria-hidden>→</span></Link>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-muted">
                <Image src={lookbook[category.slug as keyof typeof lookbook] ?? lookbook.atelier} alt={category.label} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[10px] tracking-[0.18em] uppercase opacity-75">{category.kicker}</p>
                  <h3 className="mt-2 text-3xl text-white">{category.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="house-section">
        <div className="house-wrap flex items-end justify-between gap-4 sm:px-6">
          <div className="min-w-0">
            <p className="kicker">
              <T k="newArrivals" />
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl">
              <T k="currentCut" />
            </h2>
          </div>
          <Link href="/shop?sort=new" className="text-link shrink-0">
            <T k="viewAll" />
          </Link>
        </div>
        <ProductRail labelKey="newArrivals">
          {arrivals.map((product) => (
            <div
              key={product.id}
              className="w-[min(78vw,20rem)] shrink-0 snap-start md:w-auto md:min-w-0"
            >
              <ProductCard product={product} align="center" />
            </div>
          ))}
        </ProductRail>
      </section>

      <LineStories />
      <HouseGallery />
      <BrandStory />
      <HomeSocial />

      <section className="house-section border-t border-border">
        <div className="house-wrap grid gap-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <p className="kicker">
              <T k="journal" />
            </p>
            <h2 className="mt-3 max-w-[10ch] text-4xl sm:text-5xl">
              <T k="notesFromTheTable" />
            </h2>
            <Link href="/journal" className="text-link mt-8">
              <T k="allNotes" />
            </Link>
          </Reveal>
          <HomeJournalList />
        </div>
      </section>
      <HomeFaq />
    </div>
  );
}
