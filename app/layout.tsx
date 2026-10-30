import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";
import { PostHogInit } from "@/components/PostHogInit";
import { CookieBanner } from "@/components/CookieBanner";
import { site } from "@/lib/site";
import { getCustomerIdentifier } from "@/lib/customer-session";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "THIRTY FOUR | Modern luxury. Defined by you.",
    template: "%s | THIRTY FOUR",
  },
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "THIRTY FOUR",
    description: site.description,
    siteName: "THIRTY FOUR GLOBAL",
    type: "website",
    images: [{ url: "/brand/34-on-dark.png", width: 512, height: 512, alt: "THIRTY FOUR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "THIRTY FOUR",
    description: site.description,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const identifier = await getCustomerIdentifier();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} ${geistMono.variable} ${naskh.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="tf-lang" strategy="beforeInteractive">
          {`(function(){try{var l=localStorage.getItem("tf-lang");if(l==="fa-AF"||l==="ps"){document.documentElement.lang=l;document.documentElement.dir="rtl";document.documentElement.setAttribute("data-lang",l)}}catch(e){}})();`}
        </Script>
        <Providers initialIdentifier={identifier}>
          {children}
          <CookieBanner />
          <Analytics />
          <PostHogInit />
        </Providers>
      </body>
    </html>
  );
}
