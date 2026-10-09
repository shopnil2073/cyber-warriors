"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function CardCreatorTab() {
  const [cardType, setCardType] = useState<"potm" | "win" | "goal" | "farewell">("potm");
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Form Inputs
  const [playerName, setPlayerName] = useState("TAMZIDUL ISLAM NION");
  const [playerImage, setPlayerImage] = useState<string>("/logo.jpg");
  const [month, setMonth] = useState("SEPTEMBER");
  const [matches, setMatches] = useState("368");
  const [wins, setWins] = useState("200");
  const [draws, setDraws] = useState("50");
  const [goals, setGoals] = useState("180");
  const [ga, setGa] = useState("40");
  const [winRate, setWinRate] = useState("61.3%");
  const [motm, setMotm] = useState("11");
  const [location, setLocation] = useState("KISHOREGANJ");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPlayerImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${playerName.replace(/\s+/g, "_")}_${cardType}_card.png`;
      link.click();
    } catch (err) {
      console.error("Card generation failed:", err);
      alert("Failed to generate card image!");
    }
    setDownloading(false);
  };

  return (
    <div className="space-y-6">
      {/* Category Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-[#23293A] pb-4">
        {[
          { id: "potm", label: "🌟 PLAYER OF THE MONTH" },
          { id: "win", label: "🏆 WIN STAT CARD" },
          { id: "goal", label: "⚽ GOAL STAT CARD" },
          { id: "farewell", label: "👑 FAREWELL CARD" },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setCardType(type.id as any)}
            className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer uppercase ${
              cardType === type.id
                ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                : "bg-[var(--bg-card)] text-gray-400 hover:text-white border border-[#23293A]"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* INPUT FORM PANEL */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[var(--border-color)] pb-2">
            ⚙️ CARD DETAILS INPUT
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-1.5 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] file:font-bold file:px-2 file:py-1 cursor-pointer"
              />
            </div>

            {cardType === "potm" && (
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Month Name</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}

            {(cardType === "win" || cardType === "goal" || cardType === "farewell") && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Played (PL)</label>
                  <input
                    type="text"
                    value={matches}
                    onChange={(e) => setMatches(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Wins (W)</label>
                  <input
                    type="text"
                    value={wins}
                    onChange={(e) => setWins(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Draws (D)</label>
                  <input
                    type="text"
                    value={draws}
                    onChange={(e) => setDraws(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Win Rate %</label>
                  <input
                    type="text"
                    value={winRate}
                    onChange={(e) => setWinRate(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </>
            )}

            {(cardType === "win" || cardType === "goal") && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Goals (GF)</label>
                  <input
                    type="text"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Goals Against (GA)</label>
                  <input
                    type="text"
                    value={ga}
                    onChange={(e) => setGa(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Man Of The Match (MOTM)</label>
                  <input
                    type="text"
                    value={motm}
                    onChange={(e) => setMotm(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Location / District</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={downloadCard}
            disabled={downloading}
            className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
          >
            {downloading ? "GENERATING CARD..." : "📥 DOWNLOAD CARD PNG"}
          </button>
        </div>

        {/* REALTIME CARD PREVIEW CANVAS */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
            LIVE CARD CANVAS PREVIEW (1080x1080):
          </span>

          <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
            <div
              ref={cardRef}
              className="relative w-[500px] h-[500px] bg-[#05070B] text-white flex flex-col justify-between p-6 select-none overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(circle at center, #1A180E 0%, #05070B 80%)",
              }}
            >
              {/* BRAND HEADER */}
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-[#D4AF37]">CYBER WARRIORS</h3>
                    <p className="text-[8px] font-mono text-gray-400 uppercase">TOGETHER WE FIGHT FOR GLORY</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg">👑</span>
                </div>
              </div>

              {/* CENTER PLAYER PHOTO & STATS */}
              {cardType === "potm" && (
                <div className="grid grid-cols-2 items-center my-auto z-10 gap-2">
                  <div className="relative h-64 w-full flex items-center justify-center">
                    <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.3)]" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-block bg-[#D4AF37] text-black font-black text-xs px-3 py-1 rounded">
                      PLAYER OF THE MONTH
                    </div>
                    <h2 className="text-xl font-black text-[#D4AF37] uppercase tracking-wider">{month}</h2>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-tight border-t border-[#D4AF37]/30 pt-2">
                      {playerName}
                    </h1>
                  </div>
                </div>
              )}

              {(cardType === "win" || cardType === "goal") && (
                <div className="my-auto z-10 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-4xl font-black tracking-widest text-[#D4AF37]">
                      {cardType === "win" ? `${wins} WINS` : `${goals} GOALS`}
                    </span>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">ANOTHER MILESTONE UNLOCKED 👑</p>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="h-48 w-full flex items-center justify-center">
                      <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" />
                    </div>

                    <div className="space-y-2 bg-[#121624]/80 p-3 rounded-xl border border-[#D4AF37]/30 font-mono text-xs">
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">MATCHES:</span>
                        <span className="font-bold text-[#D4AF37]">{matches}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">WINS:</span>
                        <span className="font-bold text-white">{wins}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">DRAWS:</span>
                        <span className="font-bold text-white">{draws}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">WIN RATE:</span>
                        <span className="font-bold text-[#D4AF37]">{winRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MOTM:</span>
                        <span className="font-bold text-amber-400">⭐ {motm}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center border-t border-[#D4AF37]/30 pt-2">
                    <h2 className="text-lg font-black text-white uppercase">{playerName}</h2>
                    <p className="text-[9px] text-[#D4AF37] font-bold uppercase">CYBER WARRIORS | {location}</p>
                  </div>
                </div>
              )}

              {cardType === "farewell" && (
                <div className="my-auto z-10 space-y-3 text-center">
                  <h1 className="text-3xl font-black tracking-widest text-[#D4AF37]">FAREWELL</h1>
                  <p className="text-xs italic text-gray-300">Thank You For Everything!</p>

                  <div className="grid grid-cols-2 items-center gap-2">
                    <div className="h-44 w-full flex items-center justify-center">
                      <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]" />
                    </div>

                    <div className="space-y-2 bg-[#121624]/90 p-3 rounded-xl border border-[#D4AF37]/40 text-left font-mono text-xs">
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">MATCHES:</span>
                        <span className="font-bold text-white">{matches}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">WINS:</span>
                        <span className="font-bold text-[#D4AF37]">{wins}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-1">
                        <span className="text-gray-400">DRAWS:</span>
                        <span className="font-bold text-white">{draws}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">WIN RATE:</span>
                        <span className="font-bold text-[#D4AF37]">{winRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-white uppercase">{playerName}</h2>
                    <p className="text-[9px] text-gray-400 italic">"ONCE A WARRIOR, ALWAYS A WARRIOR."</p>
                  </div>
                </div>
              )}

              {/* FOOTER BRANDING */}
              <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 border-t border-[#23293A] pt-2 z-10">
                <span>CYBER WARRIORS OFFICIAL</span>
                <span>EVERY MATCH. EVERY MOMENT.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}