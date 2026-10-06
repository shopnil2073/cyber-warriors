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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cw_news_articles");
      if (stored) {
        const parsed: Article[] = JSON.parse(stored);
        setNewsList(parsed.filter((item) => item.status === "Published"));
      }
    } catch (e) {
      console.error("Error reading news articles", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-xl font-black text-[#D4AF37] uppercase tracking-wider">
          ⚡ NEWS & UPDATES
        </h1>

        {newsList.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No news published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((item) => (
              <div key={item.id} className="bg-[#121624] border border-[#23293A] rounded-xl p-4 space-y-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                )}
                <div>
                  <span className="text-[10px] font-bold text-[#D4AF37] bg-[#0B0E14] px-2 py-1 rounded border border-[#23293A]">
                    {item.category}
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-white uppercase">{item.title}</h2>
                <p className="text-xs text-gray-300 line-clamp-3">{item.content}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-[#23293A]">
                  <span>By {item.author}</span>
                  <span>{item.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}