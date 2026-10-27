"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchNewsFromCloud, NewsItem } from "../../../utils/tournamentStore";

export default function SingleNewsClient() {
  const params = useParams();
  
  // [[...slug]] catch-all param handling
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (slug) {
        const allNews = await fetchNewsFromCloud();
        const found = allNews.find(
          (n) => n.slug === slug || n.id === slug || decodeURIComponent(slug) === n.slug
        );
        if (found) setArticle(found);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center">
        <p className="text-[#D4AF37] animate-pulse font-mono">Loading Official News...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 uppercase">Article Not Found</h1>
        <p className="text-gray-400 mt-2 text-sm">
          The news article you are looking for does not exist or has been removed.
        </p>
        <a
          href="/news"
          className="mt-6 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-2 rounded-xl hover:bg-[#D4AF37]/10 transition-colors uppercase"
        >
          ← Back to All News
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-200 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-[#121927] border border-[#1f293d] rounded-2xl overflow-hidden shadow-2xl p-6 md:p-10">
        
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="bg-[#D4AF37] text-black text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {article.createdAt || article.date}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            • By {article.author || "CW ADMIN"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-6 leading-tight uppercase">
          {article.title}
        </h1>

        {/* Image */}
        {article.imageUrl && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 border border-[#1f293d]">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {article.content}
        </div>
      </div>
    </div>
  );
}