import { createClient } from "@supabase/supabase-js";

// Browser client (login + admin panel). Shudhu public/anon key use hoy.
// Kokhono service_role key NEXT_PUBLIC_ diye rakhba na.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Supabase env missing: NEXT_PUBLIC_SUPABASE_URL ar NEXT_PUBLIC_SUPABASE_ANON_KEY set koro (.env.local + Vercel)."
  );
}

export const supabase = createClient(url, key);
