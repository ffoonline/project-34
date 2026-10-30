import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Impressum — Draft",
  description: "Preview template; provider details pending confirmation.",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return <DocPage kicker="legal" title="impressum" kind="impressum" />;
}
