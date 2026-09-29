"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllUsers, UserProfile } from "../utils/userStore";

interface PlayerRank {
  id: string;
  name: string;
  avatar: string;
  app: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  overallRating: number;
  seasonalRating: number;
  monthlyRating: number;
  weeklyRating: number;
  motm?: number;
}

export default function RankingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"OVERALL" | "SEASONAL" | "MONTHLY" | "WEEKLY">("OVERALL");
  const [selectedSeason, setSelectedSeason] = useState("Season 2026 (Jul - Dec)");
  const [selectedMonth, setSelectedMonth] = useState("September 2026");
  const [selectedWeek, setSelectedWeek] = useState("Week 39 (21 Sep - 27 Sep 2026)");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerRank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const allUsers: UserProfile[] = await getAllUsers();
        
        const formatted: PlayerRank[] = allUsers.map((p: any, idx: number) => {
          const app = Number(p.matches || p.matches_played || 0);
          const w = Number(p.wins || p.soloWins || 0);
          const d = Number(p.draws || 0);
          const l = Number(p.losses || 0);
          const gf = Number(p.scored || p.goals_for || 0);
          const ga = Number(p.conceded || p.goals_against || 0);

          // Ratings based on matches/wins starting from 0 if no match played
          const overallRating = Number(p.ovrRating || p.rating || (app > 0 ? 1000 + (w * 15) - (l * 10) : 0));
          const seasonalRating = Number(p.seasonalRating || (app > 0 ? 1000 + (w * 10) : 0));
          const monthlyRating = Number(p.monthlyRating || (app > 0 ? 500 + (w * 8) : 0));
          const weeklyRating = Number(p.weeklyRating || (app > 0 ? 100 + (w * 5) : 0));

          return {
            id: String(p.id || idx + 1),
            name: p.name || "PLAYER",
            avatar: p.avatar || "/logo.jpg",
            app,
            w,
            d,
            l,
            gf,
            ga,
            overallRating,
            seasonalRating,
            monthlyRating,
            weeklyRating,
            motm: Number(p.motm || 0),
          };
        });

        setPlayers(formatted);
      } catch (e) {
        console.error("Leaderboard fetch error:", e);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Sort players dynamically based on activeTab rating
  const getSortedPlayers = () => {
    return [...players].sort((a, b) => {
      if (activeTab === "OVERALL") return b.overallRating - a.overallRating;
      if (activeTab === "SEASONAL") return b.seasonalRating - a.seasonalRating;
      if (activeTab === "MONTHLY") return b.monthlyRating - a.monthlyRating;
      return b.weeklyRating - a.weeklyRating;
    });
  };

  const filteredPlayers = getSortedPlayers().filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-28 font-sans">
      
      {/* Header Banner */}
      <div className="relative w-full py-10 px-4 text-center border-b border-[var(--border-color)] bg-[var(--bg-card)] transition-colors duration-300">
        <div className="relative z-10 space-y-2">
          <div className="flex justify-center mb-1">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-black">
              <Image src="/logo.jpg" alt="Club Logo" fill className="object-cover" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-widest text-[#D4AF37] uppercase font-serif">
            CYBER WARRIORS
          </h1>
          <p className="text-xs md:text-sm tracking-[0.25em] font-extrabold text-[var(--text-muted)] uppercase">
            OFFICIAL LEADERBOARD
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 bg-[var(--bg-card)] p-1.5 rounded-xl border border-[var(--border-color)] mb-6 transition-colors duration-300">
          {(["OVERALL", "SEASONAL", "MONTHLY", "WEEKLY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedCardId(null);
              }}
              className={`py-2.5 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Title & Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xl">🏆</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-main)]">
              {activeTab} RANKINGS
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {activeTab === "SEASONAL" && (
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] px-3 py-2 rounded-xl focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="Season 2026 (Jul - Dec)">Season 2026 (Jul - Dec)</option>
                <option value="Season 2026 (Jan - Jun)">Season 2026 (Jan - Jun)</option>
              </select>
            )}

            {activeTab === "MONTHLY" && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] px-3 py-2 rounded-xl focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
              </select>
            )}

            {activeTab === "WEEKLY" && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] px-3 py-2 rounded-xl focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                <option value="Week 39 (21 Sep - 27 Sep 2026)">Week 39 (21 Sep - 27 Sep 2026)</option>
                <option value="Week 38 (14 Sep - 20 Sep 2026)">Week 38 (14 Sep - 20 Sep 2026)</option>
              </select>
            )}

            <div className="relative w-full md:w-56 shrink-0">
              <input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] px-3.5 py-2 rounded-xl focus:border-[#D4AF37] outline-none transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Leaderboard Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#D4AF37] font-black tracking-widest animate-pulse">
            LOADING RANKINGS...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-12 text-center text-[var(--text-muted)] font-bold">
            NO PLAYERS FOUND
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredPlayers.map((player, index) => {
              const rankNum = index + 1;
              const isExpanded = expandedCardId === player.id;
              
              // Winrate capped at maximum 100%
              const rawWinRate = player.app > 0 ? Math.round((player.w / player.app) * 100) : 0;
              const winRate = Math.min(100, Math.max(0, rawWinRate));
              const gd = player.gf - player.ga;

              const currentPts =
                activeTab === "OVERALL"
                  ? player.overallRating
                  : activeTab === "SEASONAL"
                  ? player.seasonalRating
                  : activeTab === "MONTHLY"
                  ? player.monthlyRating
                  : player.weeklyRating;

              return (
                <div
                  key={player.id}
                  onClick={() => router.push(`/profile?id=${player.id}`)}
                  className={`bg-[var(--bg-card)] border rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-sm ${
                    rankNum === 1
                      ? "border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      : "border-[var(--border-color)] hover:border-[#D4AF37]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-color)] group-hover:border-[#D4AF37] bg-black">
                          <Image src={player.avatar || "/logo.jpg"} alt={player.name} fill className="object-cover" />
                        </div>
                        <span className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          #{rankNum}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-xs md:text-sm text-[var(--text-main)] uppercase group-hover:text-[#D4AF37] line-clamp-1">
                          {player.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-md font-bold">
                            👕 {player.app} APP
                          </span>
                          <span className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-md font-bold">
                            ✔ {player.w} W
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right pl-2">
                        <div className="text-lg md:text-xl font-black text-[#D4AF37]">
                          {currentPts}
                        </div>
                        <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase block -mt-1">
                          {activeTab === "OVERALL" ? "RATING" : "POINTS"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => toggleCard(player.id, e)}
                        className="w-7 h-7 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#D4AF37] flex items-center justify-center text-xs font-bold"
                        title="Toggle Stats"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-24 opacity-100 mt-4 pt-3 border-t border-[var(--border-color)]" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] font-bold block">WIN %</span>
                        <span className="text-xs font-black text-[#D4AF37]">{winRate}%</span>
                      </div>
                      <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] font-bold block">GF</span>
                        <span className="text-xs font-black text-[var(--text-main)]">{player.gf}</span>
                      </div>
                      <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] font-bold block">GA</span>
                        <span className="text-xs font-black text-[var(--text-main)]">{player.ga}</span>
                      </div>
                      <div className="bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-color)]">
                        <span className="text-[9px] text-[var(--text-muted)] font-bold block">GD</span>
                        <span className={`text-xs font-black ${gd >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {gd > 0 ? `+${gd}` : gd}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}