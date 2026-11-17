import React from "react";
import "../tournament/effects.css";
import "../tournament/effects-extra.css";

// ---------- Rating ring ----------
export function RatingRing({ value, label = "RATING", size = 150, max = 1500, min = 900 }: { value: number | null; label?: string; size?: number; max?: number; min?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.max(0.04, Math.min(1, (value - min) / (max - min)));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#cwGold)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          style={{ ["--ring-from" as string]: c, ["--ring-to" as string]: c * (1 - pct), strokeDashoffset: c * (1 - pct) } as React.CSSProperties}
          className="cw-ring-anim drop-shadow-[0_0_8px_rgba(212,175,55,.7)]"
        />
        <defs>
          <linearGradient id="cwGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="100%" stopColor="#AA7C11" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="cw-mono cw-neon text-3xl font-black text-[#D4AF37]">{value ?? "—"}</span>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)]">{label}</span>
      </div>
    </div>
  );
}

// ---------- Form dots ----------
export function FormDots({ form }: { form: string[] }) {
  if (!form.length) return <span className="text-xs text-[var(--text-muted)]">No matches yet</span>;
  const tone = { W: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,.7)]", D: "bg-zinc-500", L: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.6)]" } as const;
  return (
    <div className="flex items-center gap-1.5">
      {form.map((r, i) => (
        <span key={i} className={`cw-pop flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black text-white ${tone[r as "W"]}`} style={{ animationDelay: `${i * 80}ms` }}>
          {r}
        </span>
      ))}
    </div>
  );
}

// ---------- W/D/L bar ----------
export function RecordBar({ w, d, l }: { w: number; d: number; l: number }) {
  const total = w + d + l;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
        {total === 0 ? null : (
          <>
            <div className="cw-bar-fill bg-emerald-500" style={{ width: `${pct(w)}%` }} />
            <div className="cw-bar-fill bg-zinc-500" style={{ width: `${pct(d)}%`, animationDelay: ".15s" }} />
            <div className="cw-bar-fill bg-red-500" style={{ width: `${pct(l)}%`, animationDelay: ".3s" }} />
          </>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-black uppercase tracking-wider">
        <span className="text-emerald-400">{w} W</span>
        <span className="text-zinc-400">{d} D</span>
        <span className="text-red-400">{l} L</span>
      </div>
    </div>
  );
}

// ---------- Stat tile ----------
export function StatTile({ icon, label, value, sub, glow = false }: { icon: string; label: string; value: React.ReactNode; sub?: string; glow?: boolean }) {
  return (
    <div className={`cw-hud rounded-xl border bg-[var(--bg-main)] p-3 text-center ${glow ? "border-[#D4AF37]/60 shadow-[0_0_18px_rgba(212,175,55,.18)]" : "border-[var(--border-color)]"}`}>
      <div className="text-lg">{icon}</div>
      <div className="cw-mono mt-1 text-xl font-black text-[var(--text-main)]">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</div>
      {sub && <div className="mt-0.5 text-[9px] font-bold text-[#D4AF37]">{sub}</div>}
    </div>
  );
}

// ---------- Progress bar ----------
export function ProgressBar({ value, max, color = "from-[#AA7C11] to-[#F3E5AB]" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
      <div className={`cw-bar-fill h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ---------- Mini bar chart (6 month trend) ----------
export function TrendBars({ data, keyName, color = "#D4AF37" }: { data: { month: string; [k: string]: number | string }[]; keyName: string; color?: string }) {
  const values = data.map((d) => Number(d[keyName]) || 0);
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-32 items-end justify-between gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="cw-mono text-[10px] font-black text-[var(--text-main)]">{values[i]}</span>
          <div className="flex h-20 w-full items-end overflow-hidden rounded-md bg-white/5">
            <div className="w-full origin-bottom rounded-md transition-all duration-700" style={{ height: `${(values[i] / max) * 100}%`, minHeight: values[i] ? 6 : 0, background: `linear-gradient(to top, ${color}, #F3E5AB)` }} />
          </div>
          <span className="text-[9px] font-bold uppercase text-[var(--text-muted)]">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, icon, children, right }: { title: string; icon?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="cw-hud cw-fade-up rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-lg md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </section>
  );
}

export const nf = (n: number | null | undefined) => (n === null || n === undefined ? "—" : String(n));
