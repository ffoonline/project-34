import { createClient, type EdgeConfigClient } from "@vercel/global-config";

const connectionString =
  process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;

function createEdgeConfigClient(): EdgeConfigClient | null {
  if (!connectionString) return null;
  try {
    return createClient(connectionString, {
      cache: "force-cache",
    });
  } catch {
    return null;
  }
}

// Next.js App Router: force-cache so static / Cache Component reads stay
// on the Data Cache. Omit Vite dotenv-expand and SvelteKit $env — this
// house is Next.js. Quote GLOBAL_CONFIG in .env files; tokens often contain `$`.
export const edgeConfigClient = createEdgeConfigClient();
