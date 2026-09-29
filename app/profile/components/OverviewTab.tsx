"use client";

import React from "react";

interface OverviewTabProps {
  overviewStats: {
    ovrRating: number;
    globalRank: string;
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
    doubleHatTricks: number;
    winStreak: number;
  };
  filterMode: "Overall" | "Solo" | "Franchise";
  setFilterMode: (mode: "Overall" | "Solo" | "Franchise") => void;
}

export default function OverviewTab({
  overviewStats,
  filterMode,
  setFilterMode,
}: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Rating & Rank */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3.5 sm:p-6 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all shadow-md">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1">
            <span>⭐</span> OVR RATING
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[var(--text-main)] tracking-widest font-mono">
            {overviewStats.ovrRating === 0 ? "00" : overviewStats.ovrRating.toLocaleString()}
          </h3>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3.5 sm:p-6 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all shadow-md">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1">
            <span>🌐</span> GLOBAL RANK
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[#D4AF37] tracking-widest font-mono">
            {overviewStats.globalRank}
          </h3>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-lg">
        <div className="flex flex-row items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
            <span>🍰</span> PERFORMANCE ANALYTICS
          </h3>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as any)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="Overall">Overall</option>
            <option value="Solo">Solo</option>
            <option value="Franchise">Franchise</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg block mb-0.5">📚</span>
            <h4 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.matches}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">MATCHES</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg text-emerald-400 block mb-0.5">✓</span>
            <h4 className="text-xl sm:text-2xl font-black text-emerald-400">{overviewStats.wins}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">WINS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg text-yellow-400 block mb-0.5">—</span>
            <h4 className="text-xl sm:text-2xl font-black text-yellow-400">{overviewStats.draws}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DRAWS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg text-red-400 block mb-0.5">✕</span>
            <h4 className="text-xl sm:text-2xl font-black text-red-400">{overviewStats.losses}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">LOSSES</span>
          </div>
        </div>

        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 sm:p-4 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1 text-[var(--text-main)]">
              <span className="text-yellow-400">⚡</span> WIN RATE
            </span>
            <span className="text-[#D4AF37]">{overviewStats.winRate}%</span>
          </div>
          <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
            <div className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full" style={{ width: `${overviewStats.winRate}%` }} />
          </div>
        </div>
      </div>

      {/* Goal Analytics */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3">
          <span>⚽</span> GOAL ANALYTICS
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.scored}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">SCORED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.conceded}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CONCEDED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-emerald-400">{overviewStats.goalDiff}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DIFF</span>
          </div>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3">
          <span>🎖️</span> KEY MILESTONES
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">🛡️</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.cleanSheets}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CLEAN SHEETS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">⭐</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.motmAwards}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">MOTM AWARDS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">🔥</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.hatTricks}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">HAT-TRICKS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">💣</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{overviewStats.doubleHatTricks}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DOUBLE HT</span>
          </div>
        </div>
      </div>
    </div>
  );
}