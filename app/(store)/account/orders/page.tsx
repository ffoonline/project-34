import type { Metadata } from "next";
import { AccountFrame } from "@/components/AccountFrame";
import { AccountOrdersList } from "@/components/AccountCopy";
import { getCustomerIdentifier } from "@/lib/customer-session";
import { listOrdersForCustomer } from "@/lib/store";

export const metadata: Metadata = { title: "Orders" };

export default async function AccountOrdersPage() {
  const identifier = await getCustomerIdentifier();
  const orders = identifier ? await listOrdersForCustomer(identifier) : [];
  return (
    <AccountFrame>
      <AccountOrdersList
        orders={orders.map((order) => ({
          id: order.id,
          status: order.status,
          total: order.total,
          currency: order.currency,
        }))}
      />
    </AccountFrame>
  );
}
