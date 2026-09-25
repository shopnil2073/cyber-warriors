"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getStoredTicker } from "./utils/tournamentStore";

export default function Home() {
  const taglineText = "Driven by Passion. Defined by Glory.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [rankingTab, setRankingTab] = useState<"OVERALL" | "MONTHLY" | "WEEKLY">("OVERALL");
  const [ticker, setTicker] = useState("🔥 CYBER WARRIORS SOLO CHAMPIONSHIP SEASON 1 FIXTURES ARE NOW LIVE!");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const newsItems = [
    {
      id: 1,
      title: "CW TRAINING DRILL & ACADEMY MATCHES",
      image: "/logo.jpg",
    },
    {
      id: 2,
      title: "CYBER WARRIORS MATCH RULES & REGULATIONS",
      image: "/logo.jpg",
    },
    {
      id: 3,
      title: "The Royal Club Academy Officially Welcomes Five New Players to Roster",
      image: "/logo.jpg",
    },
    {
      id: 4,
      title: "Anupam Satter Turzo Joins Cyber Warriors As New Captain",
      image: "/logo.jpg",
    },
    {
      id: 5,
      title: "Cyber Warriors Strengthens Main Roster with New Additions",
      image: "/logo.jpg",
    },
  ];

  // Auto Slider Timer (3 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [newsItems.length]);

  useEffect(() => {
    const activeTicker = getStoredTicker();
    if (activeTicker) setTicker(activeTicker);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < taglineText.length) {
          setDisplayText(taglineText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(taglineText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 selection:bg-[#D4AF37] selection:text-black">
      
      {/* Dynamic Announcement Ticker */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-1.5 px-4 transition-colors">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <span className="bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase animate-pulse shrink-0">
            HOT NEWS
          </span>
          <p className="text-xs text-[var(--text-muted)] font-medium truncate">
            {ticker}
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden border-b border-[var(--border-color)] transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(#23293A_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 py-6">
          <div className="flex justify-center mb-2">
            <div className="relative w-64 h-64 md:w-80 md:h-80 p-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300">
              {/* Homepage Hero Banner Logo Dynamic Switch */}
              <img
                src={isDark ? "/logo.jpg" : "/logo-light.jpg"}
                alt="Cyber Warriors Banner Logo"
                className="w-full h-full object-contain transition-all duration-300"
              />
            </div>
          </div>

          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-[var(--bg-card)] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-lg shadow-[#D4AF37]/10 transition-colors">
            THE OFFICIAL CYBER WARRIORS PORTAL
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-main)] uppercase mt-1 transition-colors">
            CYBER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]">WARRIORS</span>
          </h1>

          {/* Typing Tagline */}
          <div className="h-8 flex items-center justify-center mt-2">
            <blockquote className="text-sm md:text-lg italic font-serif text-[var(--text-muted)] tracking-wide">
              "{displayText}"
              <span className="inline-block w-0.5 h-4 ml-1 bg-[#D4AF37] animate-pulse" />
            </blockquote>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/tournament"
              className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/25 hover:scale-105 transition-all"
            >
              SOLO MATCH CENTER
            </Link>
            <Link
              href="/ranking"
              className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[#D4AF37] transition-all"
            >
              ELITE LEADERBOARD
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Sections Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

        {/* 1. HQ NEWS SECTION (AUTOMATIC SLIDE SHOW) */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-md transition-colors overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">📰</span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[var(--text-main)]">
                HQ NEWS
              </h2>
            </div>
            <Link
              href="/news"
              className="text-[11px] font-black text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-full hover:bg-[#D4AF37]/10 transition-colors uppercase tracking-wider"
            >
              ALL NEWS →
            </Link>
          </div>

          {/* Auto Sliding Container */}
          <div className="relative w-full overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out gap-4"
              style={{
                transform: `translateX(-${currentNewsIndex * 260}px)`,
              }}
            >
              {newsItems.map((item) => (
                <Link
                  key={item.id}
                  href="/news"
                  className="shrink-0 w-[240px] md:w-[280px] h-[160px] md:h-[180px] relative rounded-2xl overflow-hidden border-2 border-[#23293A] hover:border-[#D4AF37] group transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-extrabold text-xs md:text-sm text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {newsItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentNewsIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentNewsIndex === idx
                      ? "bg-[#D4AF37] w-5"
                      : "bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. ELITE RANKING SECTION */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-md transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[var(--text-main)]">
                ELITE RANKING
              </h2>
            </div>
            <Link
              href="/ranking"
              className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-lg hover:bg-[#D4AF37]/10 transition-colors uppercase"
            >
              FULL RANK →
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
            {(["OVERALL", "MONTHLY", "WEEKLY"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRankingTab(tab)}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                  rankingTab === tab
                    ? "bg-[#D4AF37] text-black shadow-md"
                    : "text-[var(--text-muted)] hover:text-[#D4AF37]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rank 1 Highlight Card */}
          <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-xl p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative shrink-0">
                <span className="absolute -top-3 -left-1 text-xl z-10 animate-bounce">👑</span>
                <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md">
                  <Image src="/logo.jpg" alt="Leader" fill className="object-cover" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">
                  OVERALL LEADER
                </span>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wide text-[var(--text-main)]">
                  MUNTAHIDUL WAKID TASFI
                </h3>
              </div>
            </div>

            <div className="text-right flex items-center justify-between w-full md:w-auto md:block">
              <div className="text-2xl font-black text-[#D4AF37]">1252 <span className="text-xs font-bold text-[var(--text-muted)]">RTG</span></div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-bold bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)] mb-6">
            <div>👕 52 APP</div>
            <div>✔ 36 W</div>
            <div>➖ 6 D</div>
            <div>⚽ 159 GF</div>
            <div className="text-[#D4AF37]">📊 69% WIN</div>
          </div>

          {/* Ranking List */}
          <div className="space-y-2">
            {[
              { rank: 2, name: "Farhanul Islam", app: 57, w: 39, gf: 152, win: 68, rtg: 1236 },
              { rank: 3, name: "Shahriar Showrov", app: 16, w: 16, gf: 97, win: 100, rtg: 1222 },
              { rank: 4, name: "Samiur Rahman Sami", app: 48, w: 31, gf: 151, win: 65, rtg: 1180 },
              { rank: 5, name: "Ra Fi", app: 56, w: 30, gf: 162, win: 54, rtg: 1178 },
            ].map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#D4AF37] hover:translate-x-1 transition-all duration-200 text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#D4AF37] w-4 text-center">{player.rank}</span>
                  <div className="relative w-8 h-8 rounded-full bg-black/40 overflow-hidden border border-gray-700 shrink-0 group-hover:border-[#D4AF37] transition-colors">
                    <Image src="/logo.jpg" alt={player.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">{player.name}</h4>
                    <div className="text-[10px] text-[var(--text-muted)] flex gap-2">
                      <span>👕 {player.app} APP</span>
                      <span>✔ {player.w} W</span>
                      <span>⚽ {player.gf} GF</span>
                    </div>
                  </div>
                </div>
                <div className="font-black text-sm text-[#D4AF37]">{player.rtg}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TOP SCORERS SECTION */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-md transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[var(--text-main)]">
                TOP SCORERS
              </h2>
            </div>
            <Link
              href="/ranking"
              className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-lg hover:bg-[#D4AF37]/10 transition-colors uppercase"
            >
              ALL SCORERS →
            </Link>
          </div>

          <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-xl p-4 mb-4 flex items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shrink-0">
                <Image src="/logo.jpg" alt="Golden Boot" fill className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                  🥇 GOLDEN BOOT
                </span>
                <h3 className="text-base md:text-lg font-black uppercase tracking-wide text-[var(--text-main)]">
                  HARUNOR RASHED
                </h3>
                <div className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-3 mt-1">
                  <span>👕 54 APP</span>
                  <span>⚽ 3.24 RATIO</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#D4AF37]">175</div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">GOALS</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { rank: 2, name: "Ra Fi", app: 56, ratio: 2.89, goals: 162 },
              { rank: 3, name: "Muntahidul Wakid Tasfi", app: 52, ratio: 3.05, goals: 159 },
              { rank: 4, name: "Farhanul Islam", app: 57, ratio: 2.67, goals: 152 },
              { rank: 5, name: "Samiur Rahman Sami", app: 48, ratio: 3.15, goals: 151 },
            ].map((scorer) => (
              <div
                key={scorer.rank}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#D4AF37] hover:translate-x-1 transition-all duration-200 text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#D4AF37] w-4 text-center">{scorer.rank}</span>
                  <div className="relative w-8 h-8 rounded-full bg-black/40 overflow-hidden border border-gray-700 shrink-0 group-hover:border-[#D4AF37] transition-colors">
                    <Image src="/logo.jpg" alt={scorer.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">{scorer.name}</h4>
                    <span className="text-[10px] text-[var(--text-muted)]">👕 {scorer.app} APP • ⚽ {scorer.ratio} RT</span>
                  </div>
                </div>
                <div className="font-black text-sm text-[#D4AF37]">{scorer.goals}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SOLO UPCOMING SECTION */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-md transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[var(--text-main)]">
                SOLO UPCOMING
              </h2>
            </div>
            <Link
              href="/tournament"
              className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 rounded-lg hover:bg-[#D4AF37]/10 transition-colors uppercase"
            >
              ALL SOLO →
            </Link>
          </div>

          <div className="max-w-md mx-auto bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-4 text-center space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#D4AF37] px-2">
              <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded-md">
                SOLO TOURNAMENT
              </span>
              <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded-md">
                ROUND 2
              </span>
            </div>

            <div className="text-xs font-bold text-[var(--text-muted)] pt-1">
              📅 02 FEB 2026
            </div>

            <div className="flex items-center justify-around py-4">
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <Image src="/logo.jpg" alt="Shafin" fill className="object-cover" />
                </div>
                <span className="font-black text-xs text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">Shafin</span>
              </div>

              <div className="text-base font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 animate-pulse">
                VS
              </div>

              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <Image src="/logo.jpg" alt="Abu" fill className="object-cover" />
                </div>
                <span className="font-black text-xs text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">Abu</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}