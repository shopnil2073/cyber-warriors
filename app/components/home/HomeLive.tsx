"use client";

import React, { useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { fetchMatchCards, fetchRanking, fetchTopScorers } from "../../lib/tournament/queries";
import type { MatchCard, RankedPlayer, Scorer } from "../../lib/tournament/types";
import RankingList from "../tournament/RankingList";
import TopScorersList from "../tournament/TopScorersList";
import MatchScorecard from "../tournament/MatchScorecard";
import "../tournament/effects.css";

const Section = ({ icon, title, href, label, children }: { icon: string; title: string; href: string; label: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-md transition-colors md:p-6">
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-black uppercase tracking-wider text-[var(--text-main)] md:text-xl">{title}</h2>
      </div>
      <Link href={href as Route} className="rounded-lg border border-[#D4AF37]/40 px-3 py-1 text-xs font-bold uppercase text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10">
        {label} →
      </Link>
    </div>
    {children}
  </section>
);

const Skeleton = () => (
  <div className="space-y-2">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" style={{ animationDelay: `${i * 120}ms` }} />
    ))}
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <div className="py-10 text-center text-xs font-bold uppercase text-[var(--text-muted)]">{text}</div>
);

type Period = "OVERALL" | "MONTHLY" | "WEEKLY";

// Elite Ranking + Top Scorers + Upcoming: live Supabase data (demo data nai)
export default function HomeLive() {
  const [period, setPeriod] = useState<Period>("OVERALL");
  const [ranking, setRanking] = useState<RankedPlayer[]>([]);
  const [rankLoading, setRankLoading] = useState(true);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [scorersLoading, setScorersLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<MatchCard[]>([]);
  const [upLoading, setUpLoading] = useState(true);

  useEffect(() => {
    setRankLoading(true);
    void fetchRanking(supabase, period.toLowerCase() as "overall", 5).then((r) => {
      setRanking(r);
      setRankLoading(false);
    });
  }, [period]);

  useEffect(() => {
    void fetchTopScorers(supabase, { limit: 5 }).then((s) => {
      setScorers(s);
      setScorersLoading(false);
    });
    void fetchMatchCards(supabase, { status: ["live", "scheduled"], sort: "schedule", limit: 8 }).then((m) => {
      setUpcoming(m.filter((x) => x.home_entry_id && x.away_entry_id).slice(0, 3));
      setUpLoading(false);
    });
  }, []);

  return (
    <>
      <Section icon="👑" title="Elite ranking" href="/ranking" label="Full rank">
        <div className="mb-6 flex gap-2 border-b border-[var(--border-color)] pb-3">
          {(["OVERALL", "MONTHLY", "WEEKLY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all ${period === tab ? "scale-105 bg-[#D4AF37] text-black shadow-md" : "text-[var(--text-muted)] hover:text-[#D4AF37]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {rankLoading ? <Skeleton /> : ranking.length === 0 ? <Empty text="Ranking will appear after the first published result" /> : <RankingList rows={ranking} label={period} />}
      </Section>

      <Section icon="🏆" title="Top scorers" href="/ranking" label="All scorers">
        {scorersLoading ? <Skeleton /> : scorers.length === 0 ? <Empty text="No goals recorded yet" /> : <TopScorersList rows={scorers} />}
      </Section>

      <Section icon="📅" title="Upcoming matches" href="/tournament" label="All fixtures">
        {upLoading ? (
          <Skeleton />
        ) : upcoming.length === 0 ? (
          <Empty text="No scheduled matches right now" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((m, i) => <MatchScorecard key={m.id} m={m} index={i} />)}
          </div>
        )}
      </Section>
    </>
  );
}
