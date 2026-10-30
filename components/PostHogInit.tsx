"use client";

import { useEffect, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import {
  hasCookieConsent,
  readCookieConsent,
  subscribeCookieConsent,
} from "@/lib/cookie-consent";

export function PostHogInit() {
  const consent = useSyncExternalStore(subscribeCookieConsent, readCookieConsent, () => null);
  const analyticsAllowed = hasCookieConsent(consent, "analytics");
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  useEffect(() => {
    if (!key || !host) return;

    if (!analyticsAllowed) {
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
  }, [analyticsAllowed, key, host]);

  return null;
}
