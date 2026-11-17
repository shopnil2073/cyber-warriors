"use client";

import React, { useState } from "react";
import CardCreatorTab from "../components/admin/CardCreatorTab";
import TournamentAdminTab from "../components/admin/TournamentAdminTab";
import { ALLOWED_ADMIN_EMAILS, SUPER_ADMIN_EMAIL } from "../lib/adminEmails";
import { logoutPlayerApi } from "../../utils/authApi";

type Tab = "tournaments" | "card" | "admins";

export default function AdminConsole({ email }: { email: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("tournaments");
  const admins = Array.from(new Set([SUPER_ADMIN_EMAIL, ...ALLOWED_ADMIN_EMAILS]));

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-4 pb-24 font-sans text-[var(--text-main)] md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xl">
          <div>
            <h1 className="text-lg font-black uppercase text-[#D4AF37]">📟 Admin command center</h1>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Signed in as {email}</p>
          </div>
          <button
            onClick={async () => {
              await logoutPlayerApi();
              window.location.href = "/";
            }}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white"
          >
            LOGOUT
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {([
            { id: "tournaments", label: "🏟️ TOURNAMENTS & RESULTS" },
            { id: "card", label: "🎨 CARD CREATOR" },
            { id: "admins", label: "🔑 ADMIN ACCESS" },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-xs font-black uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4AF37] text-black shadow-lg"
                  : "border border-[var(--border-color)] bg-[var(--bg-card)] text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "tournaments" && <TournamentAdminTab />}
        {activeTab === "card" && <CardCreatorTab />}
        {activeTab === "admins" && (
          <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h2 className="border-b border-[var(--border-color)] pb-3 text-sm font-black uppercase tracking-wider text-[#D4AF37]">🔑 Authorized admins</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Admin list ekhon server e <code className="text-[#D4AF37]">app/lib/adminEmails.ts</code> file theke ashe. Notun admin dite oi file e email add kore deploy koro.
            </p>
            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-3 text-xs">
                  <span className="font-semibold text-white">{a}</span>
                  {a === SUPER_ADMIN_EMAIL && <span className="text-[10px] font-black uppercase text-[#D4AF37]">Super admin</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
