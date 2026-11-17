"use client";

import React, { useState } from "react";
import PotmCard from "./cards/PotmCard";
import WinStatCard from "./cards/WinStatCard";
import FarewellCard from "./cards/FarewellCard";
import BirthdayCard from "./cards/BirthdayCard";
import MotmMatchCard from "./cards/MotmMatchCard";

type SubTab = "motm" | "potm" | "win" | "farewell" | "birthday";

export default function CardCreatorTab() {
  const [subTab, setSubTab] = useState<SubTab>("motm");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-[#23293A] pb-4">
        {([
          { id: "motm", label: "⭐ MOTM (MATCH)" },
          { id: "potm", label: "🌟 PLAYER OF THE MONTH" },
          { id: "win", label: "🏆 WIN/GOAL STAT CARD" },
          { id: "farewell", label: "👑 FAREWELL CARD" },
          { id: "birthday", label: "🎂 BIRTHDAY CARD" },
        ] as { id: SubTab; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`cursor-pointer rounded-xl px-4 py-2.5 text-xs font-black uppercase transition-all ${
              subTab === tab.id
                ? "scale-105 bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
                : "border border-[#23293A] bg-[var(--bg-card)] text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === "motm" && <MotmMatchCard />}
      {subTab === "potm" && <PotmCard />}
      {subTab === "win" && <WinStatCard />}
      {subTab === "farewell" && <FarewellCard />}
      {subTab === "birthday" && <BirthdayCard />}
    </div>
  );
}
