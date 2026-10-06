"use client";

import React, { useState } from "react";
import { updateFixtureScore, getStoredFixtures, Fixture } from "../../utils/tournamentStore";

interface EditMatchTabProps {
  fixtures: Fixture[];
  onScoreUpdated: (fixtures: Fixture[]) => void;
}

export default function EditMatchTab({ fixtures, onScoreUpdated }: EditMatchTabProps) {
  const [editMatchId, setEditMatchId] = useState("");
  const [editP1Score, setEditP1Score] = useState(0);
  const [editP2Score, setEditP2Score] = useState(0);

  const handleUpdateScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMatchId) return alert("Select a match!");
    updateFixtureScore(editMatchId, editP1Score, editP2Score);
    onScoreUpdated(getStoredFixtures());
    alert("Score Updated!");
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
      <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">UPDATE EXISTING MATCH SCORE</h2>
      <form onSubmit={handleUpdateScore} className="space-y-4">
        <select
          onChange={(e) => setEditMatchId(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        >
          <option value="">Select Match to Edit...</option>
          {fixtures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.p1} VS {f.p2} ({f.date})
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="New Player 1 Score"
            value={editP1Score}
            onChange={(e) => setEditP1Score(Number(e.target.value))}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
          <input
            type="number"
            placeholder="New Player 2 Score"
            value={editP2Score}
            onChange={(e) => setEditP2Score(Number(e.target.value))}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded cursor-pointer uppercase"
        >
          UPDATE SCORE
        </button>
      </form>
    </div>
  );
}