import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isCommandCenterEmail } from "../adminEmails";

// Signed (HMAC) httpOnly cookie session. Server eta diye bujhe user ke.
export const SESSION_COOKIE = "cw_session";

export type SessionPayload = { id: string; email: string; exp: number };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET set koro (minimum 32 character) .env.local + Vercel e.");
  }
  return s;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(id: string, email: string, ttlSeconds: number): string {
  const payload: SessionPayload = {
    id,
    email: email.toLowerCase().trim(),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = b64(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (!payload.id || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

// Admin route gulo te eta use korbe (porer step e tournament/result API te lagbe)
export async function requireAdminSession(): Promise<SessionPayload | null> {
  const s = await getSession();
  return s && isCommandCenterEmail(s.email) ? s : null;
}

export function sessionCookieOptions(maxAgeSeconds?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAgeSeconds ? { maxAge: maxAgeSeconds } : {}),
  };
}
