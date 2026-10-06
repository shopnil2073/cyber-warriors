"use client";

import React, { useEffect, useState } from "react";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: "Announcement" | "Match Report" | "Top Performer" | "Tournament Update" | "Transfer";
  status: "Published" | "Draft";
  author: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    const loadNews = () => {
      try {
        const stored = localStorage.getItem("cw_news_articles");
        if (stored) {
          const parsed: Article[] = JSON.parse(stored);
          setNewsList(parsed.filter((item) => item.status === "Published"));
        } else {
          setNewsList([]);
        }
      } catch (e) {
        console.error("Error loading news articles", e);
      }
    };

    loadNews();

    // Storage change listener for instant cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cw_news_articles") {
        loadNews();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredNews =
    selectedCategory === "ALL"
      ? newsList
      : newsList.filter(
          (item) => item.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  const featuredArticle = newsList.length > 0 ? newsList[0] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Subtitle */}
        <p className="text-center text-xs font-semibold text-[var(--text-muted)]">
          টুর্নামেন্টের সর্বশেষ আপডেট, ম্যাচ রিপোর্ট, প্লেয়ার ট্রান্সফার ও অফিসিয়াল নোটিশ
        </p>

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

        {/* FEATURED ARTICLE (Top Banner) */}
        {featuredArticle && selectedCategory === "ALL" && (
          <div className="bg-[var(--bg-card)] border border-[#D4AF37]/50 rounded-2xl p-5 shadow-lg relative overflow-hidden space-y-3">
            <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block">
              ⚡ FEATURED ARTICLE
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] float-right">
              📅 {featuredArticle.createdAt}
            </span>

            {featuredArticle.imageUrl && (
              <img
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                className="w-full h-48 md:h-64 object-cover rounded-xl border border-[var(--border-color)]"
              />
            )}

            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
              {featuredArticle.title}
            </h2>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
              {featuredArticle.content}
            </p>

            <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] font-bold text-[#D4AF37]">
              <span>CATEGORY: {featuredArticle.category.toUpperCase()}</span>
              <span>AUTHOR: {featuredArticle.author}</span>
            </div>
          </div>
        )}

        {/* ALL ARTICLES LIST */}
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)] italic">
              এই ক্যাটাগরিতে এখনো কোনো খবর প্রকাশিত হয়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#D4AF37]/40 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-36 object-cover rounded-lg border border-[var(--border-color)]"
                      />
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold text-[#D4AF37] bg-[var(--bg-main)] px-2.5 py-1 rounded border border-[#D4AF37]/30 uppercase">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        📅 {item.createdAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-white uppercase line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-color)] flex justify-between items-center text-[10px] text-[var(--text-muted)] font-bold">
                    <span>By {item.author}</span>
                    <span className="text-[#D4AF37] hover:underline cursor-pointer">
                      READ MORE ›
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}