import { StoreHeader } from "@/components/StoreHeader";
import { Footer } from "@/components/Footer";
import { CartDock } from "@/components/CartDock";
import { ReviewButton } from "@/components/ReviewButton";
import { T } from "@/components/T";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showFullAddress = process.env.SHOW_FULL_ADDRESS === "true";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.production,
    sameAs: [
      "https://www.facebook.com/share/1CBUFGNur3/",
      "https://www.instagram.com/thirtyfourglobal",
      "https://www.tiktok.com/@thirtyfourglobal",
    ],
    ...(site.email ? { email: site.email } : {}),
    telephone: `+${site.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      ...(showFullAddress ? { streetAddress: site.fullAddress } : {}),
      addressLocality: "Kabul",
      addressCountry: "AF",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(site.email ? { email: site.email } : {}),
      telephone: `+${site.whatsapp}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a href="#main" className="skip-link">
        <T k="skipToContent" />
      </a>
      <StoreHeader />
      <main id="main" className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <ReviewButton />
      </main>
      <Footer showFullAddress={showFullAddress} />
      <CartDock />
    </>
  );
}
