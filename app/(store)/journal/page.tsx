import type { Metadata } from "next";
import { JournalIndex } from "@/components/JournalViews";

export const metadata: Metadata = {
  title: "Journal",
  description: "Editorial notes from the Thirty Four atelier.",
};

export default function JournalPage() {
  return <JournalIndex />;
}
