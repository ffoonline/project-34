"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Demand, Product } from "@/lib/types";
import { categories, collections } from "@/lib/site";

const empty: Omit<Product, "id"> = {
  slug: "",
  name: "",
  category: "men",
  subcategory: "tops",
  collection: "atelier",
  price: 0,
  description: "",
  story: "",
  fabric: "",
  care: "",
  sizes: ["S", "M", "L"],
  colors: [{ name: "Ink", hex: "#1a1714" }],
  stock: 0,
  featured: false,
  newArrival: true,
  demand: "steady",
  images: [""],
};

export function ProductForm({
  initial,
  onSaved,
}: {
  initial?: Product;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    initial
      ? {
          ...initial,
        }
      : empty,
  );
  const [saving, setSaving] = useState(false);

  function patch<K extends keyof Omit<Product, "id">>(key: K, value: Omit<Product, "id">[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const url = initial ? `/api/products/${initial.id}` : "/api/products";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      toast.error(body.error || "Could not save product");
      return;
    }
    toast.success(initial ? "Product updated" : "Product added");
    if (!initial) setForm(empty);
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(event) => patch("name", event.target.value)}
            required
            className="rounded-none"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(event) => patch("slug", event.target.value)}
            placeholder="auto from name"
            className="rounded-none"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => patch("category", value as Product["category"])}
          >
            <SelectTrigger className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Collection</Label>
          <Select
            value={form.collection}
            onValueChange={(value) => patch("collection", value)}
          >
            <SelectTrigger className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.slug} value={collection.slug}>
                  {collection.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Demand</Label>
          <Select
            value={form.demand}
            onValueChange={(value) => patch("demand", value as Demand)}
          >
            <SelectTrigger className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="steady">Steady</SelectItem>
              <SelectItem value="limited">Limited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="price">Price USD</Label>
          <Input
            id="price"
            type="number"
            min={0.01}
            step="0.01"
            value={form.price}
            onChange={(event) => patch("price", Number(event.target.value))}
            className="rounded-none"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="compareAt">Compare at</Label>
          <Input
            id="compareAt"
            type="number"
            min={0}
            value={form.compareAt ?? ""}
            onChange={(event) =>
              patch(
                "compareAt",
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            className="rounded-none"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => patch("stock", Number(event.target.value))}
            className="rounded-none"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sizes">Sizes (comma)</Label>
        <Input
          id="sizes"
          value={form.sizes.join(", ")}
          onChange={(event) =>
            patch(
              "sizes",
              event.target.value.split(",").map((part) => part.trim()).filter(Boolean),
            )
          }
          className="rounded-none"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="colors">Colours as Name:#hex, Name:#hex</Label>
        <Input
          id="colors"
          value={form.colors.map((c) => `${c.name}:${c.hex}`).join(", ")}
          onChange={(event) =>
            patch(
              "colors",
              event.target.value
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean)
                .map((part) => {
                  const [name, hex] = part.split(":");
                  return { name: name.trim(), hex: (hex || "#16120f").trim() };
                }),
            )
          }
          className="rounded-none"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="images">Image URLs (one per line)</Label>
        <Textarea
          id="images"
          value={form.images.join("\n")}
          onChange={(event) => patch("images", event.target.value.split("\n"))}
          className="min-h-24 rounded-none"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(event) => patch("description", event.target.value)}
          className="min-h-24 rounded-none"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fabric">Fabric</Label>
          <Input
            id="fabric"
            value={form.fabric}
            onChange={(event) => patch("fabric", event.target.value)}
            className="rounded-none"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="care">Care</Label>
          <Input
            id="care"
            value={form.care}
            onChange={(event) => patch("care", event.target.value)}
            className="rounded-none"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="story">Story</Label>
        <Textarea
          id="story"
          value={form.story}
          onChange={(event) => patch("story", event.target.value)}
          className="rounded-none"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={form.featured}
            onCheckedChange={(checked) => patch("featured", Boolean(checked))}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={form.newArrival}
            onCheckedChange={(checked) => patch("newArrival", Boolean(checked))}
          />
          New arrival
        </label>
      </div>
      <Button type="submit" disabled={saving} className="h-11 rounded-none uppercase tracking-[0.22em]">
        {saving ? "Saving" : initial ? "Update product" : "Add product"}
      </Button>
    </form>
  );
}
