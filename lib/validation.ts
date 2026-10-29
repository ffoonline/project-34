import { categories } from "./site";
import type { Category, CurrencyCode, Demand, Order, Product } from "./types";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CATEGORY_SLUGS = new Set(categories.map((entry) => entry.slug));
const DEMANDS = new Set<Demand>(["high", "steady", "limited"]);
const CURRENCIES = new Set<CurrencyCode>(["USD", "EUR", "GBP"]);
const ORDER_STATUSES = new Set<Order["status"]>([
  "received",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]);
const PAYMENT_METHODS = new Set<Order["paymentMethod"]>([
  "cod",
  "transfer",
  "whatsapp",
  "stripe",
]);

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function isValidEmail(value: unknown): value is string {
  const email = normalizeEmail(value);
  return Boolean(email) && EMAIL_RE.test(email) && email.length <= 254;
}

export function requireEmail(value: unknown, message = "A real email, please.") {
  const email = normalizeEmail(value);
  if (!isValidEmail(email)) {
    throw new ValidationError(message);
  }
  return email;
}

export function requirePassword(value: unknown, min = 8) {
  if (typeof value !== "string" || value.length < min) {
    throw new ValidationError(`Password must be at least ${min} characters.`);
  }
  if (value.length > 200) {
    throw new ValidationError("Password is too long.");
  }
  return value;
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "piece";
}

export function parseMoney(value: unknown, label = "Price") {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ValidationError(`${label} must be greater than zero.`);
  }
  if (amount > 1_000_000) {
    throw new ValidationError(`${label} is out of range.`);
  }
  return Math.round(amount * 100) / 100;
}

export function parseStock(value: unknown) {
  const stock = typeof value === "number" ? value : Number(value ?? 0);
  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
    throw new ValidationError("Stock must be a whole number of zero or more.");
  }
  if (stock > 1_000_000) {
    throw new ValidationError("Stock is out of range.");
  }
  return stock;
}

export function parseQty(value: unknown) {
  const qty = Math.floor(Number(value));
  if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
    throw new ValidationError("Quantity must be between 1 and 99.");
  }
  return qty;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const next = value.map((entry) => String(entry).trim()).filter(Boolean);
  return next.length ? next : fallback;
}

export function parseCategory(value: unknown): Category {
  const slug = asString(value);
  if (!CATEGORY_SLUGS.has(slug as Category)) {
    throw new ValidationError("Choose a house category.");
  }
  return slug as Category;
}

export function parseDemand(value: unknown): Demand {
  const demand = asString(value) || "steady";
  if (!DEMANDS.has(demand as Demand)) {
    throw new ValidationError("Demand must be high, steady, or limited.");
  }
  return demand as Demand;
}

export function parseCurrency(value: unknown): CurrencyCode {
  const code = asString(value).toUpperCase() || "USD";
  if (!CURRENCIES.has(code as CurrencyCode)) return "USD";
  return code as CurrencyCode;
}

export function parseOrderStatus(value: unknown): Order["status"] {
  const status = asString(value);
  if (!ORDER_STATUSES.has(status as Order["status"])) {
    throw new ValidationError("Unknown order status.");
  }
  return status as Order["status"];
}

export function parsePaymentMethod(value: unknown): Order["paymentMethod"] {
  const method = asString(value) || "cod";
  if (!PAYMENT_METHODS.has(method as Order["paymentMethod"])) {
    throw new ValidationError("Unknown payment method.");
  }
  return method as Order["paymentMethod"];
}

