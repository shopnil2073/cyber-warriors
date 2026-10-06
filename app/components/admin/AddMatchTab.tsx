"use client";

import React, { useState } from "react";
import { saveFixture, getStoredFixtures, Fixture } from "../../utils/tournamentStore";

interface AddMatchTabProps {
  onMatchAdded: (fixtures: Fixture[]) => void;
}

export default function AddMatchTab({ onMatchAdded }: AddMatchTabProps) {
  const [matchData, setMatchData] = useState({
    p1Name: "",
    p1Score: 0,
    p2Name: "",
    p2Score: 0,
    group: "GROUP STAGE",
  });

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Fixture = {
      id: "m_" + Date.now(),
      group: matchData.group,
      tournament: "PFG PREMIER LEAGUE S2",
      date: new Date()
        .toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase(),
      p1: matchData.p1Name,
      p1Device: "Registered Device",
      p1Score: matchData.p1Score,
      p2: matchData.p2Name,
      p2Device: "Registered Device",
      p2Score: matchData.p2Score,
      status: "FT",
    };
    saveFixture(newMatch);
    onMatchAdded(getStoredFixtures());
    alert("Match Added!");
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
      <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">ADD NEW MATCH</h2>
      <form onSubmit={handleAddMatch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Player 1 Name"
            value={matchData.p1Name}
            onChange={(e) => setMatchData({ ...matchData, p1Name: e.target.value })}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
          <input
            type="number"
            required
            placeholder="Player 1 Score"
            value={matchData.p1Score}
            onChange={(e) => setMatchData({ ...matchData, p1Score: Number(e.target.value) })}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Player 2 Name"
            value={matchData.p2Name}
            onChange={(e) => setMatchData({ ...matchData, p2Name: e.target.value })}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
          <input
            type="number"
            required
            placeholder="Player 2 Score"
            value={matchData.p2Score}
            onChange={(e) => setMatchData({ ...matchData, p2Score: Number(e.target.value) })}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-2.5 rounded hover:scale-[1.01] cursor-pointer uppercase"
        >
          SAVE MATCH
        </button>
      </form>
    </div>
  );
}