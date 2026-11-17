import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient } from "../../lib/supabase/server-public";
import {
  fetchEntries,
  fetchMatchCards,
  fetchStandings,
  fetchTopScorers,
  fetchTournamentBySlug,
} from "../../lib/tournament/queries";
import { categoryIcon, categoryLabel } from "../../lib/tournament/types";
import BracketView from "../../components/tournament/BracketView";
import MatchScorecard from "../../components/tournament/MatchScorecard";
import StandingsTable from "../../components/tournament/StandingsTable";
import TopScorersList from "../../components/tournament/TopScorersList";
import { Avatar, EmptyState, SectionTitle, StatusBadge } from "../../components/tournament/ui";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await fetchTournamentBySlug(createPublicClient(), slug);
  return { title: t ? `${t.name} | Cyber Warriors` : "Tournament not found" };
}

const TABS = [
  { id: "fixtures", label: "📋 Scorecards" },
  { id: "table", label: "🏆 Points table" },
  { id: "bracket", label: "🌳 Bracket" },
  { id: "stats", label: "📊 Stats" },
  { id: "motm", label: "⭐ MOTM" },
] as const;

export default async function TournamentDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab: tabParam } = await searchParams;

  const db = createPublicClient();
  const t = await fetchTournamentBySlug(db, slug);
  if (!t) notFound();

  const tab = TABS.some((x) => x.id === tabParam) ? tabParam! : t.format === "knockout" ? "bracket" : "fixtures";

  const [matches, entries] = await Promise.all([
    fetchMatchCards(db, { tournamentId: t.id }),
    fetchEntries(db, t.id),
  ]);

  const standings = tab === "table" && t.format === "league" ? await fetchStandings(db, t.id) : [];
  const scorers = tab === "stats" ? await fetchTopScorers(db, { tournamentId: t.id, limit: 10 }) : [];

  const stages = Array.from(new Set(matches.map((m) => m.stage)));
  const motmMatches = matches.filter((m) => m.status === "completed" && m.motm_player_id);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 text-[var(--text-main)]">
      <section className="relative overflow-hidden border-b border-[var(--border-color)]">
        {t.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.banner_url} alt={t.name} className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="cw-grid-bg absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-10">
          <Link href={`/tournament?cat=${t.category}&status=${t.status}` as Route} className="text-xs font-bold text-[var(--text-muted)] hover:text-[#D4AF37]">
            ← {categoryLabel(t.category)} tournaments
          </Link>
          <div className="cw-fade-up mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-[#D4AF37]/40 bg-black/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
              {categoryIcon(t.category)} {categoryLabel(t.category)}
            </span>
            <StatusBadge status={t.status} />
            <span className="text-[11px] font-bold text-[var(--text-muted)]">{t.format === "knockout" ? "🌳 Knockout" : "📋 League"}</span>
            {t.season && <span className="text-[11px] font-bold text-[var(--text-muted)]">📅 {t.season}</span>}
          </div>
          <h1 className="cw-fade-up mt-2 text-2xl font-black uppercase tracking-tight md:text-4xl cw-shine-text" style={{ animationDelay: "80ms" }}>
            {t.name}
          </h1>
          {t.description && <p className="mt-2 max-w-2xl text-xs text-[var(--text-muted)] md:text-sm">{t.description}</p>}
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-[var(--text-muted)]">
            <span>👥 {entries.length} entries</span>
            <span>⚽ {matches.filter((m) => m.status === "completed").length}/{matches.length} played</span>
            {t.prize && <span className="text-[#D4AF37]">🎁 {t.prize}</span>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {TABS.map((x) => (
            <Link
              key={x.id}
              href={`/tournament/${t.slug}?tab=${x.id}` as Route}
              className={`shrink-0 rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                tab === x.id ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-transparent text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {x.label}
            </Link>
          ))}
        </div>

        {tab === "fixtures" &&
          (matches.length === 0 ? (
            <EmptyState text="Fixtures not generated yet" />
          ) : (
            <div className="space-y-8">
              {stages.map((stage) => (
                <section key={stage}>
                  <SectionTitle icon="📌" title={stage} />
                  <div className="grid gap-4 md:grid-cols-2">
                    {matches
                      .filter((m) => m.stage === stage && (m.home_entry_id || m.away_entry_id))
                      .map((m, i) => <MatchScorecard key={m.id} m={m} index={i} showTournament={false} />)}
                  </div>
                </section>
              ))}
            </div>
          ))}

        {tab === "table" &&
          (t.format === "knockout" ? (
            <EmptyState text="Knockout tournament: see the Bracket tab" />
          ) : standings.length === 0 ? (
            <EmptyState text="No entries yet" />
          ) : (
            <StandingsTable rows={standings} />
          ))}

        {tab === "bracket" &&
          (t.format !== "knockout" ? (
            <EmptyState text="League tournament: see the Points table tab" />
          ) : matches.length === 0 ? (
            <EmptyState text="Bracket not generated yet" />
          ) : (
            <BracketView matches={matches} />
          ))}

        {tab === "stats" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <SectionTitle icon="🏆" title="Top scorers" />
              {scorers.length === 0 ? <EmptyState text="No goals recorded yet" /> : <TopScorersList rows={scorers} />}
            </section>
            <section>
              <SectionTitle icon="👥" title="Participants" />
              {entries.length === 0 ? (
                <EmptyState text="No entries yet" />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {entries.map((e, i) => (
                    <div 
                      key={e.id} 
                      className="cw-fade-up flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 text-xs" 
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <Avatar name={e.name} size={30} />
                      <div className="min-w-0">
                        <p className="truncate font-black uppercase text-[var(--text-main)]">{e.name}</p>
                        {e.entry_members.length > 1 && <p className="text-[10px] text-[var(--text-muted)]">{e.entry_members.length} players</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "motm" &&
          (motmMatches.length === 0 ? (
            <EmptyState text="No MOTM awarded yet" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {motmMatches.map((m, i) => (
                <Link
                  key={m.id}
                  href={`/profile?id=${m.motm_player_id}` as Route}
                  className="cw-card cw-fade-up flex items-center gap-3 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-4"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Avatar src={m.motm_avatar} name={m.motm_name} size={56} ring />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">⭐ Man of the match</p>
                    <p className="truncate text-sm font-black uppercase text-[var(--text-main)]">{m.motm_name}</p>
                    <p className="truncate text-[11px] text-[var(--text-muted)]">
                      {m.home_name} {m.home_score}-{m.away_score} {m.away_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}