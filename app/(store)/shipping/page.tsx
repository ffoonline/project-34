import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Shipping — Draft",
  description: "Preview only; shipping operations are pending confirmation and review.",
  robots: { index: false, follow: false },
};

export default function ShippingPage() {
  return <DocPage kicker="customerCare" title="shipping" kind="shipping" />;
}
