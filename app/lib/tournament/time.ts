// Bangladesh time (Asia/Dhaka) helper
const TZ = "Asia/Dhaka";

export const dayKey = (iso: string | Date): string =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD

export const todayKey = () => dayKey(new Date());

export const formatDayLong = (key: string): string =>
  new Date(`${key}T12:00:00+06:00`).toLocaleDateString("en-GB", {
    timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

export const formatDayShort = (key: string): string =>
  new Date(`${key}T12:00:00+06:00`).toLocaleDateString("en-GB", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });

export const formatTime = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }) : "TBA";

export const formatDateTime = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleString("en-GB", { timeZone: TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "TBA";

export const formatDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" }) : "-";
