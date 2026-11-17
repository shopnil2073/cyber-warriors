// DB (players table) <-> site er UserProfile mapping.
// DB column: id, name, email, password, avatar, konami_id, device, location, facebook, whatsapp, rank_badge (+ optional: blood_group, dob, status, discord, cobeg_id, role)

type Row = Record<string, unknown>;
const s = (v: unknown, fallback = "") => (typeof v === "string" && v.trim() ? v : fallback);

// Password kokhono browser e pathano hobe na. Shape ta utils/userStore.ts er UserProfile er hubohu.
export function toProfile(u: Row): Record<string, unknown> {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    rank: s(u.rank_badge, "#NEW"),
    avatar: s(u.avatar, "/logo.jpg"),
    konamiId: s(u.konami_id, "Not Set"),
    hardware: s(u.device, "Not Set"),
    location: s(u.location, "Not Set"),
    bloodGroup: s(u.blood_group, "Not Set"),
    dob: s(u.dob, "Not Set"),
    status: s(u.status, "Free Agent"),
    facebook: s(u.facebook),
    whatsapp: s(u.whatsapp),
    discord: s(u.discord),
    cobegId: s(u.cobeg_id),
    role: s(u.role, "player"),
  };
}

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Register er jonno row. role client theke newa hoy na (sobai "player").
export function toInsertRow(input: Row): Row {
  const row: Row = {
    name: clean(input.name, 80),
    email: clean(input.email, 160).toLowerCase(),
    avatar: clean(input.avatar, 1_500_000),
    konami_id: clean(input.konamiId, 60),
    device: clean(input.hardware, 80),
    location: clean(input.location, 120),
    facebook: clean(input.facebook, 300),
    whatsapp: clean(input.whatsapp, 40),
    rank_badge: "#NEW",
    role: "player",
  };
  return row;
}

// Profile update e jei field gulo user nijer change korte pare
export function toUpdateRow(input: Row): Row {
  const map: Array<[string, string, number]> = [
    ["name", "name", 80],
    ["avatar", "avatar", 1_500_000],
    ["konamiId", "konami_id", 60],
    ["hardware", "device", 80],
    ["location", "location", 120],
    ["bloodGroup", "blood_group", 20],
    ["dob", "dob", 30],
    ["facebook", "facebook", 300],
    ["whatsapp", "whatsapp", 40],
    ["discord", "discord", 80],
    ["cobegId", "cobeg_id", 60],
  ];
  const row: Row = {};
  for (const [from, to, max] of map) {
    if (input[from] !== undefined && input[from] !== null) row[to] = clean(input[from], max);
  }
  return row;
}
