import type { Metadata } from "next";
import { StaffGate } from "@/components/StaffGate";

export const metadata: Metadata = {
  title: "Staff",
  description: "Staff desk for THIRTY FOUR.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <StaffGate next={next} />;
}
