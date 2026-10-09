"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function GoalStatCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [goalPost, setGoalPost] = useState("");
  const [matches, setMatches] = useState("");
  const [wins, setWins] = useState("");
  const [draws, setDraws] = useState("");
  const [gf, setGf] = useState("");
  const [ga, setGa] = useState("");
  const [winRate, setWinRate] = useState("");
  const [motm, setMotm] = useState("");
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
      // 1. Ensure all preview images are fully loaded before rendering
      const images = cardRef.current.getElementsByTagName("img");
      const promises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);

      // 2. Render to HTML5 Canvas safely
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#05070B",
        width: 500,
        height: 500,
      });

      // 3. Generate PNG Blob / DataURL and trigger direct browser download
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `${(playerName || "Goal_Stat_Card").replace(/\s+/g, "_")}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Goal card generation error:", err);
      alert("Download failed! Doya kore image format verification korun.");
    }
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT FORM */}
      <div className="bg-[#121624] border border-[#23293A] p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2">
          ⚽ GOAL STAT CARD INPUTS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Name</label>
            <input
              type="text"
              placeholder="e.g. TAMZID"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Goal Post Title</label>
            <input
              type="text"
              placeholder="e.g. 100 GOALS"
              value={goalPost}
              onChange={(e) => setGoalPost(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Matches (PL)</label>
            <input
              type="text"
              placeholder=""
              value={matches}
              onChange={(e) => setMatches(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Wins (W)</label>
            <input
              type="text"
              placeholder=""
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Goals For (GF)</label>
            <input
              type="text"
              placeholder=""
              value={gf}
              onChange={(e) => setGf(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Goals Against (GA)</label>
            <input
              type="text"
              placeholder=""
              value={ga}
              onChange={(e) => setGa(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Win Rate %</label>
            <input
              type="text"
              placeholder=""
              value={winRate}
              onChange={(e) => setWinRate(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">MOTM (👑 Stars)</label>
            <input
              type="text"
              placeholder=""
              value={motm}
              onChange={(e) => setMotm(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-white outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full bg-[#0B0E14] border border-[#23293A] p-1.5 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] cursor-pointer"
          />
        </div>

        <button
          onClick={downloadCard}
          disabled={downloading}
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
        >
          {downloading ? "GENERATING..." : "📥 DOWNLOAD GOAL STAT CARD PNG"}
        </button>
      </div>

      {/* CANVAS PREVIEW */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          GOAL STAT TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div
            ref={cardRef}
            className="relative w-[500px] h-[500px] bg-[#05070B] text-white flex flex-col justify-between p-5 select-none overflow-hidden"
            style={{ backgroundImage: "radial-gradient(circle at center, #1F190B 0%, #05070B 85%)" }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full border border-[#D4AF37]" />
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37]">CYBER WARRIORS</span>
              </div>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                GOAL MACHINE UNLOCKED ⚽
              </span>
            </div>

            {/* GOAL TITLE */}
            <div className="text-center my-1 z-10 min-h-[40px]">
              <h1 className="text-4xl font-black text-[#D4AF37] tracking-widest filter drop-shadow-[0_5px_15px_rgba(212,175,55,0.6)] uppercase">
                {goalPost}
              </h1>
            </div>

            {/* CENTER CONTENT */}
            <div className="grid grid-cols-3 items-center z-10 gap-2">
              <div className="space-y-2">
                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl text-center">
                  <div className="text-xs font-black text-[#D4AF37]">⚽ {gf || "0"}</div>
                  <div className="text-[7px] text-gray-400 uppercase">GOALS FOR</div>
                </div>
                <div className="bg-[#121624]/90 border border-[#D4AF37]/40 p-2 rounded-xl text-center">
                  <div className="text-xs font-black text-white">🛡️ {ga || "0"}</div>
                  <div className="text-[7px] text-gray-400 uppercase">GOALS AGAINST</div>
                </div>
              </div>

              <div className="h-48 flex items-center justify-center">
                {playerImage ? (
                  <img
                    src={playerImage}
                    alt="Player"
                    className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                  />
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
              </div>
            </div>

            <div className="text-center border-t border-[#D4AF37]/30 pt-2 z-10 min-h-[30px]">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">{playerName}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}