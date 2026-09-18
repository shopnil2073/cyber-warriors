export interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gameId: string;
  avatar: string;
  password?: string;
  device?: string;
  cobegId?: string;
  discord?: string;
  city?: string;
  fbUrl?: string;
  bloodGroup?: string;
  dob?: string;
  app: number;
  w: number;
  d: number;
  gf: number;
  rtg: number;
}

export const getStoredUsers = (): PlayerProfile[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem("cw_all_players");
  return users ? JSON.parse(users) : [];
};

export const registerUser = (newUser: Omit<PlayerProfile, "id" | "app" | "w" | "d" | "gf" | "rtg">) => {
  const users = getStoredUsers();
  const player: PlayerProfile = {
    ...newUser,
    id: Date.now().toString(),
    app: 0,
    w: 0,
    d: 0,
    gf: 0,
    rtg: 1000,
  };
  users.push(player);
  localStorage.setItem("cw_all_players", JSON.stringify(users));
  localStorage.setItem("cw_user_name", player.name);
  localStorage.setItem("cw_logged_in_user", JSON.stringify(player));
  return player;
};

export const loginUser = (email: string, password?: string) => {
  const users = getStoredUsers();
  const player = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (player) {
    if (password && player.password && player.password !== password) {
      return { success: false, message: "Invalid Password!" };
    }
    localStorage.setItem("cw_user_name", player.name);
    localStorage.setItem("cw_logged_in_user", JSON.stringify(player));
    return { success: true, player };
  }
  return { success: false, message: "No account found with this email!" };
};