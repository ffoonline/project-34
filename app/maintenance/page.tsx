import type { Metadata } from "next";
import { MaintenanceBody } from "@/components/MaintenanceBody";

export const metadata: Metadata = {
  title: "Temporarily closed",
  description: "The THIRTY FOUR house is closed for a private fitting.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <MaintenanceBody />;
}
