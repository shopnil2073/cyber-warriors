import type { Route } from "next";
import Link from "next/link";
import { createPublicClient } from "../../lib/supabase/server-public";
import { fetchMatchCards, fetchRanking, fetchTopScorers, fetchTournaments } from "../../lib/tournament/queries";
import { categoryIcon, categoryLabel, type CategoryId } from "../../lib/tournament/types";
import MatchScorecard from "./MatchScorecard";
import RankingList from "./RankingList";
import TopScorersList from "./TopScorersList";
import { EmptyState, PageHero, SectionTitle, TournamentCard } from "./ui";

// /solo ar /team-up dutoi eta use kore. categories diye alada kora hoy.
export default async function CategoryHub({
  categories,
  badge,
  title,
  subtitle,
}: {
  categories: CategoryId[];
  badge: string;
  title: string;
  subtitle: string;
}) {
  const db = createPublicClient();
  const [all, upcoming, results, ranking, scorers] = await Promise.all([
    Promise.all(categories.map((c) => fetchTournaments(db, { category: c, limit: 60 }))).then((r) => r.flat()),
    fetchMatchCards(db, { categories, status: ["live", "scheduled"], sort: "schedule", limit: 6 }),
    fetchMatchCards(db, { categories, status: ["completed"], sort: "latest", limit: 6 }),
    fetchRanking(db, "overall", 8),
    fetchTopScorers(db, { limit: 5 }),
  ]);

  const live = all.filter((t) => t.status === "live");
  const open = all.filter((t) => t.status === "open");
  const done = all.filter((t) => t.status === "completed").slice(0, 3);
  const matchable = upcoming.filter((m) => m.home_entry_id && m.away_entry_id);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 text-[var(--text-main)]">
      <PageHero badge={badge} title={title} subtitle={subtitle} />

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/tournament?cat=${c}&status=live` as Route}
              className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] transition-all hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              {categoryIcon(c)} {categoryLabel(c)}
            </Link>
          ))}
        </div>

        {live.length > 0 && (
          <section>
            <SectionTitle icon="🔴" title="Live now" href={`/tournament?cat=${categories[0]}&status=live`} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
            </div>
          </section>
        )}

        <section>
          <SectionTitle icon="🔓" title="Open registration" href={`/tournament?cat=${categories[0]}&status=open`} />
          {open.length === 0 ? (
            <EmptyState text="No open tournaments right now" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {open.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
            </div>
          )}
        </section>

        <section>
          <SectionTitle icon="📅" title="Upcoming & live matches" />
          {matchable.length === 0 ? (
            <EmptyState text="No scheduled matches yet" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matchable.map((m, i) => <MatchScorecard key={m.id} m={m} index={i} />)}
            </div>
          )}
        </section>

        <section>
          <SectionTitle icon="📋" title="Latest results" />
          {results.length === 0 ? (
            <EmptyState text="No results published yet" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((m, i) => <MatchScorecard key={m.id} m={m} index={i} />)}
            </div>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <SectionTitle icon="👑" title="Elite ranking" href="/ranking" hrefLabel="Full rank" />
            {ranking.length === 0 ? <EmptyState text="Rankings appear after the first result" /> : <RankingList rows={ranking} />}
          </section>
          <section>
            <SectionTitle icon="🏆" title="Top scorers" href="/ranking" hrefLabel="All scorers" />
            {scorers.length === 0 ? <EmptyState text="No goals recorded yet" /> : <TopScorersList rows={scorers} />}
          </section>
        </div>

        {done.length > 0 && (
          <section>
            <SectionTitle icon="🏁" title="Recently completed" href={`/tournament?cat=${categories[0]}&status=completed`} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {done.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
