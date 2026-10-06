"use client";

import React, { useState } from "react";
import { saveNews } from "../../utils/tournamentStore";

export default function PostNewsTab() {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory] = useState("ANNOUNCEMENT");
  const [newsContent, setNewsContent] = useState("");

  const handlePostNews = (e: React.FormEvent) => {
    e.preventDefault();
    saveNews({
      id: "n_" + Date.now(),
      title: newsTitle,
      category: newsCategory,
      content: newsContent,
      date: new Date()
        .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase(),
    });
    alert("News Published to Website!");
    setNewsTitle("");
    setNewsContent("");
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
      <h2 className="text-sm font-bold text-[#D4AF37] uppercase mb-4">POST ANNOUNCEMENT / NEWS</h2>
      <form onSubmit={handlePostNews} className="space-y-4">
        <input
          type="text"
          required
          placeholder="News Title"
          value={newsTitle}
          onChange={(e) => setNewsTitle(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        />
        <textarea
          rows={3}
          required
          placeholder="News Article Details..."
          value={newsContent}
          onChange={(e) => setNewsContent(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2 text-xs rounded text-white"
        />
        <button
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-bold text-xs py-2 rounded cursor-pointer uppercase"
        >
          PUBLISH NEWS
        </button>
      </form>
    </div>
  );
}