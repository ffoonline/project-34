import type { Metadata } from "next";
import { AboutPageBody } from "@/components/AboutExtra";

export const metadata: Metadata = {
  title: "About — Draft",
  description: "Preview only; the official brand story is pending approval.",
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  return <AboutPageBody />;
}
