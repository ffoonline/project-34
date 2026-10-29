import type { Metadata } from "next";
import { AccountFrame } from "@/components/AccountFrame";
import { AccountOverviewCopy } from "@/components/AccountCopy";
import { getCustomerIdentifier } from "@/lib/customer-session";
import { listOrdersForCustomer } from "@/lib/store";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const identifier = await getCustomerIdentifier();
  const orders = identifier ? await listOrdersForCustomer(identifier) : [];
  return (
    <AccountFrame>
      <AccountOverviewCopy count={orders.length} />
    </AccountFrame>
  );
}
