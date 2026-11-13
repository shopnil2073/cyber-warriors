"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  saveFixture,
  getStoredFixtures,
  Fixture,
} from "../../utils/tournamentStore";
import { supabase } from "../lib/supabase";

const ALLOWED_ADMIN_EMAILS = [
  "shopnilhossainhim@gmail.com",
  "razibulislamhridoy@gmail.com",
  "samiaakter2073@gmail.com",
  "hmmamun2010@gmail.com",
  "tanjimuddin1437@gmail.com",
  "mdharunanwer@gmail.com",
  "akasharsenal14@gmail.com",
  "samiulakter2075@gmail.com",
];

interface DBUser {
  id: string;
  name?: string;
  ovrRating?: number;
  rating?: number;
  matches?: number;
  wins?: number;
  scored?: number;
  totalGoals?: number;
}

export default function MatchdayManagement() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"matches" | "players">("matches");

  // ডাটা স্টেটসমূহ
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [registeredPlayers, setRegisteredPlayers] = useState<DBUser[]>([]);

  // ফরম স্টেটসমূহ
  const [matchData, setMatchData] = useState({ p1Name: "", p1Score: 0, p2Name: "", p2Score: 0, group: "GROUP STAGE" });
  
  // Player Edit State
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState(1200);
  const [editMatches, setEditMatches] = useState(0);
  const [editWins, setEditWins] = useState(0);
  const [editGoals, setEditGoals] = useState(0);

  useEffect(() => {
    const cachedUser = localStorage.getItem("cw_active_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed && parsed.email) {
          const clean = parsed.email.toLowerCase().trim();
          if (ALLOWED_ADMIN_EMAILS.includes(clean)) {
            setIsAdmin(true);
            setChecking(false);
          }
        }
      } catch (e) {}
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAccess(session?.user?.email);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAccess(session?.user?.email);
    });

    setFixtures(getStoredFixtures());
    loadRegisteredPlayers();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadRegisteredPlayers = async () => {
    try {
      // Fetch from Supabase users table
      const { data, error } = await supabase.from("users").select("*");
      if (!error && data && data.length > 0) {
        setRegisteredPlayers(data);
        setSelectedPlayerId(data[0].id);
        setEditName(data[0].name || "");
        setEditRating(data[0].ovrRating || data[0].rating || 1200);
        setEditMatches(data[0].matches || 0);
        setEditWins(data[0].wins || 0);
        setEditGoals(data[0].scored || data[0].totalGoals || 0);
      } else {
        // Fallback to local storage if supabase empty
        const local = localStorage.getItem("cw_users");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRegisteredPlayers(parsed);
            setSelectedPlayerId(parsed[0].id);
            setEditName(parsed[0].name || "");
            setEditRating(parsed[0].ovrRating || parsed[0].rating || 1200);
            setEditMatches(parsed[0].matches || 0);
            setEditWins(parsed[0].wins || 0);
            setEditGoals(parsed[0].scored || parsed[0].totalGoals || 0);
          }
        }
      }
    } catch (e) {
      console.error("Error loading players:", e);
    }
  };

  const checkAccess = (email?: string) => {
    if (!email) {
      const activeUserStr = localStorage.getItem("cw_active_user");
      if (activeUserStr) {
        try {
          const userObj = JSON.parse(activeUserStr);
          if (userObj?.email) {
            email = userObj.email;
          }
        } catch (e) {}
      }
    }

    if (!email) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const isAllowed = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);
    setIsAdmin(isAllowed);
    setChecking(false);
  };

  // ম্যাচ সেভ
  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Fixture = {
      id: "m_" + Date.now(),
      group: matchData.group,
      tournament: "CYBER WARRIORS TOURNAMENT",
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
    alert("ম্যাচ রেজাল্ট সফলভাবে পাবলিশ করা হয়েছে!");
    setMatchData({ p1Name: "", p1Score: 0, p2Name: "", p2Score: 0, group: "GROUP STAGE" });
  };

  // প্লেয়ার স্ট্যাটস আপডেট
  const handleUpdatePlayerStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return;

    try {
      const payload = {
        name: editName,
        ovrRating: Number(editRating),
        matches: Number(editMatches),
        wins: Number(editWins),
        scored: Number(editGoals),
      };

      await supabase.from("users").update(payload).eq("id", selectedPlayerId);

      // Also update local storage cache if exists
      const local = localStorage.getItem("cw_users");
      if (local) {
        const parsed = JSON.parse(local);
        const updated = parsed.map((u: any) => u.id === selectedPlayerId ? { ...u, ...payload } : u);
        localStorage.setItem("cw_users", JSON.stringify(updated));
      }

      await loadRegisteredPlayers();
      alert("রেজিস্টার্ড প্লেয়ারের স্ট্যাটস সফলভাবে আপডেট করা হয়েছে!");
    } catch (err) {
      console.error("Update player error:", err);
      alert("প্লেয়ার ডাটা আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="animate-pulse text-sm font-mono text-amber-400">Verifying Matchday Management Access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="text-xs text-zinc-400">
            You do not have permission to access Matchday Management. Please sign in with an authorized admin account.
          </p>
          <Link href="/" className="inline-block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-3 rounded-xl uppercase transition-all">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ড্যাশবোর্ড হেডার */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h1 className="text-lg md:text-xl font-black text-[#D4AF37] uppercase tracking-wider">
                MATCHDAY MANAGEMENT
              </h1>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
              ম্যাচডে ম্যানেজমেন্ট ও রেজিস্টার্ড প্লেয়ার স্ট্যাটস কন্ট্রোল
            </p>
          </div>

          <button
            onClick={async () => {
              localStorage.removeItem("cw_active_user");
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            LOGOUT
          </button>
        </div>

        {/* নেভিগেশন ট্যাবস (মাত্র ২টি ট্যাব) */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "matches", label: "📋 MATCHDAY MANAGEMENT" },
            { id: "players", label: "👤 PLAYER STATS & RANKING" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black px-5 py-2.5 rounded-xl whitespace-nowrap transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white border border-[var(--border-color)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB ১: ম্যাচ ম্যানেজমেন্ট */}
        {activeTab === "matches" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-4">
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
                ➕ নতুন ম্যাচ রেজাল্ট যোগ করুন
              </h2>
              <form onSubmit={handleAddMatch} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="প্লেয়ার ১ নাম"
                    value={matchData.p1Name}
                    onChange={(e) => setMatchData({ ...matchData, p1Name: e.target.value })}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="প্লেয়ার ১ স্কোর"
                    value={matchData.p1Score}
                    onChange={(e) => setMatchData({ ...matchData, p1Score: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="প্লেয়ার ২ নাম"
                    value={matchData.p2Name}
                    onChange={(e) => setMatchData({ ...matchData, p2Name: e.target.value })}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="প্লেয়ার ২ স্কোর"
                    value={matchData.p2Score}
                    onChange={(e) => setMatchData({ ...matchData, p2Score: Number(e.target.value) })}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider cursor-pointer"
                >
                  PUBLISH MATCH RESULT
                </button>
              </form>
            </div>

            {/* সাম্প্রতিক ম্যাচ লিস্ট */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-4">
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
                📂 সাম্প্রতিক ম্যাচসমূহ
              </h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {fixtures.map((m) => (
                  <div key={m.id} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-[#D4AF37] font-bold">
                      <span>{m.group}</span>
                      <span>{m.date}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-1">
                      <span>{m.p1} ({m.p1Score})</span>
                      <span className="text-[var(--text-muted)]">VS</span>
                      <span>({m.p2Score}) {m.p2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB ২: রেজিস্টার্ড প্লেয়ার স্ট্যাটস ও র্যাঙ্কিং এডিটিং */}
        {activeTab === "players" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-4 max-w-xl mx-auto">
            <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
              👤 রেজিস্টার্ড প্লেয়ার স্ট্যাটস ও র্যাঙ্কিং এডিট
            </h2>

            {registeredPlayers.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center uppercase font-bold">কোনো রেজিস্টার্ড প্লেয়ার পাওয়া যায়নি।</p>
            ) : (
              <form onSubmit={handleUpdatePlayerStats} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">প্লেয়ার নির্বাচন করুন</label>
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setSelectedPlayerId(pid);
                      const p = registeredPlayers.find((item) => item.id === pid);
                      if (p) {
                        setEditName(p.name || "");
                        setEditRating(p.ovrRating || p.rating || 1200);
                        setEditMatches(p.matches || 0);
                        setEditWins(p.wins || 0);
                        setEditGoals(p.scored || p.totalGoals || 0);
                      }
                    }}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {registeredPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Rating: {p.ovrRating || p.rating || 1200})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">প্লেয়ারের নাম</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">রেটিং / Rtg</label>
                    <input
                      type="number"
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">ম্যাচ / App</label>
                    <input
                      type="number"
                      value={editMatches}
                      onChange={(e) => setEditMatches(Number(e.target.value))}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">জয় / Wins</label>
                    <input
                      type="number"
                      value={editWins}
                      onChange={(e) => setEditWins(Number(e.target.value))}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">গোল / Goals</label>
                    <input
                      type="number"
                      value={editGoals}
                      onChange={(e) => setEditGoals(Number(e.target.value))}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider cursor-pointer"
                >
                  UPDATE REGISTERED PLAYER STATS
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}