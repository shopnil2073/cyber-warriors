"use client";

import React from "react";

interface MilestoneBadge {
  name: string;
  icon: string;
  desc: string;
  category: string;
  unlocked: boolean;
}

interface MilestoneProgression {
  title: string;
  current: number;
  next: number;
  category: string;
  icon: string;
}

interface MilestonesTabProps {
  milestoneSubTab: "BADGES" | "PROGRESSION";
  setMilestoneSubTab: (tab: "BADGES" | "PROGRESSION") => void;
  milestoneFilter: "ALL" | "ATTACK" | "DEFENSE" | "SPECIAL";
  setMilestoneFilter: (filter: "ALL" | "ATTACK" | "DEFENSE" | "SPECIAL") => void;
  badgeList: MilestoneBadge[];
  progressionList: MilestoneProgression[];
}

export default function MilestonesTab({
  milestoneSubTab,
  setMilestoneSubTab,
  milestoneFilter,
  setMilestoneFilter,
  badgeList,
  progressionList,
}: MilestonesTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn transition-all duration-300">
      <div className="flex items-center justify-center gap-3 bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)] max-w-md mx-auto shadow-md">
        <button
          onClick={() => setMilestoneSubTab("BADGES")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            milestoneSubTab === "BADGES"
              ? "bg-[#D4AF37] text-black shadow-md scale-105"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <span>🔒</span> UNLOCKED BADGES
        </button>
        <button
          onClick={() => setMilestoneSubTab("PROGRESSION")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            milestoneSubTab === "PROGRESSION"
              ? "bg-[#D4AF37] text-black shadow-md scale-105"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <span>📊</span> PROGRESSION
        </button>
      </div>

      {milestoneSubTab === "BADGES" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-wider hidden sm:inline">BADGE VAULT</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {(["ALL", "ATTACK", "DEFENSE", "SPECIAL"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMilestoneFilter(cat)}
                  className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                    milestoneFilter === cat
                      ? "bg-[#D4AF37] text-black"
                      : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {badgeList
              .filter((b) => milestoneFilter === "ALL" || b.category === milestoneFilter)
              .map((badge, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                    badge.unlocked
                      ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg"
                      : "bg-[var(--bg-card)] border-[var(--border-color)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="text-2xl block">{badge.icon}</span>
                  <h4 className="text-[11px] font-black text-[var(--text-main)] uppercase">{badge.name}</h4>
                  <p className="text-[9px] text-[var(--text-muted)] font-semibold leading-tight">{badge.desc}</p>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border block uppercase ${badge.unlocked ? "text-[#D4AF37] border-[#D4AF37] bg-[#D4AF37]/10" : "text-[var(--text-muted)] bg-[var(--bg-main)] border-[var(--border-color)]"}`}>
                    {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {milestoneSubTab === "PROGRESSION" && (
        <div className="space-y-4">
          {progressionList
            .filter((item) => milestoneFilter === "ALL" || item.category === milestoneFilter)
            .map((item, idx) => {
              const remaining = Math.max(0, item.next - item.current);
              const pct = Math.min(100, Math.round((item.current / item.next) * 100));

              return (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 p-5 rounded-2xl transition-all shadow-md space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span> {item.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase bg-[var(--bg-main)] text-[#D4AF37] px-3 py-1 rounded-full border border-[var(--border-color)] font-mono">
                      Next: {item.next}
                    </span>
                  </div>

                  <div className="w-full bg-[var(--border-color)] h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-[#D4AF37] to-amber-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-muted)] font-mono">
                    <span>{item.current} current</span>
                    <span>{remaining} remaining</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div className="border-t-2 border-[#D4AF37]/20 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>💎</span> MILESTONE PRESTIGE & MASTERY SUITE
          </h3>
          <span className="text-[9px] font-black text-black bg-[#D4AF37] px-2.5 py-0.5 rounded-md uppercase hidden sm:block">PRESTIGE SYSTEM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">⭐ TOTAL MILESTONE XP</span>
              <span className="text-xs font-mono font-black text-[#D4AF37]">0 / 5,000 XP</span>
            </div>
            <div className="w-full bg-[var(--border-color)] h-3 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-amber-500 to-[#D4AF37] h-full rounded-full w-0" />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold">Earn XP for every progression step unlocked.</p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-wider">🏅 PRESTIGE TIER</span>
              <span className="text-[10px] bg-[#D4AF37] text-black font-black px-2.5 py-0.5 rounded uppercase">BRONZE NOVICE</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold">Unlock 5 Gold Badges to upgrade to Silver Tier status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-2 hover:border-[#D4AF37] transition-all">
            <span className="text-xl block">🎁</span>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">CLAIMABLE MASTERY REWARDS</span>
            <button className="w-full bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] font-black text-[10px] py-1.5 rounded-xl uppercase cursor-not-allowed">
              NO REWARDS READY
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-xl block">👑</span>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">UPCOMING REWARD UNLOCK</span>
            <h5 className="text-xs font-black text-[#D4AF37]">Gold Avatar Frame</h5>
            <span className="text-[9px] text-[var(--text-muted)] font-semibold">At 50 Appearances</span>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl text-center space-y-1 hover:border-[#D4AF37] transition-all">
            <span className="text-xl block">🌍</span>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">MILESTONE RANKING</span>
            <h5 className="text-base font-black text-[var(--text-main)] font-mono">Unranked</h5>
            <span className="text-[9px] text-[var(--text-muted)] font-semibold">0% Completion Rate</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3 shadow-md">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <span>✨</span> RAREST UNLOCKED BADGE SHOWCASE
            </h4>
            <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase hidden sm:inline">COMMUNITY RARITY: N/A</span>
          </div>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl text-center">
            <p className="text-xs text-[var(--text-muted)] font-medium italic">Unlock rare achievements to showcase them on your profile header.</p>
          </div>
        </div>
      </div>
    </div>
  );
}