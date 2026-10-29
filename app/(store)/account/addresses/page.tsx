import type { Metadata } from "next";
import { AccountFrame } from "@/components/AccountFrame";
import { AccountSoon } from "@/components/AccountCopy";

export const metadata: Metadata = { title: "Addresses" };

export default function AccountAddressesPage() {
  return (
    <AccountFrame>
      <AccountSoon k="addressesSoon" />
    </AccountFrame>
  );
}
