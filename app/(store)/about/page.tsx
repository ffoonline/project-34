import type { Metadata } from "next";
import { AboutPageBody } from "@/components/AboutExtra";

export const metadata: Metadata = {
  title: "About",
  description: "The story of THIRTY FOUR GLOBAL — a Kabul house for men, women, and children.",
};

export default function AboutPage() {
  return <AboutPageBody />;
}
