"use client";

import React, { useState } from "react";
import PotmCard from "./cards/PotmCard";
import WinStatCard from "./cards/WinStatCard";
import FarewellCard from "./cards/FarewellCard";
import BirthdayCard from "./cards/BirthdayCard"; // 👈 1. Import BirthdayCard

export default function CardCreatorTab() {
  const [subTab, setSubTab] = useState<"potm" | "win" | "farewell" | "birthday">("potm");

  return (
    <div className="space-y-6">
      {/* 4 CATEGORIES SUB-NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-[#23293A] pb-4">
        {[
          { id: "potm", label: "🌟 PLAYER OF THE MONTH" },
          { id: "win", label: "🏆 WIN/GOAL STAT CARD" },
          { id: "farewell", label: "👑 FAREWELL CARD" },
          { id: "birthday", label: "🎂 BIRTHDAY CARD" }, // 👈 2. Add Button
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase ${
              subTab === tab.id
                ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                : "bg-[var(--bg-card)] text-gray-400 hover:text-white border border-[#23293A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE TEMPLATE */}
      {subTab === "potm" && <PotmCard />}
      {subTab === "win" && <WinStatCard />}
      {subTab === "farewell" && <FarewellCard />}
      {subTab === "birthday" && <BirthdayCard />} {/* 👈 3. Render Component */}
    </div>
  );
}