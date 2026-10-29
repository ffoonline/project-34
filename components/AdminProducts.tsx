"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";

export function AdminProducts({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    if (!res.ok) {
      setError("Could not load products.");
      setLoading(false);
      return;
    }
    setProducts((await res.json()) as Product[]);
    setError("");
    setLoading(false);
  }

  return (
    <div className="grid gap-12">
      <section>
        <h2 className="font-heading text-3xl">Add a cut</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Photos, prices, sizes, colours, stock, and collections — no code required.
        </p>
        <div className="mt-6 max-w-3xl border border-border bg-card p-6">
          <ProductForm onSaved={load} />
        </div>
      </section>
      <section>
        <h2 className="font-heading text-3xl">Current rail</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading the rail…</p>
        ) : error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <ProductTable products={products} onChange={load} />
          </div>
        )}
      </section>
    </div>
  );
}
