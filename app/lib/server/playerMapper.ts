// DB column (snake_case, jemon konami_id) <-> site er UserProfile (camelCase, jemon konamiId)

export const snakeToCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
export const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

// Password kokhono browser e pathano hobe na
export function toProfile(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "password") continue;
    out[snakeToCamel(key)] = value;
  }
  return out;
}

const INSERT_FIELDS = [
  "name",
  "email",
  "rank",
  "avatar",
  "konamiId",
  "hardware",
  "location",
  "bloodGroup",
  "dob",
  "status",
  "facebook",
  "whatsapp",
] as const;

export function toInsertRow(input: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const field of INSERT_FIELDS) {
    const value = input[field];
    if (value === undefined || value === null) continue;
    row[camelToSnake(field)] = typeof value === "string" ? value.trim() : value;
  }
  return row;
}
