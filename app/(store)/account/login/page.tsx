import type { Metadata } from "next";
import { CustomerLoginForm } from "@/components/CustomerLoginForm";
import { Logo } from "@/components/Logo";
import { PageLead } from "@/components/PageLead";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="account" title="signIn" body="accountLede" kickerClassName="mt-6" />
      <div className="mt-8">
        <CustomerLoginForm redirect={redirect} />
      </div>
    </div>
  );
}
