import type { Metadata } from "next";
import { DocPage } from "@/components/DocSections";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookies and similar technologies used by THIRTY FOUR GLOBAL.",
};

export default function CookiesPage() {
  return <DocPage kicker="legal" title="cookies" date kind="cookies" />;
}
