import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Privacy — Draft",
  description: "Preview only; processing details are pending verification and legal review.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return <DocPage kicker="legal" title="privacyPolicyTitle" kind="privacy" />;
}
