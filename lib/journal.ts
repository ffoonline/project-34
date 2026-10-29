export const journal = [
  {
    slug: "the-number-not-the-season",
    title: "The number, not the season",
    kicker: "House notes",
    date: "12 March 2026",
    excerpt:
      "We do not name drops after months. Thirty Four is a number you can keep. Cloth should outlast the campaign that sold it.",
    readTime: "4 min",
    image: "/catalog/women-atelier.jpg",
    body: [
      "Fashion likes a calendar. We like a wardrobe that still works when the calendar has moved on. The house is called Thirty Four because a number does not expire, and because the first pattern block we kept — a coat, a shirt, a child’s hem — was marked 34 on the envelope.",
      "Kabul teaches patience. Dust, heat, a sudden cold. Cloth that only photographs well in a studio will fail on the street by Friday. So we cut with that Friday in mind: denser weaves, quieter colour, seams that can be let out once.",
      "When we add footwear, bags, fragrance, they will sit in the same number. Not a new brand, not a louder one. The same house, more rooms.",
    ],
  },
  {
    slug: "cloth-cut-for-kabul-light",
    title: "Cloth cut for Kabul light",
    kicker: "Atelier",
    date: "2 February 2026",
    excerpt:
      "Afternoon light here is pale and exacting. Ivory cannot be too yellow. Black cannot be cheap. We sample in the window, not under a ring light.",
    readTime: "5 min",
    image: "/catalog/rf34-check-jacket.jpg",
    body: [
      "The atelier window faces west. By four, the room is the colour of tea with too little milk. That is the light we trust. A camel coat that looks rich at noon can look dirty at four; we recut the dye lot until it does not.",
      "International sales will come. They should not require a different product — only a different shipping note. The cloth is already made to travel: unstructured jackets, silks that pack, children’s hems with a hidden centimetre.",
      "If you are reading this from London or Dubai, the same coat is on the rail. We will not invent a second Thirty Four for export.",
    ],
  },
  {
    slug: "how-we-size-little-34",
    title: "How we size Little 34",
    kicker: "Kids",
    date: "18 January 2026",
    excerpt:
      "Children grow in jumps. We hide fabric in the cuff and keep the shoulder honest, so a coat can last two winters without looking borrowed.",
    readTime: "3 min",
    image: "/catalog/kids-rail.jpg",
    body: [
      "Little 34 is not adult cloth shrunk on a photocopier. The shoulder is redrawn. The pocket is placed where a hand actually is. The lining is cotton, because wool on a child’s neck is an argument you will lose.",
      "Every kids piece ships with a small card: how to let the hem, how to wash the knit, how to send it back if the size is wrong. Exchange is part of the garment.",
      "Parents in Herat and in Vienna should be able to order the same coat. Sizing is in years, with a chest measurement on every product page. Guess less; keep the receipt.",
    ],
  },
];

export function getArticle(slug: string) {
  return journal.find((entry) => entry.slug === slug);
}
