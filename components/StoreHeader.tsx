import { Header } from "@/components/Header";
import { getStorefrontConfig } from "@/lib/storefront-config";

export async function StoreHeader() {
  const { saleEnabled } = await getStorefrontConfig();
  return <Header saleEnabled={saleEnabled} />;
}
