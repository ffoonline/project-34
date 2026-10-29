import "server-only";

import { createAdminClient } from "./supabase/admin";
import { shippingForCity } from "./money";
import type { CartItem, ContactMessage, CurrencyCode, Order, Subscriber } from "./types";

export type OrderItemRow = {
  product_id: string;
  slug: string;
  name: string;
  unit_price: number | string;
  qty: number;
  size: string;
  color: string;
  image: string | null;
};

export type OrderRow = {
  id: string;
  user_id: string | null;
  status: Order["status"];
  channel: Order["channel"];
  currency: CurrencyCode;
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  customer_country: string;
  customer_address: string;
  customer_notes: string | null;
  payment_method: Order["paymentMethod"];
  stripe_payment_intent_id: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
};

export type PlaceOrderInput = {
  items: { productId?: string; slug?: string; qty: number; size?: string; color?: string }[];
  customer: Order["customer"];
  currency?: CurrencyCode;
  city?: string;
  paymentMethod?: Order["paymentMethod"];
  channel?: Order["channel"];
  stripePaymentIntentId?: string;
  userId?: string | null;
};

function db() {
  const admin = createAdminClient();
  if (!admin) throw new Error("Supabase service role is not configured.");
  return admin;
}

export function mapOrderItem(row: OrderItemRow): CartItem {
  return {
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    price: Number(row.unit_price),
    image: row.image ?? "",
    size: row.size,
    color: row.color,
    qty: row.qty,
  };
}

export function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    channel: row.channel,
    currency: row.currency,
    items: (row.order_items ?? []).map(mapOrderItem),
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      city: row.customer_city,
      country: row.customer_country,
      address: row.customer_address,
      notes: row.customer_notes || undefined,
    },
    paymentMethod: row.payment_method,
    stripePaymentIntentId: row.stripe_payment_intent_id || undefined,
  };
}

const ORDER_SELECT = "*, order_items(*)";

export async function fetchOrderById(id: string) {
  const { data, error } = await db().from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapOrder(data as OrderRow) : null;
}

export async function fetchOrders() {
  const { data, error } = await db()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as OrderRow[]).map(mapOrder);
}

export async function fetchOrdersForCustomer(identifier: string, userId?: string | null) {
  const email = identifier.toLowerCase();
  const phone = identifier.replace(/\s+/g, "");
  let request = db().from("orders").select(ORDER_SELECT).order("created_at", { ascending: false });
  if (userId) {
    request = request.or(`user_id.eq.${userId},customer_email.eq.${email}`);
  } else if (identifier.includes("@")) {
    request = request.eq("customer_email", email);
  } else {
    request = request.eq("customer_phone", phone);
  }
  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return ((data ?? []) as OrderRow[]).map(mapOrder);
}

export async function fetchOrderByPaymentIntent(id: string) {
  const { data, error } = await db()
    .from("orders")
    .select(ORDER_SELECT)
    .eq("stripe_payment_intent_id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapOrder(data as OrderRow) : null;
}

export async function placeOrderRpc(input: PlaceOrderInput) {
  const admin = db();
  const city = input.city || input.customer.city || "Kabul";
  const { data, error } = await admin.rpc("place_order", {
    p_items: input.items.map((item) => ({
      productId: item.productId || "",
      slug: item.slug || "",
      qty: item.qty,
      size: item.size || "",
      color: item.color || "",
    })),
    p_customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
      city,
      country: input.customer.country,
      address: input.customer.address,
      notes: input.customer.notes ?? "",
    },
    p_currency: input.currency || "USD",
    p_city: city,
    p_payment_method: input.paymentMethod || "cod",
    p_channel: input.channel || (input.paymentMethod === "whatsapp" ? "whatsapp" : "checkout"),
    p_stripe_payment_intent_id: input.stripePaymentIntentId ?? null,
    p_user_id: input.userId ?? null,
  });
  if (error) {
    throw new Error(error.message.replace(/^.*P0001:\s*/i, "").replace(/^ERROR:\s*/i, ""));
  }
  const payload = data as { id?: string } | null;
  if (!payload?.id) throw new Error("The house could not record the order.");
  const order = await fetchOrderById(payload.id);
  if (!order) throw new Error("The house could not record the order.");
  return order;
}

export async function patchOrderStatus(id: string, status: Order["status"]) {
  const { data, error } = await db()
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select(ORDER_SELECT)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapOrder(data as OrderRow) : null;
}

export async function insertSubscriber(email: string): Promise<{ subscriber: Subscriber; created: boolean }> {
  const admin = db();
  const { data, error } = await admin
    .from("subscribers")
    .insert({ email })
    .select("email, created_at")
    .maybeSingle();
  if (error) {
    if (error.code === "23505") {
      return { subscriber: { email, at: new Date().toISOString() }, created: false };
    }
    throw new Error(error.message);
  }
  return {
    subscriber: { email: data?.email ?? email, at: data?.created_at ?? new Date().toISOString() },
    created: true,
  };
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const { data, error } = await db()
    .from("subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({ email: row.email as string, at: row.created_at as string }));
}

export async function insertMessage(message: ContactMessage) {
  const { error } = await db().from("contact_messages").insert({
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone ?? null,
    message: message.message,
  });
  if (error) throw new Error(error.message);
  return message;
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await db()
    .from("contact_messages")
    .select("id, name, email, phone, message, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? undefined,
    message: row.message as string,
    at: row.created_at as string,
  }));
}

export function previewShipping(city: string) {
  return shippingForCity(city);
}
