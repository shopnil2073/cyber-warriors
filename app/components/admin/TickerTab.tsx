"use client";

import React, { useState, useEffect } from "react";
import { getStoredTicker, saveTicker } from "../../utils/tournamentStore";

export default function TickerTab() {
  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    setTickerText(getStoredTicker());
  }, []);

  const handleUpdateTicker = (e: React.FormEvent) => {
    e.preventDefault();
    saveTicker(tickerText);
    alert("Homepage Ticker Announcement Updated!");
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
      <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">UPDATE HOMEPAGE ANNOUNCEMENT TICKER</h2>
      <form onSubmit={handleUpdateTicker} className="space-y-4">
        <input
          type="text"
          required
          placeholder="e.g. 📢 Matchday 11 Registration is now OPEN!"
          value={tickerText}
          onChange={(e) => setTickerText(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        />
        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded cursor-pointer uppercase"
        >
          UPDATE TICKER TEXT
        </button>
      </form>
    </div>
  );
}