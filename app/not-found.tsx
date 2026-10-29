import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { T } from "@/components/T";

export default function NotFound() {
  return (
    <>
      <StoreHeader />
      <div className="mx-auto max-w-lg flex-1 px-4 py-24 text-center">
        <Logo size={72} className="mx-auto h-[72px] w-[72px]" />
        <p className="kicker mt-6">34 / 404</p>
        <h1 className="font-heading mt-3 text-5xl">
          <T k="pieceNotOnRail" />
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          <T k="recutOrOld" />
        </p>
        <Link href="/shop" className="text-link mt-8">
          <T k="shopTheHouse" />
        </Link>
      </div>
      <Footer />
    </>
  );
}
