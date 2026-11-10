import { createClient } from "@supabase/supabase-js";

// Server-e public data porar jonno (login chara). RLS shudhu published news dey.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env missing: NEXT_PUBLIC_SUPABASE_URL ar NEXT_PUBLIC_SUPABASE_ANON_KEY set koro (.env.local + Vercel)."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
