import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductConfigure } from "@/components/ProductConfigure";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";
import { RelatedHeading } from "@/components/ShopHeading";
import { getProductBySlug, listProducts } from "@/lib/store";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Piece not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = (await listProducts())
    .filter((entry) => entry.category === product.category && entry.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <ProductConfigure product={product} />
      {related.length > 0 ? (
        <section className="mt-24">
          <RelatedHeading category={product.category} />
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
            {related.map((entry) => (
              <ProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </section>
      ) : null}
      <ReviewsSection productId={product.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images,
            brand: site.name,
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.price,
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </div>
  );
}
