"use client";

import React, { useEffect, useState } from "react";
import { fetchNewsFromCloud, NewsItem } from "../../utils/tournamentStore";

export default function NewsPageClient() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const data = await fetchNewsFromCloud();
        const published = data.filter((item) => item.status !== "Draft");
        setNewsList(published);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  const categories = ["ALL", "ANNOUNCEMENT", "TRANSFER", "TOURNAMENT", "ACADEMY", "RULES"];

  const filteredNews = selectedCategory === "ALL" 
    ? newsList 
    : newsList.filter((item) => item.category?.toUpperCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase border border-[#D4AF37]/30 px-3 py-1 rounded-full bg-[#D4AF37]/10">
            CYBER WARRIORS HQ
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">NEWS & ANNOUNCEMENTS</span>
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-2 border-b border-[var(--border-color)] pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-black shadow-lg scale-105"
                  : "bg-[var(--bg-card)] text-gray-400 border border-[var(--border-color)] hover:text-white hover:border-[#D4AF37]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-[#D4AF37] animate-pulse">
            LOADING OFFICIAL NEWS...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold uppercase">
            No published news found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const targetUrl = `/news/${item.slug || item.id}`;
              return (
                <a
                  key={item.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 flex flex-col group shadow-xl"
                >
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold">
                        CYBER WARRIORS
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 font-mono">
                        {item.createdAt || item.date} • By {item.author || "CW ADMIN"}
                      </p>
                      <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug uppercase">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="text-xs font-black text-[#D4AF37] uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      READ FULL ARTICLE <span>→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}