import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmbeddedCheckoutDesk } from "@/components/EmbeddedCheckoutDesk";
import { getProductById, getProductBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const { productId } = await params;
  const product = (await getProductById(productId)) ?? (await getProductBySlug(productId));
  return {
    title: product ? `Card — ${product.name}` : "Card",
    description: "Embedded Stripe Checkout priced from the catalogue.",
  };
}

export default async function EmbeddedPayPage({ params }: Ctx) {
  const { productId } = await params;
  const product = (await getProductById(productId)) ?? (await getProductBySlug(productId));
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="kicker">Checkout</p>
      <h1 className="font-heading mt-3 text-6xl">{product.name}</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Card desk for this piece. The amount is taken from the rail, not the browser.
        Pay on delivery remains on the bag checkout.
      </p>
      <EmbeddedCheckoutDesk productId={product.id} />
      <p className="mt-8 text-sm">
        <Link href={`/products/${product.slug}`} className="underline">
          Back to the piece
        </Link>
      </p>
    </div>
  );
}
