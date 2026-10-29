"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useSyncExternalStore } from "react";
import { readCookieConsent, subscribeCookieConsent } from "@/lib/cookie-consent";

export function PostHogInit() {
  const consent = useSyncExternalStore(subscribeCookieConsent, readCookieConsent, () => null);
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  useEffect(() => {
    if (!key || !host) return;

    if (consent !== "all") {
      if (posthog.__loaded) posthog.opt_out_capturing();
      return;
    }

    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: true,
        persistence: "localStorage+cookie",
      });
    } else {
      posthog.opt_in_capturing();
    }
  }, [consent, key, host]);

  return null;
}
