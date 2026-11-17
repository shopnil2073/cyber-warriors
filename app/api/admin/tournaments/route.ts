import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/server/supabaseAdmin";
import { requireAdminSession } from "../../../lib/server/session";
import { generateKnockout, generateLeague, shuffle, slugify } from "../../../lib/tournament/bracket";
import { CATEGORIES, isCategory, isStatus } from "../../../lib/tournament/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = Record<string, unknown>;

class ApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const int = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
};
const need = <T>(value: T | null | undefined, message: string): T => {
  if (value === null || value === undefined || value === "") throw new ApiError(message);
  return value;
};

export async function POST(req: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ ok: false, error: "Admin login lagbe (website e sign in koro)." }, { status: 403 });

    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) throw new ApiError("Invalid request.");

    const db = getAdminClient();
    const action = String(body.action ?? "");
    const result = await handlers(action, body, db, session.email);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof ApiError) return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
    console.error("admin/tournaments:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

type Db = ReturnType<typeof getAdminClient>;

async function handlers(action: string, body: Body, db: Db, adminEmail: string): Promise<Record<string, unknown>> {
  switch (action) {
    // ------------------------------------------------------------ tournaments
    case "create_tournament": {
      const name = need(str(body.name, 100), "Tournament er naam dao.");
      const category = body.category;
      if (!isCategory(category)) throw new ApiError("Category valid na.");
      const format = body.format === "knockout" ? "knockout" : "league";
      const base = {
        name,
        category,
        format,
        season: str(body.season, 40) || null,
        description: str(body.description, 1000) || null,
        prize: str(body.prize, 200) || null,
        max_entries: int(body.maxEntries),
        banner_url: str(body.bannerUrl, 500) || null,
        status: "open",
        created_by: adminEmail,
      };
      let slug = slugify(`${name} ${base.season ?? ""}`);
      for (let i = 0; i < 4; i++) {
        const { data, error } = await db.from("tournaments").insert({ ...base, slug }).select().single();
        if (!error) return { tournament: data };
        if (error.code === "23505") {
          slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
          continue;
        }
        throw new ApiError(`Database error: ${error.message}`, 500);
      }
      throw new ApiError("Slug banano jayni.", 500);
    }

    case "update_tournament": {
      const id = need(str(body.id, 60), "id lagbe.");
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.status !== undefined) {
        if (!isStatus(body.status)) throw new ApiError("Status valid na.");
        patch.status = body.status;
      }
      if (body.name !== undefined) patch.name = need(str(body.name, 100), "Naam dao.");
      if (body.season !== undefined) patch.season = str(body.season, 40) || null;
      if (body.description !== undefined) patch.description = str(body.description, 1000) || null;
      if (body.prize !== undefined) patch.prize = str(body.prize, 200) || null;
      const { data, error } = await db.from("tournaments").update(patch).eq("id", id).select().single();
      if (error) throw new ApiError(error.message, 500);
      return { tournament: data };
    }

    case "delete_tournament": {
      const id = need(str(body.id, 60), "id lagbe.");
      const { error } = await db.from("tournaments").delete().eq("id", id);
      if (error) throw new ApiError(error.message, 500);
      return {};
    }

    // ---------------------------------------------------------------- entries
    case "add_entries": {
      const tournamentId = need(str(body.tournamentId, 60), "tournamentId lagbe.");
      const list = Array.isArray(body.entries) ? (body.entries as Body[]) : [];
      if (list.length === 0) throw new ApiError("Kom ponche 1 ta entry dao.");

      const { data: t } = await db.from("tournaments").select("id, category, max_entries").eq("id", tournamentId).maybeSingle();
      if (!t) throw new ApiError("Tournament paowa jayni.", 404);
      const isTeam = CATEGORIES.find((c) => c.id === t.category)?.team ?? false;

      const parsed = list.map((e) => ({
        name: str(e.name, 60),
        playerIds: Array.isArray(e.playerIds) ? Array.from(new Set((e.playerIds as unknown[]).map((p) => str(p, 40)).filter(Boolean))) : [],
      }));
      for (const e of parsed) {
        if (e.playerIds.length === 0) throw new ApiError("Prottek entry te kom ponche 1 jon player lagbe.");
        if (!isTeam && e.playerIds.length !== 1) throw new ApiError("Ei category te prottek entry te thik 1 jon player.");
        if (isTeam && e.playerIds.length < 2) throw new ApiError("Team entry te kom ponche 2 jon player lagbe.");
        if (isTeam && !e.name) throw new ApiError("Team er naam dao.");
      }

      const allIds = Array.from(new Set(parsed.flatMap((e) => e.playerIds)));
      const { data: players } = await db.from("players").select("id, name").in("id", allIds);
      const nameById = new Map((players ?? []).map((p) => [p.id as string, p.name as string]));
      for (const id of allIds) if (!nameById.has(id)) throw new ApiError(`Player paowa jayni: ${id}`);

      // ekoi player duibar na thake
      const { data: existingEntries } = await db.from("tournament_entries").select("id").eq("tournament_id", tournamentId);
      const existingIds = (existingEntries ?? []).map((e) => e.id as string);
      if (existingIds.length) {
        const { data: existingMembers } = await db.from("entry_members").select("player_id").in("entry_id", existingIds);
        const taken = new Set((existingMembers ?? []).map((m) => m.player_id as string));
        const dup = allIds.find((id) => taken.has(id));
        if (dup) throw new ApiError(`${nameById.get(dup)} age thekei ei tournament e ache.`);
      }
      if (t.max_entries && existingIds.length + parsed.length > t.max_entries) {
        throw new ApiError(`Maximum ${t.max_entries} ta entry.`);
      }

      for (const e of parsed) {
        const entryName = isTeam ? e.name : nameById.get(e.playerIds[0])!;
        const { data: entry, error } = await db
          .from("tournament_entries")
          .insert({ tournament_id: tournamentId, name: entryName })
          .select("id")
          .single();
        if (error || !entry) throw new ApiError(error?.message ?? "Entry add hoyni", 500);
        const { error: mErr } = await db
          .from("entry_members")
          .insert(e.playerIds.map((player_id) => ({ entry_id: entry.id, player_id })));
        if (mErr) {
          await db.from("tournament_entries").delete().eq("id", entry.id);
          throw new ApiError(mErr.message, 500);
        }
      }
      return { added: parsed.length };
    }

    case "remove_entry": {
      const entryId = need(str(body.entryId, 60), "entryId lagbe.");
      const { data: played } = await db
        .from("matches")
        .select("id")
        .eq("status", "completed")
        .or(`home_entry_id.eq.${entryId},away_entry_id.eq.${entryId}`)
        .limit(1);
      if (played && played.length) throw new ApiError("Ei entry er match ageii complete. Remove kora jabe na.");
      const { error } = await db.from("tournament_entries").delete().eq("id", entryId);
      if (error) throw new ApiError(error.message, 500);
      return {};
    }

    // --------------------------------------------------------------- fixtures
    case "generate_fixtures": {
      const tournamentId = need(str(body.tournamentId, 60), "tournamentId lagbe.");
      const { data: t } = await db.from("tournaments").select("id, format, status").eq("id", tournamentId).maybeSingle();
      if (!t) throw new ApiError("Tournament paowa jayni.", 404);

      const { data: done } = await db.from("matches").select("id").eq("tournament_id", tournamentId).eq("status", "completed").limit(1);
      if (done && done.length) throw new ApiError("Result publish hoye geche, tai fixtures abar generate kora jabe na. Age result gulo reset koro.");

      const { data: entries } = await db
        .from("tournament_entries")
        .select("id, seed, created_at")
        .eq("tournament_id", tournamentId)
        .order("seed", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
      let ids = (entries ?? []).map((e) => e.id as string);
      if (ids.length < 2) throw new ApiError("Kom ponche 2 ta entry add koro.");
      if (body.shuffle !== false) ids = shuffle(ids);

      let generated;
      try {
        generated = t.format === "knockout" ? generateKnockout(ids) : generateLeague(ids, body.rounds === 2 ? 2 : 1);
      } catch (e) {
        throw new ApiError(e instanceof Error ? e.message : "Fixture generate hoyni");
      }

      await db.from("matches").delete().eq("tournament_id", tournamentId);
      const now = new Date().toISOString();
      const rows = generated.map((m) => ({
        ...m,
        tournament_id: tournamentId,
        completed_at: m.status === "completed" ? now : null,
      }));
      const { error } = await db.from("matches").insert(rows);
      if (error) throw new ApiError(`Fixture insert hoyni: ${error.message}`, 500);

      if (t.status === "open") await db.from("tournaments").update({ status: "live", updated_at: now }).eq("id", tournamentId);
      return { matches: rows.length };
    }

    case "create_match": {
      const tournamentId = need(str(body.tournamentId, 60), "tournamentId lagbe.");
      const homeId = need(str(body.homeEntryId, 60), "Home side dao.");
      const awayId = need(str(body.awayEntryId, 60), "Away side dao.");
      if (homeId === awayId) throw new ApiError("Duto side alada hote hobe.");
      const { count } = await db.from("matches").select("id", { count: "exact", head: true }).eq("tournament_id", tournamentId);
      const { data, error } = await db
        .from("matches")
        .insert({
          tournament_id: tournamentId,
          home_entry_id: homeId,
          away_entry_id: awayId,
          stage: str(body.stage, 40) || "Match",
          round_no: 1,
          match_no: (count ?? 0) + 1,
          scheduled_at: body.scheduledAt ? new Date(String(body.scheduledAt)).toISOString() : null,
        })
        .select()
        .single();
      if (error) throw new ApiError(error.message, 500);
      return { match: data };
    }

    case "save_match": {
      const matchId = need(str(body.matchId, 60), "matchId lagbe.");
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.scheduledAt !== undefined) patch.scheduled_at = body.scheduledAt ? new Date(String(body.scheduledAt)).toISOString() : null;
      if (body.status !== undefined) {
        if (body.status !== "scheduled" && body.status !== "live") throw new ApiError("Status shudhu scheduled/live hote pare.");
        patch.status = body.status;
      }
      const { data, error } = await db.from("matches").update(patch).eq("id", matchId).neq("status", "completed").select().single();
      if (error) throw new ApiError("Match update hoyni (complete hole age reset koro).");
      return { match: data };
    }

    // ---------------------------------------------------------------- results
    case "publish_match": {
      const matchId = need(str(body.matchId, 60), "matchId lagbe.");
      const homeScore = int(body.homeScore);
      const awayScore = int(body.awayScore);
      if (homeScore === null || awayScore === null) throw new ApiError("Duto score-i dao (0 ba tar beshi).");

      const { data: m } = await db.from("matches").select("id, home_entry_id, away_entry_id").eq("id", matchId).maybeSingle();
      if (!m || !m.home_entry_id || !m.away_entry_id) throw new ApiError("Match er duto side ageii thaka lagbe.");

      const { data: members } = await db
        .from("entry_members")
        .select("entry_id, player_id")
        .in("entry_id", [m.home_entry_id, m.away_entry_id]);
      const memberIds = new Set((members ?? []).map((x) => x.player_id as string));

      const motm = str(body.motmPlayerId, 40);
      if (motm && !memberIds.has(motm)) throw new ApiError("MOTM ei match er player hote hobe.");

      // team match e scorer goals: jei side e dewa hoyeche, sum == oi side er score
      let playerGoals: Record<string, number> | null = null;
      if (body.playerGoals && typeof body.playerGoals === "object") {
        playerGoals = {};
        for (const [pid, g] of Object.entries(body.playerGoals as Record<string, unknown>)) {
          const n = int(g);
          if (!memberIds.has(pid) || n === null) continue;
          playerGoals[pid] = n;
        }
        for (const [entryId, score] of [
          [m.home_entry_id, homeScore],
          [m.away_entry_id, awayScore],
        ] as const) {
          const side = (members ?? []).filter((x) => x.entry_id === entryId).map((x) => x.player_id as string);
          if (side.length > 1 && side.some((p) => p in playerGoals!)) {
            const sum = side.reduce((a, p) => a + (playerGoals![p] ?? 0), 0);
            if (sum !== score) throw new ApiError(`Player goal er jog (${sum}) team score (${score}) er shathe mile na.`);
          }
        }
      }

      const { data, error } = await db.rpc("publish_match_result", {
        p_match_id: matchId,
        p_home_score: homeScore,
        p_away_score: awayScore,
        p_home_pens: int(body.homePens),
        p_away_pens: int(body.awayPens),
        p_motm_player_id: motm || null,
        p_player_goals: playerGoals,
      });
      if (error) throw new ApiError(error.message);
      return { match: data };
    }

    case "reset_match": {
      const matchId = need(str(body.matchId, 60), "matchId lagbe.");
      const { data, error } = await db.rpc("reset_match_result", { p_match_id: matchId });
      if (error) throw new ApiError(error.message);
      return { match: data };
    }

    default:
      throw new ApiError("Unknown action.");
  }
}
