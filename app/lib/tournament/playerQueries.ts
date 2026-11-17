import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryId, MatchCard } from "./types";

export type PlayerOverview = {
  overall: {
    matches: number; wins: number; draws: number; losses: number; goals: number; conceded: number;
    clean_sheets: number; hat_tricks: number; double_hat_tricks: number; best_goals: number; motm: number;
    win_rate: number; goals_per_match: number; rating: number | null;
  };
  ranks: { overall: number | null; seasonal: number | null; monthly: number | null; weekly: number | null };
  total_players: number;
  streak: { current: number; best: number };
  form: ("W" | "D" | "L")[];
  titles: { champion: number; runner_up: number; third: number };
  categories: { category: CategoryId; matches: number; wins: number; draws: number; losses: number; goals: number; conceded: number }[];
  trend: { month: string; matches: number; wins: number; goals: number }[];
  first_match_at: string | null;
};

export type PlayerTournament = {
  tournament_id: string; slug: string; name: string; category: CategoryId; format: "league" | "knockout";
  status: "open" | "live" | "completed"; season: string | null; prize: string | null; banner_url: string | null;
  entry_id: string; entry_name: string; place: number | null; played: number; total: number;
};

export type RankRow = {
  rank: number | null; player_id: string; name: string; avatar: string | null; konami_id: string | null; device: string | null;
  matches: number; wins: number; draws: number; losses: number; goals: number; conceded: number;
  clean_sheets: number; hat_tricks: number; motm: number; win_rate: number | null; rating: number | null;
};

export type Period = "overall" | "seasonal" | "monthly" | "weekly";

export async function fetchPlayerOverview(db: SupabaseClient, id: string): Promise<PlayerOverview | null> {
  const { data, error } = await db.rpc("get_player_overview", { p_player_id: id });
  if (error) { console.error("fetchPlayerOverview:", error.message); return null; }
  return data as PlayerOverview;
}

export async function fetchPlayerMatches(db: SupabaseClient, id: string, scope: "all" | "upcoming" | "completed" = "all", limit = 300): Promise<MatchCard[]> {
  const { data, error } = await db.rpc("get_player_matches", { p_player_id: id, p_scope: scope, p_limit: limit });
  if (error) { console.error("fetchPlayerMatches:", error.message); return []; }
  return (data ?? []) as MatchCard[];
}

export async function fetchPlayerTournaments(db: SupabaseClient, id: string): Promise<PlayerTournament[]> {
  const { data, error } = await db.rpc("get_player_tournaments", { p_player_id: id });
  if (error) { console.error("fetchPlayerTournaments:", error.message); return []; }
  return (data ?? []) as PlayerTournament[];
}

export async function fetchRankingAll(db: SupabaseClient, period: Period, category: CategoryId | null): Promise<RankRow[]> {
  const { data, error } = await db.rpc("get_ranking_all", { p_period: period, p_category: category });
  if (error) { console.error("fetchRankingAll:", error.message); return []; }
  return (data ?? []) as RankRow[];
}

// Rating formula (SQL er shathe mile): 1000 + 25W + 8D - 10L + 2*GD
export const RATING_FORMULA = "1000 + 25×Win + 8×Draw − 10×Loss + 2×(Goals − Conceded)";
