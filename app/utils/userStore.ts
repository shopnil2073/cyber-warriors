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
  status: string;
}

const API_BASE_URL = "https://cyber-warriors.xyz/api";

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
};

// ১. রেজিস্টার
export const registerNewPlayer = async (newUser: UserProfile): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    return data.status === "success";
  } catch (err) {
    console.error("Register Error:", err);
    return false;
  }
};

// ২. লগইন
export const loginPlayer = async (email: string, pass: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();

    if (data.status === "success" && data.user) {
      const u = data.user;
      const userProfile: UserProfile = {
        id: u.id,
        name: u.name,
        email: u.email,
        rank: u.rank_badge || "#NEW",
        avatar: u.avatar || "/logo.jpg",
        konamiId: u.konami_id || "Not Set",
        hardware: u.hardware || "Not Set",
        location: u.location || "Not Set",
        bloodGroup: u.blood_group || "Not Set",
        dob: u.dob || "Not Set",
        status: u.status || "Free Agent",
        facebook: u.facebook || "",
        whatsapp: u.whatsapp || "",
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("cw_active_user", JSON.stringify(userProfile));
      }
      return userProfile;
    }
    return null;
  } catch (err) {
    console.error("Login Error:", err);
    return null;
  }
};

// ৩. একটিভ সেশন
export const getActiveUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("cw_active_user");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// ৪. প্রোফাইল আপডেট
export const updateActiveUserProfile = async (updated: UserProfile) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cw_active_user", JSON.stringify(updated));
  }
  try {
    await fetch(`${API_BASE_URL}/update-profile.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  } catch (err) {
    console.error("Update Error:", err);
  }
};

// ৫. লগআউট
export const logoutPlayer = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cw_active_user");
  }
};