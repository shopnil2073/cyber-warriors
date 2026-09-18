"use client";

import React, { useState } from "react";

type TabType = "PENDING" | "UPCOMING" | "COMPLETED" | "CALENDAR";

export default function MyMatchesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");

  const tabDescriptions: Record<TabType, string> = {
    PENDING: "Active matches waiting for score submission.",
    UPCOMING: "Scheduled matches starting soon.",
    COMPLETED: "Archived match history & results.",
    CALENDAR: "Full fixture calendar and schedule.",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121624] border border-[#D4AF37]/40 flex items-center justify-center text-xl text-[#D4AF37]">
              🎮
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase">
              PERSONAL <span className="text-[#D4AF37]">CENTER</span>
            </h1>
          </div>
          <div className="w-20 h-1 bg-[#D4AF37] rounded-full mt-2" />
        </div>

        {/* Dynamic Navigation Tabs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#121624] p-2 rounded-2xl border border-[#23293A]">
          {(
            [
              { id: "PENDING", label: "PENDING", icon: "⚠️" },
              { id: "UPCOMING", label: "UPCOMING", icon: "🕒" },
              { id: "COMPLETED", label: "COMPLETED", icon: "✔️" },
              { id: "CALENDAR", label: "CALENDAR", icon: "📅" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl font-extrabold text-xs tracking-wider transition-all gap-1.5 border ${
                  isActive
                    ? "bg-gradient-to-b from-[#1E2538] to-[#121624] border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                    : "border-transparent text-[var(--text-muted)] hover:text-white hover:bg-[#1A2035]"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Helper Message */}
        <p className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-2">
          <span className="text-[#D4AF37]">⚡</span>
          {tabDescriptions[activeTab]}
        </p>

        {/* Content Card Display Area */}
        <div className="bg-[#121624] border border-[#23293A] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xl">
          <div className="text-6xl mb-4 opacity-80">🏆</div>
          <h2 className="text-xl font-black tracking-wider uppercase text-white mb-2">
            ALL CAUGHT UP!
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)] max-w-sm">
            {activeTab === "PENDING" && "You have no pending matches requiring action."}
            {activeTab === "UPCOMING" && "No upcoming matches currently scheduled for you."}
            {activeTab === "COMPLETED" && "No match history found in your account."}
            {activeTab === "CALENDAR" && "No upcoming calendar events registered."}
          </p>
        </div>

      </div>
    </div>
  );
}