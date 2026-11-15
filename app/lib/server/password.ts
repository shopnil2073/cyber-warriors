import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Password hash: scrypt$<salt>$<hash>. Database e ar plain text password thakbe na.
const PREFIX = "scrypt";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${PREFIX}$${salt}$${hash}`;
}

export function isHashed(stored: string): boolean {
  return stored.startsWith(`${PREFIX}$`);
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// Purono (plain text) password gulo-o login korte parbe. Login successful hole auto hash e upgrade hobe.
export function verifyPassword(
  input: string,
  stored: string | null | undefined
): { ok: boolean; needsUpgrade: boolean } {
  if (!stored) return { ok: false, needsUpgrade: false };

  if (isHashed(stored)) {
    const [, salt, hash] = stored.split("$");
    if (!salt || !hash) return { ok: false, needsUpgrade: false };
    const candidate = scryptSync(input, salt, 64).toString("hex");
    return { ok: safeEqual(candidate, hash), needsUpgrade: false };
  }

  const ok = safeEqual(input, stored);
  return { ok, needsUpgrade: ok };
}
