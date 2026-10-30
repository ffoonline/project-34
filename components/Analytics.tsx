"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  hasCookieConsent,
  readCookieConsent,
  subscribeCookieConsent,
} from "@/lib/cookie-consent";

type ConsentAwareWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function Analytics() {
  const consent = useSyncExternalStore(subscribeCookieConsent, readCookieConsent, () => null);
  const analyticsAllowed = hasCookieConsent(consent, "analytics");
  const marketingAllowed = hasCookieConsent(consent, "marketing");
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    const target = window as ConsentAwareWindow;
    target.gtag?.("consent", "update", {
      analytics_storage: analyticsAllowed ? "granted" : "denied",
      ad_storage: marketingAllowed ? "granted" : "denied",
      ad_user_data: marketingAllowed ? "granted" : "denied",
      ad_personalization: marketingAllowed ? "granted" : "denied",
    });
    target.fbq?.("consent", marketingAllowed ? "grant" : "revoke");
  }, [analyticsAllowed, marketingAllowed]);

  return (
    <>
      {analyticsAllowed && ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'granted',ad_storage:'${marketingAllowed ? "granted" : "denied"}',ad_user_data:'${marketingAllowed ? "granted" : "denied"}',ad_personalization:'${marketingAllowed ? "granted" : "denied"}'});gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
      {marketingAllowed && pixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
