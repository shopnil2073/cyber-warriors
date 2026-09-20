"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getStoredStandings, Standing } from "../utils/tournamentStore";

export default function RankingPage() {
  const [rankingTab, setRankingTab] = useState<"OVERALL" | "MONTHLY" | "WEEKLY">("OVERALL");
  const [activeCategory, setActiveCategory] = useState<"rank" | "scorers">("rank");
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    setStandings(getStoredStandings());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-24">
      
      {/* Dynamic Header Section */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-6 px-4 shadow-lg text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase">
          CYBER WARRIORS OFFICIAL LEADERBOARD
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
          ELITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]">RANKINGS & STATS</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          ট্র্যাকিং এবং পয়েন্ট টেবিলের মাধ্যমে প্লেয়ারদের পারফরম্যান্স ও শীর্ষ র্যাঙ্কিং তালিকা
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Category Switcher Tabs */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveCategory("rank")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              activeCategory === "rank"
                ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white"
            }`}
          >
            👑 ELITE LEADERBOARD
          </button>
          <button
            onClick={() => setActiveCategory("scorers")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              activeCategory === "scorers"
                ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white"
            }`}
          >
            ⚽ TOP SCORERS (GOLDEN BOOT)
          </button>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex justify-center gap-2 border-b border-[var(--border-color)] pb-3">
          {(["OVERALL", "MONTHLY", "WEEKLY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRankingTab(tab)}
              className={`text-xs font-extrabold px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                rankingTab === tab
                  ? "bg-[#D4AF37] text-black font-black shadow-md"
                  : "text-[var(--text-muted)] hover:text-[#D4AF37]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RANKING CATEGORY */}
        {activeCategory === "rank" && (
          <div className="space-y-4">
            {/* Rank 1 Highlight Card */}
            {standings.length > 0 && (
              <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-2xl p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)] relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-[#D4AF37] text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                  RANK #1 CHAMPION
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute -top-3 -left-2 text-2xl animate-bounce z-10">👑</span>
                      <div className="relative w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black shadow-lg">
                        <Image src="/logo.jpg" alt="Champion" fill className="object-cover" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">
                        CURRENT LEADER
                      </span>
                      <h2 className="text-lg md:text-xl font-black uppercase text-white tracking-wide">
                        {standings[0].name}
                      </h2>
                      <div className="text-[11px] text-[var(--text-muted)] font-bold flex gap-3 mt-1">
                        <span>👕 {standings[0].mp} MATCHES</span>
                        <span className="text-green-400">✔ {standings[0].w} WINS</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center sm:text-right bg-[var(--bg-main)]/80 px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 shadow-inner">
                    <div className="text-3xl font-black text-[#D4AF37]">{standings[0].pts}</div>
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">TOTAL POINTS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Standings Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[var(--border-color)] font-black text-xs text-[#D4AF37] uppercase tracking-wider">
                🏆 LEADERBOARD RANKINGS
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-[9px] tracking-widest">
                    <tr>
                      <th className="p-3.5">POS</th>
                      <th className="p-3.5">PLAYER</th>
                      <th className="p-3.5 text-center">MATCHES</th>
                      <th className="p-3.5 text-center">WON</th>
                      <th className="p-3.5 text-center">GD</th>
                      <th className="p-3.5 text-center text-[#D4AF37]">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {standings.map((s) => (
                      <tr key={s.rank} className="hover:bg-[#D4AF37]/10 transition-colors group cursor-pointer">
                        <td className="p-3.5 font-black text-[#D4AF37]">#{s.rank}</td>
                        <td className="p-3.5 font-bold text-white flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black border border-gray-700 shrink-0">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                          </div>
                          <span>{s.name}</span>
                        </td>
                        <td className="p-3.5 text-center font-semibold">{s.mp}</td>
                        <td className="p-3.5 text-center font-semibold text-green-400">{s.w}</td>
                        <td className="p-3.5 text-center font-semibold">{s.gd}</td>
                        <td className="p-3.5 text-center font-black text-[#D4AF37] text-sm">{s.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCORERS CATEGORY (GOLDEN BOOT) */}
        {activeCategory === "scorers" && (
          <div className="space-y-4">
            {/* Golden Boot Winner Card */}
            <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-2xl p-5 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black shadow-lg shrink-0">
                  <Image src="/logo.jpg" alt="Golden Boot Leader" fill className="object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                    🥇 GOLDEN BOOT LEADER
                  </span>
                  <h2 className="text-lg md:text-xl font-black uppercase text-white tracking-wide">
                    HARUNOR RASHED
                  </h2>
                  <div className="text-[11px] text-[var(--text-muted)] font-bold flex gap-3 mt-1">
                    <span>👕 54 MATCHES</span>
                    <span>⚽ 3.24 GOAL RATIO</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#D4AF37]">175</div>
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">GOALS</span>
              </div>
            </div>

            {/* Scorers Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[var(--border-color)] font-black text-xs text-[#D4AF37] uppercase tracking-wider">
                ⚽ TOP GOAL SCORERS LIST
              </div>
              <div className="divide-y divide-[var(--border-color)]">
                {[
                  { rank: 1, name: "Harunor Rashed", app: 54, ratio: 3.24, goals: 175 },
                  { rank: 2, name: "Ra Fi", app: 56, ratio: 2.89, goals: 162 },
                  { rank: 3, name: "Muntahidul Wakid Tasfi", app: 52, ratio: 3.05, goals: 159 },
                  { rank: 4, name: "Farhanul Islam", app: 57, ratio: 2.67, goals: 152 },
                  { rank: 5, name: "Samiur Rahman Sami", app: 48, ratio: 3.15, goals: 151 },
                ].map((scorer) => (
                  <div
                    key={scorer.rank}
                    className="flex items-center justify-between p-4 bg-[var(--bg-card)] hover:bg-[#D4AF37]/10 transition-colors text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#D4AF37] w-6 text-center">#{scorer.rank}</span>
                      <div className="relative w-8 h-8 rounded-full bg-black overflow-hidden border border-gray-700 shrink-0 group-hover:border-[#D4AF37] transition-colors">
                        <Image src="/logo.jpg" alt={scorer.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-[#D4AF37] transition-colors">{scorer.name}</h4>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          👕 {scorer.app} MATCHES • ⚽ {scorer.ratio} RATIO
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-base text-[#D4AF37]">{scorer.goals}</div>
                      <span className="text-[9px] text-[var(--text-muted)] uppercase">GOALS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}