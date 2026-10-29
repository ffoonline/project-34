import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { PieceCount, ShopHeading, ShopHeroImage, ShopLede, ShopSubNav } from "@/components/ShopHeading";
import { T } from "@/components/T";
import { listProducts } from "@/lib/store";
import { filterProducts, type ProductQuery } from "@/lib/filter-products";
import { categoryDescKey, type CopyKey } from "@/lib/i18n";
import { subcategories } from "@/lib/site";

export async function ShopView({
  title,
  titleKey,
  description,
  descriptionKey,
  query,
  line,
  image,
}: {
  title?: string;
  titleKey?: CopyKey;
  description?: string;
  descriptionKey?: CopyKey;
  query: ProductQuery;
  line?: string;
  image?: string;
}) {
  const products = filterProducts(await listProducts(), query);
  const subs = line && line in subcategories ? subcategories[line] : [];
  const activeSub = query.subcategory;
  const ledeKey = descriptionKey ?? (line ? categoryDescKey(line) : undefined);

  return (
    <div>
      {image ? (
        <section className="shop-line">
          <div className="shop-line__media">
            <ShopHeroImage src={image} line={line} title={title} />
          </div>
          <div className="shop-line__veil" aria-hidden />
          <div className="shop-line__content">
            <p className="kicker">
              <T k="shop" />
            </p>
            <h1>
              <ShopHeading line={line} title={title} titleKey={titleKey} subcategory={activeSub} />
            </h1>
            <ShopLede k={ledeKey} className="shop-line__lede" />
            {!ledeKey && description ? <p className="shop-line__lede">{description}</p> : null}
          </div>
        </section>
      ) : (
        <div className="house-wrap pt-[clamp(4.5rem,9vw,8rem)] sm:px-6">
          <p className="kicker">
            <T k="shop" />
          </p>
          <h1 className="mt-3 text-5xl md:text-6xl">
            <ShopHeading line={line} title={title} titleKey={titleKey} subcategory={activeSub} />
          </h1>
          <ShopLede k={ledeKey} className="mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground" />
          {!ledeKey && description ? (
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground">{description}</p>
          ) : null}
        </div>
      )}

      <div className="house-wrap pb-[clamp(4.5rem,9vw,8rem)] sm:px-6">
        <p className="mt-10 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          <PieceCount count={products.length} />
        </p>
        {subs.length > 0 && line ? (
          <ShopSubNav line={line} subs={subs} activeSub={activeSub} />
        ) : null}
        <div className="mt-10">
          <Suspense fallback={<div className="h-20 bg-muted/40" />}>
            <ProductFilters line={line} />
          </Suspense>
        </div>
        {products.length === 0 ? (
          <p className="mt-16 py-20 text-center text-sm text-muted-foreground">
            <T k="nothingOnThisRail" />
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
