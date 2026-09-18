"use client";

import React, { useState, useEffect } from "react";
import {
  saveFixture,
  getStoredFixtures,
  updateFixtureScore,
  getStoredStandings,
  updatePlayerInfo,
  saveNews,
  getStoredTicker,
  saveTicker,
  Fixture,
  Standing,
} from "../utils/tournamentStore";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"add-match" | "edit-match" | "edit-player" | "news" | "ticker">("add-match");

  // Local Component States
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);

  // Form States
  const [matchData, setMatchData] = useState({ p1Name: "", p1Score: 0, p2Name: "", p2Score: 0, group: "GROUP STAGE" });
  const [editMatchId, setEditMatchId] = useState("");
  const [editP1Score, setEditP1Score] = useState(0);
  const [editP2Score, setEditP2Score] = useState(0);

  const [selectedRank, setSelectedRank] = useState(1);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerPts, setEditPlayerPts] = useState(0);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("ANNOUNCEMENT");
  const [newsContent, setNewsContent] = useState("");

  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setFixtures(getStoredFixtures());
      setStandings(getStoredStandings());
      setTickerText(getStoredTicker());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cyber123") setIsAuthenticated(true);
    else alert("Wrong Admin Password!");
  };

  // 1. Add Match
  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Fixture = {
      id: "m_" + Date.now(),
      group: matchData.group,
      tournament: "PFG PREMIER LEAGUE S2",
      date: new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      p1: matchData.p1Name,
      p1Device: "Registered Device",
      p1Score: matchData.p1Score,
      p2: matchData.p2Name,
      p2Device: "Registered Device",
      p2Score: matchData.p2Score,
      status: "FT",
    };
    saveFixture(newMatch);
    setFixtures(getStoredFixtures());
    alert("Match Added!");
  };

  // 2. Edit Match Result
  const handleUpdateScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMatchId) return alert("Select a match!");
    updateFixtureScore(editMatchId, editP1Score, editP2Score);
    setFixtures(getStoredFixtures());
    alert("Score Updated!");
  };

  // 3. Edit Player Info
  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlayerInfo(Number(selectedRank), editPlayerName, Number(editPlayerPts));
    setStandings(getStoredStandings());
    alert("Player Info Updated!");
  };

  // 4. Post News
  const handlePostNews = (e: React.FormEvent) => {
    e.preventDefault();
    saveNews({
      id: "n_" + Date.now(),
      title: newsTitle,
      category: newsCategory,
      content: newsContent,
      date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
    });
    alert("News Published to Website!");
    setNewsTitle("");
    setNewsContent("");
  };

  // 5. Update Ticker
  const handleUpdateTicker = (e: React.FormEvent) => {
    e.preventDefault();
    saveTicker(tickerText);
    alert("Homepage Ticker Announcement Updated!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center px-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl w-full max-w-sm text-center shadow-xl">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider mb-4">ADMIN PORTAL LOGIN</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-black text-xs py-2 rounded-lg hover:scale-105 transition-all uppercase">
              UNLOCK CONTROL PANEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl">
          <div>
            <h1 className="text-lg font-black text-[#D4AF37] uppercase">⚡ CYBER WARRIORS ADMIN HUB</h1>
            <p className="text-[10px] text-[var(--text-muted)]">Full Web Content Control Panel</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10">
            LOGOUT
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "add-match", label: "➕ ADD MATCH" },
            { id: "edit-match", label: "✏️ EDIT MATCH" },
            { id: "edit-player", label: "👤 PLAYER INFO" },
            { id: "news", label: "📰 POST NEWS" },
            { id: "ticker", label: "📢 TICKER NOTICE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-extrabold px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-[#D4AF37] text-black shadow-md" : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ADD MATCH */}
        {activeTab === "add-match" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">ADD NEW MATCH</h2>
            <form onSubmit={handleAddMatch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Player 1 Name" value={matchData.p1Name} onChange={(e) => setMatchData({ ...matchData, p1Name: e.target.value })} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
                <input type="number" required placeholder="Player 1 Score" value={matchData.p1Score} onChange={(e) => setMatchData({ ...matchData, p1Score: Number(e.target.value) })} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Player 2 Name" value={matchData.p2Name} onChange={(e) => setMatchData({ ...matchData, p2Name: e.target.value })} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
                <input type="number" required placeholder="Player 2 Score" value={matchData.p2Score} onChange={(e) => setMatchData({ ...matchData, p2Score: Number(e.target.value) })} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              </div>
              <button type="submit" className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-2.5 rounded hover:scale-[1.01]">SAVE MATCH</button>
            </form>
          </div>
        )}

        {/* TAB 2: EDIT MATCH */}
        {activeTab === "edit-match" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">UPDATE EXISTING MATCH SCORE</h2>
            <form onSubmit={handleUpdateScore} className="space-y-4">
              <select onChange={(e) => setEditMatchId(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white">
                <option value="">Select Match to Edit...</option>
                {fixtures.map((f) => (
                  <option key={f.id} value={f.id}>{f.p1} VS {f.p2} ({f.date})</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="New Player 1 Score" value={editP1Score} onChange={(e) => setEditP1Score(Number(e.target.value))} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
                <input type="number" placeholder="New Player 2 Score" value={editP2Score} onChange={(e) => setEditP2Score(Number(e.target.value))} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              </div>
              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded">UPDATE SCORE</button>
            </form>
          </div>
        )}

        {/* TAB 3: PLAYER INFO */}
        {activeTab === "edit-player" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">EDIT PLAYER INFO & POINTS</h2>
            <form onSubmit={handleUpdatePlayer} className="space-y-4">
              <select onChange={(e) => {
                const rank = Number(e.target.value);
                setSelectedRank(rank);
                const p = standings.find(s => s.rank === rank);
                if(p) { setEditPlayerName(p.name); setEditPlayerPts(p.pts); }
              }} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white">
                <option value="">Select Rank to Edit...</option>
                {standings.map((s) => (
                  <option key={s.rank} value={s.rank}>Rank #{s.rank} - {s.name}</option>
                ))}
              </select>
              <input type="text" placeholder="Player Name" value={editPlayerName} onChange={(e) => setEditPlayerName(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              <input type="number" placeholder="Total Points" value={editPlayerPts} onChange={(e) => setEditPlayerPts(Number(e.target.value))} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded">UPDATE PLAYER DATA</button>
            </form>
          </div>
        )}

        {/* TAB 4: POST NEWS */}
        {activeTab === "news" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">POST ANNOUNCEMENT / NEWS</h2>
            <form onSubmit={handlePostNews} className="space-y-4">
              <input type="text" required placeholder="News Title" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              <textarea rows={3} required placeholder="News Article Details..." value={newsContent} onChange={(e) => setNewsContent(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded">PUBLISH NEWS</button>
            </form>
          </div>
        )}

        {/* TAB 5: TICKER */}
        {activeTab === "ticker" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">UPDATE HOMEPAGE ANNOUNCEMENT TICKER</h2>
            <form onSubmit={handleUpdateTicker} className="space-y-4">
              <input type="text" required placeholder="e.g. 📢 Matchday 11 Registration is now OPEN!" value={tickerText} onChange={(e) => setTickerText(e.target.value)} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded" />
              <button type="submit" className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded">UPDATE TICKER TEXT</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}