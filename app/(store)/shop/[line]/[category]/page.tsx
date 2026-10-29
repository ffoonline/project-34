import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/ShopView";
import { lookbook } from "@/lib/catalog";
import { categories, subcategories } from "@/lib/site";

type Params = { line: string; category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { line, category } = await params;
  const sub = subcategories[line]?.find((item) => item.slug === category);
  return { title: sub ? `${sub.label} · ${line}` : "Shop" };
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ collection?: string; q?: string; sort?: string }>;
}) {
  const { line, category } = await params;
  const query = await searchParams;
  const meta = categories.find((item) => item.slug === line);
  const sub = subcategories[line]?.find((item) => item.slug === category);
  if (!meta || !sub) notFound();
  return (
    <ShopView
      title={`${meta.label} · ${sub.label}`}
      query={{ ...query, category: line, subcategory: category }}
      line={line}
      image={lookbook[line as keyof typeof lookbook]}
    />
  );
}
