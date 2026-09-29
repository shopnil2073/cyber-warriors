"use client";

import React from "react";

interface AchievementsTabProps {
  achievements: {
    championSolo: number;
    runnerUpSolo: number;
    thirdPlaceSolo: number;
    seasonTop10: number;
    monthTop5: number;
    weekTop3: number;
    totalWins: number;
    totalGoals?: number;
  };
}

export default function AchievementsTab({ achievements }: AchievementsTabProps) {
  const currentWins = achievements.totalWins || 0;
  const currentGoals = achievements.totalGoals || 0;

  // Calculate dynamic next milestone target (50, 100, 150, 200, etc.)
  const nextWinMilestone = (Math.floor(currentWins / 50) + 1) * 50;
  const nextGoalMilestone = (Math.floor(currentGoals / 50) + 1) * 50;

  const winProgressPct = Math.min(100, Math.round((currentWins / nextWinMilestone) * 100));
  const goalProgressPct = Math.min(100, Math.round((currentGoals / nextGoalMilestone) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-1 shadow-sm border-l-4 border-l-[#D4AF37]">
        <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
          <span>🏆</span> OFFICIAL MILESTONES & RANKING ACHIEVEMENTS
        </h2>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          Official tournament finishes and leaderboard rankings recorded automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🥇</span>
            <span className={`text-2xl font-black ${achievements.championSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.championSolo}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
            Champion in solo tour
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 1st Place</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🥈</span>
            <span className={`text-2xl font-black ${achievements.runnerUpSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.runnerUpSolo}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
            Runner-up in solo tour
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 2nd Place</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🥉</span>
            <span className={`text-2xl font-black ${achievements.thirdPlaceSolo > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.thirdPlaceSolo}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">
            Third Place in solo tour
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Finished 3rd Place</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🏆</span>
            <span className={`text-2xl font-black ${achievements.seasonTop10 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.seasonTop10}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Season Top 10</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 10 Overall</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🏅</span>
            <span className={`text-2xl font-black ${achievements.monthTop5 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.monthTop5}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Month Top 5</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 5 Monthly</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-3xl filter drop-shadow">🎗️</span>
            <span className={`text-2xl font-black ${achievements.weekTop3 > 0 ? "text-[#D4AF37]" : "text-[var(--text-muted)]"}`}>
              {achievements.weekTop3}
            </span>
          </div>
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Week Top 3</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">Ranked in Top 3 Weekly</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>⚽</span> GOALS & WINS MILESTONES
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WIN MILESTONE PROGRESS CARD */}
          <div className="bg-[var(--bg-main)] border border-[#D4AF37]/40 p-5 rounded-2xl space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-[var(--text-main)] flex items-center gap-2">
                <span>🏆</span> NEXT WIN MILESTONE: <span className="text-[#D4AF37]">{nextWinMilestone} WINS</span>
              </span>
              <span className="text-xs font-mono font-black text-[#D4AF37]">
                {currentWins} / {nextWinMilestone}
              </span>
            </div>
            <div className="w-full bg-[var(--border-color)] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${winProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-muted)]">
              <span>PROGRESS</span>
              <span>{winProgressPct}%</span>
            </div>
          </div>

          {/* GOAL MILESTONE PROGRESS CARD */}
          <div className="bg-[var(--bg-main)] border border-[#D4AF37]/40 p-5 rounded-2xl space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-[var(--text-main)] flex items-center gap-2">
                <span>⚽</span> NEXT GOAL MILESTONE: <span className="text-[#D4AF37]">{nextGoalMilestone} GOALS</span>
              </span>
              <span className="text-xs font-mono font-black text-[#D4AF37]">
                {currentGoals} / {nextGoalMilestone}
              </span>
            </div>
            <div className="w-full bg-[var(--border-color)] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${goalProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-muted)]">
              <span>PROGRESS</span>
              <span>{goalProgressPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}