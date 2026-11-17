import Link from "next/link";
import AccessDenied from "../components/admin/AccessDenied";
import TournamentAdminTab from "../components/admin/TournamentAdminTab";
import { requireAdminSession } from "../lib/server/session";

export const dynamic = "force-dynamic";

// Matchday HQ: fixtures + result publish (admin only, server session)
export default async function MatchdayPage() {
  try {
    const session = await requireAdminSession();
    if (!session) return <AccessDenied />;
    return (
      <div className="min-h-screen bg-[var(--bg-main)] p-4 pb-24 text-[var(--text-main)] md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div>
              <h1 className="text-lg font-black uppercase text-[#D4AF37]">📋 Matchday HQ</h1>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">Create tournaments, generate fixtures and publish results</p>
            </div>
            <Link href="/admin" className="rounded-xl border border-[var(--border-color)] px-3 py-1.5 text-xs font-bold hover:border-[#D4AF37]">Admin console</Link>
          </div>
          <TournamentAdminTab />
        </div>
      </div>
    );
  } catch (err) {
    return <AccessDenied reason={err instanceof Error ? err.message : "Server config error"} />;
  }
}
