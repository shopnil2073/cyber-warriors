"use client";

import React, { useEffect, useState } from "react";
import { fetchNewsFromCloud, getStoredNews, NewsItem } from "../utils/tournamentStore";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const loadNewsData = async () => {
    const localNews = getStoredNews();
    const publishedLocal = localNews.filter((item) => !item.status || item.status === "Published");
    if (publishedLocal.length > 0) {
      setNewsList(publishedLocal);
      setLoading(false);
    }

    const cloudNews = await fetchNewsFromCloud();
    const publishedCloud = cloudNews.filter((item) => !item.status || item.status === "Published");
    setNewsList(publishedCloud);
    setLoading(false);
  };

  useEffect(() => {
    loadNewsData();
  }, []);

  const filteredNews =
    selectedCategory === "ALL"
      ? newsList
      : newsList.filter(
          (item) => (item.category || "").toUpperCase().trim() === selectedCategory.toUpperCase().trim()
        );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            CYBER WARRIORS OFFICIAL PRESS & NEWS
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            NEWS & ANNOUNCEMENTS
          </h1>
          <p className="text-xs font-semibold text-[var(--text-muted)]">
            টুর্নামেন্টের সর্বশেষ আপডেট, ম্যাচ রিপোর্ট, প্লেয়ার ট্রান্সফার ও অফিসিয়াল নোটিশ
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            "ALL",
            "ANNOUNCEMENT",
            "MATCH REPORT",
            "TOP PERFORMER",
            "TOURNAMENT UPDATE",
            "TRANSFER",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-extrabold px-4 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer uppercase ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ALL ARTICLES LIST */}
        <div className="space-y-4">
          {loading && newsList.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-[#D4AF37] animate-pulse">
              LOADING LATEST NEWS FROM GLOBAL SERVER...
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)] italic">
              এই ক্যাটাগরিতে এখনো কোনো খবর প্রকাশিত হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNews.map((item) => {
                const cleanSlug = item.slug || item.id;
                // Clean link format: https://www.cyber-warriors.xyz/news/slug-name
                const targetUrl = `/news/${cleanSlug}`;

                return (
                  <div
                    key={item.id}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/50 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between group shadow-md"
                  >
                    <div className="space-y-2">
                      {item.imageUrl && (
                        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-36 object-cover rounded-lg border border-[var(--border-color)] group-hover:scale-[1.01] transition-all cursor-pointer"
                          />
                        </a>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold text-[#D4AF37] bg-[var(--bg-main)] px-2.5 py-1 rounded border border-[#D4AF37]/30 uppercase">
                          {item.category || "ANNOUNCEMENT"}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          📅 {item.date || item.createdAt}
                        </span>
                      </div>

                      <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                        <h3 className="text-sm font-extrabold text-white uppercase line-clamp-2 group-hover:text-[#D4AF37] transition-all cursor-pointer">
                          {item.title}
                        </h3>
                      </a>

                      <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] text-[var(--text-muted)] font-bold">
                      <span>By {item.author || "ADMIN"}</span>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D4AF37] hover:underline font-black cursor-pointer"
                      >
                        READ FULL NOTICE ›
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}