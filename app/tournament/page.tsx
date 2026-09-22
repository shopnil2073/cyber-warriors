"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toJpeg } from "html-to-image";

export default function TournamentPage() {
  const [activeTab, setActiveTab] = useState<"SOLO" | "TEAM-UP" | "FRIENDLY">("SOLO");
  const [viewMode, setViewMode] = useState<"FIXTURES" | "BRACKET">("BRACKET");
  const [isExporting, setIsExporting] = useState(false);
  const bracketRef = useRef<HTMLDivElement>(null);

  const tournamentMatches = {
    SOLO: [
      { id: 1, p1: "Shafin", p2: "Abu", p1Img: "/logo.jpg", p2Img: "/logo.jpg", round: "ROUND 2", date: "02 FEB 2026", status: "UPCOMING" },
      { id: 2, p1: "Muntahidul", p2: "Farhanul", p1Img: "/logo.jpg", p2Img: "/logo.jpg", round: "QUARTER FINAL", date: "05 FEB 2026", status: "UPCOMING" },
    ],
    "TEAM-UP": [
      { id: 1, p1: "Cyber Kings", p2: "Royal Strikers", p1Img: "/logo.jpg", p2Img: "/logo.jpg", round: "SEMI FINAL", date: "10 FEB 2026", status: "LIVE" },
    ],
    FRIENDLY: [
      { id: 1, p1: "Ra Fi", p2: "Showrov", p1Img: "/logo.jpg", p2Img: "/logo.jpg", round: "EXHIBITION", date: "ALWAYS OPEN", status: "OPEN" },
    ],
  };

  const bracketData = [
    {
      stage: "QUARTER FINALS",
      matches: [
        { p1: "Shafin", p2: "Abu", score: "2 - 1", p1Img: "/logo.jpg", p2Img: "/logo.jpg" },
        { p1: "Muntahidul", p2: "Farhanul", score: "0 - 2", p1Img: "/logo.jpg", p2Img: "/logo.jpg" },
      ]
    },
    {
      stage: "SEMI FINALS",
      matches: [
        { p1: "Shafin", p2: "Farhanul", score: "VS", p1Img: "/logo.jpg", p2Img: "/logo.jpg" },
      ]
    },
    {
      stage: "GRAND FINALS",
      matches: [
        { p1: "TBD", p2: "TBD", score: "🏆 TROPHY", p1Img: "/logo.jpg", p2Img: "/logo.jpg" },
      ]
    }
  ];

  // Image Export Handler Function
  const exportBracketAsImage = async () => {
    if (!bracketRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toJpeg(bracketRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        width: 1280,
        height: 720,
      });

      const link = document.createElement("a");
      link.download = `Cyber_Warriors_Bracket_${activeTab}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-24">
      
      {/* Header Banner */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-8 px-4 text-center space-y-2 shadow-lg">
        <div className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase">
          CYBER WARRIORS MATCH CENTER
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
          OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]">TOURNAMENTS & FIXTURES</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          সলো, টিম-আপ এবং ফ্রেন্ডলি ম্যাচের লাইভ শিডিউল, ফলাফল এবং ব্র্যাকেট বিবরণ
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">

        {/* Category Switcher Tabs & View Mode Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex justify-center gap-2 md:gap-3">
            {(["SOLO", "TEAM-UP", "FRIENDLY"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white hover:border-[#D4AF37]/40"
                }`}
              >
                {tab === "SOLO" && "🥷 "}
                {tab === "TEAM-UP" && "👨‍👩‍👦 "}
                {tab === "FRIENDLY" && "🎮 "}
                {tab}
              </button>
            ))}
          </div>

          {/* View Switcher (List vs Bracket) */}
          <div className="flex items-center gap-3">
            {viewMode === "BRACKET" && (
              <button
                onClick={exportBracketAsImage}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
              >
                📸 {isExporting ? "GENERATING JPG..." : "DOWNLOAD BRACKET (16:9 JPG)"}
              </button>
            )}

            <div className="flex bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)] text-xs font-extrabold">
              <button
                onClick={() => setViewMode("FIXTURES")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "FIXTURES" ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                📋 FIXTURES
              </button>
              <button
                onClick={() => setViewMode("BRACKET")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "BRACKET" ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                🌿 BRACKET TREE
              </button>
            </div>
          </div>
        </div>

        {/* FIXTURES LIST VIEW */}
        {viewMode === "FIXTURES" && (
          <section className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-base md:text-lg font-black uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                🏆 {activeTab} MATCH FIXTURES
              </h2>
              <span className="text-xs text-[#D4AF37] font-extrabold uppercase">
                {tournamentMatches[activeTab].length} MATCHES SCHEDULED
              </span>
            </div>

            <div className="grid gap-4">
              {tournamentMatches[activeTab].map((match) => (
                <div
                  key={match.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37] rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-[var(--border-color)] pb-3 mb-4">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded-md">
                      {match.round}
                    </span>
                    <div className="flex items-center gap-2">
                      {match.status === "LIVE" ? (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded-md animate-pulse">
                          🔴 LIVE NOW
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] font-bold">
                          📅 {match.date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-around py-2">
                    <div className="flex flex-col items-center gap-2 text-center group cursor-pointer">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black shadow-md group-hover:scale-105 transition-transform">
                        <Image src={match.p1Img} alt={match.p1} fill className="object-cover" />
                      </div>
                      <span className="font-black text-sm md:text-base text-white group-hover:text-[#D4AF37] transition-colors">
                        {match.p1}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg md:text-xl font-black text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-inner animate-pulse">
                        VS
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center group cursor-pointer">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black shadow-md group-hover:scale-105 transition-transform">
                        <Image src={match.p2Img} alt={match.p2} fill className="object-cover" />
                      </div>
                      <span className="font-black text-sm md:text-base text-white group-hover:text-[#D4AF37] transition-colors">
                        {match.p2}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex justify-end">
                    <Link
                      href={`/tournament`}
                      className="text-[11px] font-extrabold text-black bg-[#D4AF37] hover:brightness-110 px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                    >
                      MATCH DETAILS →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ELEGANT LIGHT THEME 16:9 BRACKET CARD */}
        {viewMode === "BRACKET" && (
          <div className="overflow-x-auto pb-6">
            <div
              ref={bracketRef}
              id="bracket-card-export"
              className="w-[1280px] h-[720px] bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/60 text-slate-800 p-10 rounded-3xl border-4 border-[#D4AF37] shadow-2xl relative flex flex-col justify-between overflow-hidden shrink-0 mx-auto"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-[#D4AF37]/30 pb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shadow-md">
                    <img src="/logo.jpg" alt="CW Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-widest text-[#AA7C11] uppercase">
                      CYBER WARRIORS
                    </h2>
                    <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                      OFFICIAL {activeTab} TOURNAMENTS BRACKET
                    </p>
                  </div>
                </div>

                <div className="bg-[#D4AF37] text-black px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-md">
                  SEASON 1 CHAMPIONSHIP
                </div>
              </div>

              {/* Bracket Tree Grid */}
              <div className="grid grid-cols-3 gap-8 items-center relative z-10 my-auto">
                {bracketData.map((col, idx) => (
                  <div key={idx} className="space-y-6">
                    <span className="block text-center text-xs font-black uppercase tracking-widest text-slate-900 bg-[#D4AF37]/20 border border-[#D4AF37]/50 py-2 rounded-xl shadow-sm">
                      {col.stage}
                    </span>

                    <div className="space-y-6">
                      {col.matches.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="bg-white/90 backdrop-blur-md border-2 border-[#D4AF37]/40 p-4 rounded-2xl shadow-lg space-y-3 relative hover:border-[#D4AF37] transition-all"
                        >
                          {/* Player 1 */}
                          <div className="flex justify-between items-center text-sm font-black">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] bg-black shrink-0">
                                <img src={m.p1Img} alt={m.p1} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-slate-900">{m.p1}</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-black">
                            {/* Player 2 */}
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 bg-black shrink-0">
                                <img src={m.p2Img} alt={m.p2} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-slate-900">{m.p2}</span>
                            </div>

                            {/* Score / Status */}
                            <span className="text-xs bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-black shadow-sm">
                              {m.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Watermark Footer */}
              <div className="flex justify-between items-center border-t-2 border-[#D4AF37]/30 pt-3 text-[11px] font-bold text-slate-500 relative z-10">
                <span>🌐 cyber-warriors.xyz</span>
                <span className="text-[#AA7C11] font-black uppercase tracking-wider">
                  POWERED BY CYBER WARRIORS ESPORT PORTAL
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}