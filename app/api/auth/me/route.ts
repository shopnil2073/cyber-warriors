import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/server/supabaseAdmin";
import { toProfile } from "../../../lib/server/playerMapper";
import { getSession } from "../../../lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cookie session thik ache kina + latest profile (password chara) ferot dey
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });

    const { data, error } = await getAdminClient()
      .from("players")
      .select("*")
      .eq("id", session.id)
      .maybeSingle();

    if (error || !data) return NextResponse.json({ ok: false }, { status: 401 });
    return NextResponse.json({ ok: true, user: toProfile(data as Record<string, unknown>) });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
