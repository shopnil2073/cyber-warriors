"use client";

import React, { useState, useEffect } from "react";
import { getStoredNews, NewsArticle } from "../utils/tournamentStore";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    setNewsList(getStoredNews());
  }, []);

  const categories = [
    "ALL",
    "ANNOUNCEMENT",
    "MATCH REPORT",
    "TOP PERFORMER",
    "TOURNAMENT UPDATE",
    "TRANSFER",
  ];

  const filteredNews =
    selectedCategory === "ALL"
      ? newsList
      : newsList.filter((n) => n.category.toUpperCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 pb-24">
      
      {/* Top Banner Header */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] py-6 px-4 shadow-lg text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black tracking-widest uppercase">
          CYBER WARRIORS OFFICIAL PRESS & NEWS
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider">
          NEWS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          টুর্নামেন্টের সবশেষ আপডেট, ম্যাচ রিপোর্ট, প্লেয়ার ট্রান্সফার ও অফিসিয়াল নোটিশ
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Category Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all rounded-xl border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured News / Latest Article Highlight */}
        {filteredNews.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-2 border-[#D4AF37] rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black">
              <span className="bg-[#D4AF37] text-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                🔥 FEATURED ARTICLE
              </span>
              <span className="text-[var(--text-muted)]">📅 {filteredNews[0].date}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
              {filteredNews[0].title}
            </h2>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {filteredNews[0].content}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37] font-bold">
              <span>CATEGORY: {filteredNews[0].category}</span>
            </div>
          </div>
        )}

        {/* News Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#D4AF37]/50 transition-all shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {news.category}
                    </span>
                    <span className="text-[var(--text-muted)]">📅 {news.date}</span>
                  </div>

                  <h3 className="text-base font-black text-white uppercase tracking-wide line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                    {news.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center text-xs font-bold text-[#D4AF37]">
                  <span>READ FULL NOTICE</span>
                  <span>→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
              এই ক্যাটাগরিতে এখনো কোনো নিউজ পাবলিশ করা হয়নি!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}