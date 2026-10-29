import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupVerifyForm } from "@/components/SignupForms";
import { Logo } from "@/components/Logo";
import { PageLead } from "@/components/PageLead";

export const metadata: Metadata = { title: "Verify code" };

export default async function SignupVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ identifier?: string; redirect?: string }>;
}) {
  const { identifier, redirect: next } = await searchParams;
  if (!identifier) redirect("/account/signup");
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="step2" title="enterTheCode" kickerClassName="mt-6" />
      <div className="mt-8">
        <SignupVerifyForm identifier={identifier} redirect={next} />
      </div>
    </div>
  );
}
