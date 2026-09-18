"use client";

import React, { useState } from "react";
import { saveNews } from "../../utils/tournamentStore";

export default function NewsManagement() {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Announcement");
  const [status, setStatus] = useState("Published");

  const categories = [
    "Announcement",
    "Match Report",
    "Top Performer",
    "Tournament Update",
    "Transfer",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill title and details!");

    saveNews({
      id: "news_" + Date.now(),
      title,
      category,
      content,
      date: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase(),
    });

    alert("Article Published Successfully!");
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#1E2330] pb-4">
          <h1 className="text-xl font-black text-white uppercase tracking-wider">
            NEWS MANAGEMENT
          </h1>
          <div className="bg-[#131722] border border-[#D4AF37]/40 px-3 py-1 rounded-lg text-[10px] font-bold text-[#D4AF37]">
            👤 ATIQ UZZAMAN HRIDOY
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 gap-2 bg-[#131722] p-1 rounded-xl border border-[#1E2330]">
          <button
            onClick={() => setActiveTab("add")}
            className={`py-2 rounded-lg text-xs font-black uppercase transition-all ${
              activeTab === "add" ? "bg-[#D4AF37] text-black" : "text-gray-400"
            }`}
          >
            ADD/EDIT ARTICLE
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`py-2 rounded-lg text-xs font-black uppercase transition-all ${
              activeTab === "manage" ? "bg-[#D4AF37] text-black" : "text-gray-400"
            }`}
          >
            MANAGE ARTICLES
          </button>
        </div>

        {/* Form Container */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#131722] border border-[#1E2330] rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-black text-gray-300 uppercase tracking-wider">
                CREATE NEW ARTICLE
              </h2>

              {/* Headline Input */}
              <input
                type="text"
                placeholder="ENTER AN ENGAGING HEADLINE"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />

              {/* Textarea */}
              <textarea
                rows={5}
                placeholder="Write your article description here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* PUBLISH SETTINGS */}
            <div className="bg-[#131722] border border-[#1E2330] rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider">
                PUBLISH SETTINGS
              </h3>

              {/* Category Selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#1E2330] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">
                  FEATURED IMAGE
                </label>
                <input
                  type="file"
                  className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1E2330] file:text-white hover:file:bg-[#D4AF37] hover:file:text-black cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-black text-xs py-3 rounded-lg hover:opacity-90 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                🚀 PUBLISH ARTICLE
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}