"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getStoredTicker } from "../utils/tournamentStore";
import { supabase } from "./lib/supabase";
import HomeLive from "./components/home/HomeLive";

export default function Home() {
  const taglineText = "Driven by Passion. Defined by Glory.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticker, setTicker] = useState("🔥 CYBER WARRIORS SOLO CHAMPIONSHIP SEASON 1 FIXTURES ARE NOW LIVE!");
  const [mounted, setMounted] = useState(false);

  // Dynamic Cloud News State (Latest 20 published real news)
  const [cloudNews, setCloudNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);


  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    loadPublishedNewsFromDatabase();
  }, []);

  const loadPublishedNewsFromDatabase = async () => {
    try {
      setLoadingNews(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("id, title, slug, category, author_name, image_url, published_at, status")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setCloudNews(data);
      }
    } catch (err) {
      console.error("Error loading published news:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 selection:bg-[#D4AF37] selection:text-black font-sans">
      
      {/* Ticker */}
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

          <div className="h-8 flex items-center justify-center mt-2">
            <blockquote className="text-sm md:text-lg italic font-serif text-[var(--text-muted)] tracking-wide">
              "{displayText}"
              <span className="inline-block w-0.5 h-4 ml-1 bg-[#D4AF37] animate-pulse" />
            </blockquote>
          </div>

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

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

        {/* 1. HQ NEWS AUTO-SLIDESHOW SECTION */}
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

          <div className="relative w-full overflow-hidden rounded-2xl group py-2">
            {loadingNews ? (
              <div className="py-12 text-center text-xs font-mono text-[#D4AF37] animate-pulse uppercase">
                Loading Latest Cloud News...
              </div>
            ) : cloudNews.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold text-[var(--text-muted)] uppercase">
                No news articles published yet.
              </div>
            ) : (
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4">
                {[...cloudNews, ...cloudNews].map((item, idx) => {
                  const targetUrl = `/news/${item.slug}`;
                  return (
                    <a
                      key={`${item.id}-${idx}`}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-[240px] md:w-[280px] h-[160px] md:h-[180px] relative rounded-2xl overflow-hidden border-2 border-[var(--border-color)] hover:border-[#D4AF37] group/card transition-all duration-300 shadow-lg cursor-pointer bg-black/50 block"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold bg-slate-900">
                          CYBER WARRIORS
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[9px] font-extrabold text-[#D4AF37] uppercase tracking-wider mb-1">
                          {item.category}
                        </span>
                        <h3 className="font-extrabold text-xs md:text-sm text-white group-hover/card:text-[#D4AF37] transition-colors uppercase tracking-wide leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* LIVE DATA: Elite Ranking, Top Scorers, Upcoming (Supabase) */}
        <HomeLive />

      </div>
    </div>
  );
}