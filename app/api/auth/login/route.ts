import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/server/supabaseAdmin";
import { hashPassword, verifyPassword } from "../../../lib/server/password";
import { toProfile } from "../../../lib/server/playerMapper";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "../../../lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

// Choto brute-force protection (server instance e memory te thake, best-effort)
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;

function blocked(key: string): boolean {
  const rec = attempts.get(key);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return rec.count >= MAX_FAILS;
}
function noteFail(key: string) {
  const rec = attempts.get(key);
  if (!rec || Date.now() - rec.first > WINDOW_MS) attempts.set(key, { count: 1, first: Date.now() });
  else rec.count += 1;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "").trim();
    const remember = body?.remember === true;

    if (!email || !password) return fail("Please enter both email and password!", 400);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const key = `${ip}|${email}`;
    if (blocked(key)) return fail("Onek bar vul hoyeche. 15 minute pore abar chesta koro.", 429);

    const db = getAdminClient();
    const { data: rows, error } = await db
      .from("players")
      .select("*")
      .ilike("email", escapeLike(email))
      .limit(1);

    if (error) {
      console.error("login lookup:", error);
      return fail(`Database error: ${error.message}`, 500);
    }

    const player = rows?.[0] as Record<string, unknown> | undefined;
    const check = verifyPassword(password, player?.password as string | undefined);

    if (!player || !check.ok) {
      noteFail(key);
      return fail("Invalid email or password! Please check your credentials.", 401);
    }

    // Purono plain text password hole ekhon hash kore rakho
    if (check.needsUpgrade) {
      const { error: upErr } = await db
        .from("players")
        .update({ password: hashPassword(password) })
        .eq("id", player.id as string);
      if (upErr) console.error("password upgrade failed:", upErr.message);
    }

    attempts.delete(key);

    const ttl = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const token = createSessionToken(String(player.id), String(player.email), ttl);

    const res = NextResponse.json({ ok: true, user: toProfile(player) });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(remember ? ttl : undefined));
    return res;
  } catch (err) {
    console.error("login:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return fail(`Server error: ${message}`, 500);
  }
}
