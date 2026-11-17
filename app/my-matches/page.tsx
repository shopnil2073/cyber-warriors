"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { getActiveUser } from "../../utils/userStore";
import { fetchPlayerMatches, fetchPlayerTournaments, type PlayerTournament } from "../lib/tournament/playerQueries";
import { categoryIcon, categoryLabel, type MatchCard } from "../lib/tournament/types";
import { dayKey, formatDayLong, formatDayShort, formatTime, todayKey } from "../lib/tournament/time";
import { Avatar } from "../components/tournament/ui";
import { ProgressBar } from "../components/stats/widgets";
import "../components/tournament/effects.css";
import "../components/tournament/effects-extra.css";

type TabType = "PENDING" | "UPCOMING" | "COMPLETED" | "CALENDAR";

const TABS: { id: TabType; label: string; icon: string; help: string }[] = [
  { id: "PENDING", label: "PENDING", icon: "⚠️", help: "Live ba shomoy ber hoye geche, result publish hoy ni emon match." },
  { id: "UPCOMING", label: "UPCOMING", icon: "🕒", help: "Ashchhe emon match gulo, din onujayi." },
  { id: "COMPLETED", label: "COMPLETED", icon: "✔️", help: "Shesh hoye jawa match ar result." },
  { id: "CALENDAR", label: "CALENDAR", icon: "📅", help: "Din select koro, oi dine tomar shob match dekho." },
];

const medal = (p: number | null) => (p === 1 ? "🥇" : p === 2 ? "🥈" : p === 3 ? "🥉" : null);

function matchDay(m: MatchCard): string | null {
  const iso = m.status === "completed" ? m.completed_at : m.scheduled_at;
  return iso ? dayKey(iso) : null;
}

function MyMatch({ m, mine, index }: { m: MatchCard; mine: Set<string>; index: number }) {
  const meHome = !!m.home_entry_id && mine.has(m.home_entry_id);
  const me = meHome ? { name: m.home_name, avatar: m.home_avatar, score: m.home_score } : { name: m.away_name, avatar: m.away_avatar, score: m.away_score };
  const opp = meHome ? { name: m.away_name, avatar: m.away_avatar, score: m.away_score, id: m.away_player_id } : { name: m.home_name, avatar: m.home_avatar, score: m.home_score, id: m.home_player_id };
  const done = m.status === "completed";
  let result: "W" | "D" | "L" | null = null;
  if (done && me.score !== null && opp.score !== null) {
    result = me.score > opp.score ? "W" : me.score < opp.score ? "L" : "D";
    if (result === "D" && m.winner_entry_id) result = (m.winner_entry_id === (meHome ? m.home_entry_id : m.away_entry_id)) ? "W" : "L";
  }
  const tone = result === "W" ? "border-l-emerald-500" : result === "L" ? "border-l-red-500" : result === "D" ? "border-l-zinc-500" : m.status === "live" ? "border-l-red-500" : "border-l-[#D4AF37]";
  const badge = result === "W" ? ["WIN", "bg-emerald-500/20 text-emerald-400"] : result === "L" ? ["LOSS", "bg-red-500/20 text-red-400"] : result === "D" ? ["DRAW", "bg-zinc-500/20 text-zinc-300"] : m.status === "live" ? ["LIVE", "bg-red-500/20 text-red-400"] : ["UPCOMING", "bg-[#D4AF37]/15 text-[#D4AF37]"];

  return (
    <article className={`cw-card cw-fade-up overflow-hidden rounded-2xl border border-l-4 border-[var(--border-color)] bg-[var(--bg-card)] ${tone}`} style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] bg-black/10 px-4 py-2">
        <Link href={`/tournament/${m.tournament_slug}` as Route} className="flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,.25)] transition-colors hover:bg-[#D4AF37]/20">
          <span>{categoryIcon(m.category)}</span>
          <span className="max-w-[160px] truncate">{m.tournament_name}</span>
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          <span>{m.stage}</span>
          <span>·</span>
          <span>{m.status === "completed" ? formatTime(m.completed_at) : formatTime(m.scheduled_at)}</span>
        </div>
      </header>
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar src={me.avatar} name={me.name} size={48} ring />
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase text-[#D4AF37]">{me.name} <span className="ml-1 rounded bg-[#D4AF37] px-1.5 py-0.5 text-[9px] text-black">YOU</span></p>
            <p className="text-[10px] font-bold text-[var(--text-muted)]">{meHome ? "HOME" : "AWAY"}</p>
          </div>
        </div>
        <div className="shrink-0 text-center">
          <div className={`cw-mono rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-xl font-black ${done ? "cw-score text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
            {done || m.status === "live" ? `${me.score ?? 0} - ${opp.score ?? 0}` : "VS"}
          </div>
          <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black ${badge[1]}`}>{badge[0]}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-3 text-right">
          <Avatar src={opp.avatar} name={opp.name} size={48} />
          <div className="min-w-0">
            {opp.id ? (
              <Link href={`/profile?id=${opp.id}` as Route} className="block truncate text-xs font-black uppercase text-[var(--text-main)] hover:text-[#D4AF37]">{opp.name ?? "TBD"}</Link>
            ) : (
              <p className="truncate text-xs font-black uppercase text-[var(--text-muted)]">{opp.name ?? "TBD"}</p>
            )}
            <p className="text-[10px] font-bold text-[var(--text-muted)]">OPPONENT</p>
          </div>
        </div>
      </div>
      {done && m.motm_name && (
        <footer className="border-t border-[var(--border-color)] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent py-1.5 text-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">⭐ MOTM: {m.motm_name}</footer>
      )}
    </article>
  );
}

