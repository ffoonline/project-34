import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PageLead } from "@/components/PageLead";
import { RegisterForm } from "@/components/RegisterForm";
import { T } from "@/components/T";

export const metadata: Metadata = {
  title: "Register",
  description: "Open a THIRTY FOUR account with email and password.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <Logo size={72} className="h-[72px] w-[72px]" />
      <PageLead kicker="account" title="registerTitle" body="registerLede" kickerClassName="mt-6" />
      <div className="mt-8">
        <RegisterForm redirect={redirect} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        <T k="alreadyInHouse" />{" "}
        <Link href="/account/login" className="underline">
          <T k="signIn" />
        </Link>
        .
      </p>
    </div>
  );
}
