"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { getActiveUser } from "../../utils/userStore";
import { fetchRankingAll, RATING_FORMULA, type Period, type RankRow } from "../lib/tournament/playerQueries";
import { CATEGORIES, type CategoryId } from "../lib/tournament/types";
import { Avatar } from "../components/tournament/ui";
import "../components/tournament/effects.css";
import "../components/tournament/effects-extra.css";

type SortKey = "rating" | "wins" | "goals" | "motm" | "win_rate";

const PERIODS: { id: Period; label: string }[] = [
  { id: "overall", label: "OVERALL" },
  { id: "seasonal", label: "SEASONAL" },
  { id: "monthly", label: "MONTHLY" },
  { id: "weekly", label: "WEEKLY" },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "rating", label: "⭐ Rating" },
  { id: "wins", label: "🏆 Wins" },
  { id: "goals", label: "⚽ Goals" },
  { id: "motm", label: "🎖️ MOTM" },
  { id: "win_rate", label: "📊 Win %" },
];

function periodLabel(p: Period): string {
  const now = new Date();
  const tz = { timeZone: "Asia/Dhaka" } as const;
  if (p === "monthly") return now.toLocaleDateString("en-GB", { ...tz, month: "long", year: "numeric" });
  if (p === "weekly") return "This week (Mon – Sun)";
  if (p === "seasonal") {
    const month = Number(now.toLocaleDateString("en-GB", { ...tz, month: "numeric" }));
    const year = now.toLocaleDateString("en-GB", { ...tz, year: "numeric" });
    return month > 6 ? `Season ${year} (Jul – Dec)` : `Season ${year} (Jan – Jun)`;
  }
  return "All time";
}

const metric = (r: RankRow, k: SortKey) => (k === "win_rate" ? Number(r.win_rate ?? 0) : Number(r[k] ?? 0));

