import type { Product } from "./types";

export const houseCollections = [
  {
    slug: "new-season",
    title: "New Season",
    kicker: "On the rail",
    story: "The current cut. Nothing held back for a louder month.",
    image: "/catalog/rf34-check-jacket.jpg",
    match: (product: Product) => product.newArrival || product.collection === "atelier",
  },
  {
    slug: "essentials",
    title: "Essentials",
    kicker: "The house shirt",
    story: "Pieces we recut without a campaign.",
    image: "/catalog/men-tees-rail.jpg",
    match: (product: Product) => product.collection === "essentials",
  },
  {
    slug: "signature",
    title: "Fragrance Edit",
    kicker: "Signature",
    story: "Two scents. The rest of the cabinet can wait.",
    image: "/catalog/signature-34.jpg",
    match: (product: Product) => product.collection === "signature",
  },
  {
    slug: "little-34",
    title: "Little 34",
    kicker: "Kids",
    story: "Grown cloth, honest shoulders, a hidden centimetre in the hem.",
    image: "/catalog/kids-rail.jpg",
    match: (product: Product) => product.collection === "little-34",
  },
];
