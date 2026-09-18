"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredFixtures, getStoredStandings, Fixture, Standing } from "../utils/tournamentStore";

export default function SoloPage() {
  const [subTab, setSubTab] = useState<"open" | "live" | "completed">("live");
  const [activeTab, setActiveTab] = useState<"fixtures" | "standings" | "bracket" | "my-matches">("fixtures");
  const [copySuccess, setCopySuccess] = useState(false);

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFixtures(getStoredFixtures());
    setStandings(getStoredStandings());
  }, []);

  const handleCopyFixtures = () => {
    const text = fixtures
      ? fixtures.map((f) => `[${f.group}] ${f.p1} (${f.p1Score}) VS (${f.p2Score}) ${f.p2}`).join("\n")
      : "";
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const filteredFixtures = fixtures.filter(
    (f) =>
      f.p1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.p2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-24">
      {/* Top Status Tabs */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-2">
          {(["open", "live", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-5 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase transition-all ${
                subTab === tab
                  ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-white"
              }`}
            >
              {tab === "live" ? "🔴 LIVE MATCHES" : tab === "open" ? "🔓 OPEN REGISTRATION" : "🏁 COMPLETED"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        {/* Main Category Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "fixtures", label: "📋 FIXTURES & RESULTS" },
            { id: "standings", label: "🏆 POINTS TABLE" },
            { id: "bracket", label: "🌳 BRACKET VIEW" },
            { id: "my-matches", label: "🎮 MY MATCHES" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all rounded-xl border ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-transparent text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: FIXTURES */}
        {activeTab === "fixtures" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <input
                type="text"
                placeholder="🔍 Search Player Name or Group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs w-full sm:w-72 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleCopyFixtures}
                className="w-full sm:w-auto px-4 py-2 bg-[var(--bg-card)] border border-[#D4AF37] text-[#D4AF37] text-xs font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                📋 {copySuccess ? "COPIED TO CLIPBOARD!" : "COPY ALL FIXTURES"}
              </button>
            </div>

            <div className="space-y-3">
              {filteredFixtures.length > 0 ? (
                filteredFixtures.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 hover:border-[#D4AF37]/50 transition-all shadow-lg space-y-3"
                  >
                    <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-black border-b border-[var(--border-color)] pb-2">
                      <span className="text-[#D4AF37] tracking-widest">{m.group}</span>
                      <span>📅 {m.date}</span>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2 text-xs md:text-sm font-extrabold">
                      <div className="col-span-5 text-right space-y-0.5">
                        <p className="text-white text-xs md:text-sm font-black">{m.p1}</p>
                        <p className="text-[9px] text-[var(--text-muted)] font-mono">{m.p1Device}</p>
                      </div>

                      <div className="col-span-2 text-center bg-[var(--bg-main)] py-2 rounded-xl border border-[var(--border-color)] text-[#D4AF37] font-black text-sm md:text-base shadow-inner">
                        {m.p1Score} - {m.p2Score}
                      </div>

                      <div className="col-span-5 text-left space-y-0.5">
                        <p className="text-white text-xs md:text-sm font-black">{m.p2}</p>
                        <p className="text-[9px] text-[var(--text-muted)] font-mono">{m.p2Device}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
                  কোনো ম্যাচ পাওয়া যায়নি!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STANDINGS */}
        {activeTab === "standings" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[var(--border-color)] font-black text-xs text-[#D4AF37] uppercase tracking-wider flex items-center justify-between">
              <span>🏆 LEAGUE STANDINGS TABLE</span>
              <span className="text-[10px] text-[var(--text-muted)]">UPDATED LIVE</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-[9px] tracking-widest">
                  <tr>
                    <th className="p-3.5"># RANK</th>
                    <th className="p-3.5">PLAYER NAME</th>
                    <th className="p-3.5 text-center">MP</th>
                    <th className="p-3.5 text-center">W</th>
                    <th className="p-3.5 text-center">GD</th>
                    <th className="p-3.5 text-center text-[#D4AF37]">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {standings.map((s) => (
                    <tr key={s.rank} className="hover:bg-[#D4AF37]/5 transition-colors">
                      <td className="p-3.5 font-black text-[#D4AF37]">#{s.rank}</td>
                      <td className="p-3.5 font-bold text-white">{s.name}</td>
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
        )}

        {/* TAB 3: BRACKET VIEW */}
        {activeTab === "bracket" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <h3 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider">🌿 TOURNAMENT BRACKET</h3>
            <p className="text-xs text-[var(--text-muted)]">নকআউট পর্ব শুরু হলে এখানে রিয়েল-টাইম ব্র্যাকেট ভিজ্যুয়ালাইজেশন দেখা যাবে।</p>
          </div>
        )}

        {/* TAB 4: MY MATCHES */}
        {activeTab === "my-matches" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <h3 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider">🎮 MY SCHEDULED MATCHES</h3>
            <p className="text-xs text-[var(--text-muted)]">আপনার আইডি দিয়ে সাইন ইন থাকলে আপনার পরবর্তী ম্যাচের শিডিউল এখানে প্রফেশনাল কার্ড আকারে দেখাবে।</p>
          </div>
        )}
      </div>
    </div>
  );
}