import type { Route } from "next";
import Link from "next/link";
import type { RankedPlayer } from "../../lib/tournament/types";
import { Avatar, delay } from "./ui";

// Server ar client dutoi jaygay use kora jay (kono hook nai)
export default function RankingList({ rows, label = "OVERALL" }: { rows: RankedPlayer[]; label?: string }) {
  const [first, ...rest] = rows;
  if (!first) return null;
  return (
    <div>
      <Link
        href={`/profile?id=${first.player_id}` as Route}
        className="cw-card cw-glow cw-sweep group mb-3 flex flex-col items-center justify-between gap-4 rounded-xl border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent p-4 md:flex-row"
      >
        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="relative shrink-0">
            <span className="cw-float absolute -left-1 -top-4 z-10 text-xl">👑</span>
            <Avatar src={first.avatar} name={first.name} size={60} ring />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{label} LEADER</span>
            <h3 className="text-base font-black uppercase tracking-wide text-[var(--text-main)] transition-colors group-hover:text-[#D4AF37] md:text-lg">{first.name}</h3>
          </div>
        </div>
        <div className="font-mono text-2xl font-black text-[#D4AF37]">
          {first.rating} <span className="text-xs font-bold text-[var(--text-muted)]">RTG</span>
        </div>
      </Link>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3 text-center font-mono text-xs font-bold md:grid-cols-5">
        <div>👕 {first.matches} APP</div>
        <div>✔ {first.wins} W</div>
        <div>➖ {first.draws} D</div>
        <div>⚽ {first.goals} GF</div>
        <div className="text-[#D4AF37]">📊 {first.win_rate ?? 0}% WIN</div>
      </div>

      <div className="space-y-2">
        {rest.map((p, i) => (
          <Link
            key={p.player_id}
            href={`/profile?id=${p.player_id}` as Route}
            className="cw-fade-up group flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3 text-xs transition-all duration-200 hover:translate-x-1 hover:border-[#D4AF37]"
            style={delay(i, 50)}
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-center font-mono font-black text-[#D4AF37]">#{i + 2}</span>
              <Avatar src={p.avatar} name={p.name} size={34} />
              <div>
                <h4 className="font-bold uppercase text-[var(--text-main)] transition-colors group-hover:text-[#D4AF37]">{p.name}</h4>
                <div className="flex gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                  <span>👕 {p.matches}</span>
                  <span>✔ {p.wins}</span>
                  <span>⚽ {p.goals}</span>
                </div>
              </div>
            </div>
            <div className="font-mono text-sm font-black text-[#D4AF37]">{p.rating}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
