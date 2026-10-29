import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Returns",
  description: "Returns and exchanges for THIRTY FOUR.",
};

export default function ReturnsPage() {
  return <DocPage kicker="customerCare" title="returnsHeading" kind="returns" />;
}
