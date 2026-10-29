import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { lookbook } from "@/lib/catalog";
import { categories, categoryLabel } from "@/lib/site";

type Params = { line: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { line } = await params;
  if (line === "sale") return { title: "Sale" };
  if (line === "all") return { title: "Shop" };
  return { title: categoryLabel(line) };
}

export default async function ShopLinePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ collection?: string; q?: string; sort?: string }>;
}) {
  const { line } = await params;
  const query = await searchParams;
  if (line === "all") {
    return <ShopView titleKey="allProducts" query={query} />;
  }
  if (line === "sale") {
    return <ShopView titleKey="sale" descriptionKey="saleDesc" query={{ ...query, sale: "1" }} />;
  }
  const meta = categories.find((item) => item.slug === line);
  if (!meta) notFound();
  return (
    <ShopView
      title={meta.label}
      query={{ ...query, category: line }}
      line={line}
      image={lookbook[line as keyof typeof lookbook]}
    />
  );
}
