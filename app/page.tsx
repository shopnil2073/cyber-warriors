"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getStoredTicker } from "./utils/tournamentStore";
import { getAllUsers, UserProfile } from "./utils/userStore";

export default function Home() {
  const taglineText = "Driven by Passion. Defined by Glory.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [rankingTab, setRankingTab] = useState<"OVERALL" | "MONTHLY" | "WEEKLY">("OVERALL");
  const [ticker, setTicker] = useState("🔥 CYBER WARRIORS SOLO CHAMPIONSHIP SEASON 1 FIXTURES ARE NOW LIVE!");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Dynamic Registered Players State
  const [dbPlayers, setDbPlayers] = useState<UserProfile[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);

  // Random 2 Players State for SOLO UPCOMING Section
  const [soloPlayer1, setSoloPlayer1] = useState<UserProfile | null>(null);
  const [soloPlayer2, setSoloPlayer2] = useState<UserProfile | null>(null);

  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    fetchRegisteredPlayers();
  }, []);

  // Fetch real registered players from userStore/Database
  const fetchRegisteredPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const players = await getAllUsers();
      if (players && Array.isArray(players) && players.length > 0) {
        setDbPlayers(players);

        // Pick 2 Random Players for SOLO UPCOMING Section
        if (players.length >= 2) {
          const randomIndex1 = Math.floor(Math.random() * players.length);
          let randomIndex2 = Math.floor(Math.random() * players.length);
          while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * players.length);
          }
          setSoloPlayer1(players[randomIndex1]);
          setSoloPlayer2(players[randomIndex2]);
        } else {
          setSoloPlayer1(players[0]);
          setSoloPlayer2(players[0]);
        }
      }
    } catch (err) {
      console.error("Error loading database players:", err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  // Dynamic HQ News Articles linked with registered database players' avatars
  const newsItems = [
    {
      id: 1,
      title: "ANUPAM SATTER TURZO JOINS CYBER WARRIORS AS NEW CAPTAIN",
      image: dbPlayers[0]?.avatar || "/logo.jpg",
      userId: dbPlayers[0]?.id || "",
    },
    {
      id: 2,
      title: "CYBER WARRIORS STRENGTHENS MAIN ROSTER WITH NEW ADDITIONS",
      image: dbPlayers[1]?.avatar || "/logo.jpg",
      userId: dbPlayers[1]?.id || "",
    },
    {
      id: 3,
      title: "THE ROYAL CLUB ACADEMY OFFICIALLY WELCOMES FIVE NEW PLAYERS",
      image: dbPlayers[2]?.avatar || "/logo.jpg",
      userId: dbPlayers[2]?.id || "",
    },
    {
      id: 4,
      title: "CYBER WARRIORS MATCH RULES & REGULATIONS UPDATE",
      image: dbPlayers[3]?.avatar || "/logo.jpg",
      userId: dbPlayers[3]?.id || "",
    },
    {
      id: 5,
      title: "CW TRAINING DRILL & ACADEMY MATCHES ANNOUNCED",
      image: dbPlayers[4]?.avatar || dbPlayers[0]?.avatar || "/logo.jpg",
      userId: dbPlayers[4]?.id || dbPlayers[0]?.id || "",
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

  // Tagline Typing Effect
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

  // Sort Registered Players for Elite Ranking (Sorted by Rating/OVR)
  const rankedPlayers = [...dbPlayers].sort((a: any, b: any) => {
    const rateA = Number(a.ovrRating || a.rating || 0);
    const rateB = Number(b.ovrRating || b.rating || 0);
    return rateB - rateA;
  });

  // Sort Registered Players for Top Scorers (Sorted by Goals)
  const topScorers = [...dbPlayers].sort((a: any, b: any) => {
    const goalsA = Number(a.totalGoals || a.goals || a.scored || 0);
    const goalsB = Number(b.totalGoals || b.goals || b.scored || 0);
    return goalsB - goalsA;
  });

  const rank1Player: any = rankedPlayers[0];
  const otherRankedPlayers: any[] = rankedPlayers.slice(1, 5);

  const topScorer1Player: any = topScorers[0];
  const otherTopScorers: any[] = topScorers.slice(1, 5);

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
              href="/event"
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

        {/* 1. HQ NEWS SECTION (AUTOMATIC SLIDE SHOW WITH DATABASE REGISTERED USER PHOTOS) */}
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

          {/* Auto Sliding Container with Registered Database Users Pictures */}
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
                  href={item.userId ? `/profile?id=${item.userId}` : "/news"}
                  className="shrink-0 w-[240px] md:w-[280px] h-[160px] md:h-[180px] relative rounded-2xl overflow-hidden border-2 border-[var(--border-color)] hover:border-[#D4AF37] group transition-all duration-300 shadow-lg cursor-pointer bg-black/50"
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
                  className={`h-2 rounded-full transition-all ${
                    currentNewsIndex === idx
                      ? "bg-[#D4AF37] w-5"
                      : "bg-gray-600 hover:bg-gray-400 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. ELITE RANKING SECTION (DYNAMIC DATABASE PLAYERS ONLY WITH PROFILE NAVIGATION) */}
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
                    ? "bg-[#D4AF37] text-black shadow-md scale-105"
                    : "text-[var(--text-muted)] hover:text-[#D4AF37]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loadingPlayers ? (
            <div className="py-10 text-center text-xs font-black uppercase text-[#D4AF37] tracking-widest animate-pulse">
              LOADING REGISTERED DATABASE PLAYERS...
            </div>
          ) : rankedPlayers.length === 0 ? (
            <div className="py-10 text-center text-xs font-bold uppercase text-[var(--text-muted)]">
              No registered players found in database.
            </div>
          ) : (
            <div>
              {/* Rank 1 Highlight Card (Navigates to profile) */}
              {rank1Player && (
                <Link
                  href={`/profile?id=${rank1Player.id}`}
                  className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-xl p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 block cursor-pointer group"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative shrink-0">
                      <span className="absolute -top-3 -left-1 text-xl z-10 animate-bounce">👑</span>
                      <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md group-hover:scale-105 transition-transform">
                        <Image
                          src={rank1Player.avatar || "/logo.jpg"}
                          alt={rank1Player.name || "Leader"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">
                        {rankingTab} LEADER
                      </span>
                      <h3 className="text-base md:text-lg font-black uppercase tracking-wide text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">
                        {rank1Player.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right flex items-center justify-between w-full md:w-auto md:block">
                    <div className="text-2xl font-black text-[#D4AF37] font-mono">
                      {rank1Player.ovrRating || rank1Player.rating || 1200}{" "}
                      <span className="text-xs font-bold text-[var(--text-muted)]">RTG</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Stats Bar for Rank 1 */}
              {rank1Player && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-bold bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)] mb-6 font-mono">
                  <div>👕 {rank1Player.matches || 0} APP</div>
                  <div>✔ {rank1Player.wins || rank1Player.soloWins || 0} W</div>
                  <div>➖ {rank1Player.draws || 0} D</div>
                  <div>⚽ {rank1Player.scored || rank1Player.totalGoals || 0} GF</div>
                  <div className="text-[#D4AF37]">📊 {rank1Player.winRate || 0}% WIN</div>
                </div>
              )}

              {/* Ranking List (#2 to #5 Navigates to profile) */}
              <div className="space-y-2">
                {otherRankedPlayers.map((player, idx) => (
                  <Link
                    key={player.id || idx}
                    href={`/profile?id=${player.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#D4AF37] hover:translate-x-1 transition-all duration-200 text-xs cursor-pointer group block"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#D4AF37] w-4 text-center font-mono">
                        #{idx + 2}
                      </span>
                      <div className="relative w-8 h-8 rounded-full bg-black/40 overflow-hidden border border-gray-700 shrink-0 group-hover:border-[#D4AF37] transition-colors">
                        <Image
                          src={player.avatar || "/logo.jpg"}
                          alt={player.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors uppercase">
                          {player.name}
                        </h4>
                        <div className="text-[10px] text-[var(--text-muted)] flex gap-2 font-mono">
                          <span>👕 {player.matches || 0} APP</span>
                          <span>✔ {player.wins || 0} W</span>
                          <span>⚽ {player.scored || player.totalGoals || 0} GF</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-black text-sm text-[#D4AF37] font-mono">
                      {player.ovrRating || player.rating || 1000}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. TOP SCORERS SECTION (DYNAMIC PROFILE NAVIGATION) */}
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

          {topScorer1Player ? (
            <div>
              {/* Golden Boot #1 Scorer Card */}
              <Link
                href={`/profile?id=${topScorer1Player.id}`}
                className="bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent border-2 border-[#D4AF37] rounded-xl p-4 mb-4 flex items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-300 block cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src={topScorer1Player.avatar || "/logo.jpg"}
                      alt={topScorer1Player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                      🥇 GOLDEN BOOT
                    </span>
                    <h3 className="text-base md:text-lg font-black uppercase tracking-wide text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors">
                      {topScorer1Player.name}
                    </h3>
                    <div className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-3 mt-1 font-mono">
                      <span>👕 {topScorer1Player.matches || 0} APP</span>
                      <span>
                        ⚽ {(Number(topScorer1Player.totalGoals || topScorer1Player.scored || 0) / Math.max(1, Number(topScorer1Player.matches || 1))).toFixed(2)} RATIO
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#D4AF37] font-mono">
                    {topScorer1Player.totalGoals || topScorer1Player.goals || topScorer1Player.scored || 0}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                    GOALS
                  </span>
                </div>
              </Link>

              {/* Other Top Scorers #2 to #5 */}
              <div className="space-y-2">
                {otherTopScorers.map((scorer, idx) => (
                  <Link
                    key={scorer.id || idx}
                    href={`/profile?id=${scorer.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[#D4AF37] hover:translate-x-1 transition-all duration-200 text-xs cursor-pointer group block"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#D4AF37] w-4 text-center font-mono">
                        #{idx + 2}
                      </span>
                      <div className="relative w-8 h-8 rounded-full bg-black/40 overflow-hidden border border-gray-700 shrink-0 group-hover:border-[#D4AF37] transition-colors">
                        <Image
                          src={scorer.avatar || "/logo.jpg"}
                          alt={scorer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors uppercase">
                          {scorer.name}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          👕 {scorer.matches || 0} APP
                        </span>
                      </div>
                    </div>
                    <div className="font-black text-sm text-[#D4AF37] font-mono">
                      {scorer.totalGoals || scorer.goals || scorer.scored || 0}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs font-bold text-[var(--text-muted)] uppercase">
              No top scorers recorded yet.
            </div>
          )}
        </section>

        {/* 4. SOLO UPCOMING SECTION (DYNAMIC PROFILE NAVIGATION FOR MATCH PLAYERS) */}
        <section className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-md transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-[var(--text-main)]">
                SOLO UPCOMING
              </h2>
            </div>
            <Link
              href="/event"
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

            <div className="text-xs font-bold text-[var(--text-muted)] pt-1 font-mono">
              📅 02 FEB 2026
            </div>

            {loadingPlayers ? (
              <div className="py-4 text-xs font-bold text-[#D4AF37] animate-pulse uppercase">
                Loading Upcoming Matchup...
              </div>
            ) : soloPlayer1 && soloPlayer2 ? (
              <div className="flex items-center justify-around py-4">
                {/* Player 1 Profile Link */}
                <Link
                  href={`/profile?id=${soloPlayer1.id}`}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src={soloPlayer1.avatar || "/logo.jpg"}
                      alt={soloPlayer1.name || "Player 1"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-black text-xs text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors uppercase max-w-[100px] truncate">
                    {soloPlayer1.name}
                  </span>
                </Link>

                <div className="text-base font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 animate-pulse font-mono">
                  VS
                </div>

                {/* Player 2 Profile Link */}
                <Link
                  href={`/profile?id=${soloPlayer2.id}`}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black/40 shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src={soloPlayer2.avatar || "/logo.jpg"}
                      alt={soloPlayer2.name || "Player 2"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-black text-xs text-[var(--text-main)] group-hover:text-[#D4AF37] transition-colors uppercase max-w-[100px] truncate">
                    {soloPlayer2.name}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="py-4 text-xs text-gray-500 font-bold uppercase">
                No active registered players for fixture
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}