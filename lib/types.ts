export type Category = "men" | "women" | "kids" | "fragrance" | "accessories";

export type Demand = "high" | "steady" | "limited";

export type CurrencyCode = "USD" | "EUR" | "GBP";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  collection: string;
  price: number;
  compareAt?: number;
  description: string;
  story: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller?: boolean;
  demand: Demand;
  images: string[];
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

export type OrderStatus = "received" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  channel: "checkout" | "whatsapp" | "email";
  currency: CurrencyCode;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    notes?: string;
  };
  paymentMethod: "cod" | "transfer" | "whatsapp" | "stripe";
  stripePaymentIntentId?: string;
};

export type CustomerAccount = {
  identifier: string;
  password: string;
  createdAt: string;
};

export type Subscriber = {
  email: string;
  at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  at: string;
};
