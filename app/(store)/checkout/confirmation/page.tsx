import type { Metadata } from "next";
import { getOrder } from "@/lib/store";
import { CheckoutConfirmation } from "@/components/CheckoutNotices";

export const metadata: Metadata = {
  title: "Order received",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: id } = await searchParams;
  const order = id ? await getOrder(id) : null;

  return (
    <CheckoutConfirmation
      order={
        order
          ? { id: order.id, customer: { name: order.customer.name }, status: order.status }
          : null
      }
    />
  );
}
