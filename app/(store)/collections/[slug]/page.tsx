import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { houseCollections } from "@/lib/collections";
import { listProducts } from "@/lib/store";

export async function generateStaticParams() {
  return houseCollections.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = houseCollections.find((entry) => entry.slug === slug);
  return { title: collection?.title ?? "Collection" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = houseCollections.find((entry) => entry.slug === slug);
  if (!collection) notFound();
  const products = (await listProducts()).filter(collection.match);

  return <CollectionView slug={slug} image={collection.image} products={products} />;
}
