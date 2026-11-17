import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/server/supabaseAdmin";
import { toProfile, toUpdateRow } from "../../../lib/server/playerMapper";
import { getSession } from "../../../lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

// Logged-in user shudhu nijer profile update korte pare (session cookie theke id ney)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return fail("Login koro.", 401);

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return fail("Invalid request.", 400);

    const row = toUpdateRow(body);
    if (typeof row.avatar === "string" && row.avatar.startsWith("data:") && row.avatar.length > 1_400_000) {
      return fail("Avatar onek boro. Choto photo dao.", 413);
    }
    if (Object.keys(row).length === 0) return fail("Update korar moto kichu nai.", 400);

    const db = getAdminClient();
    for (let attempt = 0; attempt < 10; attempt++) {
      const { data, error } = await db.from("players").update(row).eq("id", session.id).select().single();
      if (!error && data) {
        return NextResponse.json({ ok: true, user: toProfile(data as Record<string, unknown>) });
      }
      if (error?.code === "PGRST204") {
        const col = /'([^']+)' column/.exec(error.message)?.[1];
        if (col && col in row) {
          delete row[col];
          if (Object.keys(row).length === 0) return fail("Table e ei column gulo nai.", 400);
          continue;
        }
      }
      return fail(`Database error: ${error?.message ?? "unknown"}`, 500);
    }
    return fail("Update kora jayni.", 500);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Unexpected error", 500);
  }
}
