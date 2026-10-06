"use client";

import React, { useState, useEffect } from "react";
import { getActiveUser } from "../utils/userStore";
import { getStoredNews, saveAllNews, NewsItem } from "../utils/tournamentStore";

export default function NewsPanel() {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("ANNOUNCEMENT");
  const [status, setStatus] = useState<string>("Published");
  const [imageUrl, setImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("CYBER WARRIORS ADMIN");

  const loadArticles = () => {
    const data = getStoredNews();
    setArticles(data);
  };

  useEffect(() => {
    const user = getActiveUser();
    if (user && user.name) {
      setAuthorName(user.name.toUpperCase());
    }

    loadArticles();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cw_news") {
        loadArticles();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill in Title and Content!");

    const formattedDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();

    let updatedList: NewsItem[] = [];

    if (editingId) {
      updatedList = articles.map((art) =>
        art.id === editingId
          ? {
              ...art,
              title,
              slug,
              content,
              category,
              status,
              imageUrl,
              updatedAt: formattedDate,
            }
          : art
      );
      alert("Article Updated Successfully!");
    } else {
      const newArticle: NewsItem = {
        id: "n_" + Date.now(),
        title,
        slug: slug || "news-" + Date.now(),
        content,
        category,
        status,
        author: authorName,
        imageUrl,
        date: formattedDate,
        createdAt: formattedDate,
        updatedAt: formattedDate,
      };
      updatedList = [newArticle, ...articles];
      alert("Article Published Successfully!");
    }

    setArticles(updatedList);
    saveAllNews(updatedList);
    resetForm();
    setActiveTab("manage");
  };

  const handleEdit = (art: NewsItem) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug || "");
    setContent(art.content);
    setCategory(art.category || "ANNOUNCEMENT");
    setStatus(art.status || "Published");
    setImageUrl(art.imageUrl || "");
    setActiveTab("add");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      const filtered = articles.filter((a) => a.id !== id);
      setArticles(filtered);
      saveAllNews(filtered);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setCategory("ANNOUNCEMENT");
    setStatus("Published");
    setImageUrl("");
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#121624] border border-[#23293A] p-4 rounded-xl shadow-md">
          <div>
            <h1 className="text-xl font-black text-[#D4AF37] uppercase tracking-wider">
              NEWS MANAGEMENT
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              AUTHOR: {authorName}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#23293A] pb-3">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("add");
            }}
            className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all cursor-pointer uppercase ${
              activeTab === "add"
                ? "bg-[#D4AF37] text-black shadow-md"
                : "bg-[#121624] text-gray-400 hover:text-white"
            }`}
          >
            {editingId ? "✏️ EDIT ARTICLE" : "➕ ADD ARTICLE"}
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all cursor-pointer uppercase ${
              activeTab === "manage"
                ? "bg-[#D4AF37] text-black shadow-md"
                : "bg-[#121624] text-gray-400 hover:text-white"
            }`}
          >
            📋 MANAGE ARTICLES ({articles.length})
          </button>
        </div>

        {/* TAB 1: ADD / EDIT */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#121624] border border-[#23293A] rounded-xl p-6 shadow-md space-y-4">
              <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">
                {editingId ? "EDIT EXISTING ARTICLE" : "CREATE NEW ARTICLE"}
              </h2>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="ENTER AN ENGAGING HEADLINE"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-sm rounded-lg text-white focus:border-[#D4AF37] outline-none uppercase font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="article-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-2.5 text-xs rounded-lg text-gray-300 font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                  Article Content
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write full news article details here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-lg text-white focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="bg-[#121624] border border-[#23293A] rounded-xl p-6 shadow-md space-y-4">
              <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">
                PUBLISH SETTINGS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-lg text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="MATCH REPORT">Match Report</option>
                    <option value="TOP PERFORMER">Top Performer</option>
                    <option value="TOURNAMENT UPDATE">Tournament Update</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#23293A] p-3 text-xs rounded-lg text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-[#0B0E14] border border-[#23293A] p-2 text-xs rounded-lg text-gray-400 file:bg-[#121624] file:border-0 file:text-[#D4AF37] file:font-bold file:px-3 file:py-1 file:rounded cursor-pointer"
                />
                {imageUrl && (
                  <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-[#D4AF37]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-extrabold text-xs py-3 rounded-lg hover:brightness-110 transition-all uppercase cursor-pointer"
              >
                🚀 {editingId ? "UPDATE ARTICLE" : "PUBLISH ARTICLE"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MANAGE */}
        {activeTab === "manage" && (
          <div className="bg-[#121624] border border-[#23293A] rounded-xl p-4 md:p-6 shadow-md overflow-x-auto">
            <h2 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
              ALL PUBLISHED ARTICLES
            </h2>

            {articles.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No news articles found. Create one from the Add Article tab.</p>
            ) : (
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#23293A] text-gray-400 font-black uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Title / Slug</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Author</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Created At</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23293A]">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#1A2035]/50 transition-all">
                      <td className="py-3 px-2 font-mono text-gray-500 text-[10px]">{art.id.slice(0, 8)}</td>
                      <td className="py-3 px-2 max-w-[200px]">
                        <p className="font-bold text-white truncate">{art.title}</p>
                        <p className="text-[10px] font-mono text-[#D4AF37] truncate">{art.slug || art.id}</p>
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-[#0B0E14] border border-[#23293A] text-[#D4AF37] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {art.category || "ANNOUNCEMENT"}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-bold text-gray-300">{art.author || "ADMIN"}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            art.status === "Draft"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {art.status || "Published"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[10px] text-gray-400">{art.date || art.createdAt}</td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(art)}
                          className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded font-bold hover:bg-[#D4AF37]/20 uppercase cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded font-bold hover:bg-red-500/20 uppercase cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}