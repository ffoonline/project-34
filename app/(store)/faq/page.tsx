import type { Metadata } from "next";
import { FaqView } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Shipping, delivery, and exchange for THIRTY FOUR.",
};

export default function FaqPage() {
  return <FaqView />;
}
