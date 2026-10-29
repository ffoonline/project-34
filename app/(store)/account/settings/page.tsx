import type { Metadata } from "next";
import { AccountFrame } from "@/components/AccountFrame";
import { AccountSoon } from "@/components/AccountCopy";

export const metadata: Metadata = { title: "Settings" };

export default function AccountSettingsPage() {
  return (
    <AccountFrame>
      <AccountSoon k="settingsSoon" />
    </AccountFrame>
  );
}
