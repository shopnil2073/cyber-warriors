import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  rank: string;
  avatar: string;
  konamiId: string;
  hardware: string;
  location: string;
  bloodGroup: string;
  dob: string;
  facebook?: string;
  whatsapp?: string;
  discord?: string;
  cobegId?: string;
  status: string;
  role?: string;
}

export const EMPTY_USER: UserProfile = {
  id: "",
  name: "",
  email: "",
  rank: "UNRANKED",
  avatar: "/logo.jpg",
  konamiId: "Not Set",
  hardware: "Not Set",
  location: "Not Set",
  bloodGroup: "Not Set",
  dob: "Not Set",
  status: "Free Agent",
  facebook: "",
  whatsapp: "",
  discord: "",
  cobegId: "",
  role: "player",
};

const ACTIVE_USER_KEY = "cw_active_user";

async function post(url: string, body: unknown) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(body),
    });
    return (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; user?: UserProfile };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

// 1. New Player Registration (server API diye: password hash hoy)
export const registerNewPlayer = async (newUser: UserProfile): Promise<boolean> => {
  const json = await post("/api/auth/register", newUser);
  if (!json.ok) console.error("Register failed:", json.error);
  return json.ok === true;
};

// 2. Player Sign In (server API diye: session cookie set hoy)
export const loginPlayer = async (email: string, pass: string): Promise<UserProfile | null> => {
  const json = await post("/api/auth/login", { email, password: pass, remember: true });
  if (json.ok && json.user) {
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(json.user));
    return json.user;
  }
  return null;
};

// 3. Get Active User
export const getActiveUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 4. Logout User (cookie ar localStorage dutoi clear)
export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACTIVE_USER_KEY);
    fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
  }
};
export const logoutPlayer = logoutUser;

// 5. Get All Registered Players  (players_public view theke: email/password/whatsapp ashe na)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase.from("players_public").select("*");
    if (!error && data && data.length > 0) {
      return data.map((u) => ({
        id: u.id,
        name: u.name,
        email: "",
        rank: u.rank_badge || "#NEW",
        avatar: u.avatar || "/logo.jpg",
        konamiId: u.konami_id || "Not Set",
        hardware: u.device || "Not Set",
        location: u.location || "Not Set",
        bloodGroup: "Not Set",
        dob: "Not Set",
        status: "Free Agent",
        facebook: u.facebook || "",
        whatsapp: "",
        discord: "",
        cobegId: "",
        role: "player",
      }));
    }
    if (error) console.error("Fetch players error:", error.message);
  } catch (err) {
    console.error("Fetch players error:", err);
  }
  return [];
};

// 6. Update Profile Data (server API: shudhu nijer profile)
export const updateActiveUserProfile = async (updated: UserProfile): Promise<boolean> => {
  const json = await post("/api/profile/update", updated);
  if (json.ok && json.user) {
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(json.user));
    return true;
  }
  console.error("Update Profile Error:", json.error);
  return false;
};
