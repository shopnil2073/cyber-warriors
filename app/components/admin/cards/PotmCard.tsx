"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function PotmCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [month, setMonth] = useState("");
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
      // 1. Ensure all images are loaded
      const images = cardRef.current.getElementsByTagName("img");
      const promises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);

      // 2. Render to Canvas safely
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#05070B",
        width: 500,
        height: 500,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `${(playerName || "POTM_Card").replace(/\s+/g, "_")}.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed! Check image format.");
    }
    setDownloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT FORM */}
      <div className="bg-[#121624] border border-[#23293A] p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2">
          🌟 PLAYER OF THE MONTH INPUTS
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Name</label>
            <input
              type="text"
              placeholder="Enter player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Month</label>
            <input
              type="text"
              placeholder="e.g. OCTOBER"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Player Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-1.5 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] file:font-bold cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={downloadCard}
          disabled={downloading}
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
        >
          {downloading ? "GENERATING..." : "📥 DOWNLOAD POTM CARD PNG"}
        </button>
      </div>

      {/* CANVAS PREVIEW */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          POTM TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div
            ref={cardRef}
            className="relative w-[500px] h-[500px] bg-[#05070B] text-white flex flex-col justify-between p-6 select-none overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(circle at 70% 30%, #2A2108 0%, #05070B 75%)",
            }}
          >
            {/* TOP BRANDING */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-[#D4AF37]" />
                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-[#D4AF37]">CYBER WARRIORS</h4>
                  <p className="text-[7px] font-mono text-gray-400">TOGETHER WE FIGHT FOR GLORY</p>
                </div>
              </div>
              <span className="text-xl">👑</span>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-2 items-center my-auto z-10 gap-2">
              <div className="relative h-64 w-full flex items-center justify-center">
                {playerImage ? (
                  <img src={playerImage} alt="Player" className="max-h-full object-contain filter drop-shadow-[0_10px_25px_rgba(212,175,55,0.4)]" />
                ) : (
                  <div className="text-xs text-gray-600 border border-dashed border-gray-700 p-8 rounded-xl text-center">
                    NO PHOTO UPLOADED
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="text-[#D4AF37] font-black text-2xl tracking-tighter uppercase leading-none filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]">
                  PLAYER<br />OF THE<br />MONTH
                </div>
                {month && (
                  <div className="inline-block bg-[#D4AF37] text-black font-black text-[11px] px-3 py-1 rounded tracking-widest uppercase">
                    {month}
                  </div>
                )}
                <div className="border-t border-[#D4AF37]/40 pt-2 min-h-[30px]">
                  <h2 className="text-xl font-black uppercase text-white tracking-wider">{playerName}</h2>
                </div>
              </div>
            </div>

            {/* FOOTER BRANDING */}
            <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 border-t border-[#23293A] pt-2 z-10">
              <span className="text-[#D4AF37]">STRONGER TOGETHER</span>
              <span>CYBER WARRIORS | FIGHT FOR GLORY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}