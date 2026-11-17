export const CATEGORIES = [
  { id: "solo", label: "Solo", icon: "🥷", team: false },
  { id: "duo", label: "Duo", icon: "🤝", team: true },
  { id: "4man", label: "4 Man", icon: "👥", team: true },
  { id: "6man", label: "6 Man", icon: "🛡️", team: true },
  { id: "teamup", label: "Team Up", icon: "⚔️", team: true },
  { id: "friendly", label: "Friendly", icon: "🎮", team: false },
  { id: "bid", label: "Bid", icon: "💰", team: true },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type TournamentStatus = "open" | "live" | "completed";
export type TournamentFormat = "league" | "knockout";

export const STATUSES: { id: TournamentStatus; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "live", label: "Live" },
  { id: "completed", label: "Completed" },
];

export const isCategory = (v: unknown): v is CategoryId => CATEGORIES.some((c) => c.id === v);
export const isStatus = (v: unknown): v is TournamentStatus => STATUSES.some((s) => s.id === v);
export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const categoryIcon = (id: string) => CATEGORIES.find((c) => c.id === id)?.icon ?? "🏆";

export type Tournament = {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  season: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  description: string | null;
  prize: string | null;
  banner_url: string | null;
  max_entries: number | null;
  start_date: string | null;
  created_at: string;
  tournament_entries?: { count: number }[];
};

export type Entry = {
  id: string;
  tournament_id: string;
  name: string;
  seed: number | null;
  entry_members: { player_id: string }[];
};

export type MatchCard = {
  id: string;
  tournament_id: string;
  tournament_name: string;
  tournament_slug: string;
  category: CategoryId;
  format: TournamentFormat;
  stage: string;
  round_no: number;
  match_no: number;
  home_entry_id: string | null;
  away_entry_id: string | null;
  home_name: string | null;
  away_name: string | null;
  home_player_id: string | null;
  away_player_id: string | null;
  home_avatar: string | null;
  away_avatar: string | null;
  home_device: string | null;
  away_device: string | null;
  home_score: number | null;
  away_score: number | null;
  home_pens: number | null;
  away_pens: number | null;
  winner_entry_id: string | null;
  motm_player_id: string | null;
  motm_name: string | null;
  motm_avatar: string | null;
  status: "scheduled" | "live" | "completed";
  scheduled_at: string | null;
  completed_at: string | null;
  next_match_id: string | null;
  next_slot: "home" | "away" | null;
};

export type Standing = {
  tournament_id: string;
  entry_id: string;
  name: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

export type RankedPlayer = {
  player_id: string;
  name: string;
  avatar: string | null;
  rank_badge: string | null;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  conceded: number;
  win_rate: number | null;
  rating: number;
};

export type Scorer = {
  player_id: string;
  name: string;
  avatar: string | null;
  matches: number;
  goals: number;
  ratio: number | null;
};

export type PublicPlayer = {
  id: string;
  name: string;
  avatar: string | null;
  konami_id: string | null;
  device: string | null;
  location: string | null;
  rank_badge: string | null;
  facebook: string | null;
};
