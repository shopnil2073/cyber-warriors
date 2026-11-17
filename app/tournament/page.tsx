import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "../lib/supabase/server-public";
import { CATEGORIES, STATUSES, categoryIcon, categoryLabel, type CategoryId, type TournamentStatus } from "../lib/tournament/types";
import { StatusBadge, EmptyState } from "../components/tournament/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tournaments | Cyber Warriors",
};

type Props = {
  searchParams: Promise<{ cat?: string; status?: string }>;
};

export default async function TournamentsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const activeCat = CATEGORIES.some((c) => c.id === resolvedParams.cat) ? (resolvedParams.cat as CategoryId) : undefined;
  const activeStatus = STATUSES.some((s) => s.id === resolvedParams.status) ? (resolvedParams.status as TournamentStatus) : "open";

  const db = createPublicClient();
  let query = db.from("tournaments").select("*, tournament_entries(count)").eq("status", activeStatus);
  
  if (activeCat) {
    query = query.eq("category", activeCat);
  }

  const { data: tournaments, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tournaments:", error.message);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 text-[var(--text-main)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#D4AF37] md:text-4xl">
            Club Tournaments
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)] md:text-sm">
            Compete in official Cyber Warriors eFootball tournaments and establish your legacy.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <Link
            href={`/tournament?status=${activeStatus}`}
            className={`shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
              !activeCat
                ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <span>🏆</span>
            <span>All Categories</span>
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/tournament?cat=${c.id}&status=${activeStatus}`}
              className={`shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
                activeCat === c.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>

        {/* Status Filter */}
        <div className="mt-4 flex gap-2 border-b border-[var(--border-color)] pb-4">
          {STATUSES.map((s) => (
            <Link
              key={s.id}
              href={`/tournament?${activeCat ? `cat=${activeCat}&` : ""}status=${s.id}`}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeStatus === s.id
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Tournament List */}
        <div className="mt-8">
          {!tournaments || tournaments.length === 0 ? (
            <EmptyState text={`No ${activeStatus} tournaments found.`} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map((t) => {
                const entryCount = t.tournament_entries?.[0]?.count ?? 0;
                return (
                  <Link
                    key={t.id}
                    href={`/tournament/${t.slug}`}
                    className="cw-card group relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 transition-all hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                        {categoryIcon(t.category)} {categoryLabel(t.category)}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>

                    <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">
                      {t.name}
                    </h3>

                    {t.description && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                        {t.description}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)] pt-4 text-xs font-bold text-[var(--text-muted)]">
                      <span>👥 {entryCount} Teams/Players</span>
                      <span className="text-[#D4AF37] font-black uppercase group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}