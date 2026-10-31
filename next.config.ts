import type { NextConfig } from "next";

const stripeMode = process.env.STRIPE_MODE?.trim().toLowerCase();
const stripeIsLivemode = stripeMode === "live" || stripeMode === "livemode";
const modeStripePublishableKey = stripeIsLivemode
  ? process.env.NEXT_PUBLIC_STRIPE_LIVEMODE_PUBLISHABLE_KEY ||
    process.env.STRIPE_LIVEMODE_PUBLISHABLE_KEY
  : process.env.NEXT_PUBLIC_STRIPE_SANDBOX_PUBLISHABLE_KEY ||
    process.env.STRIPE_SANDBOX_PUBLISHABLE_KEY;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.POSTHOG_ANALYTICS_API_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.POSTHOG_ANALYTICS_HOST,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      modeStripePublishableKey ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.STRIPE_PUBLISHABLE_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: false },
      { source: "/shop/all", destination: "/shop", permanent: false },
      { source: "/policies", destination: "/privacy", permanent: false },
      { source: "/order/:id/confirmation", destination: "/checkout/confirmation?order=:id", permanent: false },
    ];
  },
};

export default nextConfig;
