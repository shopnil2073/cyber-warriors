"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { removeBackground } from "../../../lib/bgRemoval";

export default function PotmCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const lastFileRef = useRef<File | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [month, setMonth] = useState("");
  const [playerImage, setPlayerImage] = useState<string>("");

  // IMAGE CONTROLS & TOLERANCE
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [moveStep, setMoveStep] = useState(10);
  const [scale, setScale] = useState(1);
  const [borderWidth, setBorderWidth] = useState(4);
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [brightness, setBrightness] = useState(100);
  const [tolerance, setTolerance] = useState(45); // Fallback (color based) background removal sensitivity

  // FALLBACK: AI kaj na korle ager color-based background cleaner (tolerance diye)
  const processImageWithTolerance = async (file: File, tol: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          const maxDim = 1000;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);

          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          // Sample background color from corners
          const corners = [
            { x: 5, y: 5 },
            { x: w - 5, y: 5 },
            { x: 5, y: h - 5 },
            { x: w - 5, y: h - 5 }
          ];

          let rSum = 0, gSum = 0, bSum = 0;
          corners.forEach(c => {
            const idx = (c.y * w + c.x) * 4;
            rSum += data[idx];
            gSum += data[idx + 1];
            bSum += data[idx + 2];
          });
          const bgR = rSum / corners.length;
          const bgG = gSum / corners.length;
          const bgB = bSum / corners.length;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const dist = Math.sqrt(
              Math.pow(r - bgR, 2) +
              Math.pow(g - bgG, 2) +
              Math.pow(b - bgB, 2)
            );

            if (dist < tol) {
              data[i + 3] = 0; // Transparent
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // AI diye auto background remove (prothom option). Fail korle fallback e tolerance method.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    lastFileRef.current = file;
    setProcessing(true);
    setUsedFallback(false);
    setPos({ x: 0, y: 0 });
    setScale(1);

    try {
      const blob = await removeBackground(file, {
        model: "isnet_fp16",
        output: { format: "image/png", quality: 0.8 },
      });
      setPlayerImage(await blobToBase64(blob));
    } catch (err) {
      console.error("AI BG Removal failed, fallback use hocche:", err);
      try {
        const processed = await processImageWithTolerance(file, tolerance);
        setPlayerImage(processed);
        setUsedFallback(true);
      } catch (err2) {
        console.error("Fallback processing error:", err2);
        const reader = new FileReader();
        reader.onload = () => setPlayerImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
    setProcessing(false);
  };

  const moveImage = (direction: "up" | "down" | "left" | "right") => {
    if (!playerImage) return;
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
      link.download = `${(playerName || "POTM_Card").replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error", err);
      alert("Download failed!");
    }
    setDownloading(false);
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">PLAYER PHOTO (OR TRANSPARENT PNG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-xl text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] file:font-bold cursor-pointer"
            />
            {processing && (
              <p className="text-[10px] text-amber-400 mt-1 font-bold animate-pulse">
                ⏳ AI is removing background... Please wait (prothom bar ektu beshi somoy lage).
              </p>
            )}
          </div>

          {playerImage && (
            <div className="border border-[#23293A] bg-[#0B0E14] p-4 rounded-xl space-y-4">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase block">
                ⚙️ IMAGE ADJUSTMENTS & POSITION CONTROLS
              </span>

              {/* FALLBACK TOLERANCE SLIDER: shudhu AI fail korle dekhabe */}
              {usedFallback && (
                <div>
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold mb-1">
                    <span>AUTO BG REMOVAL TOLERANCE (AI fail korse, color method)</span>
                    <span className="text-[#D4AF37]">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={tolerance}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setTolerance(val);
                      if (lastFileRef.current) {
                        processImageWithTolerance(lastFileRef.current, val)
                          .then(setPlayerImage)
                          .catch((err) => console.error(err));
                      }
                    }}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-[8px] text-gray-500 block mt-0.5">Adjust slider if background isn't fully removed (or use a pre-cut PNG).</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] text-gray-400 font-bold uppercase">
                    POSITION CONTROLS (UP / DOWN / LEFT / RIGHT)
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
                    onClick={() => moveImage("up")}
                    className="bg-[#23293A] hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-colors"
                  >
                    ▲
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage("left")}
                      className="bg-[#23293A] hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-colors"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage("down")}
                      className="bg-[#23293A] hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-colors"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage("right")}
                      className="bg-[#23293A] hover:bg-[#D4AF37] hover:text-black text-white p-2 rounded-lg text-xs font-bold w-12 border border-[#323B52] transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-gray-400 font-bold block mb-1.5">BORDER COLOR</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-gray-700"
                  />
                  <div className="flex gap-1">
                    {["#FFFFFF", "#D4AF37", "#FFD700", "#FF0000", "#00E5FF", "#00FF66"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBorderColor(color)}
                        className="w-6 h-6 rounded-full border border-gray-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

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
                  onClick={() => {
                    setPos({ x: 0, y: 0 });
                    setScale(1);
                    setBorderWidth(4);
                    setBorderColor("#FFFFFF");
                    setBrightness(100);
                    setTolerance(45);
                  }}
                  className="w-full bg-gray-800 text-gray-300 py-2 text-xs font-bold rounded-lg border border-gray-700 hover:bg-gray-700"
                >
                  RESET POSITION & STYLE
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={downloadCard}
          disabled={downloading || processing}
          className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3.5 rounded-xl hover:brightness-110 transition-all uppercase cursor-pointer disabled:opacity-50 mt-4 shadow-lg flex items-center justify-center gap-2"
        >
          <span>📥</span> {downloading ? "GENERATING..." : "DOWNLOAD POTM CARD PNG"}
        </button>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
          POTM TEMPLATE CANVAS PREVIEW (1080x1080):
        </span>

        <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/40 shadow-2xl bg-black max-w-[500px] mx-auto">
          <div
            ref={cardRef}
            className="relative w-[500px] h-[500px] select-none overflow-hidden bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `url('/potm-bg.jpg')`,
            }}
          >
            <div className="absolute left-0 bottom-0 top-0 w-[57%] flex items-end justify-center z-10 overflow-hidden">
              {playerImage ? (
                <img
                  src={playerImage}
                  alt="Player Cutout"
                  draggable={false}
                  className="max-h-[92%] w-auto object-contain cursor-default"
                  style={{
                    filter: `${getBorderShadowStyle()} brightness(${brightness}%)`,
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: "transform 0.1s ease-out, filter 0.1s ease-out",
                  }}
                />
              ) : (
                <div className="text-[10px] font-bold text-gray-500 border border-dashed border-[#D4AF37]/30 p-6 rounded-2xl text-center bg-black/40 backdrop-blur-sm mb-12">
                  UPLOAD PLAYER PHOTO
                </div>
              )}
            </div>

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
