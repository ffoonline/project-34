import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Cookies — Draft",
  description: "Preview only; the technology inventory is pending verification and legal review.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return <DocPage kicker="legal" title="cookies" kind="cookies" />;
}
