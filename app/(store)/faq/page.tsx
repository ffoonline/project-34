import type { Metadata } from "next";
import { FaqView } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "FAQ — Draft",
  description: "Preview only; answers are pending business confirmation.",
  robots: { index: false, follow: false },
};

export default function FaqPage() {
  return <FaqView />;
}
