"use client";

import React, { useState, useEffect } from "react";
import CardCreatorTab from "../components/admin/CardCreatorTab";
import { fetchNewsFromCloud, saveNewsToCloud, deleteNewsFromCloud, NewsItem } from "../../utils/tournamentStore";

const ADMIN_PASSWORD = "cyber123";
const AUTH_KEY = "cw_admin_auth_timestamp";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export default function AdminConsole() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"card" | "match" | "news">("news");

  // News Panel Internal State
  const [subTab, setSubTab] = useState<"CREATE" | "MANAGE">("CREATE");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("ANNOUNCEMENT");
  const [author, setAuthor] = useState("CW ADMIN");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const savedTimestamp = localStorage.getItem(AUTH_KEY);
    if (savedTimestamp) {
      const loginTime = parseInt(savedTimestamp, 10);
      if (new Date().getTime() - loginTime < TWENTY_FOUR_HOURS) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNews();
    }
  }, [isAuthenticated]);

  const loadNews = async () => {
    setLoadingNews(true);
    const data = await fetchNewsFromCloud();
    setNewsList(data);
    setLoadingNews(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, new Date().getTime().toString());
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("❌ ভুল পাসওয়ার্ড!");
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in required fields!");
      return;
    }

    setIsPublishing(true);
    const currentDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newArticle: NewsItem = {
      id: Date.now().toString(),
      title,
      slug: slug || generateSlug(title),
      category,
      author,
      imageUrl,
      content,
      status: "Published",
      date: currentDate,
      createdAt: currentDate,
    };

    const updated = [newArticle, ...newsList];
    const success = await saveNewsToCloud(updated);

    if (success) {
      setNewsList(updated);
      setTitle("");
      setSlug("");
      setImageUrl("");
      setContent("");
      alert("🚀 News article successfully published to all devices!");
      setSubTab("MANAGE");
    } else {
      alert("Failed to publish news.");
    }
    setIsPublishing(false);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const success = await deleteNewsFromCloud(id);
    if (success) {
      setNewsList((prev) => prev.filter((item) => item.id !== id));
      alert("Article deleted!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center p-4">
        <div className="bg-[#121624] border border-[#D4AF37]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
          <div className="text-center space-y-1">
            <span className="text-3xl">👑</span>
            <h1 className="text-lg font-black text-[#D4AF37]">CYBER WARRIORS ADMIN</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-xl text-center text-white outline-none focus:border-[#D4AF37]"
            />
            {loginError && <p className="text-xs text-red-400 text-center font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-xl uppercase">
              UNLOCK CONSOLE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 pb-24 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex justify-between items-center shadow-xl">
          <h1 className="text-lg font-black text-[#D4AF37] uppercase">📟 ADMIN COMMAND CENTER</h1>
          <button
            onClick={() => {
              localStorage.removeItem(AUTH_KEY);
              setIsAuthenticated(false);
            }}
            className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            LOGOUT
          </button>
        </div>

        {/* TOP TABS */}
        <div className="flex overflow-x-auto gap-2 border-b border-[var(--border-color)] pb-3 scrollbar-none">
          {[
            { id: "card", label: "🎨 CARD CREATOR" },
            { id: "match", label: "📋 MATCHDAY HQ" },
            { id: "news", label: "✍️ NEWS PANEL" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-black px-5 py-2.5 rounded-xl uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4AF37] text-black shadow-lg"
                  : "bg-[var(--bg-card)] text-gray-400 border border-[var(--border-color)] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "card" && <CardCreatorTab />}

        {activeTab === "match" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center text-gray-400 font-bold uppercase">
            MATCHDAY HQ MODULE ACTIVE
          </div>
        )}

        {activeTab === "news" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6 shadow-xl">
            {/* SUB TABS */}
            <div className="flex gap-3 border-b border-[var(--border-color)] pb-4">
              <button
                onClick={() => setSubTab("CREATE")}
                className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                  subTab === "CREATE" ? "bg-[#D4AF37] text-black" : "bg-[var(--bg-main)] text-gray-400 hover:text-white"
                }`}
              >
                + ADD ARTICLE
              </button>
              <button
                onClick={() => setSubTab("MANAGE")}
                className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                  subTab === "MANAGE" ? "bg-[#D4AF37] text-black" : "bg-[var(--bg-main)] text-gray-400 hover:text-white"
                }`}
              >
                MANAGE ARTICLES ({newsList.length})
              </button>
            </div>

            {/* CREATE NEWS FORM */}
            {subTab === "CREATE" && (
              <form onSubmit={handleSubmitNews} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">ARTICLE TITLE *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="e.g. CYBER WARRIORS SEASON 1 ANNOUNCED"
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">URL SLUG (AUTO)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="cyber-warriors-season-1-announced"
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-gray-400 font-mono focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    >
                      <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                      <option value="TRANSFER">TRANSFER</option>
                      <option value="TOURNAMENT">TOURNAMENT</option>
                      <option value="ACADEMY">ACADEMY</option>
                      <option value="RULES">RULES</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">AUTHOR</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">IMAGE URL (OPTIONAL)</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://i.ibb.co/... or /logo.jpg"
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">ARTICLE CONTENT *</label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write detailed news announcement here..."
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black text-sm uppercase rounded-xl shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-50"
                >
                  {isPublishing ? "PUBLISHING TO CLOUD..." : "🚀 PUBLISH TO ALL VISITORS"}
                </button>
              </form>
            )}

            {/* MANAGE ARTICLES */}
            {subTab === "MANAGE" && (
              <div className="space-y-3">
                {loadingNews ? (
                  <p className="text-xs text-[#D4AF37] animate-pulse">Loading Articles...</p>
                ) : newsList.length === 0 ? (
                  <p className="text-xs text-gray-400">No news articles published yet.</p>
                ) : (
                  newsList.map((item) => (
                    <div key={item.id} className="bg-[var(--bg-main)] border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1 uppercase">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">{item.date} • Slug: /{item.slug}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all shrink-0"
                      >
                        DELETE
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}