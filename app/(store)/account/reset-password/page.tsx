import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { Logo } from "@/components/Logo";
import { PageLead } from "@/components/PageLead";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ identifier?: string; redirect?: string }>;
}) {
  const { identifier, redirect } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="account" title="resetPassword" body="resetPasswordLede" kickerClassName="mt-6" />
      <div className="mt-8">
        <ResetPasswordForm identifier={identifier || ""} redirect={redirect} />
      </div>
    </div>
  );
}
