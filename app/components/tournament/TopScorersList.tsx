import type { Route } from "next";
import Link from "next/link";
import type { Scorer } from "../../lib/tournament/types";
import { Avatar, delay } from "./ui";

export default function TopScorersList({ rows }: { rows: Scorer[] }) {
  return (
    <div className="space-y-2">
      {rows.map((s, i) => (
        <Link
          key={s.player_id}
          href={`/profile?id=${s.player_id}` as Route}
          className={`cw-card cw-fade-up flex items-center justify-between rounded-xl border bg-[var(--bg-card)] p-3 ${i === 0 ? "border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/15 to-transparent" : "border-[var(--border-color)]"}`}
          style={delay(i, 50)}
        >
          <div className="flex items-center gap-3">
            <span className={`w-6 text-center font-mono text-sm font-black ${i === 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>#{i + 1}</span>
            <Avatar src={s.avatar} name={s.name} size={i === 0 ? 48 : 36} ring={i === 0} />
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--text-main)]">{s.name}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">👕 {s.matches} APP · ⚽ {s.ratio ?? 0}/match</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-black text-[#D4AF37]">{s.goals}</div>
            <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]">goals</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
