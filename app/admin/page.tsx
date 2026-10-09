"use client";

import React, { useState, useEffect } from "react";
import CardCreatorTab from "../components/admin/CardCreatorTab";

const ADMIN_PASSWORD = "cyber123";
const AUTH_KEY = "cw_admin_auth_timestamp";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function AdminConsole() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"card" | "match" | "news">("card");

  useEffect(() => {
    const savedTimestamp = localStorage.getItem(AUTH_KEY);
    if (savedTimestamp) {
      const loginTime = parseInt(savedTimestamp, 10);
      if (new Date().getTime() - loginTime < TWENTY_FOUR_HOURS) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, new Date().getTime().toString());
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("❌ ভুল পাসওয়ার্ড!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center p-4">
        <div className="bg-[#121624] border border-[#D4AF37]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
          <div className="text-center space-y-1">
            <span className="text-3xl">👑</span>
            <h1 className="text-lg font-black text-[#D4AF37]">CYBER WARRIORS ADMIN</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-xl text-center text-white outline-none focus:border-[#D4AF37]"
            />
            {loginError && <p className="text-xs text-red-400 text-center font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl uppercase">
              UNLOCK CONSOLE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex justify-between items-center shadow-xl">
          <h1 className="text-lg font-black text-[#D4AF37] uppercase">📟 ADMIN COMMAND CENTER</h1>
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setIsAuthenticated(false); }} className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl">
            LOGOUT
          </button>
        </div>

        {/* TOP TABS */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "card", label: "🎨 CARD CREATOR" },
            { id: "match", label: "📋 MATCHDAY HQ" },
            { id: "news", label: "✍️ NEWS PANEL" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black px-5 py-2.5 rounded-xl uppercase transition-all ${
                activeTab === tab.id ? "bg-[#D4AF37] text-black shadow-lg" : "bg-[var(--bg-card)] text-gray-400 border border-[var(--border-color)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "card" && <CardCreatorTab />}
      </div>
    </div>
  );
}