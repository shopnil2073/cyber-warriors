"use client";

import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { removeBackground } from "@imgly/background-removal";

export default function WinStatCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);

  // INPUT STATES
  const [playerName, setPlayerName] = useState("");
  
  // POST TITLE DROPDOWN STATES
  const [postType, setPostType] = useState("WINS");
  const [postAmount, setPostAmount] = useState("50");

  const [matches, setMatches] = useState("");
  const [wins, setWins] = useState("");
  const [draws, setDraws] = useState("");
  const [winRate, setWinRate] = useState("");
  const [isManualWinRate, setIsManualWinRate] = useState(false);
  const [motm, setMotm] = useState("");
  const [location, setLocation] = useState("");
  const [playerImage, setPlayerImage] = useState<string>("");

  // IMAGE CONTROLS
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [moveStep, setMoveStep] = useState(10);
  const [scale, setScale] = useState(1);
  const [borderWidth, setBorderWidth] = useState(4);
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [brightness, setBrightness] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  // AUTO WIN RATE CALCULATOR: Win Rate = ((Wins + (0.5 * Draws)) / Matches) * 100
  useEffect(() => {
    if (isManualWinRate) return;

    const m = parseFloat(matches);
    const w = parseFloat(wins);
    const d = parseFloat(draws) || 0;

    if (!isNaN(m) && !isNaN(w) && m > 0) {
      const calculatedRate = ((w + 0.5 * d) / m) * 100;
      setWinRate(`${calculatedRate.toFixed(1)}%`);
    } else {
      setWinRate("");
    }
  }, [matches, wins, draws, isManualWinRate]);

  // CONVERT BLOB TO BASE64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // AI BACKGROUND REMOVAL PROCESSOR
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRemovingBg(true);
    setIsLocked(false);
    setPos({ x: 0, y: 0 });
    setScale(1);

    try {
      const blob = await removeBackground(file, {
        model: "isnet_fp16",
        output: {
          format: "image/png",
          quality: 0.8,
        },
      });
      const base64Data = await blobToBase64(blob);
      setPlayerImage(base64Data);
    } catch (err) {
      console.error("AI BG Removal failed, falling back to original:", err);
      const reader = new FileReader();
      reader.onload = () => setPlayerImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    setRemovingBg(false);
  };

  // DIRECTIONAL BUTTON HANDLERS
  const moveImage = (direction: "up" | "down" | "left" | "right") => {
    if (isLocked || !playerImage) return;
    setPos((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: prev.y - moveStep };
        case "down":
          return { ...prev, y: prev.y + moveStep };
        case "left":
          return { ...prev, x: prev.x - moveStep };
        case "right":
          return { ...prev, x: prev.x + moveStep };
        default:
          return prev;
      }
    });
  };

  // MOUSE & TOUCH DRAG HANDLERS
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked || !playerImage || e.touches.length === 0) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - pos.x,
      y: e.touches[0].clientY - pos.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isLocked || e.touches.length === 0) return;
    setPos({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        pixelRatio: 3,
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `${(playerName || "Win_Stat_Card").replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error", err);
      alert("Download failed! Doya kore image load o lock confirm korun.");
    }
    setDownloading(false);
  };

  // MULTI-DIRECTIONAL DROP SHADOW WITH DYNAMIC BORDER COLOR
  const getBorderShadowStyle = () => {
    if (borderWidth === 0) return "drop-shadow(0px 15px 25px rgba(0,0,0,0.8))";
    const bw = `${borderWidth}px`;
    return `
      drop-shadow(${bw} 0px 0px ${borderColor})
      drop-shadow(-${bw} 0px 0px ${borderColor})
      drop-shadow(0px ${bw} 0px ${borderColor})
      drop-shadow(0px -${bw} 0px ${borderColor})
      drop-shadow(0px 15px 25px rgba(0,0,0,0.8))
    `;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start p-2 md:p-0">
      {/* INPUT FORM (MOBILE FRIENDLY) */}
      <div className="bg-[#121624] border border-[#23293A] p-4 md:p-6 rounded-2xl space-y-4 shadow-xl w-full">
        <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest border-b border-[#23293A] pb-2 flex items-center gap-2">
          <span>🏆</span> WIN/GOAL STAT CARD INPUTS
        </h3>

        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">PLAYER NAME</label>
              <input
                type="text"
                placeholder="e.g. SIAM HOSSAIN"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* WIN/GOAL POST TITLE DROPDOWN SECTION */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                WIN/GOAL POST TITLE
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* TYPE DROPDOWN */}
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="WINS">WINS</option>
                  <option value="GOALS">GOALS</option>
                </select>

                {/* AMOUNT DROPDOWN */}
                <select
                  value={postAmount}
                  onChange={(e) => setPostAmount(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  {["50", "100", "150", "200", "250", "300", "350", "400", "450", "500", "550", "600"].map(
                    (amt) => (
                      <option key={amt} value={amt}>
                        {amt}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">MATCHES</label>
              <input
                type="number"
                placeholder="123"
                value={matches}
                onChange={(e) => setMatches(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">WINS</label>
              <input
                type="number"
                placeholder="50"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">DRAWS</label>
              <input
                type="number"
                placeholder="11"
                value={draws}
                onChange={(e) => setDraws(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">WIN RATE %</label>
              </div>
              <input
                type="text"
                placeholder="45.1%"
                value={winRate}
                onChange={(e) => {
                  setIsManualWinRate(true);
                  setWinRate(e.target.value);
                }}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">MAN OF THE MATCH (MOTM)</label>
              <input
                type="text"
                placeholder="4"
                value={motm}
                onChange={(e) => setMotm(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">LOCATION / DISTRICT</label>
              <input
                type="text"
                placeholder="e.g. TANGAIL"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
              />
            </div>
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
                ⏳ Fast AI is removing background... Please wait.
              </p>
            )}
          </div>

          {/* CONTROLS FOR IMAGE ADJUSTMENTS */}
          {playerImage && (
            <div className="border border-[#23293A] bg-[#0B0E14] p-3.5 md:p-4 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">
                ⚙️ IMAGE ADJUSTMENTS & POSITION CONTROLS
              </span>

              {/* DIRECTIONAL ARROW BUTTONS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] text-gray-400 font-bold uppercase">
                    POSITION CONTROLS
                  </label>
                  <div className="flex gap-1">
                    {[5, 10, 20].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setMoveStep(step)}
                        className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                          moveStep === step
                            ? "bg-[#D4AF37] text-black"
                            : "bg-[#121624] text-gray-400 border border-gray-700"
                        }`}
                      >
                        {step}px
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1.5 bg-[#121624] p-3 rounded-xl border border-[#23293A]">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => moveImage("up")}
                    className="bg-[#23293A] active:scale-95 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-all disabled:opacity-40"
                  >
                    ▲
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => moveImage("left")}
                      className="bg-[#23293A] active:scale-95 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-all disabled:opacity-40"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => moveImage("down")}
                      className="bg-[#23293A] active:scale-95 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-all disabled:opacity-40"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => moveImage("right")}
                      className="bg-[#23293A] active:scale-95 hover:bg-[#D4AF37] hover:text-black text-white p-2.5 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-all disabled:opacity-40"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>

              {/* BORDER COLOR SELECTOR */}
              <div>
                <label className="text-[9px] text-gray-400 font-bold block mb-1.5">BORDER COLOR</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-gray-700 shrink-0"
                  />
                  <div className="flex gap-1.5 shrink-0">
                    {["#FFFFFF", "#D4AF37", "#FFD700", "#FF0000", "#00E5FF", "#00FF66"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBorderColor(color)}
                        className="w-6 h-6 rounded-full border border-gray-600 transition-transform active:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* BORDER THICKNESS SLIDER */}
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
                  className="w-full accent-[#D4AF37] cursor-pointer touch-none"
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
                  className="w-full accent-[#D4AF37] cursor-pointer touch-none"
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
                  className="w-full accent-[#D4AF37] cursor-pointer touch-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-full text-xs font-bold py-2.5 rounded-lg transition-all ${
                    isLocked
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-[#23293A] text-[#D4AF37] border border-[#D4AF37]/40"
                  }`}
                >
                  {isLocked ? "🔒 POSITION & STYLE LOCKED" : "🔓 LOCK SETTINGS"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPos({ x: 0, y: 0 });
                    setScale(1);
                    setBorderWidth(4);
                    setBorderColor("#FFFFFF");
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
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3.5 rounded-xl hover:brightness-110 active:scale-[0.99] transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg flex items-center justify-center gap-2"
        >
          <span>📥</span> {downloading ? "GENERATING..." : "DOWNLOAD WIN STAT CARD PNG"}
        </button>
      </div>

      {/* CANVAS PREVIEW (RESPONSIVE FOR MOBILE SCHEDULING) */}
      <div className="space-y-2 w-full overflow-x-auto">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          WIN STAT TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div
            ref={cardRef}
            className="relative w-[500px] h-[500px] select-none overflow-hidden bg-cover bg-center"
            style={{
              backgroundImage: `url('/win-stat-bg.jpg')`,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* BIG GOLDEN HEADER: e.g. "50 WINS" OR "100 GOALS" */}
            <div className="absolute top-[52px] left-0 right-0 text-center z-10 pointer-events-none">
              <h1 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6D1F] tracking-tighter uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {`${postAmount} ${postType}`}
              </h1>
            </div>

            {/* LEFT STATS: PERFECTLY INSIDE BRUSH BOXES */}
            {/* MATCHES */}
            <div className="absolute left-[55px] top-[175px] z-20 pointer-events-none -rotate-6">
              <span className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {matches || ""}
              </span>
            </div>

            {/* WINS */}
            <div className="absolute left-[62px] top-[240px] z-20 pointer-events-none -rotate-6">
              <span className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {wins || ""}
              </span>
            </div>

            {/* DRAWS */}
            <div className="absolute left-[70px] top-[300px] z-20 pointer-events-none -rotate-6">
              <span className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {draws || ""}
              </span>
            </div>

            {/* RIGHT STATS: PERFECT CIRCLE & STAR ALIGNMENT */}
            {/* WIN RATE IN CIRCLE CENTER */}
            <div className="absolute right-[10px] top-[182px] w-[90px] text-center z-20 pointer-events-none">
              <span className="text-sm font-black text-white tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {winRate || ""}
              </span>
            </div>

            {/* MOTM: EXACTLY ON RIGHT BRUSH BANNER */}
            <div className="absolute right-[65px] top-[242px] z-20 pointer-events-none rotate-6">
              <span className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {motm || ""}
              </span>
            </div>

            {/* CENTER PLAYER CUTOUT PHOTO */}
            <div className="absolute left-[12%] right-[12%] bottom-[60px] top-[100px] flex items-end justify-center z-10 overflow-hidden">
              {playerImage ? (
                <img
                  src={playerImage}
                  alt="Player Cutout"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  draggable={false}
                  className={`max-h-[96%] w-auto object-contain ${
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

            {/* BOTTOM BANNER: PLAYER NAME & LOCATION */}
            <div className="absolute left-0 right-0 bottom-[38px] text-center z-20 pointer-events-none px-4">
              {playerName && (
                <h2 className="text-2xl font-black italic uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#D4AF37] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                  {playerName}
                </h2>
              )}
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-0.5">
                CYBER WARRIORS {location ? `| ${location}` : "| TANGAIL"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}