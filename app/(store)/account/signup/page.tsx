import type { Metadata } from "next";
import { SignupIdentifierForm } from "@/components/SignupForms";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { PageLead } from "@/components/PageLead";
import { T } from "@/components/T";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="step1" title="createAccount" body="signupLede" kickerClassName="mt-6" />
      <div className="mt-8">
        <SignupIdentifierForm redirect={redirect} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        <T k="preferEmailPassword" />{" "}
        <Link href="/register" className="underline">
          <T k="registerTitle" />
        </Link>
        . <T k="alreadyInHouse" />{" "}
        <Link href="/account/login" className="underline">
          <T k="signIn" />
        </Link>
        .
      </p>
    </div>
  );
}
