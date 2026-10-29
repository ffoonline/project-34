import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupPasswordForm } from "@/components/SignupForms";
import { Logo } from "@/components/Logo";
import { PageLead } from "@/components/PageLead";

export const metadata: Metadata = { title: "Set password" };

export default async function SignupPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ identifier?: string; redirect?: string }>;
}) {
  const { identifier, redirect: next } = await searchParams;
  if (!identifier) redirect("/account/signup");
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="step3" title="setAPassword" kickerClassName="mt-6" />
      <div className="mt-8">
        <SignupPasswordForm identifier={identifier} redirect={next} />
      </div>
    </div>
  );
}
