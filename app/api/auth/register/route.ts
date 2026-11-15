import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/server/supabaseAdmin";
import { hashPassword } from "../../../lib/server/password";
import { toInsertRow, toProfile } from "../../../lib/server/playerMapper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (error: string, status: number, extra?: Record<string, unknown>) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");
const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return fail("Invalid request.", 400);

    const name = str(body.name, 80);
    const email = str(body.email, 160).toLowerCase();
    const password = String(body.password ?? "").trim();
    const konamiId = str(body.konamiId, 60);
    const hardware = str(body.hardware, 80);
    const facebook = str(body.facebook, 300);

    if (!name || !email || !password || !konamiId || !hardware || !facebook) {
      return fail("Please fill in all REQUIRED fields!", 400);
    }
    if (!EMAIL_RE.test(email)) return fail("Valid email address dao.", 400);
    if (password.length < 8) return fail("Password must be at least 8 characters long!", 400);
    if (password.length > 128) return fail("Password onek boro.", 400);

    // Avatar: shudhu image data URL ba site er nijer path
    let avatar = String(body.avatar ?? "/logo.jpg");
    if (!(avatar.startsWith("data:image/") || avatar.startsWith("/")) || avatar.length > 1_500_000) {
      avatar = "/logo.jpg";
    }

    const db = getAdminClient();

    // 1) Email age theke ache kina
    const { data: existing, error: lookupErr } = await db
      .from("players")
      .select("id")
      .ilike("email", escapeLike(email))
      .limit(1);

    if (lookupErr) {
      console.error("register lookup:", lookupErr);
      return fail(`Database error: ${lookupErr.message}`, 500, { code: lookupErr.code });
    }
    if (existing && existing.length > 0) {
      return fail("This email address is already registered!", 409);
    }

    // 2) Row baniye insert (password hash kore)
    const baseRow = {
      ...toInsertRow({ ...body, name, email, konamiId, hardware, facebook, avatar }),
      password: hashPassword(password),
    } as Record<string, unknown>;

    for (let attempt = 0; attempt < 8; attempt++) {
      const row: Record<string, unknown> = {
        ...baseRow,
        id: `CW-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      const { data, error } = await db.from("players").insert(row).select().single();

      if (!error && data) {
        return NextResponse.json({ ok: true, user: toProfile(data as Record<string, unknown>) });
      }
      if (!error) break;

      // Table e je column nai, seta bad diye abar chesta (schema cache error)
      if (error.code === "PGRST204") {
        const col = /'([^']+)' column/.exec(error.message)?.[1];
        if (col && col in baseRow && col !== "email" && col !== "password") {
          delete baseRow[col];
          continue;
        }
      }
      // Unique violation
      if (error.code === "23505") {
        if (/email/i.test(error.message)) return fail("This email address is already registered!", 409);
        continue; // id collision, notun id diye abar
      }

      console.error("register insert:", error);
      return fail(`Database error: ${error.message}`, 500, { code: error.code });
    }

    return fail("Registration complete kora jayni. Abar chesta koro.", 500);
  } catch (err) {
    console.error("register:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return fail(`Server error: ${message}`, 500);
  }
}
