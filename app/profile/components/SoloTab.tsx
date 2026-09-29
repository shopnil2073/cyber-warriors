"use client";

import React from "react";

interface SoloTabProps {
  soloStats: {
    gamesWon: number;
    seriesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    scored: number;
    conceded: number;
    goalDiff: number;
    indvGamesWon: number;
    indvGamesLost: number;
    cleanSheets: number;
    hatTricks: number;
    doubleHt: number;
    currentStreak: number;
    avgGoalsPerMatch: string;
    clutchWinRate: string;
    mvpPoints: number;
    favoriteFormation: string;
    comebackWins: number;
    penaltyWinRate: string;
  };
}

export default function SoloTab({ soloStats }: SoloTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn transition-all duration-300">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] p-4 sm:p-6 rounded-2xl text-center space-y-1 sm:space-y-2 transition-all duration-300 shadow-md">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1 sm:gap-2">
            <span>🏆</span> GAMES WON
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[var(--text-main)] font-mono tracking-widest">
            {soloStats.gamesWon}
          </h3>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] p-4 sm:p-6 rounded-2xl text-center space-y-1 sm:space-y-2 transition-all duration-300 shadow-md">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center justify-center gap-1 sm:gap-2">
            <span>🎯</span> SERIES PLAYED
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-[var(--text-main)] font-mono tracking-widest">
            {soloStats.seriesPlayed}
          </h3>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>🏆</span> MATCH RECORD
        </h3>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg block mb-0.5 text-emerald-400 font-bold">✓</span>
            <h4 className="text-xl sm:text-3xl font-black text-emerald-400">{soloStats.wins}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">WINS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg block mb-0.5 text-amber-400 font-bold">—</span>
            <h4 className="text-xl sm:text-3xl font-black text-amber-400">{soloStats.draws}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DRAWS</span>
          </div>

          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-lg block mb-0.5 text-red-400 font-bold">✕</span>
            <h4 className="text-xl sm:text-3xl font-black text-red-400">{soloStats.losses}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">LOSSES</span>
          </div>
        </div>

        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 sm:p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[var(--text-main)]">
              <span className="text-[#D4AF37]">⚡</span> SOLO WIN RATE
            </span>
            <span className="text-[#D4AF37] font-mono text-xs sm:text-sm">{soloStats.winRate}%</span>
          </div>
          <div className="w-full bg-[var(--border-color)] h-2.5 rounded-full overflow-hidden p-0.5">
            <div className="bg-[#D4AF37] h-full rounded-full transition-all duration-700" style={{ width: `${soloStats.winRate}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>⚽</span> GOAL ANALYTICS
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{soloStats.scored}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">SCORED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{soloStats.conceded}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CONCEDED</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <h4 className="text-lg sm:text-2xl font-black text-emerald-400">{soloStats.goalDiff}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DIFF</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>📊</span> GAME ANALYTICS
        </h3>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 sm:p-4 rounded-xl text-center">
            <h4 className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">{soloStats.indvGamesWon}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">INDV. GAMES WON</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 sm:p-4 rounded-xl text-center">
            <h4 className="text-xl sm:text-3xl font-black text-red-400 font-mono">{soloStats.indvGamesLost}</h4>
            <span className="text-[9px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">INDV. GAMES LOST</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <span>🎖️</span> KEY MILESTONES
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">🛡️</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{soloStats.cleanSheets}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">CLEAN SHEETS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">🎩</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{soloStats.hatTricks}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">HAT-TRICKS</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-xl text-center">
            <span className="text-base sm:text-xl block mb-0.5">💣</span>
            <h4 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">{soloStats.doubleHt}</h4>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mt-0.5 block">DOUBLE HT</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>📈</span> SOLO FORM
          </h3>
          <span className="text-[9px] font-black text-[var(--text-muted)] tracking-widest uppercase">(LAST 10)</span>
        </div>
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 sm:p-6 rounded-xl text-center">
          <p className="text-xs text-[var(--text-muted)] font-medium italic">No recent matches recorded.</p>
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
            <span>🔥</span> ADVANCED SOLO PRO INSIGHTS
          </h3>
          <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRO ANALYTICS SUITE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md hover:border-[#D4AF37] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs font-black text-[var(--text-main)] uppercase">🔥 WIN STREAK</span>
              <span className="text-[10px] sm:text-xs font-mono font-black text-[#D4AF37]">{soloStats.currentStreak} MATCHES</span>
            </div>
            <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-[#D4AF37] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, soloStats.currentStreak * 10)}%` }} />
            </div>
            <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-semibold">Consecutive victories in solo series.</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md hover:border-[#D4AF37] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs font-black text-[var(--text-main)] uppercase">⚽ AVG GOALS / MATCH</span>
              <span className="text-[10px] sm:text-xs font-mono font-black text-emerald-400">{soloStats.avgGoalsPerMatch}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-semibold">Average goal ratio per tournament fixture.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-xl block mb-0.5">⚡</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">CLUTCH WIN %</span>
            <h4 className="text-sm sm:text-xl font-black text-[#D4AF37] font-mono">{soloStats.clutchWinRate}</h4>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-xl block mb-0.5">♟️</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">FORMATION</span>
            <h4 className="text-xs sm:text-sm font-black text-[var(--text-main)]">{soloStats.favoriteFormation}</h4>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-2.5 sm:p-4 rounded-2xl text-center space-y-0.5 sm:space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-base sm:text-xl block mb-0.5">🎯</span>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-[var(--text-muted)]">PENALTY WIN %</span>
            <h4 className="text-sm sm:text-xl font-black text-emerald-400 font-mono">{soloStats.penaltyWinRate}</h4>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 sm:p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-[#D4AF37] transition-all">
            <div>
              <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-black uppercase">🔄 COMEBACKS</span>
              <h5 className="text-sm sm:text-xl font-black text-[var(--text-main)] mt-0.5">{soloStats.comebackWins} Wins</h5>
            </div>
            <span className="text-xl sm:text-3xl">🛡️</span>
          </div>

          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/40 p-3 sm:p-5 rounded-2xl flex items-center justify-between shadow-md hover:border-[#D4AF37] transition-all">
            <div>
              <span className="text-[8px] sm:text-[10px] text-[#D4AF37] font-black uppercase">👑 MVP POINTS</span>
              <h5 className="text-sm sm:text-xl font-black text-[#D4AF37] font-mono mt-0.5">{soloStats.mvpPoints} PTS</h5>
            </div>
            <span className="text-xl sm:text-3xl">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}