"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function FarewellCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [matches, setMatches] = useState("");
  const [wins, setWins] = useState("");
  const [draws, setDraws] = useState("");
  const [winRate, setWinRate] = useState("");
  const [playerImage, setPlayerImage] = useState<string>("");

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
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${(playerName || "Farewell_Card").replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error(err);
    }
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT FORM */}
      <div className="bg-[#121624] border border-[#23293A] p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2">
          👑 FAREWELL CARD INPUTS
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Name</label>
            <input type="text" placeholder="" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Matches (PL)</label>
              <input type="text" placeholder="" value={matches} onChange={(e) => setMatches(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Wins (W)</label>
              <input type="text" placeholder="" value={wins} onChange={(e) => setWins(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Draws (D)</label>
              <input type="text" placeholder="" value={draws} onChange={(e) => setDraws(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Win Rate %</label>
              <input type="text" placeholder="" value={winRate} onChange={(e) => setWinRate(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-[#0B0E14] border border-[#23293A] p-1.5 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] cursor-pointer" />
          </div>
        </div>

        <button onClick={downloadCard} disabled={downloading} className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg">
          {downloading ? "GENERATING..." : "📥 DOWNLOAD FAREWELL CARD PNG"}
        </button>
      </div>

      {/* CANVAS PREVIEW */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          FAREWELL TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div ref={cardRef} className="relative w-[500px] h-[500px] bg-[#05070B] text-white flex flex-col justify-between p-5 select-none overflow-hidden" style={{ backgroundImage: "radial-gradient(circle at center, #241C06 0%, #05070B 85%)" }}>
            
            {/* HEADER METALLIC FAREWELL */}
            <div className="text-center z-10 space-y-1">
              <span className="text-xs">👑 CYBER WARRIORS</span>
              <h1 className="text-4xl font-black text-[#D4AF37] tracking-widest uppercase filter drop-shadow-[0_5px_15px_rgba(212,175,55,0.7)]">
                FAREWELL
              </h1>
              <p className="text-[10px] italic text-gray-300 font-serif">Thank You For Everything!</p>
            </div>

            {/* CENTER CONTENT */}
            <div className="grid grid-cols-2 items-center z-10 gap-2 my-auto">
              <div className="h-44 flex items-center justify-center">
                {playerImage ? (
                  <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]" />
                ) : (
                  <div className="text-[10px] text-gray-600 border border-dashed border-gray-700 p-4 rounded-xl text-center">
                    NO PHOTO
                  </div>
                )}
              </div>

              {/* RIGHT GOLD BORDER BADGES */}
              <div className="space-y-1.5 font-mono">
                <div className="border border-[#D4AF37]/50 bg-[#121624]/90 p-2 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-gray-400">👕 MATCHES</span>
                  <span className="font-bold text-white">{matches || "0"}</span>
                </div>
                <div className="border border-[#D4AF37]/50 bg-[#121624]/90 p-2 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-gray-400">⚽ WINS</span>
                  <span className="font-bold text-[#D4AF37]">{wins || "0"}</span>
                </div>
                <div className="border border-[#D4AF37]/50 bg-[#121624]/90 p-2 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-gray-400">🤝 DRAW</span>
                  <span className="font-bold text-white">{draws || "0"}</span>
                </div>
                <div className="border border-[#D4AF37]/50 bg-[#121624]/90 p-2 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-gray-400">📈 WIN RATE</span>
                  <span className="font-bold text-[#D4AF37]">{winRate || "0%"}</span>
                </div>
              </div>
            </div>

            {/* BOTTOM BANNER */}
            <div className="text-center z-10 border-t border-[#D4AF37]/40 pt-2 space-y-1 min-h-[40px]">
              {playerName && (
                <h2 className="text-sm font-black text-white uppercase">THANK YOU, {playerName}</h2>
              )}
              <div className="bg-[#D4AF37] text-black text-[9px] font-black py-1 px-3 rounded inline-block tracking-widest uppercase">
                THANK YOU FOR THE MEMORIES, WISHING YOU ALL THE BEST!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}