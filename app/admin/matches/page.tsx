"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveFixture,
  getStoredFixtures,
  updateFixtureScore,
  getStoredStandings,
  updatePlayerInfo,
  saveNews,
  saveTicker,
  Fixture,
  Standing,
} from "../../utils/tournamentStore";

const SUPER_ADMIN = "shopnilhossainhim@gmail.com";

export default function CommandCenter() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "players" | "news" | "admins">("matches");

  // ডাটা স্টেটসমূহ
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [adminList, setAdminList] = useState<string[]>([SUPER_ADMIN]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // ফরম স্টেটসমূহ
  const [matchData, setMatchData] = useState({ p1Name: "", p1Score: 0, p2Name: "", p2Score: 0, group: "GROUP STAGE" });
  const [selectedRank, setSelectedRank] = useState(1);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerPts, setEditPlayerPts] = useState(0);

  useEffect(() => {
    // অ্যাকাউন্ট ও অ্যাক্সেস যাচাইকরণ
    const storedUser = localStorage.getItem("cw_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        router.push("/");
      }
    } else {
      router.push("/sign-in");
    }

    setFixtures(getStoredFixtures());
    setStandings(getStoredStandings());

    // সেভ করা অ্যাডমিন লিস্ট লোড
    const savedAdmins = localStorage.getItem("cw_admin_list");
    if (savedAdmins) {
      setAdminList(JSON.parse(savedAdmins));
    }
  }, [router]);

  // নতুন অ্যাডমিন যুক্ত করা (শুধুমাত্র সুপার অ্যাডমিনের জন্য)
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    if (adminList.includes(newAdminEmail.toLowerCase())) {
      alert("এই ইমেইলটি ইতিমধ্যেই অ্যাডমিন হিসেবে যুক্ত আছে!");
      return;
    }
    const updated = [...adminList, newAdminEmail.toLowerCase()];
    setAdminList(updated);
    localStorage.setItem("cw_admin_list", JSON.stringify(updated));
    setNewAdminEmail("");
    alert("নতুন অ্যাডমিন সফলভাবে যোগ করা হয়েছে!");
  };

  // অ্যাডমিন রিমুভ করা
  const handleRemoveAdmin = (emailToRemove: string) => {
    if (emailToRemove === SUPER_ADMIN) {
      alert("সুপার অ্যাডমিনকে রিমুভ করা সম্ভব নয়!");
      return;
    }
    const updated = adminList.filter((e) => e !== emailToRemove);
    setAdminList(updated);
    localStorage.setItem("cw_admin_list", JSON.stringify(updated));
    alert("অ্যাডমিন এক্সেস রিমুভ করা হয়েছে!");
  };

  // ম্যাচ সেভ
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
    alert("ম্যাচ রেজাল্ট সফলভাবে পাবলিশ করা হয়েছে!");
    setMatchData({ p1Name: "", p1Score: 0, p2Name: "", p2Score: 0, group: "GROUP STAGE" });
  };

  // প্লেয়ার স্ট্যাটস আপডেট
  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlayerInfo(Number(selectedRank), editPlayerName, Number(editPlayerPts));
    setStandings(getStoredStandings());
    alert("প্লেয়ার ডাটা আপডেট সফল হয়েছে!");
  };

  const isSuperAdmin = currentUser?.email?.toLowerCase() === SUPER_ADMIN;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ড্যাশবোর্ড হেডার */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h1 className="text-lg md:text-xl font-black text-[#D4AF37] uppercase tracking-wider">
                COMMAND CENTER & MATCHDAY HQ
              </h1>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
              অ্যাডমিন কন্ট্রোল প্যানেল — ইউজার: <span className="text-white font-bold">{currentUser?.name}</span> ({currentUser?.email})
            </p>
          </div>

          {isSuperAdmin && (
            <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              👑 SUPER ADMIN ACTIVE
            </span>
          )}
        </div>

        {/* নেভিগেশন ট্যাবস */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "matches", label: "📋 MATCHDAY MANAGEMENT" },
            { id: "players", label: "👤 PLAYER STATS & RANKING" },
            { id: "admins", label: "🔑 PERMISSION CONTROL" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black px-5 py-2.5 rounded-xl whitespace-nowrap transition-all uppercase tracking-wider ${
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
                  className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider"
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

        {/* TAB ২: প্লেয়ার ইনফো ও র্যাঙ্কিং */}
        {activeTab === "players" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-4 max-w-xl mx-auto">
            <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
              👤 প্লেয়ার র্যাঙ্কিং ও পয়েন্ট আপডেট
            </h2>
            <form onSubmit={handleUpdatePlayer} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">র্যাঙ্ক নির্বাচন করুন</label>
                <select
                  onChange={(e) => {
                    const rank = Number(e.target.value);
                    setSelectedRank(rank);
                    const p = standings.find((s) => s.rank === rank);
                    if (p) {
                      setEditPlayerName(p.name);
                      setEditPlayerPts(p.pts);
                    }
                  }}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {standings.map((s) => (
                    <option key={s.rank} value={s.rank}>
                      Rank #{s.rank} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">প্লেয়ারের নাম</label>
                <input
                  type="text"
                  value={editPlayerName}
                  onChange={(e) => setEditPlayerName(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">পয়েন্ট (Points)</label>
                <input
                  type="number"
                  value={editPlayerPts}
                  onChange={(e) => setEditPlayerPts(Number(e.target.value))}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-xl hover:bg-[#b5942d] transition-all uppercase tracking-wider"
              >
                UPDATE PLAYER DATA
              </button>
            </form>
          </div>
        )}

        {/* TAB ৩: পারমিশন কন্ট্রোল (অ্যাডমিন ইমেইল অ্যাক্সেস) */}
        {activeTab === "admins" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg space-y-6 max-w-xl mx-auto">
            <div>
              <h2 className="text-sm font-black text-[#D4AF37] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">
                🔑 ADMIN ACCESS MANAGEMENT
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-2">
                নিচে থাকা ইমেইল অ্যাকাউন্টগুলো দিয়ে লগইন করলেই কেবল টগল মেনুতে **COMMAND CENTER** অপশনটি দৃশ্যমান হবে।
              </p>
            </div>

            {/* সুপার অ্যাডমিনদের জন্য নতুন অ্যাডমিন যুক্ত করার ফর্ম */}
            {isSuperAdmin ? (
              <form onSubmit={handleAddAdmin} className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--text-muted)] block">নতুন অ্যাডমিন ইমেইল যুক্ত করুন</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] p-3 text-xs rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="bg-[#D4AF37] text-black font-black text-xs px-5 rounded-xl hover:bg-[#b5942d] transition-all uppercase"
                  >
                    ADD
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-400 font-medium">
                🔒 নতুন অ্যাডমিন যোগ বা রিমুভ করার অধিকার শুধুমাত্র সুপার অ্যাডমিনের রয়েছে।
              </div>
            )}

            {/* অ্যাডমিন লিস্ট */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">অনুমোদিত অ্যাডমিনদের তালিকা:</h3>
              <div className="space-y-2">
                {adminList.map((email) => (
                  <div
                    key={email}
                    className="flex justify-between items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded-xl text-xs"
                  >
                    <span className="font-semibold text-white">{email}</span>
                    {email === SUPER_ADMIN ? (
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase">SUPER ADMIN</span>
                    ) : isSuperAdmin ? (
                      <button
                        onClick={() => handleRemoveAdmin(email)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded-lg"
                      >
                        REMOVE
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 uppercase">ADMIN</span>
                    )}
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