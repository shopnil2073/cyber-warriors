import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER ONLY. Service-role key RLS bypass kore, tai eta kokhono browser/client component e import korba na.
let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Server config incomplete: NEXT_PUBLIC_SUPABASE_URL ar SUPABASE_SERVICE_ROLE_KEY set koro (.env.local + Vercel)."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
