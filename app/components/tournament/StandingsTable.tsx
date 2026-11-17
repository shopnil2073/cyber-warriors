import type { Standing } from "../../lib/tournament/types";
import { delay } from "./ui";

export default function StandingsTable({ rows }: { rows: Standing[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4 text-xs font-black uppercase tracking-wider text-[#D4AF37]">
        <span>🏆 League standings</span>
        <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><span className="cw-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" /> Auto-updated</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[var(--bg-main)] text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              {["MP", "W", "D", "L", "GF", "GA", "GD"].map((h) => (
                <th key={h} className="p-3 text-center">{h}</th>
              ))}
              <th className="p-3 text-center text-[#D4AF37]">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {rows.map((r, i) => (
              <tr key={r.entry_id} className="cw-fade-up transition-colors hover:bg-[#D4AF37]/5" style={delay(i, 40)}>
                <td className="p-3">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${i === 0 ? "bg-[#D4AF37] text-black" : i < 3 ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="p-3 font-bold text-[var(--text-main)]">{r.name}</td>
                <td className="p-3 text-center">{r.mp}</td>
                <td className="p-3 text-center text-emerald-400">{r.w}</td>
                <td className="p-3 text-center">{r.d}</td>
                <td className="p-3 text-center text-red-400">{r.l}</td>
                <td className="p-3 text-center">{r.gf}</td>
                <td className="p-3 text-center">{r.ga}</td>
                <td className="p-3 text-center">{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                <td className="p-3 text-center text-sm font-black text-[#D4AF37]">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
