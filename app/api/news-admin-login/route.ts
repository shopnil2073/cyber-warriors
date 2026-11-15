import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isCommandCenterEmail } from "../../lib/adminEmails";
import { verifyPassword } from "../../lib/server/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function findAuthUserByEmail(admin: SupabaseClient, email: string) {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email);
    if (found) return found;
    if (data.users.length < 1000) break;
  }
  return null;
}

// Website er email + password ta check kore, tarpor Supabase Auth account ta sync kore dey.
// Tar por browser supabase.auth.signInWithPassword() diye login kore (RLS er jonno eta lage).
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").toLowerCase().trim();
    const password = String(body?.password ?? "");

    if (!email || !password) return fail("Password dao.", 400);
    if (!isCommandCenterEmail(email)) {
      return fail("Ei email news panel er admin list e nai.", 403);
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return fail("Server config incomplete: SUPABASE_SERVICE_ROLE_KEY set kora nai.", 500);
    }

    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1) Website password check (players table)
    const escaped = email.replace(/[\\%_]/g, "\\$&");
    const { data: player, error: playerErr } = await admin
      .from("players")
      .select("email,password")
      .ilike("email", escaped)
      .maybeSingle();

    if (playerErr) return fail("Player check korte problem hoyeche.", 500);
    if (!player) return fail("Ei email diye website e account paowa jayni.", 404);
    if (!verifyPassword(password, String(player.password)).ok) return fail("Password vul.", 401);

    // 2) Supabase Auth user ta thik kore nao (na thakle banao, thakle password sync koro)
    const { data: adminRow } = await admin
      .from("news_admins")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    let userId: string | null = adminRow?.user_id ?? null;
    if (!userId) {
      const existing = await findAuthUserByEmail(admin, email);
      userId = existing?.id ?? null;
    }

    if (userId) {
      const { error } = await admin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      });
      if (error) return fail(`Auth update hoyni: ${error.message}`, 400);
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error || !data.user) {
        return fail(`Auth account banano jayni: ${error?.message ?? "unknown"}`, 400);
      }
      userId = data.user.id;
    }

    // 3) News admin list e rakho
    const { error: upsertErr } = await admin
      .from("news_admins")
      .upsert({ user_id: userId, email }, { onConflict: "user_id" });
    if (upsertErr) return fail(`Admin list update hoyni: ${upsertErr.message}`, 500);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("news-admin-login:", err);
    return fail("Unexpected error. Abar chesta koro.", 500);
  }
}
