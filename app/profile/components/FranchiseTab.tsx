"use client";

import React from "react";

interface FranchiseTabProps {
  franchiseStats: {
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    scored: number;
    conceded: number;
    goalDiff: number;
    cleanSheets: number;
    motmAwards: number;
    hatTricks: number;
    doubleHt: number;
    contractRole: string;
    clubSynergy: number;
    bestDuoPartner: string;
    duoWinRate: string;
    homeWinRate: string;
    awayWinRate: string;
    pressureWinRate: string;
    squadImpactRating: number;
    cleanSheetsPer90: string;
  };
}

export default function FranchiseTab({ franchiseStats }: FranchiseTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn transition-all duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>📊</span> FRANCHISE ANALYTICS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-[#D4AF37]/30 transition-all">
            <span className="text-base sm:text-lg block mb-0.5">🎮</span>
            <h4 className="text-xl sm:text-3xl font-black text-[var(--text-main)]">{franchiseStats.matches}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">MATCHES</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-emerald-500/50 transition-all">
            <span className="text-base sm:text-lg block mb-0.5 text-emerald-400 font-bold">✓</span>
            <h4 className="text-xl sm:text-3xl font-black text-emerald-400">{franchiseStats.wins}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">WINS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-amber-500/50 transition-all">
            <span className="text-base sm:text-lg block mb-0.5 text-amber-400 font-bold">—</span>
            <h4 className="text-xl sm:text-3xl font-black text-amber-400">{franchiseStats.draws}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DRAWS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-red-500/50 transition-all">
            <span className="text-base sm:text-lg block mb-0.5 text-red-400 font-bold">✕</span>
            <h4 className="text-xl sm:text-3xl font-black text-red-400">{franchiseStats.losses}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">LOSSES</span>
          </div>
        </div>

        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 sm:p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[var(--text-main)]">
              <span className="text-[#D4AF37]">⚡</span> FRANCHISE WIN RATE
            </span>
            <span className="text-[#D4AF37] font-mono text-xs sm:text-sm">{franchiseStats.winRate}%</span>
          </div>
          <div className="w-full bg-[var(--border-color)] h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-amber-300 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              style={{ width: `${franchiseStats.winRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>⚽</span> GOAL ANALYTICS
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.scored}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">SCORED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.conceded}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CONCEDED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-emerald-400">{franchiseStats.goalDiff}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DIFF</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>🎖️</span> KEY MILESTONES
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
            <span className="text-base sm:text-2xl block mb-0.5">🛡️</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.cleanSheets}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CLEAN SHEETS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
            <span className="text-base sm:text-2xl block mb-0.5">⭐</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.motmAwards}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">MOTM AWARDS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
            <span className="text-base sm:text-2xl block mb-0.5">🔥</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.hatTricks}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">HAT-TRICKS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center hover:border-[#D4AF37]/40 transition-all">
            <span className="text-base sm:text-2xl block mb-0.5">💣</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{franchiseStats.doubleHt}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DOUBLE HT</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>📈</span> RECENT FORM
          </h3>
          <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase">(LAST 10)</span>
        </div>
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 sm:p-6 rounded-xl text-center">
          <p className="text-xs text-[var(--text-muted)] font-medium italic">No matches recorded.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>⚔️</span> MATCH HISTORY
        </h3>
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-6 sm:p-8 rounded-xl text-center">
          <p className="text-xs text-[var(--text-muted)] font-medium italic">No match history found.</p>
        </div>
      </div>

      <div className="border-t-2 border-[#D4AF37]/20 pt-6 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>🚀</span> ADVANCED CLUB & FRANCHISE INSIGHTS
          </h3>
          <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRO CLUB SUITE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs font-black text-[var(--text-main)] uppercase tracking-wider">📜 ACTIVE CONTRACT</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded border border-emerald-500/40 uppercase">ACTIVE</span>
            </div>
            <div className="bg-[var(--bg-main)] p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-[var(--border-color)]">
              <div>
                <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold block uppercase">Squad Role</span>
                <h5 className="text-[11px] sm:text-xs font-black text-[var(--text-main)]">{franchiseStats.contractRole}</h5>
              </div>
              <div className="text-right">
                <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold block uppercase">Salary Tier</span>
                <h5 className="text-[11px] sm:text-xs font-black text-[#D4AF37]">Tier-1 Elite</h5>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs font-black text-[var(--text-main)] uppercase tracking-wider">🧩 SQUAD SYNERGY</span>
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#D4AF37]">{franchiseStats.clubSynergy}%</span>
            </div>
            <div className="w-full bg-[var(--border-color)] h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-emerald-400 to-[#D4AF37] h-full rounded-full transition-all duration-500" style={{ width: `${franchiseStats.clubSynergy}%` }} />
            </div>
            <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-semibold">Calculated from dynamic duo chemistry & squad pass completion.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-lg block mb-0.5">👥</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">BEST DUO</span>
            <h4 className="text-xs sm:text-sm font-black text-[var(--text-main)] truncate">{franchiseStats.bestDuoPartner}</h4>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-lg block mb-0.5">🔥</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">PRESSURE WIN %</span>
            <h4 className="text-sm sm:text-xl font-black text-amber-400 font-mono">{franchiseStats.pressureWinRate}</h4>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-lg block mb-0.5">⭐</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">IMPACT RATING</span>
            <h4 className="text-sm sm:text-xl font-black text-emerald-400 font-mono">{franchiseStats.squadImpactRating}</h4>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 space-y-3 shadow-md">
          <h4 className="text-[11px] sm:text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
            <span>🏟️</span> FIXTURE SPLIT & DEFENSIVE EFFICIENCY
          </h4>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-[var(--bg-main)] p-2.5 sm:p-3 rounded-xl text-center border border-[var(--border-color)]">
              <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-black block uppercase">HOME WIN %</span>
              <h5 className="text-sm sm:text-lg font-black text-[#D4AF37] font-mono mt-0.5">{franchiseStats.homeWinRate}</h5>
            </div>
            <div className="bg-[var(--bg-main)] p-2.5 sm:p-3 rounded-xl text-center border border-[var(--border-color)]">
              <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-black block uppercase">AWAY WIN %</span>
              <h5 className="text-sm sm:text-lg font-black text-[#D4AF37] font-mono mt-0.5">{franchiseStats.awayWinRate}</h5>
            </div>
            <div className="bg-[var(--bg-main)] p-2.5 sm:p-3 rounded-xl text-center border border-[var(--border-color)]">
              <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-black block uppercase">CS / 90</span>
              <h5 className="text-sm sm:text-lg font-black text-emerald-400 font-mono mt-0.5">{franchiseStats.cleanSheetsPer90}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}