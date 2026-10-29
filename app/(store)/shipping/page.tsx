import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping zones and delivery for THIRTY FOUR.",
};

export default function ShippingPage() {
  return <DocPage kicker="customerCare" title="shipping" kind="shipping" />;
}
