"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { OrderTable } from "./OrderTable";

export function AdminOrders({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState(initial);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/orders");
    if (!res.ok) {
      setError("Could not load orders. Sign in again if the session dropped.");
      return;
    }
    setOrders((await res.json()) as Order[]);
    setError("");
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return <OrderTable orders={orders} onChange={load} />;
}
