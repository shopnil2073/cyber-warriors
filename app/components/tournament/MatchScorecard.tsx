import type { Route } from "next";
import Link from "next/link";
import type { MatchCard } from "../../lib/tournament/types";
import { Avatar, delay, formatWhen } from "./ui";

function Side({ name, avatar, device, playerId, winner, align }: {
  name: string | null; avatar: string | null; device: string | null; playerId: string | null; winner: boolean; align: "left" | "right";
}) {
  const inner = (
    <div className={`flex min-w-0 flex-1 items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <Avatar src={avatar} name={name} size={52} ring={winner} />
      <div className="min-w-0">
        <p className={`truncate text-xs font-black uppercase tracking-wide md:text-sm ${winner ? "text-[#D4AF37]" : "text-[var(--text-main)]"}`}>
          {name ?? "TBD"} {winner && "👑"}
        </p>
        {device && <p className="truncate font-mono text-[10px] text-[var(--text-muted)]">{device}</p>}
      </div>
    </div>
  );
  return playerId ? (
    <Link href={`/profile?id=${playerId}` as Route} className="flex min-w-0 flex-1 transition-opacity hover:opacity-80">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function MatchScorecard({ m, index = 0, showTournament = true }: { m: MatchCard; index?: number; showTournament?: boolean }) {
  const done = m.status === "completed";
  const live = m.status === "live";
  const homeWin = done && m.winner_entry_id && m.winner_entry_id === m.home_entry_id;
  const awayWin = done && m.winner_entry_id && m.winner_entry_id === m.away_entry_id;
  const pens = done && m.home_pens !== null && m.away_pens !== null;

  return (
    <article
      className={`cw-card cw-fade-up relative overflow-hidden rounded-2xl border bg-[var(--bg-card)] ${live ? "border-red-500/50" : "border-[var(--border-color)]"}`}
      style={delay(index, 50)}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#D4AF37]/5 blur-2xl" />
      <header className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] bg-black/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest">
        <span className="truncate text-[#D4AF37]">
          {showTournament ? `${m.tournament_name} · ` : ""}
          {m.stage}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[var(--text-muted)]">
          {live && <span className="cw-live-dot h-2 w-2 rounded-full bg-red-500" />}
          {live ? <span className="text-red-400">LIVE</span> : done ? "FT" : formatWhen(m.scheduled_at)}
        </span>
      </header>

      <div className="flex items-center gap-3 px-4 py-5">
        <Side name={m.home_name} avatar={m.home_avatar} device={m.home_device} playerId={m.home_player_id} winner={!!homeWin} align="left" />
        <div className="flex shrink-0 flex-col items-center">
          <div className={`rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 font-mono text-xl font-black md:text-2xl ${done ? "cw-score text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
            {done || live ? `${m.home_score ?? 0} - ${m.away_score ?? 0}` : "VS"}
          </div>
          {pens && <span className="mt-1 text-[10px] font-bold text-[var(--text-muted)]">PEN {m.home_pens} - {m.away_pens}</span>}
        </div>
        <Side name={m.away_name} avatar={m.away_avatar} device={m.away_device} playerId={m.away_player_id} winner={!!awayWin} align="right" />
      </div>

      {done && m.motm_name && (
        <footer className="flex items-center justify-center gap-2 border-t border-[var(--border-color)] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
          <span>⭐ MOTM</span>
          <Avatar src={m.motm_avatar} name={m.motm_name} size={20} />
          <span className="text-[var(--text-main)]">{m.motm_name}</span>
        </footer>
      )}
    </article>
  );
}
