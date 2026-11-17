"use client";

import React, { ChangeEvent, Suspense, useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { EMPTY_USER, getActiveUser, getAllUsers, logoutUser, updateActiveUserProfile, UserProfile } from "../../utils/userStore";
import { compressAvatar } from "../../utils/authApi";
import {
  fetchPlayerMatches, fetchPlayerOverview, fetchPlayerTournaments,
  type PlayerOverview, type PlayerTournament,
} from "../lib/tournament/playerQueries";
import { categoryIcon, categoryLabel, type MatchCard } from "../lib/tournament/types";
import { formatDate, formatDateTime } from "../lib/tournament/time";
import { FormDots, Panel, ProgressBar, RatingRing, RecordBar, StatTile, TrendBars } from "../components/stats/widgets";
import ProfileEditModal from "./components/ProfileEditModal";
import "../components/tournament/effects.css";
import "../components/tournament/effects-extra.css";

type Tab = "OVERVIEW" | "MATCHES" | "TOURNAMENTS" | "ACHIEVEMENTS" | "MILESTONES" | "TIMELINE" | "INFO";
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "OVERVIEW", label: "Overview", icon: "📊" },
  { id: "MATCHES", label: "Matches", icon: "⚽" },
  { id: "TOURNAMENTS", label: "Tournaments", icon: "🏟️" },
  { id: "ACHIEVEMENTS", label: "Achievements", icon: "🏆" },
  { id: "MILESTONES", label: "Milestones", icon: "🎯" },
  { id: "TIMELINE", label: "Timeline", icon: "🕒" },
  { id: "INFO", label: "Info", icon: "🪪" },
];

const EMPTY_OV: PlayerOverview = {
  overall: { matches: 0, wins: 0, draws: 0, losses: 0, goals: 0, conceded: 0, clean_sheets: 0, hat_tricks: 0, double_hat_tricks: 0, best_goals: 0, motm: 0, win_rate: 0, goals_per_match: 0, rating: null },
  ranks: { overall: null, seasonal: null, monthly: null, weekly: null }, total_players: 0,
  streak: { current: 0, best: 0 }, form: [], titles: { champion: 0, runner_up: 0, third: 0 },
  categories: [], trend: [], first_match_at: null,
};

function outcome(m: MatchCard, mine: Set<string>): "W" | "D" | "L" | null {
  if (m.status !== "completed" || m.home_score === null || m.away_score === null) return null;
  const home = !!m.home_entry_id && mine.has(m.home_entry_id);
  const me = home ? m.home_score : m.away_score;
  const op = home ? m.away_score : m.home_score;
  if (me !== op) return me > op ? "W" : "L";
  if (m.winner_entry_id) return mine.has(m.winner_entry_id) ? "W" : "L";
  return "D";
}

