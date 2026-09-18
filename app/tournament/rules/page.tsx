"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function TournamentPage() {
  const [subTab, setSubTab] = useState<"open" | "live" | "completed">("live");
  const [activeTab, setActiveTab] = useState<"fixtures" | "standings" | "bracket" | "stats" | "my-matches">("fixtures");
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock Fixtures Data
  const fixtures = [
    {
      id: "m1",
      group: "GROUP STAGE",
      tournament: "PFG PREMIER LEAGUE S2",
      date: "THURSDAY, 10 SEP 2026",
      p1: "Md Rakib Hossain",
      p1Device: "Redmi note 11 pro 5g | ASBB 667-320-805",
      p1Score: 5,
      p2: "Falaj Al raeid",
      p2Device: "Redmi 12 5g | ASCW-951-689-075",
      p2Score: 5,
      status: "FT",
    },
    {
      id: "m2",
      group: "GROUP STAGE",
      tournament: "PFG PREMIER LEAGUE S2",
      date: "THURSDAY, 10 SEP 2026",
      p1: "Dip Chandra Das",
      p1Device: "Redmi Note 13 pro | mrdpdas",
      p1Score: 2,
      p2: "Raiyan Anwar",
      p2Device: "Poco X6 pro | ASAA-866-712-640",
      p2Score: 5,
      status: "FT",
    },
  ];

  // Mock Standings Data
  const standings = [
    { rank: 1, name: "Md mahi", mp: 9, w: 8, gd: "+15", pts: 25 },
    { rank: 2, name: "Raiyan Anwar", mp: 10, w: 7, gd: "+19", pts: 23 },
    { rank: 3, name: "Sezan Mahfuj", mp: 10, w: 7, gd: "+18", pts: 23 },
    { rank: 4, name: "Fuadur Rahman Kaif", mp: 10, w: 7, gd: "+20", pts: 22 },
  ];

  const handleCopyFixtures = () => {
    const text = fixtures
      ? fixtures
          .map(
            (f) =>
              `[${f.group}] ${f.p1} (${f.p1Score}) VS (${f.p2Score}) ${f.p2}`
          )
          .join("\n")
      : "";
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-20">
      {/* Top Status Filters */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-4 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-3">
          {(["open", "live", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase transition-all ${
                subTab === tab
                  ? "bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tournament Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-2 scrollbar-none">
          {[
            { id: "fixtures", label: "FIXTURES" },
            { id: "standings", label: "POINTS TABLE" },
            { id: "bracket", label: "BRACKET" },
            { id: "stats", label: "STATS" },
            { id: "my-matches", label: "MY MATCHES" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[var(--bg-card)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <Link
            href="/tournament/rules"
            className="px-5 py-2 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap text-[#D4AF37] border-b-2 border-transparent hover:underline ml-auto"
          >
            📜 RULES
          </Link>
        </div>

        {/* Tab 1: FIXTURES */}
        {activeTab === "fixtures" && (
          <div className="mt-6 space-y-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                <option>PFG PREMIER LEAGUE S2</option>
                <option>TRC CHAMPIONS LEAGUE S1</option>
              </select>
              <select className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                <option>Season 2</option>
              </select>
              <select className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                <option>Matchday 10</option>
                <option>Matchday 11</option>
              </select>
            </div>

            {/* Search & Copy Button */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <input
                type="text"
                placeholder="Search Player Name or Match ID..."
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded px-4 py-2 text-xs w-full sm:w-72 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleCopyFixtures}
                className="px-4 py-2 bg-[var(--bg-card)] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold rounded flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                📋 {copySuccess ? "COPIED TO CLIPBOARD!" : "COPY FIXTURES"}
              </button>
            </div>

            {/* Match Cards List */}
            <div className="space-y-4">
              {fixtures.map((m) => (
                <div
                  key={m.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:border-[#D4AF37]/50 transition-all shadow-md"
                >
                  <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-bold mb-3 border-b border-[var(--border-color)] pb-2">
                    <span className="text-[#D4AF37]">{m.group}</span>
                    <span>{m.date}</span>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-2 text-xs md:text-sm font-bold">
                    <div className="col-span-5 text-right">
                      <p className="text-white">{m.p1}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-normal">{m.p1Device}</p>
                    </div>

                    <div className="col-span-2 text-center bg-[var(--bg-main)] py-1 rounded border border-[var(--border-color)] text-[#D4AF37]">
                      {m.p1Score} - {m.p2Score}
                    </div>

                    <div className="col-span-5 text-left">
                      <p className="text-white">{m.p2}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-normal">{m.p2Device}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: POINTS TABLE */}
        {activeTab === "standings" && (
          <div className="mt-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-[var(--border-color)] font-bold text-sm text-[#D4AF37] uppercase">
              🏆 LEAGUE STANDINGS TABLE
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] uppercase text-[10px]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">PLAYER NAME</th>
                    <th className="p-3 text-center">MP</th>
                    <th className="p-3 text-center">W</th>
                    <th className="p-3 text-center">GD</th>
                    <th className="p-3 text-center text-[#D4AF37]">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {standings.map((s) => (
                    <tr key={s.rank} className="hover:bg-[#1C2333]/50">
                      <td className="p-3 font-bold text-[#D4AF37]">{s.rank}</td>
                      <td className="p-3 font-semibold text-white">{s.name}</td>
                      <td className="p-3 text-center">{s.mp}</td>
                      <td className="p-3 text-center">{s.w}</td>
                      <td className="p-3 text-center">{s.gd}</td>
                      <td className="p-3 text-center font-bold text-[#D4AF37]">{s.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: BRACKET */}
        {activeTab === "bracket" && (
          <div className="mt-6 p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-center space-y-4">
            <div className="text-4xl">🌿</div>
            <h3 className="text-lg font-bold text-white uppercase">Knockout Tournament Bracket View</h3>
            <p className="text-xs text-[var(--text-muted)]">Visual bracket structure generated for Solo Finals.</p>
            <button className="px-6 py-2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-xs rounded shadow-md hover:scale-105 transition-all">
              💾 SAVE BRACKET IMAGE
            </button>
          </div>
        )}

        {/* Tab 4 & 5: STATS / MY MATCHES */}
        {(activeTab === "stats" || activeTab === "my-matches") && (
          <div className="mt-6 p-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-center">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
              🔒 SIGN IN REQUIRED TO VIEW PERSONAL MATCH LOGS & SUBMIT SCORES
            </p>
          </div>
        )}
      </div>
    </div>
  );
}