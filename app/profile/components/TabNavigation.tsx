"use client";

import React from "react";

type TabType =
  | "INFO"
  | "ACHIEVEMENTS"
  | "OVERVIEW"
  | "SOLO"
  | "FRANCHISE"
  | "MILESTONES"
  | "TIMELINE";

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs: TabType[] = [
  "INFO",
  "ACHIEVEMENTS",
  "OVERVIEW",
  "SOLO",
  "FRANCHISE",
  "MILESTONES",
  "TIMELINE",
];

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="border-b border-[#D4AF37]/30 bg-[var(--bg-card)] backdrop-blur-md sticky top-0 z-40 shadow-2xl transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto px-4 py-3.5 no-scrollbar text-xs font-black tracking-wider uppercase">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#D4AF37] text-black font-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}