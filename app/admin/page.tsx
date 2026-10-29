import type { Metadata } from "next";
import Link from "next/link";
import { listMessages, listOrders, listProducts, listSubscribers } from "@/lib/store";

export const metadata: Metadata = {
  title: "Atelier",
};

export default async function AdminPage() {
  const [products, orders, subscribers, messages] = await Promise.all([
    listProducts(),
    listOrders(),
    listSubscribers(),
    listMessages(),
  ]);
  const low = products.filter((product) => product.stock <= 8).length;
  const open = orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;

  const stats = [
    { label: "Pieces on the rail", value: products.length, href: "/admin/products" },
    { label: "Low stock", value: low, href: "/admin/products" },
    { label: "Open orders", value: open, href: "/admin/orders" },
    { label: "House list", value: subscribers.length, href: "/admin" },
    { label: "Desk notes", value: messages.length, href: "/admin" },
  ];

  return (
    <div>
      <p className="kicker">Dashboard</p>
      <h1 className="font-heading mt-2 text-5xl">Good morning, atelier</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Add cloth, change a price, pack an order. Catalogue and sales live in
        Supabase when those keys are set. Without them this desk uses an
        in-memory rail so you can still preview locally.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-border bg-card p-5 hover:border-foreground"
          >
            <p className="text-[11px] tracking-[0.22em] uppercase">{stat.label}</p>
            <p className="font-heading mt-3 text-5xl">{stat.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-3xl">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex justify-between py-3">
                  <span>
                    {order.customer.name}
                    <span className="block text-xs text-muted-foreground">{order.id}</span>
                  </span>
                  <span className="capitalize">{order.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="font-heading text-3xl">Latest notes</h2>
          {messages.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">The desk is clear.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {messages.slice(0, 5).map((message) => (
                <li key={message.id} className="border border-border p-3">
                  <p className="font-medium">{message.name}</p>
                  <p className="text-muted-foreground">{message.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
