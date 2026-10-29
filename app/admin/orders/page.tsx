import type { Metadata } from "next";
import { AdminOrders } from "@/components/AdminOrders";
import { listOrders } from "@/lib/store";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return (
    <div>
      <p className="kicker">Sales</p>
      <h1 className="font-heading mt-2 text-5xl">Orders</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Confirm, pack, ship. WhatsApp and email orders land here beside checkout.
      </p>
      <div className="mt-10">
        <AdminOrders initial={orders} />
      </div>
    </div>
  );
}
