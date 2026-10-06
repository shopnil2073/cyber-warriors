"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredFixtures,
  getStoredStandings,
  Fixture,
  Standing,
} from "../utils/tournamentStore";
import { getActiveUser } from "../utils/userStore";

// Sub-components Imports (app/components/admin path)
import AddMatchTab from "../components/admin/AddMatchTab";
import EditMatchTab from "../components/admin/EditMatchTab";
import EditPlayerTab from "../components/admin/EditPlayerTab";
import PostNewsTab from "../components/admin/PostNewsTab";
import TickerTab from "../components/admin/TickerTab";
import ManageAdminsTab from "../components/admin/ManageAdminsTab";

export default function AdminDashboard() {
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "add-match" | "edit-match" | "edit-player" | "news" | "ticker" | "manage-admins"
  >("add-match");

  // Local Component States
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);

  // Super Admin & Dynamic Admin Access Control States
  const SUPER_ADMIN_EMAIL = "shopnilhossainhim@gmail.com";

  // Permanent Authorized Admins List
  const HARDCODED_ADMINS = [
    "razibulislamhridoy@gmail.com",
    "samiaakter2073@gmail.com",
    "hmmamun2010@gmail.com",
    "tanjimuddin1437@gmail.com",
    "mdharunanwer@gmail.com",
    "akasharsenal14@gmail.com",
  ];

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminEmailsList, setAdminEmailsList] = useState<string[]>([]);

  // Check user email permission & 24-hour session status on load
  useEffect(() => {
    const activeUser = getActiveUser();
    if (activeUser && activeUser.email) {
      const userEmail = activeUser.email.toLowerCase().trim();

      // Check 1: Super Admin
      if (userEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setIsAuthorizedUser(true);
        setIsSuperAdmin(true);
      } else {
        // Check 2: Hardcoded Admins List
        const isHardcodedAdmin = HARDCODED_ADMINS.map((e) => e.toLowerCase().trim()).includes(userEmail);

        // Check 3: LocalStorage Dynamic Admin List
        let isDynamicAdmin = false;
        try {
          const granted = JSON.parse(localStorage.getItem("cw_admin_emails") || "[]");
          isDynamicAdmin =
            Array.isArray(granted) &&
            granted.some((e: string) => e.toLowerCase().trim() === userEmail);
        } catch (e) {
          console.error("Error reading admin emails", e);
        }

        if (isHardcodedAdmin || isDynamicAdmin) {
          setIsAuthorizedUser(true);
        }
      }
    }

    // Load 24-hour Login Session State
    try {
      const sessionExpiry = localStorage.getItem("cw_admin_session_expiry");
      if (sessionExpiry && Date.now() < Number(sessionExpiry)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("cw_admin_session_expiry");
      }
    } catch (e) {
      console.error("Error reading admin session", e);
    }

    // Load admin email list
    try {
      const savedAdmins = JSON.parse(localStorage.getItem("cw_admin_emails") || "[]");
      setAdminEmailsList(savedAdmins);
    } catch (e) {
      setAdminEmailsList([]);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setFixtures(getStoredFixtures());
      setStandings(getStoredStandings());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if current logged in email is authorized first
    if (!isAuthorizedUser) {
      alert("Access Denied! Your email is not authorized as an Admin.");
      return;
    }

    // Require password check
    if (password === "cyber123") {
      setIsAuthenticated(true);

      // Save 24-Hour Session Expiry (24 hours = 86400000 ms)
      const oneDayExpiry = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("cw_admin_session_expiry", oneDayExpiry.toString());
    } else {
      alert("Wrong Admin Password!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cw_admin_session_expiry");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center px-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl w-full max-w-sm text-center shadow-xl">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="text-lg font-black text-[#D4AF37] uppercase tracking-wider mb-2">
            ADMIN PORTAL LOGIN
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] mb-4 font-bold">
            Enter admin password to unlock control panel
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-black text-xs py-2 rounded-lg hover:scale-105 transition-all uppercase cursor-pointer"
            >
              UNLOCK CONTROL PANEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl shadow-md">
          <div>
            <h1 className="text-lg font-black text-[#D4AF37] uppercase flex items-center gap-2">
              ⚡ CYBER WARRIORS ADMIN HUB
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] font-bold">
              {isSuperAdmin ? "👑 SUPER ADMIN MASTER ACCESS" : "🛡️ AUTHORIZED ADMIN ACCESS"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-400 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 cursor-pointer uppercase"
          >
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
            ...(isSuperAdmin ? [{ id: "manage-admins", label: "🛡️ MANAGE ADMIN ACCESS" }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-extrabold px-4 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "add-match" && <AddMatchTab onMatchAdded={setFixtures} />}
        {activeTab === "edit-match" && <EditMatchTab fixtures={fixtures} onScoreUpdated={setFixtures} />}
        {activeTab === "edit-player" && <EditPlayerTab standings={standings} onPlayerUpdated={setStandings} />}
        {activeTab === "news" && <PostNewsTab />}
        {activeTab === "ticker" && <TickerTab />}
        {activeTab === "manage-admins" && isSuperAdmin && (
          <ManageAdminsTab
            hardcodedAdmins={HARDCODED_ADMINS}
            adminEmailsList={adminEmailsList}
            onAdminsUpdated={setAdminEmailsList}
          />
        )}
      </div>
    </div>
  );
}