"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

export default function WinStatCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [winPost, setWinPost] = useState("");
  const [matches, setMatches] = useState("");
  const [wins, setWins] = useState("");
  const [draws, setDraws] = useState("");
  const [winRate, setWinRate] = useState("");
  const [motm, setMotm] = useState("");
  const [location, setLocation] = useState("");
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
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `${(playerName || "Win_Stat_Card").replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed!");
    }
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT FORM */}
      <div className="bg-[#121624] border border-[#23293A] p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2">
          🏆 WIN STAT CARD INPUTS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Name</label>
            <input type="text" placeholder="" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Win Post Title</label>
            <input type="text" placeholder="e.g. 200 WINS" value={winPost} onChange={(e) => setWinPost(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]" />
          </div>
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
            <input type="text" placeholder="e.g. 61.3%" value={winRate} onChange={(e) => setWinRate(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Man Of The Match (👑 MOTM)</label>
            <input type="text" placeholder="" value={motm} onChange={(e) => setMotm(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Location / District</label>
            <input type="text" placeholder="" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Photo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-[#0B0E14] border border-[#23293A] p-1.5 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] cursor-pointer" />
        </div>

        <button onClick={downloadCard} disabled={downloading} className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg">
          {downloading ? "GENERATING..." : "📥 DOWNLOAD WIN STAT CARD PNG"}
        </button>
      </div>

      {/* CANVAS PREVIEW */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          WIN STAT TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div ref={cardRef} className="relative w-[500px] h-[500px] bg-[#05070B] text-white flex flex-col justify-between p-5 select-none overflow-hidden" style={{ backgroundImage: "radial-gradient(circle at center, #1F190B 0%, #05070B 85%)" }}>
            
            {/* HEADER */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full border border-[#D4AF37]" />
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37]">CYBER WARRIORS</span>
              </div>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">ANOTHER MILESTONE UNLOCKED 👑</span>
            </div>

            {/* BIG GOLD MILESTONE TITLE */}
            <div className="text-center my-1 z-10 min-h-[40px]">
              <h1 className="text-4xl font-black text-[#D4AF37] tracking-widest filter drop-shadow-[0_5px_15px_rgba(212,175,55,0.6)] uppercase">
                {winPost}
              </h1>
            </div>

            {/* CENTER CONTENT */}
            <div className="grid grid-cols-3 items-center z-10 gap-2">
              <div className="space-y-2">
                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl text-center">
                  <div className="text-xs font-black text-[#D4AF37]">👑 {matches || "0"}</div>
                  <div className="text-[7px] text-gray-400 uppercase">MATCHES</div>
                </div>
                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl text-center">
                  <div className="text-xs font-black text-white">🏆 {wins || "0"}</div>
                  <div className="text-[7px] text-gray-400 uppercase">WINS</div>
                </div>
                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl text-center">
                  <div className="text-xs font-black text-white">🤝 {draws || "0"}</div>
                  <div className="text-[7px] text-gray-400 uppercase">DRAWS</div>
                </div>
              </div>

              <div className="h-48 flex items-center justify-center">
                {playerImage ? (
                  <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]" />
                ) : (
                  <div className="text-[10px] text-gray-600 border border-dashed border-gray-700 p-4 rounded-xl text-center">
                    NO PHOTO
                  </div>
                )}
              </div>

              <div className="space-y-3 text-center">
                <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37] flex flex-col items-center justify-center mx-auto bg-black/60 shadow-lg">
                  <span className="text-[7px] text-gray-400 uppercase">WIN RATE</span>
                  <span className="text-xs font-black text-[#D4AF37]">{winRate || "0%"}</span>
                </div>

                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl">
                  <span className="text-xs font-black text-amber-400">⭐ {motm || "0"}</span>
                  <span className="text-[7px] text-gray-400 block uppercase">MAN OF THE MATCH</span>
                </div>
              </div>
            </div>

            <div className="text-center border-t border-[#D4AF37]/30 pt-2 z-10 space-y-0.5">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">{playerName}</h2>
              {location && (
                <p className="text-[9px] text-[#D4AF37] font-extrabold uppercase">CYBER WARRIORS | {location}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-[7px] font-mono text-gray-500 pt-1 z-10">
              <span>EVERY MATCH. EVERY MOMENT.</span>
              <span>EVERY VICTORY.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}