function ProfileContent() {
  const router = useRouter();
  const search = useSearchParams();
  const queryId = search.get("id");

  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [own, setOwn] = useState(false);
  const [missing, setMissing] = useState(false);
  const [ov, setOv] = useState<PlayerOverview>(EMPTY_OV);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [tours, setTours] = useState<PlayerTournament[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>(EMPTY_USER);
  const [trendKey, setTrendKey] = useState<"matches" | "wins" | "goals">("matches");
  const [badgeFilter, setBadgeFilter] = useState<"ALL" | "ATTACK" | "DEFENSE" | "SPECIAL">("ALL");

  useEffect(() => {
    let alive = true;
    (async () => {
      const active = getActiveUser();
      const all = await getAllUsers();
      let display: UserProfile | null = null;
      if (queryId) display = active && String(active.id) === String(queryId) ? active : all.find((u) => String(u.id) === String(queryId)) ?? null;
      else if (active) display = active;

      if (!display) {
        if (!queryId && !active) router.push("/sign-in");
        else setMissing(true);
        return;
      }
      if (!alive) return;
      setUser(display);
      setForm(display);
      setOwn(!!active && (active.id === display.id || active.email === display.email));

      const [o, m, t] = await Promise.all([
        fetchPlayerOverview(supabase, display.id),
        fetchPlayerMatches(supabase, display.id, "all", 200),
        fetchPlayerTournaments(supabase, display.id),
      ]);
      if (!alive) return;
      setOv(o ?? EMPTY_OV);
      setMatches(m);
      setTours(t);
      setLoadingStats(false);
    })();
    return () => { alive = false; };
  }, [queryId, router]);

  const mine = useMemo(() => new Set(tours.map((t) => t.entry_id)), [tours]);
  const rankLabel = ov.ranks.overall ? `#${ov.ranks.overall}` : "#NEW";
  const o = ov.overall;

  async function onImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const avatar = await compressAvatar(file);
      setForm((p) => ({ ...p, avatar }));
    } catch {
      const r = new FileReader();
      r.onloadend = () => setForm((p) => ({ ...p, avatar: r.result as string }));
      r.readAsDataURL(file);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    await updateActiveUserProfile(form);
    setUser(form);
    window.dispatchEvent(new Event("cw_auth_change"));
    setEditing(false);
  }

  function logout() {
    logoutUser();
    window.dispatchEvent(new Event("cw_auth_change"));
    router.push("/sign-in");
  }

  if (missing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] p-4 text-center text-[var(--text-main)]">
        <div className="space-y-3"><div className="text-5xl">🕵️</div><p className="text-sm font-black uppercase">Player not found</p>
          <Link href={"/ranking" as Route} className="inline-block rounded-xl bg-[#D4AF37] px-5 py-2.5 text-xs font-black uppercase text-black">Go to ranking</Link></div>
      </div>
    );
  }
  if (!user) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]"><div className="animate-pulse font-black tracking-widest text-[#D4AF37]">LOADING PROFILE...</div></div>;
  }

  const wa = (user.whatsapp ?? "").replace(/\D/g, "");

  // ---- milestones / badges (real data)
  const progression = [
    { title: "APPEARANCES", icon: "👟", cur: o.matches, cat: "SPECIAL" },
    { title: "WINS", icon: "🏆", cur: o.wins, cat: "ATTACK" },
    { title: "GOALS", icon: "⚽", cur: o.goals, cat: "ATTACK" },
    { title: "MOTM", icon: "⭐", cur: o.motm, cat: "SPECIAL" },
    { title: "HAT-TRICKS", icon: "🎩", cur: o.hat_tricks, cat: "ATTACK" },
    { title: "CLEAN SHEETS", icon: "🛡️", cur: o.clean_sheets, cat: "DEFENSE" },
  ].map((p) => ({ ...p, next: [5, 10, 25, 50, 100, 250, 500].find((n) => n > p.cur) ?? p.cur }));

  const badges = [
    { name: "Debut", icon: "🎬", desc: "Play your first match", cat: "SPECIAL", ok: o.matches >= 1 },
    { name: "Centurion", icon: "🛡️", desc: "Play 100 matches", cat: "SPECIAL", ok: o.matches >= 100 },
    { name: "Winner", icon: "🥇", desc: "Win 10 matches", cat: "ATTACK", ok: o.wins >= 10 },
    { name: "Sharpshooter", icon: "🎯", desc: "Score 50 goals", cat: "ATTACK", ok: o.goals >= 50 },
    { name: "Mastermind", icon: "🧠", desc: "10 MOTM awards", cat: "SPECIAL", ok: o.motm >= 10 },
    { name: "Wall of Steel", icon: "🧱", desc: "15 clean sheets", cat: "DEFENSE", ok: o.clean_sheets >= 15 },
    { name: "Hat-trick Hero", icon: "🎩", desc: "5 hat-tricks", cat: "ATTACK", ok: o.hat_tricks >= 5 },
    { name: "Unstoppable", icon: "⚡", desc: "5 win streak", cat: "SPECIAL", ok: ov.streak.best >= 5 },
    { name: "Champion", icon: "👑", desc: "Win a tournament", cat: "SPECIAL", ok: ov.titles.champion >= 1 },
  ].filter((b) => badgeFilter === "ALL" || b.cat === badgeFilter);

  const completed = matches.filter((m) => m.status === "completed");
  const upcoming = matches.filter((m) => m.status !== "completed" && m.home_entry_id && m.away_entry_id);
  const gd = o.goals - o.conceded;

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] pb-28 font-sans text-[var(--text-main)] selection:bg-[#D4AF37] selection:text-black">
      {/* ================= HERO ================= */}
      <section className="cw-grid-bg cw-scanlines relative overflow-hidden border-b border-[var(--border-color)]">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4AF37]/20 blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-6 pt-5">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-bold hover:border-[#D4AF37]">← Back</button>
            {own && (
              <div className="flex gap-2">
                <button onClick={() => { setForm(user); setEditing(true); }} className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-black text-[#D4AF37] hover:bg-[#D4AF37]/20">✎ EDIT</button>
                <button onClick={logout} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-black text-red-400 hover:bg-red-500 hover:text-white">SIGN OUT</button>
              </div>
            )}
          </div>

          <div className="cw-fade-up mt-4 flex flex-col items-center text-center">
            <div className="relative h-36 w-36">
              <div className="cw-hex cw-spin-slow absolute inset-0" style={{ background: "conic-gradient(from 0deg, #F3E5AB, #AA7C11, #F3E5AB, #D4AF37, #F3E5AB)" }} />
              <div className="cw-hex absolute inset-[4px] overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar || "/logo.jpg"} alt={user.name} className="h-full w-full object-cover" />
              </div>
              <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border px-3 py-0.5 text-xs font-black ${ov.ranks.overall ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-[#D4AF37]/60 bg-[var(--bg-card)] text-[#D4AF37]"}`}>{rankLabel}</span>
            </div>
            <h1 className="cw-shine-text mt-5 text-3xl font-black uppercase tracking-tight md:text-5xl">{user.name}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider">
              {user.konamiId && user.konamiId !== "Not Set" && <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">🆔 {user.konamiId}</span>}
              {user.hardware && user.hardware !== "Not Set" && <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">📱 {user.hardware}</span>}
              {user.location && user.location !== "Not Set" && <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1">📍 {user.location}</span>}
              {ov.titles.champion > 0 && <span className="cw-glow rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 text-[#D4AF37]">👑 {ov.titles.champion}× Champion</span>}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {user.facebook && <a href={user.facebook} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-sm hover:border-[#D4AF37]" title="Facebook">f</a>}
              {own && wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-sm hover:border-[#D4AF37]" title="WhatsApp">💬</a>}
              {own && user.discord && <span className="flex h-9 items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-[11px] font-bold" title="Discord">🎧 {user.discord}</span>}
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-4 gap-2">
            {[["APP", o.matches, "👕"], ["WINS", o.wins, "✔"], ["GOALS", o.goals, "⚽"], ["WIN %", `${o.win_rate}%`, "📈"]].map(([k, v, i]) => (
              <div key={String(k)} className="cw-hud rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 py-2.5 text-center backdrop-blur">
                <div className="cw-mono text-lg font-black text-[#D4AF37] md:text-2xl">{loadingStats ? "·" : v}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{i} {k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TABS ================= */}
      <div className="sticky top-0 z-20 border-b border-[var(--border-color)] bg-[var(--bg-main)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-3 py-2.5 scrollbar-none">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-black uppercase tracking-wider transition-all ${tab === t.id ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/25" : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl space-y-5 px-4">
        {/* ================= OVERVIEW ================= */}
        {tab === "OVERVIEW" && (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              <Panel title="Player rating" icon="⭐">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <RatingRing value={o.rating} />
                  <div className="w-full space-y-2">
                    {(["overall", "seasonal", "monthly", "weekly"] as const).map((p) => (
                      <div key={p} className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{p}</span>
                        <span className={`cw-mono text-sm font-black ${ov.ranks[p] ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>{ov.ranks[p] ? `#${ov.ranks[p]}` : "#NEW"}<span className="ml-1 text-[10px] font-bold text-[var(--text-muted)]">{ov.ranks[p] ? `/ ${ov.total_players}` : ""}</span></span>
                      </div>
                    ))}
                  </div>
                </div>
                {o.matches === 0 && <p className="mt-4 rounded-lg border border-dashed border-[#D4AF37]/40 p-3 text-center text-[11px] font-bold text-[#D4AF37]">Prothom match khelar por-i rating ar rank auto set hobe.</p>}
              </Panel>

              <Panel title="Record & form" icon="📈">
                <RecordBar w={o.wins} d={o.draws} l={o.losses} />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Last 5</div>
                    <div className="mt-2"><FormDots form={ov.form} /></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Win streak</div>
                    <div className="cw-mono mt-1 text-2xl font-black text-[#D4AF37]">🔥 {ov.streak.current}<span className="ml-1 text-xs text-[var(--text-muted)]">best {ov.streak.best}</span></div>
                  </div>
                </div>
              </Panel>
            </div>

            <Panel title="Performance analytics" icon="🎯">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                <StatTile icon="👕" label="Matches" value={o.matches} />
                <StatTile icon="⚽" label="Goals" value={o.goals} glow />
                <StatTile icon="🥅" label="Conceded" value={o.conceded} />
                <StatTile icon="➗" label="Goal diff" value={gd > 0 ? `+${gd}` : gd} />
                <StatTile icon="📐" label="Goals / match" value={o.goals_per_match} />
                <StatTile icon="🛡️" label="Clean sheets" value={o.clean_sheets} />
                <StatTile icon="🎩" label="Hat-tricks" value={o.hat_tricks} sub={o.double_hat_tricks ? `${o.double_hat_tricks} double` : undefined} />
                <StatTile icon="⭐" label="MOTM" value={o.motm} glow />
                <StatTile icon="💥" label="Best in a match" value={o.best_goals} />
                <StatTile icon="🔥" label="Best streak" value={ov.streak.best} />
              </div>
            </Panel>

            <div className="grid gap-5 md:grid-cols-2">
              <Panel title="6-month activity" icon="📅" right={
                <div className="flex gap-1">{(["matches", "wins", "goals"] as const).map((k) => (
                  <button key={k} onClick={() => setTrendKey(k)} className={`rounded-md px-2 py-1 text-[9px] font-black uppercase ${trendKey === k ? "bg-[#D4AF37] text-black" : "text-[var(--text-muted)] hover:text-white"}`}>{k}</button>
                ))}</div>}>
                {ov.trend.length ? <TrendBars data={ov.trend} keyName={trendKey} /> : <p className="text-xs text-[var(--text-muted)]">No activity yet.</p>}
              </Panel>

              <Panel title="By category" icon="🧩">
                {ov.categories.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">Category stats match khelar por ashbe.</p>
                ) : (
                  <div className="space-y-3">
                    {ov.categories.map((c) => (
                      <div key={c.category} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase">
                          <span className="text-[#D4AF37]">{categoryIcon(c.category)} {categoryLabel(c.category)}</span>
                          <span className="cw-mono text-[var(--text-muted)]">{c.matches} APP · ⚽ {c.goals}</span>
                        </div>
                        <RecordBar w={c.wins} d={c.draws} l={c.losses} />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </>
        )}

        {/* ================= MATCHES ================= */}
        {tab === "MATCHES" && (
          <>
            {upcoming.length > 0 && (
              <Panel title="Upcoming & live" icon="🕒">
                <div className="space-y-2">{upcoming.map((m) => <MatchRow key={m.id} m={m} mine={mine} />)}</div>
              </Panel>
            )}
            <Panel title="Match history" icon="📋" right={own ? <Link href={"/my-matches" as Route} className="text-[11px] font-black text-[#D4AF37] hover:underline">Personal center →</Link> : undefined}>
              {completed.length === 0 ? <p className="py-6 text-center text-xs text-[var(--text-muted)]">No matches played yet.</p> : <div className="space-y-2">{completed.slice(0, 30).map((m) => <MatchRow key={m.id} m={m} mine={mine} />)}</div>}
            </Panel>
          </>
        )}

        {/* ================= TOURNAMENTS ================= */}
        {tab === "TOURNAMENTS" && (
          tours.length === 0 ? <Panel title="Tournaments" icon="🏟️"><p className="py-6 text-center text-xs text-[var(--text-muted)]">Kono tournament e entry nai.</p></Panel> : (
            <div className="grid gap-4 md:grid-cols-2">
              {tours.map((t, i) => (
                <Link key={t.entry_id} href={`/tournament/${t.slug}` as Route} className="cw-card cw-hud cw-fade-up rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/8 to-transparent p-4" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">{categoryIcon(t.category)} {categoryLabel(t.category)} · {t.format}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${t.status === "live" ? "bg-red-500/20 text-red-400" : t.status === "open" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-300"}`}>{t.status}</span>
                  </div>
                  <h3 className="mt-2 text-base font-black uppercase">{t.place === 1 ? "🥇 " : t.place === 2 ? "🥈 " : t.place === 3 ? "🥉 " : ""}{t.name}</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Entry: <b className="text-[var(--text-main)]">{t.entry_name}</b>{t.season ? ` · ${t.season}` : ""}{t.prize ? ` · 🎁 ${t.prize}` : ""}</p>
                  <div className="mt-3"><ProgressBar value={t.played} max={t.total || 1} /></div>
                  <p className="mt-1 text-[10px] font-bold text-[var(--text-muted)]">{t.played}/{t.total} matches played</p>
                </Link>
              ))}
            </div>
          )
        )}

        {/* ================= ACHIEVEMENTS ================= */}
        {tab === "ACHIEVEMENTS" && (
          <>
            <Panel title="Trophy cabinet" icon="🏆">
              <div className="grid grid-cols-3 gap-3">
                {[["👑", "Champion", ov.titles.champion], ["🥈", "Runner-up", ov.titles.runner_up], ["🥉", "Semi-final", ov.titles.third]].map(([ic, lb, n]) => (
                  <div key={String(lb)} className={`rounded-2xl border p-4 text-center ${Number(n) > 0 ? "cw-glow border-[#D4AF37] bg-[#D4AF37]/10" : "border-[var(--border-color)] bg-[var(--bg-main)] opacity-60"}`}>
                    <div className="text-4xl">{ic}</div>
                    <div className="cw-mono mt-1 text-2xl font-black text-[#D4AF37]">{n}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{lb}</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Ranking achievements" icon="🎖️">
              <div className="flex flex-wrap gap-2">
                {(["overall", "seasonal", "monthly", "weekly"] as const).filter((p) => ov.ranks[p] && ov.ranks[p]! <= 10).map((p) => (
                  <span key={p} className="rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1.5 text-[11px] font-black uppercase text-[#D4AF37]">{ov.ranks[p]! <= 3 ? "🏅" : "🎖️"} {p} Top {ov.ranks[p]! <= 3 ? 3 : 10} (#{ov.ranks[p]})</span>
                ))}
                {!(["overall", "seasonal", "monthly", "weekly"] as const).some((p) => ov.ranks[p] && ov.ranks[p]! <= 10) && <p className="text-xs text-[var(--text-muted)]">Top 10 e dhukle ekhane badge ashbe.</p>}
              </div>
            </Panel>
            <Panel title="Career totals" icon="📊">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatTile icon="✔" label="Wins" value={o.wins} /><StatTile icon="⚽" label="Goals" value={o.goals} /><StatTile icon="⭐" label="MOTM" value={o.motm} /><StatTile icon="🛡️" label="Clean sheets" value={o.clean_sheets} />
              </div>
            </Panel>
          </>
        )}

        {/* ================= MILESTONES ================= */}
        {tab === "MILESTONES" && (
          <>
            <Panel title="Progression" icon="📶">
              <div className="grid gap-4 md:grid-cols-2">
                {progression.map((p) => (
                  <div key={p.title} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase"><span>{p.icon} {p.title}</span><span className="cw-mono text-[#D4AF37]">{p.cur} / {p.next}</span></div>
                    <ProgressBar value={p.cur} max={p.next || 1} />
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Badge vault" icon="🎖️" right={
              <div className="flex gap-1">{(["ALL", "ATTACK", "DEFENSE", "SPECIAL"] as const).map((f) => (
                <button key={f} onClick={() => setBadgeFilter(f)} className={`rounded-md px-2 py-1 text-[9px] font-black ${badgeFilter === f ? "bg-[#D4AF37] text-black" : "text-[var(--text-muted)]"}`}>{f}</button>
              ))}</div>}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {badges.map((b) => (
                  <div key={b.name} className={`rounded-xl border p-4 text-center transition-all ${b.ok ? "cw-glow border-[#D4AF37] bg-[#D4AF37]/10" : "border-[var(--border-color)] bg-[var(--bg-main)] opacity-50 grayscale"}`}>
                    <div className="text-3xl">{b.icon}</div>
                    <div className="mt-1 text-xs font-black uppercase">{b.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{b.desc}</div>
                    <div className={`mt-2 text-[9px] font-black uppercase ${b.ok ? "text-emerald-400" : "text-[var(--text-muted)]"}`}>{b.ok ? "Unlocked" : "Locked"}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </>
        )}

        {/* ================= TIMELINE ================= */}
        {tab === "TIMELINE" && (
          <>
            <Panel title="Career records" icon="📁">
              <div className="grid grid-cols-2 gap-3">
                <StatTile icon="💥" label="Most goals in a match" value={o.best_goals} />
                <StatTile icon="🗓️" label="Career started" value={<span className="text-sm">{o.matches ? formatDate(ov.first_match_at) : "Recently joined"}</span>} />
              </div>
            </Panel>
            <Panel title="Journey timeline" icon="🧭">
              {completed.length === 0 ? (
                <div className="py-8 text-center"><div className="text-4xl">⏳</div><p className="mt-2 text-xs text-[var(--text-muted)]">The journey has not begun. Play matches to build your timeline.</p></div>
              ) : (
                <ol className="relative space-y-4 border-l border-[#D4AF37]/30 pl-6">
                  {completed.slice(0, 25).map((m, i) => {
                    const r = outcome(m, mine);
                    const home = !!m.home_entry_id && mine.has(m.home_entry_id);
                    const opp = home ? m.away_name : m.home_name;
                    return (
                      <li key={m.id} className="cw-fade-up relative" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
                        <span className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white ${r === "W" ? "bg-emerald-500" : r === "L" ? "bg-red-500" : "bg-zinc-500"}`}>{r}</span>
                        <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{formatDateTime(m.completed_at)}</div>
                        <div className="text-sm font-bold">{r === "W" ? "Beat" : r === "L" ? "Lost to" : "Drew with"} <span className="text-[#D4AF37]">{opp}</span> <span className="cw-mono">{home ? `${m.home_score}-${m.away_score}` : `${m.away_score}-${m.home_score}`}</span></div>
                        <div className="text-[11px] text-[var(--text-muted)]">{categoryIcon(m.category)} {m.tournament_name} · {m.stage}{m.motm_player_id === user.id ? " · ⭐ MOTM" : ""}</div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </Panel>
          </>
        )}

        {/* ================= INFO ================= */}
        {tab === "INFO" && (
          <Panel title="Player card" icon="🪪">
            <dl className="grid gap-3 md:grid-cols-2">
              {([
                ["Konami UID", user.konamiId],
                ["Device", user.hardware],
                ["Location", user.location],
                ["Status", user.status],
                ...(own ? [["Email", user.email], ["Blood group", user.bloodGroup], ["Date of birth", user.dob], ["WhatsApp", user.whatsapp || "—"], ["Discord", user.discord || "—"], ["Cobeg ID", user.cobegId || "—"]] : []),
              ] as [string, string | undefined][]).map(([k, v]) => (
                <div key={k} className="cw-hud rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3">
                  <dt className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{k}</dt>
                  <dd className="mt-1 break-all text-sm font-bold">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        )}
      </div>

      {editing && <ProfileEditModal editForm={form} setEditForm={setForm} onSave={onSave} onClose={() => setEditing(false)} onImageUpload={onImage} />}
    </div>
  );
}

function MatchRow({ m, mine }: { m: MatchCard; mine: Set<string> }) {
  const r = outcome(m, mine);
  const home = !!m.home_entry_id && mine.has(m.home_entry_id);
  const opp = home ? m.away_name : m.home_name;
  const score = m.status === "completed" ? (home ? `${m.home_score}-${m.away_score}` : `${m.away_score}-${m.home_score}`) : "VS";
  const tone = r === "W" ? "bg-emerald-500" : r === "L" ? "bg-red-500" : r === "D" ? "bg-zinc-500" : m.status === "live" ? "bg-red-500" : "bg-[#D4AF37] text-black";
  return (
    <Link href={`/tournament/${m.tournament_slug}` as Route} className="cw-card flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white ${tone}`}>{r ?? (m.status === "live" ? "●" : "🕒")}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black uppercase">vs {opp ?? "TBD"}</p>
        <p className="truncate text-[10px] text-[var(--text-muted)]">{categoryIcon(m.category)} {m.tournament_name} · {m.stage}</p>
      </div>
      <div className="text-right">
        <div className="cw-mono text-sm font-black text-[#D4AF37]">{score}</div>
        <div className="text-[9px] font-bold text-[var(--text-muted)]">{formatDateTime(m.status === "completed" ? m.completed_at : m.scheduled_at)}</div>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]"><div className="animate-pulse font-black tracking-widest text-[#D4AF37]">LOADING PROFILE...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
