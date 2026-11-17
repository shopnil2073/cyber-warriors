import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CategoryId,
  Entry,
  MatchCard,
  PublicPlayer,
  RankedPlayer,
  Scorer,
  Standing,
  Tournament,
  TournamentStatus,
} from "./types";

// Server (createPublicClient) ar browser (supabase) dui jaygay-i use kora jay: db param diye dao.

export async function fetchTournaments(
  db: SupabaseClient,
  opts: { category?: CategoryId; status?: TournamentStatus; limit?: number } = {}
): Promise<Tournament[]> {
  let q = db.from("tournaments").select("*, tournament_entries(count)").order("created_at", { ascending: false });
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error("fetchTournaments:", error.message);
    return [];
  }
  return (data ?? []) as Tournament[];
}

export async function fetchTournamentBySlug(db: SupabaseClient, slugOrId: string): Promise<Tournament | null> {
  const cleanSlug = decodeURIComponent(slugOrId).trim();
  const slugWithSpaces = cleanSlug.replace(/-/g, " ");

  // ১. slug বা ilike (case-insensitive & space/hyphen handled) দিয়ে খোঁজার চেষ্টা করবে
  let { data, error } = await db
    .from("tournaments")
    .select("*, tournament_entries(count)")
    .or(`slug.eq.${cleanSlug},slug.ilike.${slugWithSpaces},slug.ilike.${cleanSlug}`)
    .maybeSingle();

  // ২. যদি তাও না পাওয়া যায়, তবে id দিয়ে খোঁজার চেষ্টা করবে (fallback)
  if (error || !data) {
    const { data: dataById, error: errorById } = await db
      .from("tournaments")
      .select("*, tournament_entries(count)")
      .eq("id", cleanSlug)
      .maybeSingle();

    if (!errorById && dataById) {
      data = dataById;
    }
  }

  return (data as Tournament | null) ?? null;
}

export async function fetchEntries(db: SupabaseClient, tournamentId: string): Promise<Entry[]> {
  const { data, error } = await db
    .from("tournament_entries")
    .select("id, tournament_id, name, seed, entry_members(player_id)")
    .eq("tournament_id", tournamentId)
    .order("created_at", { ascending: true });
  if (error) console.error("fetchEntries:", error.message);
  return (data ?? []) as Entry[];
}

export async function fetchMatchCards(
  db: SupabaseClient,
  opts: {
    tournamentId?: string;
    categories?: CategoryId[];
    status?: ("scheduled" | "live" | "completed")[];
    limit?: number;
    sort?: "schedule" | "latest" | "bracket";
  } = {}
): Promise<MatchCard[]> {
  let q = db.from("match_cards").select("*");
  if (opts.tournamentId) q = q.eq("tournament_id", opts.tournamentId);
  if (opts.categories?.length) q = q.in("category", opts.categories);
  if (opts.status?.length) q = q.in("status", opts.status);
  if (opts.sort === "latest") q = q.order("completed_at", { ascending: false, nullsFirst: false });
  else if (opts.sort === "schedule") q = q.order("scheduled_at", { ascending: true, nullsFirst: false });
  else q = q.order("round_no", { ascending: true }).order("match_no", { ascending: true });
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error("fetchMatchCards:", error.message);
    return [];
  }
  return (data ?? []) as MatchCard[];
}

export async function fetchStandings(db: SupabaseClient, tournamentId: string): Promise<Standing[]> {
  const { data, error } = await db.from("league_standings").select("*").eq("tournament_id", tournamentId);
  if (error) console.error("fetchStandings:", error.message);
  return ((data ?? []) as Standing[]).sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name)
  );
}

export async function fetchRanking(
  db: SupabaseClient,
  period: "overall" | "monthly" | "weekly" = "overall",
  limit = 20
): Promise<RankedPlayer[]> {
  const { data, error } = await db.rpc("get_ranking", { p_period: period, p_limit: limit });
  if (error) {
    console.error("fetchRanking:", error.message);
    return [];
  }
  return (data ?? []) as RankedPlayer[];
}

export async function fetchTopScorers(
  db: SupabaseClient,
  opts: { period?: "overall" | "monthly" | "weekly"; tournamentId?: string; limit?: number } = {}
): Promise<Scorer[]> {
  const { data, error } = await db.rpc("get_top_scorers", {
    p_period: opts.period ?? "overall",
    p_tournament: opts.tournamentId ?? null,
    p_limit: opts.limit ?? 10,
  });
  if (error) {
    console.error("fetchTopScorers:", error.message);
    return [];
  }
  return (data ?? []) as Scorer[];
}

export async function fetchPlayers(db: SupabaseClient): Promise<PublicPlayer[]> {
  const { data, error } = await db.from("players_public").select("*").order("name", { ascending: true });
  if (error) console.error("fetchPlayers:", error.message);
  return (data ?? []) as PublicPlayer[];
}