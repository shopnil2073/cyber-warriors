// Browser theke auth API gulo call korar helper (userStore er loginPlayer/registerNewPlayer er jaygay)
import type { UserProfile } from "./userStore";

const ACTIVE_USER_KEY = "cw_active_user";

type ApiResult = { ok?: boolean; error?: string; user?: UserProfile };

async function post(url: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as ApiResult;
    if (!res.ok && !json.error) json.error = `Request failed (${res.status})`;
    return json;
  } catch {
    return { ok: false, error: "Network error. Internet connection check koro." };
  }
}

export async function registerPlayerApi(user: UserProfile): Promise<{ ok: boolean; error?: string }> {
  const json = await post("/api/auth/register", user);
  return { ok: json.ok === true, error: json.error };
}

export async function loginPlayerApi(
  email: string,
  password: string,
  remember: boolean
): Promise<{ user?: UserProfile; error?: string }> {
  const json = await post("/api/auth/login", { email, password, remember });
  if (json.ok && json.user) {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(json.user));
    return { user: json.user };
  }
  return { error: json.error ?? "Invalid email or password!" };
}

export async function logoutPlayerApi(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } finally {
    localStorage.removeItem(ACTIVE_USER_KEY);
    window.dispatchEvent(new Event("cw_auth_change"));
  }
}

// Boro avatar photo ke choto kore (max 480px, JPEG) jate request boro na hoy
export async function compressAvatar(file: File, maxDim = 480, quality = 0.82): Promise<string> {
  const bmp = await createImageBitmap(file);
  const ratio = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * ratio);
  const h = Math.round(bmp.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return canvas.toDataURL("image/jpeg", quality);
}
