import "server-only";

import { seedProducts } from "./catalog";
import { filterProducts, type ProductQuery } from "./filter-products";
import { shippingForCity } from "./money";
import {
  fetchMessages,
  fetchOrderById,
  fetchOrderByPaymentIntent,
  fetchOrders,
  fetchOrdersForCustomer,
  fetchSubscribers,
  insertMessage,
  insertSubscriber,
  patchOrderStatus,
  placeOrderRpc,
  type PlaceOrderInput,
} from "./orders";
import {
  fetchProductById,
  fetchProductBySlug,
  insertProduct,
  patchProduct,
  queryProducts,
  removeProduct,
} from "./products";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "./supabase/env";
import type { ContactMessage, CustomerAccount, Order, Product, Subscriber } from "./types";

type Database = {
  products: Product[];
  orders: Order[];
  subscribers: Subscriber[];
  messages: ContactMessage[];
  users: CustomerAccount[];
};

const memory = globalThis as typeof globalThis & { __tfMemory?: Database };

function cloneSeed(): Database {
  return {
    products: structuredClone(seedProducts),
    orders: [],
    subscribers: [],
    messages: [],
    users: [],
  };
}

function loadDb(): Database {
  memory.__tfMemory ??= cloneSeed();
  return memory.__tfMemory;
}

function useSupabaseReads() {
  return isSupabaseConfigured();
}

function useSupabaseWrites() {
  return isSupabaseAdminConfigured();
}

export async function listProducts(query?: ProductQuery) {
  if (useSupabaseReads()) {
    try {
      return await queryProducts(query);
    } catch (error) {
      console.error("listProducts supabase:", error);
    }
  }
  return filterProducts(loadDb().products, query ?? {});
}

export async function getProductBySlug(slug: string) {
  if (useSupabaseReads()) {
    try {
      return await fetchProductBySlug(slug);
    } catch (error) {
      console.error("getProductBySlug supabase:", error);
    }
  }
  return loadDb().products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  if (useSupabaseReads()) {
    try {
      return await fetchProductById(id);
    } catch (error) {
      console.error("getProductById supabase:", error);
    }
  }
  return loadDb().products.find((product) => product.id === id || product.slug === id) ?? null;
}

export async function createProduct(input: Product) {
  if (useSupabaseWrites()) return insertProduct(input);
  const db = loadDb();
  db.products.unshift(input);
  return input;
}

export async function updateProduct(id: string, patch: Partial<Product>) {
  if (useSupabaseWrites()) return patchProduct(id, patch);
  const db = loadDb();
  const index = db.products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...patch, id };
  return db.products[index];
}

export async function deleteProduct(id: string) {
  if (useSupabaseWrites()) return removeProduct(id);
  const db = loadDb();
  const next = db.products.filter((product) => product.id !== id);
  if (next.length === db.products.length) return false;
  db.products = next;
  return true;
}

export async function listOrders() {
  if (useSupabaseWrites()) return fetchOrders();
  return loadDb().orders;
}

export async function getOrder(id: string) {
  if (useSupabaseWrites()) return fetchOrderById(id);
  return loadDb().orders.find((order) => order.id === id) ?? null;
}

export async function findOrderByPaymentIntent(id: string) {
  if (useSupabaseWrites()) return fetchOrderByPaymentIntent(id);
  return loadDb().orders.find((order) => order.stripePaymentIntentId === id) ?? null;
}

