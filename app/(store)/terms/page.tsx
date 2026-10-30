import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Terms — Draft",
  description: "Preview only; contract details are pending confirmation and legal review.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return <DocPage kicker="legal" title="termsTitle" kind="terms" />;
}
