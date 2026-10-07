"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchNewsFromCloud, getStoredNews, NewsItem } from "../../utils/tournamentStore";

export default function ArticleClient() {
  const params = useParams();
  const slugOrId = params?.id as string;
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slugOrId) {
        setLoading(false);
        return;
      }

      const localNews = getStoredNews();
      let found = localNews.find(
        (item) => item.slug === slugOrId || item.id === slugOrId
      );

      if (found) {
        setArticle(found);
        setLoading(false);
      }

      const cloudNews = await fetchNewsFromCloud();
      const cloudFound = cloudNews.find(
        (item) => item.slug === slugOrId || item.id === slugOrId
      );

      if (cloudFound) {
        setArticle(cloudFound);
      }
      setLoading(false);
    };

    loadArticle();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-white flex items-center justify-center p-4 font-sans">
        <p className="text-xs font-mono text-[#D4AF37] animate-pulse">
          LOADING ARTICLE DETAILS FROM GLOBAL CLOUD...
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-white flex flex-col items-center justify-center p-4 space-y-4 font-sans">
        <div className="text-4xl">📰</div>
        <h1 className="text-base font-black text-[#D4AF37] uppercase tracking-wider">
          ARTICLE NOT FOUND
        </h1>
        <p className="text-xs text-[var(--text-muted)] italic">
          Requested news article does not exist or has been removed.
        </p>
        <Link
          href="/news"
          className="bg-[#D4AF37] text-black font-extrabold text-xs px-4 py-2 rounded-lg hover:brightness-110 transition-all uppercase"
        >
          ‹ BACK TO ALL NEWS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase"
        >
          ‹ BACK TO NEWS & ANNOUNCEMENTS
        </Link>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 md:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-[var(--border-color)]">
            <span className="text-[10px] font-extrabold text-[#D4AF37] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[#D4AF37]/30 uppercase tracking-widest">
              {article.category || "ANNOUNCEMENT"}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              📅 {article.date || article.createdAt}
            </span>
          </div>

          <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider leading-snug">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold">
            <span>BY {article.author || "CYBER WARRIORS ADMIN"}</span>
          </div>

          {article.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[var(--border-color)] max-h-96">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-xs md:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-normal space-y-4 pt-2">
            {article.content}
          </div>

        </div>

      </div>
    </div>
  );
}