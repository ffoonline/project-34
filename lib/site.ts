import type { Category, CurrencyCode } from "./types";

export const site = {
  name: "THIRTY FOUR",
  short: "34",
  house: "T.F.G",
  legal: "THIRTY FOUR GLOBAL",
  tagline: "Luxury is not about excess. It is about identity, detail, and experience.",
  description:
    "THIRTY FOUR is a modern luxury house for fashion, fragrance, and accessories — Men, Women, and Kids — designed for Afghanistan first and built to travel.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43134",
  email: "sales@thirtyfourglobal.com",
  ordersEmail: "sales@thirtyfourglobal.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "4915217251813",
  whatsappDisplay: "(+49) 1521 7251813",
  phoneDisplay: "(+49) 1521 7251813",
  address: "Atelier 34, Shahr-e-Naw, Kabul, Afghanistan",
  production: "https://www.thirtyfourglobal.com/",
  store: "https://www.thirty-four.store/",
  instagram: "https://www.instagram.com/thirtyfourglobal?rpxt=MTBqdmo2ZDE0YzZwNg==",
  tiktok: "https://www.tiktok.com/@thirtyfourglobal?_r=1&_t=ZS-9AiMf5rY7XO",
  facebook: "https://www.facebook.com/share/1GsmwCrmeY/",
  currencies: ["USD", "EUR", "GBP"] as CurrencyCode[],
  defaultCurrency: "USD" as CurrencyCode,
  rates: { USD: 1, EUR: 0.92, GBP: 0.79 } as Record<CurrencyCode, number>,
  shipping: {
    kabul: 0,
    afghanistan: 8,
    international: 38,
  },
  languages: [
    { code: "en", label: "English", native: "English", flag: "🇺🇸" },
    { code: "fa-AF", label: "Dari", native: "دری", flag: "🇦🇫" },
    { code: "ps", label: "Pashto", native: "پښتو", flag: "🇦🇫" },
  ],
};

export const categories: {
  slug: Category;
  label: string;
  kicker: string;
  description: string;
}[] = [
  {
    slug: "men",
    label: "Men",
    kicker: "THIRTY FOUR",
    description: "Coats, shirts, and trousers cut for a long life in the wardrobe.",
  },
  {
    slug: "women",
    label: "Women",
    kicker: "THIRTY FOUR",
    description: "The women’s house: line, cloth, and a quiet silhouette.",
  },
  {
    slug: "kids",
    label: "Kids",
    kicker: "THIRTY FOUR Kids",
    description: "The same cloth, scaled with room to grow.",
  },
  {
    slug: "fragrance",
    label: "Beauties",
    kicker: "Signature",
    description: "A small edit of scents. More rooms later, same house.",
  },
  {
    slug: "accessories",
    label: "Handcraft",
    kicker: "The extra",
    description: "Bags and objects that sit beside the cloth, not on top of it.",
  },
];

export const subcategories: Record<string, { slug: string; label: string }[]> = {
  men: [
    { slug: "tops", label: "Tops" },
    { slug: "bottoms", label: "Bottoms" },
    { slug: "outerwear", label: "Outerwear" },
  ],
  women: [
    { slug: "tops", label: "Tops" },
    { slug: "bottoms", label: "Bottoms" },
    { slug: "outerwear", label: "Outerwear" },
    { slug: "dresses", label: "Dresses" },
  ],
  kids: [
    { slug: "girls", label: "Girls" },
    { slug: "boys", label: "Boys" },
  ],
  fragrance: [{ slug: "signature", label: "Signature" }],
  accessories: [{ slug: "bags", label: "Bags" }],
};

export const collections = [
  { slug: "atelier", label: "Atelier" },
  { slug: "heritage", label: "Heritage" },
  { slug: "essentials", label: "Essentials" },
  { slug: "little-34", label: "Little 34" },
  { slug: "signature", label: "Signature" },
];

export const cities = [
  "Kabul",
  "Herat",
  "Mazar-i-Sharif",
  "Kandahar",
  "Jalalabad",
  "Other Afghanistan",
  "International",
];

export function categoryLabel(slug: string) {
  return categories.find((item) => item.slug === slug)?.label ?? slug;
}

export function whatsappLink(text: string) {
  const digits = site.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
