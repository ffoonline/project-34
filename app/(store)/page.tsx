import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { HomeHero } from "@/components/HomeHero";
import { HomeStills } from "@/components/HomeStills";
import { BrandStory } from "@/components/BrandStory";
import { LineStories } from "@/components/LineStories";
import { Reveal } from "@/components/Reveal";
import { T } from "@/components/T";
import { listProducts } from "@/lib/store";
import { HomeJournalList } from "@/components/JournalViews";

export default async function HomePage() {
  const products = await listProducts();
  const arrivals = products.filter((product) => product.newArrival).slice(0, 8);

  return (
    <div>
      <HomeHero />

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
        <div className="house-wrap mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:px-6 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <HomeStills />
      <LineStories />
      <BrandStory />

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
    </div>
  );
}