export async function placeHouseOrder(input: PlaceOrderInput): Promise<Order> {
  if (useSupabaseWrites()) return placeOrderRpc(input);

  const db = loadDb();
  const priced: Order["items"] = [];
  let subtotal = 0;
  for (const line of input.items) {
    const product = db.products.find(
      (entry) => entry.id === line.productId || entry.slug === line.slug,
    );
    if (!product) {
      throw new Error("A piece in the bag is no longer on the rail.");
    }
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1) {
      throw new Error("Invalid quantity.");
    }
    if (product.stock < qty) {
      throw new Error(`Insufficient stock for ${product.name}.`);
    }
    product.stock -= qty;
    subtotal += product.price * qty;
    priced.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      size: line.size || "",
      color: line.color || "",
      qty,
    });
  }

  const city = input.city || input.customer.city || "Kabul";
  const shipping = shippingForCity(city);
  const order: Order = {
    id: newId("ord"),
    createdAt: new Date().toISOString(),
    status: input.paymentMethod === "stripe" ? "confirmed" : "received",
    channel: input.channel || (input.paymentMethod === "whatsapp" ? "whatsapp" : "checkout"),
    currency: input.currency || "USD",
    items: priced,
    subtotal,
    shipping,
    total: subtotal + shipping,
    customer: {
      ...input.customer,
      city,
    },
    paymentMethod: input.paymentMethod || "cod",
    stripePaymentIntentId: input.stripePaymentIntentId,
  };
  db.orders.unshift(order);
  return order;
}

export async function createOrder(order: Order) {
  return placeHouseOrder({
    items: order.items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      qty: item.qty,
      size: item.size,
      color: item.color,
    })),
    customer: order.customer,
    currency: order.currency,
    city: order.customer.city,
    paymentMethod: order.paymentMethod,
    channel: order.channel,
    stripePaymentIntentId: order.stripePaymentIntentId,
  });
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  if (useSupabaseWrites()) return patchOrderStatus(id, status);
  const order = loadDb().orders.find((entry) => entry.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}

export async function addSubscriber(email: string) {
  if (useSupabaseWrites()) {
    const { subscriber } = await insertSubscriber(email);
    return subscriber;
  }
  if (useSupabaseReads()) {
    try {
      const { createClient } = await import("./supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("subscribers").insert({ email });
      if (error && error.code !== "23505") throw new Error(error.message);
      return { email, at: new Date().toISOString() };
    } catch (error) {
      console.error("addSubscriber supabase:", error);
    }
  }
  const db = loadDb();
  const existing = db.subscribers.find((row) => row.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const row = { email, at: new Date().toISOString() };
  db.subscribers.unshift(row);
  return row;
}

export async function listSubscribers() {
  if (useSupabaseWrites()) return fetchSubscribers();
  return loadDb().subscribers;
}

export async function addMessage(message: ContactMessage) {
  if (useSupabaseWrites()) return insertMessage(message);
  if (useSupabaseReads()) {
    try {
      const { createClient } = await import("./supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("contact_messages").insert({
        id: message.id,
        name: message.name,
        email: message.email,
        phone: message.phone ?? null,
        message: message.message,
      });
      if (error) throw new Error(error.message);
      return message;
    } catch (error) {
      console.error("addMessage supabase:", error);
    }
  }
  const db = loadDb();
  db.messages.unshift(message);
  return message;
}

export async function listMessages() {
  if (useSupabaseWrites()) return fetchMessages();
  return loadDb().messages;
}

export async function findCustomer(identifier: string) {
  return loadDb().users.find((user) => user.identifier === identifier) ?? null;
}

export async function createCustomer(account: CustomerAccount) {
  const db = loadDb();
  if (db.users.some((user) => user.identifier === account.identifier)) {
    return null;
  }
  db.users.unshift(account);
  return account;
}

export async function updateCustomerPassword(identifier: string, password: string) {
  const user = loadDb().users.find((entry) => entry.identifier === identifier);
  if (!user) return null;
  user.password = password;
  return user;
}

export async function listOrdersForCustomer(identifier: string) {
  if (useSupabaseWrites()) return fetchOrdersForCustomer(identifier);
  return loadDb().orders.filter(
    (order) =>
      order.customer.email.toLowerCase() === identifier.toLowerCase() ||
      order.customer.phone.replace(/\s+/g, "") === identifier.replace(/\s+/g, ""),
  );
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
