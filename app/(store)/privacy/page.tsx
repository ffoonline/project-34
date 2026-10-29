import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How THIRTY FOUR GLOBAL collects, uses, and protects personal data.",
};

export default function PrivacyPage() {
  return <DocPage kicker="legal" title="privacyPolicyTitle" date kind="privacy" />;
}
