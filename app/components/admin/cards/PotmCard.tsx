"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { removeBackground } from "@imgly/background-removal";

export default function PotmCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [month, setMonth] = useState("");
  const [playerImage, setPlayerImage] = useState<string>("");

  // IMAGE POSITION & SCALE CONTROLS
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [borderWidth, setBorderWidth] = useState(4); // Default 4px border
  const [brightness, setBrightness] = useState(100); // Default 100% brightness
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  // AI BACKGROUND REMOVAL PROCESSOR
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRemovingBg(true);
    setIsLocked(false);
    setPos({ x: 0, y: 0 });
    setScale(1);

    try {
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setPlayerImage(url);
    } catch (err) {
      console.error("AI BG Removal failed, falling back to original:", err);
      const reader = new FileReader();
      reader.onload = () => setPlayerImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    setRemovingBg(false);
  };

  // DRAG HANDLERS
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked || !playerImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isLocked) return;
    setPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `${(playerName || "POTM_Card").replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error", err);
      alert("Download failed! Doya kore image position check korun.");
    }
    setDownloading(false);
  };

  // Generate multi-directional drop-shadow for smooth cut-out border
  const getBorderShadowStyle = () => {
    if (borderWidth === 0) return "drop-shadow(0px 15px 25px rgba(0,0,0,0.8))";
    const bw = `${borderWidth}px`;
    return `
      drop-shadow(${bw} 0px 0px #FFFFFF)
      drop-shadow(-${bw} 0px 0px #FFFFFF)
      drop-shadow(0px ${bw} 0px #FFFFFF)
      drop-shadow(0px -${bw} 0px #FFFFFF)
      drop-shadow(0px 15px 25px rgba(0,0,0,0.8))
    `;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT FORM */}
      <div className="bg-[#121624] border border-[#23293A] p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2 flex items-center gap-2">
          <span>🌟</span> PLAYER OF THE MONTH INPUTS
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">PLAYER NAME</label>
            <input
              type="text"
              placeholder="Enter player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">MONTH</label>
            <input
              type="text"
              placeholder="e.g. OCTOBER"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">PLAYER PHOTO</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] file:font-bold cursor-pointer"
            />
            {removingBg && (
              <p className="text-[10px] text-amber-400 mt-1 font-bold animate-pulse">
                ⏳ AI is removing background... Please wait.
              </p>
            )}
          </div>

          {/* CONTROLS FOR IMAGE ADJUSTMENTS */}
          {playerImage && (
            <div className="border border-[#23293A] bg-[#0B0E14] p-4 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">
                ⚙️ IMAGE ADJUSTMENTS & BORDER CONTROLS
              </span>

              {/* BORDER WIDTH SLIDER */}
              <div>
                <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-1">
                  <span>BORDER OUTLINE THICKNESS</span>
                  <span className="text-[#D4AF37]">{borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* BRIGHTNESS SLIDER */}
              <div>
                <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-1">
                  <span>BRIGHTNESS</span>
                  <span className="text-[#D4AF37]">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* ZOOM / SCALE SLIDER */}
              <div>
                <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-1">
                  <span>ZOOM / SCALE</span>
                  <span className="text-[#D4AF37]">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-full text-xs font-bold py-2 rounded-lg transition-all ${
                    isLocked
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-[#23293A] text-[#D4AF37] border border-[#D4AF37]/40"
                  }`}
                >
                  {isLocked ? "🔒 POSITION & STYLE LOCKED (OK)" : "🔓 LOCK SETTINGS (OK)"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPos({ x: 0, y: 0 });
                    setScale(1);
                    setBorderWidth(4);
                    setBrightness(100);
                  }}
                  className="bg-gray-800 text-gray-300 px-3 text-xs font-bold rounded-lg border border-gray-700 hover:bg-gray-700"
                >
                  RESET
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={downloadCard}
          disabled={downloading || removingBg}
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3.5 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg flex items-center justify-center gap-2"
        >
          <span>📥</span> {downloading ? "GENERATING..." : "DOWNLOAD POTM CARD PNG"}
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
            className="relative w-[500px] h-[500px] select-none overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url('/potm-bg.jpg')`,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* DRAGGABLE & SCALABLE CUTOUT IMAGE WITH OUTLINE & BRIGHTNESS */}
            <div className="absolute left-0 bottom-0 top-0 w-[60%] flex items-end justify-center z-10 overflow-hidden">
              {playerImage ? (
                <img
                  src={playerImage}
                  alt="Player Cutout"
                  onMouseDown={handleMouseDown}
                  draggable={false}
                  className={`max-h-[92%] w-auto object-contain ${
                    isLocked ? "cursor-default" : "cursor-grab active:cursor-grabbing"
                  }`}
                  style={{
                    filter: `${getBorderShadowStyle()} brightness(${brightness}%)`,
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: isDragging ? "none" : "transform 0.1s ease-out, filter 0.1s ease-out",
                  }}
                />
              ) : (
                <div className="text-[10px] font-bold text-gray-500 border border-dashed border-[#D4AF37]/30 p-6 rounded-2xl text-center bg-black/40 backdrop-blur-sm mb-12">
                  UPLOAD PLAYER PHOTO
                </div>
              )}
            </div>

            {/* RIGHT SIDE MONTH & NAME */}
            <div className="absolute right-5 bottom-12 w-[45%] text-right z-20 space-y-1">
              {month && (
                <div className="text-[#D4AF37] font-black text-lg tracking-widest uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                  {month}
                </div>
              )}

              {playerName && (
                <div className="text-white font-black text-2xl tracking-wider uppercase leading-tight drop-shadow-[0_4px_12px_rgba(212,175,55,0.7)] border-t border-[#D4AF37]/50 pt-1">
                  {playerName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}