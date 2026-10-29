import { getStorefrontConfig } from "@/lib/storefront-config";
import { sweepExpiredOtps } from "@/lib/otp-store";

export const dynamic = "force-dynamic";

function isCronAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (cronSecret) {
    return authorization === `Bearer ${cronSecret}`;
  }

  // Production on Vercel must set CRON_SECRET. Local `next dev` can run without it.
  if (process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production") {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    console.error("[THIRTY FOUR cron] unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const expiredOtps = sweepExpiredOtps();
    const flags = await getStorefrontConfig();
    console.log("[THIRTY FOUR cron]", {
      expiredOtps,
      maintenance: flags.maintenance,
      saleEnabled: flags.saleEnabled,
    });
  } catch (error) {
    console.error("[THIRTY FOUR cron]", error);
    return new Response("Cron failed", { status: 500 });
  }

  return new Response("Hello Cron!", { status: 200 });
}