function DayGroups({ list, mine, empty }: { list: MatchCard[]; mine: Set<string>; empty: string }) {
  const groups = useMemo(() => {
    const map = new Map<string, MatchCard[]>();
    for (const m of list) {
      const k = matchDay(m) ?? "TBA";
      map.set(k, [...(map.get(k) ?? []), m]);
    }
    return [...map.entries()];
  }, [list]);

  if (groups.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-[#23293A] bg-[#121624] p-10 text-center shadow-xl">
        <div className="mb-3 text-6xl opacity-80">🏆</div>
        <h2 className="mb-1 text-xl font-black uppercase tracking-wider text-white">ALL CAUGHT UP!</h2>
        <p className="max-w-sm text-xs font-semibold text-[var(--text-muted)]">{empty}</p>
      </div>
    );
  }
  let n = 0;
  return (
    <div className="space-y-6">
      {groups.map(([key, items]) => (
        <section key={key}>
          <div className="mb-3 flex items-center gap-3">
            <span className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${key === todayKey() ? "bg-[#D4AF37] text-black" : "border border-[var(--border-color)] text-[var(--text-main)]"}`}>
              {key === "TBA" ? "Date TBA" : key === todayKey() ? "TODAY" : formatDayShort(key)}
            </span>
            <span className="h-px flex-1 bg-[var(--border-color)]" />
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">{items.length} {items.length === 1 ? "match" : "matches"}</span>
          </div>
          <div className="space-y-3">{items.map((m) => <MyMatch key={m.id} m={m} mine={mine} index={n++} />)}</div>
        </section>
      ))}
    </div>
  );
}

export default function MyMatchesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("UPCOMING");
  const [myId, setMyId] = useState<string | null>(null);
  const [myName, setMyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [tours, setTours] = useState<PlayerTournament[]>([]);
  const [tFilter, setTFilter] = useState<string | null>(null);

  const [cal, setCal] = useState({ y: Number(todayKey().slice(0, 4)), m: Number(todayKey().slice(5, 7)) - 1 });
  const [selDay, setSelDay] = useState<string>(todayKey());

  useEffect(() => {
    const u = getActiveUser();
    setMyId(u?.id ?? null);
    setMyName(u?.name ?? "");
    if (!u?.id) { setLoading(false); return; }
    void Promise.all([fetchPlayerMatches(supabase, u.id, "all", 500), fetchPlayerTournaments(supabase, u.id)]).then(([m, t]) => {
      setMatches(m);
      setTours(t);
      setLoading(false);
    });
  }, []);

  const mine = useMemo(() => new Set(tours.map((t) => t.entry_id)), [tours]);
  const filtered = useMemo(() => (tFilter ? matches.filter((m) => m.tournament_id === tFilter) : matches), [matches, tFilter]);

  const buckets = useMemo(() => {
    const t = Date.now();
    const pending: MatchCard[] = [], upcoming: MatchCard[] = [], completed: MatchCard[] = [];
    for (const m of filtered) {
      if (m.status === "completed") completed.push(m);
      else if (m.status === "live" || (m.home_entry_id && m.away_entry_id && m.scheduled_at && new Date(m.scheduled_at).getTime() < t)) pending.push(m);
      else upcoming.push(m);
    }
    const asc = (a: MatchCard, b: MatchCard) => (a.scheduled_at ?? "9").localeCompare(b.scheduled_at ?? "9");
    return { pending: pending.sort(asc), upcoming: upcoming.sort(asc), completed };
  }, [filtered]);

  const byDay = useMemo(() => {
    const map = new Map<string, MatchCard[]>();
    for (const m of filtered) {
      const k = matchDay(m);
      if (k) map.set(k, [...(map.get(k) ?? []), m]);
    }
    return map;
  }, [filtered]);

  const counts = { PENDING: buckets.pending.length, UPCOMING: buckets.upcoming.length, COMPLETED: buckets.completed.length, CALENDAR: byDay.size };

  // calendar grid
  const monthName = new Date(Date.UTC(cal.y, cal.m, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const lead = new Date(Date.UTC(cal.y, cal.m, 1)).getUTCDay();
  const dim = new Date(Date.UTC(cal.y, cal.m + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: dim }, (_, i) => `${cal.y}-${String(cal.m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`)];
  const shiftMonth = (d: number) => setCal(({ y, m }) => { const t = new Date(Date.UTC(y, m + d, 1)); return { y: t.getUTCFullYear(), m: t.getUTCMonth() }; });

  if (!loading && !myId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] p-4 text-[var(--text-main)]">
        <div className="max-w-sm space-y-4 rounded-2xl border border-[#23293A] bg-[#121624] p-8 text-center">
          <div className="text-5xl">🎮</div>
          <h1 className="text-lg font-black uppercase">Personal center</h1>
          <p className="text-xs text-[var(--text-muted)]">Tomar match gulo dekhte age sign in koro.</p>
          <Link href={"/sign-in" as Route} className="block rounded-xl bg-[#D4AF37] py-3 text-xs font-black uppercase text-black">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8 pb-28 text-[var(--text-main)]">
      <div className="mx-auto max-w-4xl space-y-7">
        {/* HEADER */}
        <div className="cw-fade-up space-y-2">
          <div className="flex items-center gap-3">
            <div className="cw-glow flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#121624] text-xl text-[#D4AF37]">🎮</div>
            <h1 className="text-2xl font-black uppercase tracking-wider md:text-3xl">PERSONAL <span className="text-[#D4AF37]">CENTER</span></h1>
          </div>
          <div className="h-1 w-20 rounded-full bg-[#D4AF37]" />
          {myName && <p className="text-xs font-bold text-[var(--text-muted)]">Welcome back, <span className="text-[#D4AF37]">{myName}</span></p>}
        </div>

        {/* MY TOURNAMENTS (highlight) */}
        {tours.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">⭐ My tournaments ({tours.length})</h2>
              {tFilter && <button onClick={() => setTFilter(null)} className="text-[11px] font-bold text-[var(--text-muted)] hover:text-[#D4AF37]">Clear filter ✕</button>}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {tours.map((t) => {
                const active = tFilter === t.tournament_id;
                return (
                  <button
                    key={t.entry_id}
                    onClick={() => setTFilter(active ? null : t.tournament_id)}
                    className={`cw-card cw-hud w-60 shrink-0 rounded-2xl border bg-gradient-to-br p-4 text-left ${active ? "cw-glow border-[#D4AF37] from-[#D4AF37]/20" : "border-[#D4AF37]/30 from-[#D4AF37]/8"} to-transparent`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">{categoryIcon(t.category)} {categoryLabel(t.category)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${t.status === "live" ? "bg-red-500/20 text-red-400" : t.status === "open" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-300"}`}>{t.status}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-1 text-sm font-black uppercase text-[var(--text-main)]">{medal(t.place)} {t.name}</h3>
                    <p className="mt-0.5 truncate text-[10px] font-bold text-[var(--text-muted)]">Entry: {t.entry_name}</p>
                    <div className="mt-3"><ProgressBar value={t.played} max={t.total || 1} /></div>
                    <p className="mt-1 text-[10px] font-bold text-[var(--text-muted)]">{t.played}/{t.total} matches played</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* TABS */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#23293A] bg-[#121624] p-2 md:grid-cols-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3.5 text-xs font-extrabold tracking-wider transition-all ${isActive ? "border-[#D4AF37] bg-gradient-to-b from-[#1E2538] to-[#121624] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10" : "border-transparent text-[var(--text-muted)] hover:bg-[#1A2035] hover:text-white"}`}>
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {counts[tab.id] > 0 && <span className={`absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${tab.id === "PENDING" ? "bg-red-500 text-white" : "bg-[#D4AF37] text-black"}`}>{counts[tab.id]}</span>}
              </button>
            );
          })}
        </div>
        <p className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]"><span className="text-[#D4AF37]">⚡</span>{TABS.find((t) => t.id === activeTab)?.help}</p>

        {loading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />)}</div>
        ) : (
          <>
            {activeTab === "PENDING" && <DayGroups list={buckets.pending} mine={mine} empty="You have no pending matches requiring action." />}
            {activeTab === "UPCOMING" && <DayGroups list={buckets.upcoming} mine={mine} empty="No upcoming matches currently scheduled for you." />}
            {activeTab === "COMPLETED" && <DayGroups list={buckets.completed} mine={mine} empty="No match history found in your account." />}

            {activeTab === "CALENDAR" && (
              <div className="space-y-5">
                <div className="cw-hud rounded-2xl border border-[#23293A] bg-[#121624] p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <button onClick={() => shiftMonth(-1)} className="rounded-lg border border-[#23293A] px-3 py-1 text-sm hover:border-[#D4AF37]">‹</button>
                    <div className="text-center">
                      <div className="text-sm font-black uppercase tracking-wider text-[#D4AF37]">{monthName}</div>
                      <button onClick={() => { const t = todayKey(); setCal({ y: Number(t.slice(0, 4)), m: Number(t.slice(5, 7)) - 1 }); setSelDay(t); }} className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[#D4AF37]">Go to today</button>
                    </div>
                    <button onClick={() => shiftMonth(1)} className="rounded-lg border border-[#23293A] px-3 py-1 text-sm hover:border-[#D4AF37]">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-[var(--text-muted)]">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((k, i) => {
                      if (!k) return <div key={`e${i}`} />;
                      const list = byDay.get(k) ?? [];
                      const isToday = k === todayKey();
                      const isSel = k === selDay;
                      return (
                        <button key={k} onClick={() => setSelDay(k)} className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-xs font-bold transition-all ${isSel ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]" : list.length ? "border-[#D4AF37]/30 bg-[#D4AF37]/5 text-white hover:border-[#D4AF37]" : "border-transparent text-[var(--text-muted)] hover:bg-white/5"} ${isToday ? "ring-1 ring-[#D4AF37]" : ""}`}>
                          <span>{Number(k.slice(8))}</span>
                          {list.length > 0 && (
                            <span className="mt-0.5 flex gap-0.5">
                              {list.slice(0, 3).map((m) => <span key={m.id} className={`h-1.5 w-1.5 rounded-full ${m.status === "live" ? "cw-live-dot bg-red-500" : m.status === "completed" ? "bg-emerald-400" : "bg-[#D4AF37]"}`} />)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-bold text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#D4AF37]" /> Upcoming</span>
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Completed</span>
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500" /> Live</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                    <span>📅 {formatDayLong(selDay)}</span>
                    <span className="text-[#D4AF37]">{(byDay.get(selDay) ?? []).length} matches</span>
                  </h3>
                  {(byDay.get(selDay) ?? []).length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#23293A] p-8 text-center text-xs font-bold text-[var(--text-muted)]">Ei dine tomar kono match nai.</div>
                  ) : (
                    <div className="space-y-3">{(byDay.get(selDay) ?? []).map((m, i) => <MyMatch key={m.id} m={m} mine={mine} index={i} />)}</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
