import type { Route } from "next";
import Link from "next/link";
import "./effects.css";
import {
  CATEGORIES,
  STATUSES,
  categoryIcon,
  categoryLabel,
  type CategoryId,
  type Tournament,
  type TournamentStatus,
} from "../../lib/tournament/types";

export const delay = (i: number, step = 60) => ({ animationDelay: `${Math.min(i, 14) * step}ms` });

export function formatWhen(iso: string | null): string {
  if (!iso) return "TBA";
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Avatar({ src, name, size = 48, ring = false }: { src?: string | null; name?: string | null; size?: number; ring?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || "/logo.jpg"}
      alt={name || "Player"}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full object-cover bg-black/40 border-2 ${ring ? "border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,.55)]" : "border-[var(--border-color)]"}`}
    />
  );
}

export function PageHero({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border-color)] cw-grid-bg">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 text-center">
        <span className="cw-fade-up inline-block rounded-full border border-[#D4AF37]/40 bg-[var(--bg-card)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] cw-glow">
          {badge}
        </span>
        <h1 className="cw-fade-up mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl cw-shine-text" style={delay(1)}>
          {title}
        </h1>
        {subtitle && (
          <p className="cw-fade-up mx-auto mt-2 max-w-xl text-xs text-[var(--text-muted)] md:text-sm" style={delay(2)}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function SectionTitle({ icon, title, href, hrefLabel }: { icon: string; title: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wider text-[var(--text-main)] md:text-lg">
        <span>{icon}</span>
        {title}
      </h2>
      {href && (
        <Link
          href={href as Route}
          className="rounded-full border border-[#D4AF37]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
        >
          {hrefLabel ?? "View all"} →
        </Link>
      )}
    </div>
  );
}

export function CategoryTabs({ active, status }: { active: CategoryId; status: TournamentStatus }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/tournament?cat=${c.id}&status=${status}` as Route}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
            active === c.id
              ? "border-[#D4AF37] bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/20"
              : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[#D4AF37]/60 hover:text-white"
          }`}
        >
          <span>{c.icon}</span>
          {c.label}
        </Link>
      ))}
    </div>
  );
}

export function StatusTabs({
  category,
  active,
  counts,
}: {
  category: CategoryId;
  active: TournamentStatus;
  counts: Record<TournamentStatus, number>;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STATUSES.map((s) => (
        <Link
          key={s.id}
          href={`/tournament?cat=${category}&status=${s.id}` as Route}
          className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all ${
            active === s.id
              ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/25 scale-105"
              : "border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-white"
          }`}
        >
          {s.id === "live" && <span className="cw-live-dot h-2 w-2 rounded-full bg-red-500" />}
          {s.label}
          <span className={`rounded-full px-1.5 text-[9px] ${active === s.id ? "bg-black/20" : "bg-white/10"}`}>{counts[s.id]}</span>
        </Link>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: TournamentStatus }) {
  const map = {
    open: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    live: "border-red-500/40 bg-red-500/10 text-red-400",
    completed: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${map[status]}`}>
      {status === "live" && <span className="cw-live-dot h-1.5 w-1.5 rounded-full bg-red-500" />}
      {status}
    </span>
  );
}

export function TournamentCard({ t, index = 0 }: { t: Tournament; index?: number }) {
  const entries = t.tournament_entries?.[0]?.count ?? 0;
  return (
    <Link
      href={`/tournament/${t.slug}` as Route}
      className="cw-card cw-fade-up group relative block overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"
      style={delay(index)}
    >
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#1A2035] via-[#121624] to-[#0B0E14]">
        {t.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.banner_url} alt={t.name} className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg border border-[#D4AF37]/40 bg-black/50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] backdrop-blur">
            {categoryIcon(t.category)} {categoryLabel(t.category)}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={t.status} />
        </div>
        {!t.banner_url && <span className="cw-float absolute bottom-3 right-4 text-4xl opacity-30">🏆</span>}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-sm font-black uppercase leading-snug tracking-wide text-[var(--text-main)] transition-colors group-hover:text-[#D4AF37] md:text-base">
          {t.name}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[var(--text-muted)]">
          {t.season && <span>📅 {t.season}</span>}
          <span>{t.format === "knockout" ? "🌳 Knockout" : "📋 League"}</span>
          <span>👥 {entries} {entries === 1 ? "entry" : "entries"}</span>
          {t.prize && <span className="text-[#D4AF37]">🎁 {t.prize}</span>}
        </div>
      </div>
    </Link>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-10 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
      {text}
    </div>
  );
}
