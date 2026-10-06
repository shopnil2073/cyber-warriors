"use client";

import React, { useState } from "react";
import { updatePlayerInfo, getStoredStandings, Standing } from "../../utils/tournamentStore";

interface EditPlayerTabProps {
  standings: Standing[];
  onPlayerUpdated: (standings: Standing[]) => void;
}

export default function EditPlayerTab({ standings, onPlayerUpdated }: EditPlayerTabProps) {
  const [selectedRank, setSelectedRank] = useState(1);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerPts, setEditPlayerPts] = useState(0);

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlayerInfo(Number(selectedRank), editPlayerName, Number(editPlayerPts));
    onPlayerUpdated(getStoredStandings());
    alert("Player Info Updated!");
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
      <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">EDIT PLAYER INFO & POINTS</h2>
      <form onSubmit={handleUpdatePlayer} className="space-y-4">
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
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        >
          <option value="">Select Rank to Edit...</option>
          {standings.map((s) => (
            <option key={s.rank} value={s.rank}>
              Rank #{s.rank} - {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Player Name"
          value={editPlayerName}
          onChange={(e) => setEditPlayerName(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        />
        <input
          type="number"
          placeholder="Total Points"
          value={editPlayerPts}
          onChange={(e) => setEditPlayerPts(Number(e.target.value))}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        />
        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded cursor-pointer uppercase"
        >
          UPDATE PLAYER DATA
        </button>
      </form>
    </div>
  );
}