import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Returns — Draft",
  description: "Preview only; return and refund details are pending confirmation and legal review.",
  robots: { index: false, follow: false },
};

export default function ReturnsPage() {
  return <DocPage kicker="customerCare" title="returnsHeading" kind="returns" />;
}
