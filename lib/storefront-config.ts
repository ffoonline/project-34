import { site } from "@/lib/site";
import { edgeConfigClient } from "@/lib/global-config";

export type StorefrontConfig = {
  announcement: string;
  maintenance: boolean;
  saleEnabled: boolean;
};

export const defaultStorefrontConfig: StorefrontConfig = {
  announcement: `${site.house} · ${site.legal}`,
  maintenance: false,
  saleEnabled: true,
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export async function getStorefrontConfig(): Promise<StorefrontConfig> {
  if (!edgeConfigClient) {
    return defaultStorefrontConfig;
  }

  try {
    const [announcement, maintenance, saleEnabled] = await Promise.all([
      edgeConfigClient.get("announcement"),
      edgeConfigClient.get("maintenance"),
      edgeConfigClient.get("saleEnabled"),
    ]);

    return {
      announcement: asString(
        announcement,
        defaultStorefrontConfig.announcement,
      ),
      maintenance: asBoolean(
        maintenance,
        defaultStorefrontConfig.maintenance,
      ),
      saleEnabled: asBoolean(saleEnabled, defaultStorefrontConfig.saleEnabled),
    };
  } catch {
    return defaultStorefrontConfig;
  }
}

export async function isMaintenanceMode(): Promise<boolean> {
  if (!edgeConfigClient) return false;
  try {
    return (await edgeConfigClient.get("maintenance")) === true;
  } catch {
    return false;
  }
}
