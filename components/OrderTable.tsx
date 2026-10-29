"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statuses: Order["status"][] = [
  "received",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderTable({
  orders,
  onChange,
}: {
  orders: Order[];
  onChange: () => void;
}) {
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: Order["status"]) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError("Could not update the order");
      toast.error("Could not update the order");
      return;
    }
    setError("");
    toast.success("Order updated");
    onChange();
  }

  if (error && orders.length === 0) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No orders yet. Placed checkouts will appear here.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article key={order.id} className="border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase">{order.id}</p>
              <h3 className="font-heading mt-1 text-2xl">{order.customer.name}</h3>
              <p className="text-sm text-muted-foreground">
                {order.customer.city} · {order.channel} · {order.paymentMethod.toUpperCase()}
              </p>
            </div>
            <Select
              value={order.status}
              onValueChange={(value) => updateStatus(order.id, value as Order["status"])}
            >
              <SelectTrigger className="w-40 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`}>
                {item.qty} × {item.name} — {item.size} / {item.color}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Total ${order.total} {order.currency} · {order.customer.email} · {order.customer.phone}
          </p>
          <Button variant="outline" className="mt-4 rounded-none" asChild>
            <a href={`mailto:${order.customer.email}`}>Email customer</a>
          </Button>
        </article>
      ))}
    </div>
  );
}
