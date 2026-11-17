import type { MatchCard } from "../../lib/tournament/types";
import "./effects.css";

function Row({ name, score, winner, tbd }: { name: string | null; score: number | null; winner: boolean; tbd: string }) {
  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-bold ${winner ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "text-[var(--text-main)]"}`}>
      <span className={`truncate ${name ? "" : "italic text-[var(--text-muted)]"}`}>{name ?? tbd}</span>
      <span className="font-mono">{score ?? "-"}</span>
    </div>
  );
}

export default function BracketView({ matches }: { matches: MatchCard[] }) {
  const rounds = Array.from(new Set(matches.map((m) => m.round_no))).sort((a, b) => a - b);
  const columns = rounds.map((r) => matches.filter((m) => m.round_no === r).sort((a, b) => a.match_no - b.match_no));
  const last = rounds.length - 1;

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <div className="flex min-w-max gap-9">
        {columns.map((col, ci) => (
          <div key={rounds[ci]} className="flex w-56 flex-col">
            <div className="mb-3 text-center text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{col[0]?.stage}</div>
            <div className="flex flex-1 flex-col">
              {col.map((m, k) => {
                const done = m.status === "completed";
                const bye = done && (!m.home_entry_id || !m.away_entry_id);
                return (
                  <div key={m.id} className="relative flex min-h-[92px] flex-1 items-center">
                    {ci > 0 && <span className="absolute -left-[18px] top-1/2 h-0.5 w-[18px] bg-[#D4AF37]/50" />}
                    <div className={`w-full overflow-hidden rounded-lg border bg-[var(--bg-main)] ${m.status === "live" ? "border-red-500/60" : done ? "border-[#D4AF37]/40" : "border-[var(--border-color)]"}`}>
                      <Row name={m.home_name} score={m.home_score} winner={!!m.winner_entry_id && m.winner_entry_id === m.home_entry_id} tbd={bye ? "BYE" : "TBD"} />
                      <div className="h-px bg-[var(--border-color)]" />
                      <Row name={m.away_name} score={m.away_score} winner={!!m.winner_entry_id && m.winner_entry_id === m.away_entry_id} tbd={bye ? "BYE" : "TBD"} />
                    </div>
                    {ci < last && (
                      <span
                        className={`cw-line-draw absolute -right-[18px] w-[18px] border-[#D4AF37]/50 ${
                          k % 2 === 0 ? "top-1/2 bottom-0 border-r-2 border-t-2" : "top-0 bottom-1/2 border-r-2 border-b-2"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
