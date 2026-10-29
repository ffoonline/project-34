export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

// Authentic reviews only. The house does not invent testimonials.
export const initialReviews: Review[] = [];