export default function RankingPage() {
  const [period, setPeriod] = useState<Period>("overall");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [sort, setSort] = useState<SortKey>("rating");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<RankRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => setMyId(getActiveUser()?.id ?? null), []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    void fetchRankingAll(supabase, period, category).then((r) => {
      if (!alive) return;
      setRows(r);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [period, category]);

  const { ranked, fresh } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (r: RankRow) => !q || r.name.toLowerCase().includes(q);
    const played = rows.filter((r) => r.matches > 0);
    const sorted = [...played].sort((a, b) => metric(b, sort) - metric(a, sort) || (b.rating ?? 0) - (a.rating ?? 0));
    return {
      ranked: sorted.map((r, i) => ({ ...r, shown: sort === "rating" ? (r.rank ?? i + 1) : i + 1 })).filter(match),
      fresh: rows.filter((r) => r.matches === 0).filter(match),
    };
  }, [rows, sort, query]);

  const podium = !query ? ranked.slice(0, 3) : [];
  const rest = !query ? ranked.slice(3) : ranked;
  const podiumOrder = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-28 text-[var(--text-main)]">
      {/* HERO */}
      <section className="cw-grid-bg relative overflow-hidden border-b border-[var(--border-color)]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D4AF37]/15 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-center">
          <span className="cw-fade-up cw-glow inline-block rounded-full border border-[#D4AF37]/40 bg-[var(--bg-card)] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
            Official leaderboard
          </span>
          <h1 className="cw-fade-up cw-shine-text mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl" style={{ animationDelay: "80ms" }}>
            Elite ranking
          </h1>
          <p className="cw-fade-up mt-2 text-xs text-[var(--text-muted)]" style={{ animationDelay: "160ms" }}>
            Register korle <b className="text-[#D4AF37]">#NEW</b>. Prothom match khelar por-i auto rating ar rank.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
        {/* PERIOD TABS */}
        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPeriod(p.id); setOpen(null); }}
              className={`rounded-lg py-2.5 text-[11px] font-black uppercase tracking-wider transition-all ${period === p.id ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/25" : "text-[var(--text-muted)] hover:text-white"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">🏆 {periodLabel(period)}</div>
          <button onClick={() => setShowInfo((s) => !s)} className="text-[11px] font-bold text-[var(--text-muted)] underline-offset-2 hover:text-[#D4AF37] hover:underline">
            {showInfo ? "Hide" : "How is rating calculated?"}
          </button>
        </div>
        {showInfo && (
          <div className="cw-fade-up rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-3 text-xs text-[var(--text-muted)]">
            Rating = <b className="cw-mono text-[#D4AF37]">{RATING_FORMULA}</b>. Admin result publish korlei ranking, stats ar badge auto update hoy.
          </div>
        )}

        {/* CATEGORY + SORT + SEARCH */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[{ id: null, label: "All", icon: "🌐" }, ...CATEGORIES.map((c) => ({ id: c.id as CategoryId | null, label: c.label, icon: c.icon }))].map((c) => (
              <button
                key={c.label}
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${category === c.id ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]" : "border-[var(--border-color)] text-[var(--text-muted)] hover:text-white"}`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {SORTS.map((s) => (
                <button key={s.id} onClick={() => setSort(s.id)} className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-black transition-all ${sort === s.id ? "bg-[#D4AF37] text-black" : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"}`}>
                  {s.label}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Search player..."
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2 text-xs outline-none transition-all focus:border-[#D4AF37] md:w-60"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" style={{ animationDelay: `${i * 100}ms` }} />)}
          </div>
        ) : ranked.length === 0 && fresh.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">No players found</div>
        ) : (
          <>
            {/* PODIUM */}
            {podium.length > 0 && (
              <div className="grid grid-cols-3 items-end gap-2 pt-4 md:gap-4">
                {podiumOrder.map((p) => {
                  const pos = p.shown;
                  const first = pos === 1;
                  return (
                    <Link
                      key={p.player_id}
                      href={`/profile?id=${p.player_id}` as Route}
                      className={`cw-card cw-fade-up cw-hud group relative flex flex-col items-center rounded-2xl border bg-gradient-to-b p-3 text-center md:p-5 ${first ? "cw-glow border-[#D4AF37] from-[#D4AF37]/25 to-transparent pb-8 md:pb-10" : "border-[var(--border-color)] from-white/5 to-transparent"}`}
                      style={{ animationDelay: `${first ? 0 : 150}ms` }}
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">{pos === 1 ? "👑" : pos === 2 ? "🥈" : "🥉"}</span>
                      <div className="mt-2"><Avatar src={p.avatar} name={p.name} size={first ? 76 : 56} ring={first} /></div>
                      <h3 className="mt-2 line-clamp-1 text-[11px] font-black uppercase tracking-wide text-[var(--text-main)] group-hover:text-[#D4AF37] md:text-sm">{p.name}</h3>
                      <div className="cw-mono cw-neon mt-1 text-xl font-black text-[#D4AF37] md:text-3xl">{sort === "rating" ? p.rating : metric(p, sort)}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{SORTS.find((s) => s.id === sort)?.label.replace(/^\S+\s/, "")}</div>
                      <div className="mt-2 hidden gap-2 text-[10px] font-bold text-[var(--text-muted)] md:flex">
                        <span>👕 {p.matches}</span><span className="text-emerald-400">✔ {p.wins}</span><span>⚽ {p.goals}</span>
                      </div>
                      <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-black ${first ? "bg-[#D4AF37] text-black" : "bg-[var(--bg-card)] text-[#D4AF37] border border-[#D4AF37]/40"}`}>#{pos}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* LIST */}
            <div className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-2">
              {rest.map((p, i) => {
                const mine = myId === p.player_id;
                const isOpen = open === p.player_id;
                const gd = p.goals - p.conceded;
                return (
                  <div
                    key={p.player_id}
                    className={`cw-fade-up overflow-hidden rounded-2xl border bg-[var(--bg-card)] transition-all duration-300 ${mine ? "border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,.2)]" : "border-[var(--border-color)] hover:border-[#D4AF37]/50"}`}
                    style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                  >
                    <div className="flex items-center justify-between gap-3 p-3.5">
                      <Link href={`/profile?id=${p.player_id}` as Route} className="flex min-w-0 items-center gap-3">
                        <span className={`cw-mono w-8 shrink-0 text-center text-sm font-black ${p.shown <= 10 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>#{p.shown}</span>
                        <Avatar src={p.avatar} name={p.name} size={42} ring={mine} />
                        <div className="min-w-0">
                          <h3 className="truncate text-xs font-black uppercase tracking-wide text-[var(--text-main)]">
                            {p.name} {mine && <span className="ml-1 rounded bg-[#D4AF37] px-1.5 py-0.5 text-[9px] text-black">YOU</span>}
                          </h3>
                          <div className="cw-mono mt-0.5 flex gap-2 text-[10px] text-[var(--text-muted)]"><span>👕 {p.matches}</span><span>✔ {p.wins}</span><span>⚽ {p.goals}</span></div>
                        </div>
                      </Link>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="text-right">
                          <div className="cw-mono text-lg font-black text-[#D4AF37]">{sort === "rating" ? p.rating : metric(p, sort)}</div>
                          <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]">{sort === "rating" ? "rating" : sort.replace("_", " ")}</div>
                        </div>
                        <button onClick={() => setOpen(isOpen ? null : p.player_id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] text-xs text-[var(--text-muted)] hover:text-[#D4AF37]" aria-label="Toggle stats">
                          {isOpen ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>
                    <div className={`grid grid-cols-4 gap-2 px-3.5 text-center transition-all duration-300 md:grid-cols-6 ${isOpen ? "max-h-40 pb-3.5 pt-1 opacity-100" : "max-h-0 opacity-0"}`}>
                      {[
                        ["WIN %", `${p.win_rate ?? 0}%`, "text-[#D4AF37]"],
                        ["D", p.draws, ""], ["L", p.losses, "text-red-400"],
                        ["GF", p.goals, ""], ["GA", p.conceded, ""],
                        ["GD", gd > 0 ? `+${gd}` : gd, gd >= 0 ? "text-emerald-400" : "text-red-400"],
                      ].map(([k, v, c]) => (
                        <div key={String(k)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] p-2">
                          <div className="text-[9px] font-bold text-[var(--text-muted)]">{k}</div>
                          <div className={`cw-mono text-xs font-black ${c || "text-[var(--text-main)]"}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NEW PLAYERS */}
            {fresh.length > 0 && (
              <section className="pt-6">
                <h2 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span className="rounded bg-[#D4AF37]/15 px-2 py-0.5 text-[#D4AF37]">#NEW</span> Waiting for first match ({fresh.length})
                </h2>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {fresh.map((p) => (
                    <Link key={p.player_id} href={`/profile?id=${p.player_id}` as Route} className="cw-card flex items-center gap-2 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-2.5">
                      <Avatar src={p.avatar} name={p.name} size={32} />
                      <span className="truncate text-[11px] font-bold uppercase text-[var(--text-muted)]">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
