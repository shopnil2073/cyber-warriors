"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { fetchEntries, fetchMatchCards, fetchPlayers, fetchTournaments } from "../../lib/tournament/queries";
import {
  CATEGORIES,
  STATUSES,
  type CategoryId,
  type Entry,
  type MatchCard,
  type PublicPlayer,
  type Tournament,
  type TournamentFormat,
  type TournamentStatus,
} from "../../lib/tournament/types";

const inputCls =
  "w-full rounded-xl border border-[#23293A] bg-[#0B0E14] px-3 py-2.5 text-xs font-semibold text-white outline-none focus:border-[#D4AF37]";
const btnCls =
  "rounded-xl border border-[#23293A] bg-[#121624] px-3 py-2 text-[11px] font-black uppercase tracking-wider text-gray-200 transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-50";
const goldBtn =
  "rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-black transition hover:brightness-110 disabled:opacity-50";
const card = "rounded-2xl border border-[#23293A] bg-[#121624] p-5 space-y-4";

async function api(action: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch("/api/admin/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ action, ...payload }),
    });
    return (await res.json()) as { ok: boolean; error?: string; [k: string]: unknown };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export default function TournamentAdminTab() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // create form
  const [cName, setCName] = useState("");
  const [cCategory, setCCategory] = useState<CategoryId>("solo");
  const [cFormat, setCFormat] = useState<TournamentFormat>("league");
  const [cSeason, setCSeason] = useState("");
  const [cPrize, setCPrize] = useState("");
  const [cDesc, setCDesc] = useState("");

  // entries form
  const [teamName, setTeamName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // fixtures form
  const [shuffleDraw, setShuffleDraw] = useState(true);
  const [rounds, setRounds] = useState<1 | 2>(1);
  const [mHome, setMHome] = useState("");
  const [mAway, setMAway] = useState("");
  const [mStage, setMStage] = useState("Friendly");

  const selected = tournaments.find((t) => t.id === selectedId) ?? null;
  const isTeam = selected ? CATEGORIES.find((c) => c.id === selected.category)?.team ?? false : false;
  const nameOf = useMemo(() => new Map(players.map((p) => [p.id, p.name])), [players]);

  const loadTournaments = useCallback(async () => {
    setTournaments(await fetchTournaments(supabase, { limit: 200 }));
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) return;
    const [e, m] = await Promise.all([fetchEntries(supabase, id), fetchMatchCards(supabase, { tournamentId: id })]);
    setEntries(e);
    setMatches(m);
  }, []);

  useEffect(() => {
    void loadTournaments();
    void fetchPlayers(supabase).then(setPlayers);
  }, [loadTournaments]);

  useEffect(() => {
    setPicked([]);
    setTeamName("");
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  async function run(action: string, payload: Record<string, unknown>, okText: string, after?: () => Promise<void> | void) {
    setBusy(true);
    setMsg(null);
    const res = await api(action, payload);
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: res.error ?? "Failed" });
      return false;
    }
    setMsg({ ok: true, text: okText });
    await loadTournaments();
    if (selectedId) await loadDetail(selectedId);
    await after?.();
    return true;
  }

  async function createTournament() {
    const ok = await run(
      "create_tournament",
      { name: cName, category: cCategory, format: cFormat, season: cSeason, prize: cPrize, description: cDesc },
      "Tournament created."
    );
    if (ok) {
      setCName("");
      setCSeason("");
      setCPrize("");
      setCDesc("");
    }
  }

  const takenIds = new Set(entries.flatMap((e) => e.entry_members.map((m) => m.player_id)));
  const available = players.filter((p) => !takenIds.has(p.id) && p.name.toLowerCase().includes(search.toLowerCase()));

  async function addEntries() {
    if (!selected || picked.length === 0) return;
    const list = isTeam ? [{ name: teamName, playerIds: picked }] : picked.map((id) => ({ playerIds: [id] }));
    const ok = await run("add_entries", { tournamentId: selected.id, entries: list }, "Entry added.");
    if (ok) {
      setPicked([]);
      setTeamName("");
    }
  }

  const togglePick = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`rounded-xl border px-4 py-3 text-xs font-bold ${msg.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      {/* CREATE */}
      <section className={card}>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">➕ New tournament</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input className={inputCls} placeholder="Tournament name *" value={cName} onChange={(e) => setCName(e.target.value)} />
          <input className={inputCls} placeholder="Season (e.g. Season 1)" value={cSeason} onChange={(e) => setCSeason(e.target.value)} />
          <select className={inputCls} value={cCategory} onChange={(e) => setCCategory(e.target.value as CategoryId)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <select className={inputCls} value={cFormat} onChange={(e) => setCFormat(e.target.value as TournamentFormat)}>
            <option value="league">📋 League (points table)</option>
            <option value="knockout">🌳 Knockout (bracket)</option>
          </select>
          <input className={inputCls} placeholder="Prize (optional)" value={cPrize} onChange={(e) => setCPrize(e.target.value)} />
          <input className={inputCls} placeholder="Short description (optional)" value={cDesc} onChange={(e) => setCDesc(e.target.value)} />
        </div>
        <button className={goldBtn} disabled={busy || !cName.trim()} onClick={createTournament}>Create tournament</button>
      </section>

      {/* LIST */}
      <section className={card}>
        <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">🏟️ Tournaments ({tournaments.length})</h3>
        {tournaments.length === 0 ? (
          <p className="text-xs text-gray-500">No tournaments yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tournaments.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition ${selectedId === t.id ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#23293A] text-gray-300 hover:border-[#D4AF37]/50"}`}
              >
                <span className="block font-black uppercase">{t.name}</span>
                <span className="text-[10px] text-gray-500">{t.category} · {t.format} · {t.status}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <>
          {/* MANAGE */}
          <section className={card}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-black uppercase text-white">{selected.name}</h3>
              <div className="flex items-center gap-2">
                <select
                  className={`${inputCls} !w-auto`}
                  value={selected.status}
                  onChange={(e) => run("update_tournament", { id: selected.id, status: e.target.value as TournamentStatus }, "Status updated.")}
                >
                  {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <a className={btnCls} href={`/tournament/${selected.slug}`} target="_blank" rel="noreferrer">View page</a>
                <button
                  className="rounded-xl border border-red-500/30 px-3 py-2 text-[11px] font-black uppercase text-red-400 hover:bg-red-500/10"
                  onClick={async () => {
                    if (!window.confirm(`"${selected.name}" delete korbe? Shob match o muche jabe.`)) return;
                    const ok = await run("delete_tournament", { id: selected.id }, "Deleted.");
                    if (ok) setSelectedId("");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </section>

          {/* ENTRIES */}
          <section className={card}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">👥 Entries ({entries.length})</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                {isTeam && <input className={inputCls} placeholder="Team name *" value={teamName} onChange={(e) => setTeamName(e.target.value)} />}
                <input className={inputCls} placeholder="🔍 Search player..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                  {available.map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#23293A] px-3 py-2 text-xs hover:border-[#D4AF37]/50">
                      <input type="checkbox" className="accent-[#D4AF37]" checked={picked.includes(p.id)} onChange={() => togglePick(p.id)} />
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-gray-500">{p.id}</span>
                    </label>
                  ))}
                  {available.length === 0 && <p className="text-xs text-gray-500">No players available.</p>}
                </div>
                <button className={goldBtn} disabled={busy || picked.length === 0} onClick={addEntries}>
                  {isTeam ? `Add team (${picked.length} players)` : `Add ${picked.length || ""} player(s)`}
                </button>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                {entries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border border-[#23293A] px-3 py-2 text-xs">
                    <div className="min-w-0">
                      <p className="truncate font-black uppercase text-white">{e.name}</p>
                      {e.entry_members.length > 1 && (
                        <p className="truncate text-[10px] text-gray-500">{e.entry_members.map((m) => nameOf.get(m.player_id) ?? m.player_id).join(", ")}</p>
                      )}
                    </div>
                    <button className="text-[10px] font-black uppercase text-red-400 hover:underline" onClick={() => run("remove_entry", { entryId: e.id }, "Entry removed.")}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FIXTURES */}
          <section className={card}>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">🗓️ Fixtures</h3>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <input type="checkbox" className="accent-[#D4AF37]" checked={shuffleDraw} onChange={(e) => setShuffleDraw(e.target.checked)} />
                Random draw
              </label>
              {selected.format === "league" && (
                <select className={`${inputCls} !w-auto`} value={rounds} onChange={(e) => setRounds(Number(e.target.value) as 1 | 2)}>
                  <option value={1}>Single round</option>
                  <option value={2}>Home & away</option>
                </select>
              )}
              <button
                className={goldBtn}
                disabled={busy || entries.length < 2}
                onClick={() => {
                  if (matches.length > 0 && !window.confirm("Purono fixtures muche notun fixtures banabe. Continue?")) return;
                  void run("generate_fixtures", { tournamentId: selected.id, shuffle: shuffleDraw, rounds }, "Fixtures generated.");
                }}
              >
                {selected.format === "knockout" ? "Generate bracket" : "Generate fixtures"}
              </button>
            </div>

            <div className="grid gap-2 border-t border-[#23293A] pt-4 md:grid-cols-5">
              <select className={inputCls} value={mHome} onChange={(e) => setMHome(e.target.value)}>
                <option value="">Home side</option>
                {entries.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <select className={inputCls} value={mAway} onChange={(e) => setMAway(e.target.value)}>
                <option value="">Away side</option>
                {entries.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <input className={inputCls} value={mStage} onChange={(e) => setMStage(e.target.value)} placeholder="Stage" />
              <button
                className={`${btnCls} md:col-span-2`}
                disabled={busy || !mHome || !mAway}
                onClick={() => run("create_match", { tournamentId: selected.id, homeEntryId: mHome, awayEntryId: mAway, stage: mStage }, "Match added.")}
              >
                + Add single match
              </button>
            </div>
          </section>

          {/* MATCHES */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">⚽ Matches & results ({matches.length})</h3>
            {matches.length === 0 && <p className="text-xs text-gray-500">No matches yet.</p>}
            {matches.map((m) => (
              <MatchEditor key={`${m.id}-${m.status}-${m.home_entry_id}-${m.away_entry_id}`} m={m} entries={entries} nameOf={nameOf} knockout={selected.format === "knockout"} busy={busy} run={run} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function MatchEditor({
  m,
  entries,
  nameOf,
  knockout,
  busy,
  run,
}: {
  m: MatchCard;
  entries: Entry[];
  nameOf: Map<string, string>;
  knockout: boolean;
  busy: boolean;
  run: (action: string, payload: Record<string, unknown>, okText: string) => Promise<boolean>;
}) {
  const [hs, setHs] = useState(m.home_score?.toString() ?? "");
  const [as, setAs] = useState(m.away_score?.toString() ?? "");
  const [hp, setHp] = useState(m.home_pens?.toString() ?? "");
  const [ap, setAp] = useState(m.away_pens?.toString() ?? "");
  const [motm, setMotm] = useState(m.motm_player_id ?? "");
  const [when, setWhen] = useState(toLocalInput(m.scheduled_at));
  const [goals, setGoals] = useState<Record<string, string>>({});

  const homeEntry = entries.find((e) => e.id === m.home_entry_id);
  const awayEntry = entries.find((e) => e.id === m.away_entry_id);
  const ready = !!homeEntry && !!awayEntry;
  const done = m.status === "completed";
  const memberIds = [...(homeEntry?.entry_members ?? []), ...(awayEntry?.entry_members ?? [])].map((x) => x.player_id);
  const teamSides = [homeEntry, awayEntry].filter((e): e is Entry => !!e && e.entry_members.length > 1);
  const drawn = hs !== "" && hs === as;

  return (
    <div className={`space-y-3 rounded-2xl border p-4 ${done ? "border-[#D4AF37]/30 bg-[#D4AF37]/5" : "border-[#23293A] bg-[#121624]"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-black uppercase text-[#D4AF37]">{m.stage} · #{m.match_no}</span>
        <span className="font-bold text-gray-400">{m.home_name ?? "TBD"} vs {m.away_name ?? "TBD"}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${done ? "bg-emerald-500/20 text-emerald-400" : m.status === "live" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-gray-300"}`}>
          {m.status}
        </span>
      </div>

      {!ready ? (
        <p className="text-[11px] text-gray-500">Duto side set hole result dewa jabe (ager round er result publish koro).</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            <input className={inputCls} type="number" min={0} placeholder={`${m.home_name} score`} value={hs} onChange={(e) => setHs(e.target.value)} disabled={done} />
            <input className={inputCls} type="number" min={0} placeholder={`${m.away_name} score`} value={as} onChange={(e) => setAs(e.target.value)} disabled={done} />
            {knockout && drawn && (
              <>
                <input className={inputCls} type="number" min={0} placeholder="Home pens" value={hp} onChange={(e) => setHp(e.target.value)} disabled={done} />
                <input className={inputCls} type="number" min={0} placeholder="Away pens" value={ap} onChange={(e) => setAp(e.target.value)} disabled={done} />
              </>
            )}
            <select className={`${inputCls} md:col-span-2`} value={motm} onChange={(e) => setMotm(e.target.value)} disabled={done}>
              <option value="">⭐ MOTM (optional)</option>
              {memberIds.map((id) => <option key={id} value={id}>{nameOf.get(id) ?? id}</option>)}
            </select>
          </div>

          {teamSides.map((side) => (
            <div key={side.id} className="rounded-xl border border-[#23293A] p-3">
              <p className="mb-2 text-[10px] font-black uppercase text-gray-400">{side.name}: goals per player (sum = team score)</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {side.entry_members.map((mm) => (
                  <label key={mm.player_id} className="flex items-center gap-2 text-[11px] text-gray-300">
                    <span className="truncate">{nameOf.get(mm.player_id) ?? mm.player_id}</span>
                    <input className={`${inputCls} !w-14 !py-1.5`} type="number" min={0} value={goals[mm.player_id] ?? ""} onChange={(e) => setGoals((g) => ({ ...g, [mm.player_id]: e.target.value }))} disabled={done} />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!done && (
          <>
            <input className={`${inputCls} !w-auto`} type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
            <button className={btnCls} disabled={busy} onClick={() => run("save_match", { matchId: m.id, scheduledAt: when || null }, "Schedule saved.")}>Save time</button>
            <button className={btnCls} disabled={busy || !ready} onClick={() => run("save_match", { matchId: m.id, status: m.status === "live" ? "scheduled" : "live" }, m.status === "live" ? "Live off." : "Marked LIVE.")}>
              {m.status === "live" ? "Stop live" : "Set live"}
            </button>
            <button
              className={goldBtn}
              disabled={busy || !ready || hs === "" || as === ""}
              onClick={() => {
                const pg: Record<string, number> = {};
                for (const [k, v] of Object.entries(goals)) if (v !== "") pg[k] = Number(v);
                void run("publish_match", {
                  matchId: m.id, homeScore: hs, awayScore: as, homePens: hp || null, awayPens: ap || null,
                  motmPlayerId: motm || null, playerGoals: Object.keys(pg).length ? pg : null,
                }, "Result published! Ranking, stats ar table update hoyeche.");
              }}
            >
              🚀 Publish result
            </button>
          </>
        )}
        {(done || m.status === "live") && (
          <button className="rounded-xl border border-red-500/30 px-3 py-2 text-[11px] font-black uppercase text-red-400 hover:bg-red-500/10" disabled={busy}
            onClick={() => window.confirm("Result reset korbe?") && run("reset_match", { matchId: m.id }, "Result reset.")}>
            Reset result
          </button>
        )}
      </div>
    </div>
  );
}
