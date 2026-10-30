import { StoreHeader } from "@/components/StoreHeader";
import { Footer } from "@/components/Footer";
import { ReviewButton } from "@/components/ReviewButton";
import { T } from "@/components/T";
import { site } from "@/lib/site";
import { AnnouncementBar } from "@/components/AnnouncementBar";

export const dynamic = "force-dynamic";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.production,
    ...(site.publicContactDetailsConfirmed
      ? {
          email: site.email,
          telephone: `+${site.whatsapp}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address,
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: site.email,
            telephone: `+${site.whatsapp}`,
          },
        }
      : {}),
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
      <AnnouncementBar />
      <StoreHeader />
      <main id="main" className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <ReviewButton />
      </main>
      <Footer />
    </>
  );
}
