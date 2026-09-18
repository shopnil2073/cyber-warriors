"use client";

import React, { useState } from "react";

export default function TeamUpPage() {
  const [squads, setSquads] = useState([
    { id: 1, name: "CYBER WARRIORS ALPHA", captain: "Harunor Rashed", members: 4, status: "RECRUITING" },
    { id: 2, name: "DARK PHANTOMS", captain: "Wakid Tasfi", members: 3, status: "NEED 1 PLAYER" },
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl gap-4">
          <div>
            <h1 className="text-xl font-black text-[#D4AF37] uppercase">TEAM-UP & SQUAD LOBBY</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">আপনার স্কোয়াড গঠন করুন অথবা নতুন টুর্নামেন্টের জন্য টিমমেট খুঁজুন</p>
          </div>
          <button
            onClick={() => alert("নতুন টিম ক্রিয়েট অপশন শীঘ্রই আসছে!")}
            className="px-5 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black text-xs rounded-xl uppercase tracking-wider"
          >
            + CREATE SQUAD
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squads.map((s) => (
            <div key={s.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white">{s.name}</span>
                <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded font-bold">
                  {s.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">Captain: <span className="text-white font-bold">{s.captain}</span></p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-500 font-bold">MEMBERS: {s.members}/4</span>
                <button className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-lg uppercase">
                  REQUEST TO JOIN
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}