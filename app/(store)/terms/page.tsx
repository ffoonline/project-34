import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of sale and use for THIRTY FOUR GLOBAL.",
};

export default function TermsPage() {
  return <DocPage kicker="legal" title="termsTitle" date kind="terms" />;
}
