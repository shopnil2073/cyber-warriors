"use client";

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { removeBackground } from "../../../lib/bgRemoval";
import { supabase } from "../../../lib/supabase";
import { fetchMatchCards } from "../../../lib/tournament/queries";
import { categoryLabel, type MatchCard } from "../../../lib/tournament/types";

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

const inputCls = "w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]";

export default function MotmMatchCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [matchId, setMatchId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);
  const [border, setBorder] = useState(4);
  const [borderColor, setBorderColor] = useState("#FFFFFF");

  useEffect(() => {
    void fetchMatchCards(supabase, { status: ["completed"], sort: "latest", limit: 60 }).then(setMatches);
  }, []);

  const m = matches.find((x) => x.id === matchId) ?? null;

  function pickMatch(id: string) {
    setMatchId(id);
    const found = matches.find((x) => x.id === id);
    // Match theke MOTM er naam auto bose jay (chaile bodlano jay)
    setPlayerName(found?.motm_name ?? "");
    // MOTM er profile photo auto nao (jodi thake), noile upload korte hobe
    if (found?.motm_avatar && found.motm_avatar !== "/logo.jpg") setImage(found.motm_avatar);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setX(0);
    setY(0);
    setScale(1);
    try {
      setImage(await blobToBase64(await removeBackground(file, { model: "isnet_fp16", output: { format: "image/png", quality: 0.8 } })));
    } catch {
      const r = new FileReader();
      r.onload = () => setImage(r.result as string);
      r.readAsDataURL(file);
    }
    setBusy(false);
  }

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const url = await toPng(cardRef.current, { cacheBust: false, pixelRatio: 3, quality: 1 });
      const a = document.createElement("a");
      a.download = `MOTM_${(playerName || "card").replace(/\s+/g, "_")}.png`;
      a.href = url;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Download failed!");
    }
    setDownloading(false);
  }

  const shadow =
    border === 0
      ? "drop-shadow(0px 15px 25px rgba(0,0,0,0.8))"
      : `drop-shadow(${border}px 0 0 ${borderColor}) drop-shadow(-${border}px 0 0 ${borderColor}) drop-shadow(0 ${border}px 0 ${borderColor}) drop-shadow(0 -${border}px 0 ${borderColor}) drop-shadow(0px 15px 25px rgba(0,0,0,0.8))`;

  return (
    <div className="grid grid-cols-1 items-start gap-6 p-2 md:gap-8 md:p-0 lg:grid-cols-2">
      <div className="w-full space-y-4 rounded-2xl border border-[#23293A] bg-[#121624] p-4 shadow-xl md:p-6">
        <h3 className="flex items-center gap-2 border-b border-[#23293A] pb-2 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
          <span>⭐</span> MOTM CARD (FROM MATCH RESULT)
        </h3>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase text-gray-400">SELECT COMPLETED MATCH</label>
          <select className={inputCls} value={matchId} onChange={(e) => pickMatch(e.target.value)}>
            <option value="">{matches.length ? "Choose a match..." : "No published matches yet"}</option>
            {matches.map((x) => (
              <option key={x.id} value={x.id}>
                {x.tournament_name} · {x.home_name} {x.home_score}-{x.away_score} {x.away_name}
                {x.motm_name ? ` · ⭐ ${x.motm_name}` : ""}
              </option>
            ))}
          </select>
          {m && !m.motm_name && <p className="mt-1 text-[10px] font-bold text-amber-400">Ei match e MOTM select kora nai. Naam nijer haate dao.</p>}
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase text-gray-400">PLAYER NAME</label>
          <input className={inputCls} value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase text-gray-400">PLAYER PHOTO (AUTO BACKGROUND REMOVE)</label>
          <input type="file" accept="image/*" onChange={onUpload} className="w-full cursor-pointer rounded-xl border border-[#23293A] bg-[#0B0E14] p-2 text-xs text-gray-400 file:border-0 file:bg-[#121624] file:font-bold file:text-[#D4AF37]" />
          {busy && <p className="mt-1 animate-pulse text-[10px] font-bold text-amber-400">⏳ AI is removing background... Please wait.</p>}
        </div>

        {image && (
          <div className="space-y-3 rounded-xl border border-[#23293A] bg-[#0B0E14] p-4">
            {[
              { label: "MOVE LEFT/RIGHT", v: x, set: setX, min: -200, max: 200, step: 5 },
              { label: "MOVE UP/DOWN", v: y, set: setY, min: -200, max: 200, step: 5 },
              { label: "ZOOM", v: scale, set: setScale, min: 0.5, max: 2.5, step: 0.05 },
              { label: "BORDER", v: border, set: setBorder, min: 0, max: 15, step: 1 },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-[9px] font-bold text-gray-400">
                  <span>{s.label}</span>
                  <span className="text-[#D4AF37]">{s.v}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full cursor-pointer accent-[#D4AF37]" />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border border-gray-700 bg-transparent" />
              {["#FFFFFF", "#D4AF37", "#FF0000", "#00E5FF", "#00FF66"].map((c) => (
                <button key={c} type="button" onClick={() => setBorderColor(c)} className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}

        <button onClick={download} disabled={downloading || busy || !m} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3.5 text-xs font-extrabold uppercase text-black shadow-lg transition-all hover:brightness-110 disabled:opacity-50">
          <span>📥</span> {downloading ? "GENERATING..." : "DOWNLOAD MOTM CARD PNG"}
        </button>
      </div>

      <div className="w-full space-y-2 overflow-x-auto">
        <span className="block font-mono text-[10px] uppercase tracking-widest text-[#D4AF37]">MOTM CARD PREVIEW:</span>
        <div className="mx-auto max-w-[500px] overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-black shadow-2xl">
          <div
            ref={cardRef}
            className="pointer-events-none relative h-[625px] w-[500px] select-none overflow-hidden"
            style={{ background: "radial-gradient(circle at 50% 28%, #3a2b06 0%, #14100a 45%, #07080c 100%)" }}
          >
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0 38px, rgba(212,175,55,.14) 38px 40px)" }} />
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-[90px]" />

            <div className="absolute left-5 top-5 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="" className="h-11 w-11 rounded-full border border-[#D4AF37] object-cover" />
              <div className="text-[10px] font-black uppercase leading-tight tracking-[0.2em] text-[#D4AF37]">Cyber<br />Warriors</div>
            </div>
            <div className="absolute right-5 top-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-300">
              {m ? `${categoryLabel(m.category)} · ${m.stage}` : "Match"}
            </div>

            <div className="absolute inset-x-0 top-[70px] text-center">
              <div className="text-[13px] font-black uppercase tracking-[0.45em] text-[#F3E5AB]">★ Man of the</div>
              <div className="-mt-1 bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6D1F] bg-clip-text text-6xl font-black italic uppercase tracking-tight text-transparent">MATCH</div>
            </div>

            <div className="absolute inset-x-[8%] bottom-[185px] top-[150px] z-10 flex items-end justify-center overflow-hidden">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Player"
                  draggable={false}
                  className="max-h-[98%] w-auto object-contain"
                  style={{ filter: shadow, transform: `translate(${x}px, ${y}px) scale(${scale})` }}
                />
              ) : (
                <div className="mb-10 rounded-2xl border border-dashed border-[#D4AF37]/30 bg-black/40 p-6 text-[10px] font-bold text-gray-500">UPLOAD PLAYER PHOTO</div>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-[118px] z-20 px-4 text-center">
              <h2 className="bg-gradient-to-r from-white via-[#FFF0B3] to-[#D4AF37] bg-clip-text text-3xl font-black italic uppercase tracking-wider text-transparent drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                {playerName || "PLAYER NAME"}
              </h2>
            </div>

            <div className="absolute inset-x-5 bottom-5 z-20 rounded-2xl border border-[#D4AF37]/50 bg-black/60 px-4 py-3 backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <span className="w-[38%] truncate text-right text-[12px] font-black uppercase text-white">{m?.home_name ?? "HOME"}</span>
                <span className="rounded-lg bg-[#D4AF37] px-3 py-1 font-mono text-xl font-black text-black">{m ? `${m.home_score}-${m.away_score}` : "0-0"}</span>
                <span className="w-[38%] truncate text-left text-[12px] font-black uppercase text-white">{m?.away_name ?? "AWAY"}</span>
              </div>
              <div className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">{m?.tournament_name ?? "Tournament"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