export function parseProductInput(body: Record<string, unknown>, id?: string): Product {
  const name = asString(body.name);
  if (!name) throw new ValidationError("Name, price, and category are required.");
  const price = parseMoney(body.price);
  const category = parseCategory(body.category);
  const compareAtRaw = body.compareAt ?? body.compare_at;
  const compareAt =
    compareAtRaw === "" || compareAtRaw == null ? undefined : parseMoney(compareAtRaw, "Compare-at price");
  if (compareAt != null && compareAt <= price) {
    throw new ValidationError("Compare-at price must be higher than the selling price.");
  }
  const images = asStringArray(body.images, []).filter(Boolean);
  const colors = Array.isArray(body.colors)
    ? body.colors
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const row = entry as { name?: unknown; hex?: unknown };
          const colorName = asString(row.name);
          if (!colorName) return null;
          return { name: colorName, hex: asString(row.hex) || "#1a1714" };
        })
        .filter((entry): entry is { name: string; hex: string } => Boolean(entry))
    : [];

  return {
    id: id || asString(body.id),
    slug: slugify(asString(body.slug) || name),
    name,
    category,
    subcategory: asString(body.subcategory) || "tops",
    collection: asString(body.collection) || "atelier",
    price,
    compareAt,
    description: asString(body.description),
    story: asString(body.story),
    fabric: asString(body.fabric),
    care: asString(body.care),
    sizes: asStringArray(body.sizes, ["M"]),
    colors: colors.length ? colors : [{ name: "Ink", hex: "#1a1714" }],
    stock: parseStock(body.stock),
    featured: Boolean(body.featured),
    newArrival: body.newArrival !== false && body.new_arrival !== false,
    bestSeller: Boolean(body.bestSeller ?? body.best_seller),
    demand: parseDemand(body.demand),
    images: images.length ? images : ["/catalog/women-atelier.jpg"],
  };
}

export function parseProductPatch(body: Record<string, unknown>): Partial<Product> {
  const patch: Partial<Product> = {};
  if (body.name != null) {
    const name = asString(body.name);
    if (!name) throw new ValidationError("Name cannot be empty.");
    patch.name = name;
  }
  if (body.slug != null) patch.slug = slugify(asString(body.slug));
  if (body.category != null) patch.category = parseCategory(body.category);
  if (body.subcategory != null) patch.subcategory = asString(body.subcategory) || "tops";
  if (body.collection != null) patch.collection = asString(body.collection) || "atelier";
  if (body.price != null) patch.price = parseMoney(body.price);
  if (body.compareAt !== undefined || body.compare_at !== undefined) {
    const raw = body.compareAt ?? body.compare_at;
    patch.compareAt = raw === "" || raw == null ? undefined : parseMoney(raw, "Compare-at price");
  }
  if (body.description != null) patch.description = asString(body.description);
  if (body.story != null) patch.story = asString(body.story);
  if (body.fabric != null) patch.fabric = asString(body.fabric);
  if (body.care != null) patch.care = asString(body.care);
  if (body.sizes != null) patch.sizes = asStringArray(body.sizes, ["M"]);
  if (body.colors != null) {
    const parsed = parseProductInput({ ...body, name: "x", price: 1, category: "men" });
    patch.colors = parsed.colors;
  }
  if (body.stock != null) patch.stock = parseStock(body.stock);
  if (body.featured != null) patch.featured = Boolean(body.featured);
  if (body.newArrival != null || body.new_arrival != null) {
    patch.newArrival = Boolean(body.newArrival ?? body.new_arrival);
  }
  if (body.bestSeller != null || body.best_seller != null) {
    patch.bestSeller = Boolean(body.bestSeller ?? body.best_seller);
  }
  if (body.demand != null) patch.demand = parseDemand(body.demand);
  if (body.images != null) {
    const images = asStringArray(body.images, []).filter(Boolean);
    patch.images = images.length ? images : ["/catalog/women-atelier.jpg"];
  }
  return patch;
}

export function parseCustomer(body: Record<string, unknown>) {
  const name = asString(body.name);
  const email = requireEmail(body.email, "Customer name and email are required.");
  if (!name) throw new ValidationError("Customer name and email are required.");
  return {
    name,
    email,
    phone: asString(body.phone),
    city: asString(body.city) || "Kabul",
    country: asString(body.country) || (asString(body.city) === "International" ? "International" : "Afghanistan"),
    address: asString(body.address),
    notes: asString(body.notes) || undefined,
  };
}

export function parseOrderLines(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError("Bag and customer details are required.");
  }
  return value.map((entry) => {
    const row = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const productId = asString(row.productId ?? row.id);
    const slug = asString(row.slug);
    if (!productId && !slug) {
      throw new ValidationError("Each bag line needs a product.");
    }
    return {
      productId,
      slug,
      qty: parseQty(row.qty ?? row.quantity),
      size: asString(row.size),
      color: asString(row.color),
    };
  });
}

export function httpError(error: unknown, fallback: string) {
  if (error instanceof ValidationError) {
    return { error: error.message, status: 400 as const };
  }
  if (error instanceof Error && error.message) {
    const known =
      /stock|rail|bag|email|password|required|quantity|empty|already/i.test(error.message);
    return { error: known ? error.message : fallback, status: known ? 400 : 500 };
  }
  return { error: fallback, status: 500 as const };
}
