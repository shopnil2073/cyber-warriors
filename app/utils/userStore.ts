import { supabase } from "../lib/supabase";

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
};

// 1. New Player Registration
export const registerNewPlayer = async (newUser: UserProfile): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from("players")
      .select("id")
      .eq("email", newUser.email)
      .maybeSingle();

    if (existing) {
      console.error("Email already registered");
      return false;
    }

    const { error } = await supabase.from("players").insert([
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        avatar: newUser.avatar,
        konami_id: newUser.konamiId,
        device: newUser.hardware,
        location: newUser.location,
        facebook: newUser.facebook,
        whatsapp: newUser.whatsapp,
        rank_badge: newUser.rank,
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error.message, error.details);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Register Error:", err);
    return false;
  }
};

// 2. Player Sign In
export const loginPlayer = async (email: string, pass: string): Promise<UserProfile | null> => {
  try {
    const { data: u, error } = await supabase
      .from("players")
      .select("*")
      .eq("email", email)
      .eq("password", pass)
      .maybeSingle();

    if (error || !u) {
      if (error) console.error("Login Query Error:", error.message);
      return null;
    }

    const userProfile: UserProfile = {
      id: u.id,
      name: u.name,
      email: u.email,
      rank: u.rank_badge || "#NEW",
      avatar: u.avatar || "/logo.jpg",
      konamiId: u.konami_id || "Not Set",
      hardware: u.device || "Not Set",
      location: u.location || "Not Set",
      bloodGroup: u.blood_group || "Not Set",
      dob: u.dob || "Not Set",
      status: u.status || "Free Agent",
      facebook: u.facebook || "",
      whatsapp: u.whatsapp || "",
      discord: u.discord || "",
      cobegId: u.cobeg_id || "",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("cw_active_user", JSON.stringify(userProfile));
    }
    return userProfile;
  } catch (err) {
    console.error("Login Exception:", err);
    return null;
  }
};

// 3. Get Active User
export const getActiveUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("cw_active_user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 4. Get All Registered Players (Async for Supabase & Fallback to LocalStorage)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase.from("players").select("*");
    if (!error && data && data.length > 0) {
      return data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        rank: u.rank_badge || "#NEW",
        avatar: u.avatar || "/logo.jpg",
        konamiId: u.konami_id || "Not Set",
        hardware: u.device || "Not Set",
        location: u.location || "Not Set",
        bloodGroup: u.blood_group || "Not Set",
        dob: u.dob || "Not Set",
        status: u.status || "Free Agent",
        facebook: u.facebook || "",
        whatsapp: u.whatsapp || "",
        discord: u.discord || "",
        cobegId: u.cobeg_id || "",
      }));
    }
  } catch (err) {
    console.error("Fetch players error:", err);
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("cw_registered_users");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
};

// 5. Update Profile Data
export const updateActiveUserProfile = async (updated: UserProfile): Promise<boolean> => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cw_active_user", JSON.stringify(updated));
  }
  try {
    const { error } = await supabase
      .from("players")
      .update({
        name: updated.name,
        avatar: updated.avatar,
        konami_id: updated.konamiId,
        device: updated.hardware,
        location: updated.location,
        blood_group: updated.bloodGroup,
        dob: updated.dob,
        facebook: updated.facebook,
        whatsapp: updated.whatsapp,
        discord: updated.discord,
        cobeg_id: updated.cobegId,
      })
      .eq("email", updated.email);

    if (error) {
      console.error("Update Profile Error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Update Error:", err);
    return false;
  }
};

// 6. Sign Out Player
export const logoutPlayer = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cw_active_user");
  }
};