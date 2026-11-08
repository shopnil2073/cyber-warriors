"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function NewsPanelPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("ANNOUNCEMENT");
  const [authorName, setAuthorName] = useState("CW ADMIN");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("news_articles").insert([
      {
        title,
        slug: slug || `article-${Date.now()}`,
        category,
        author_name: authorName,
        image_url: imageUrl || null,
        excerpt: content.slice(0, 150),
        content,
        status: "Published",
        published_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      setMessage(`Failed to publish: ${error.message}`);
    } else {
      setMessage("News article published successfully!");
      setTitle("");
      setSlug("");
      setContent("");
      setImageUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#1f293d] bg-[#121927] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-[#1f293d] pb-4">
          <h1 className="text-xl font-black uppercase text-[#D4AF37]">
            ✍️ CW News Editor Panel
          </h1>
          <Link
            href="/news"
            className="text-xs font-bold text-[#D4AF37] hover:underline"
          >
            View News &rarr;
          </Link>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-xs font-bold ${
              message.includes("successfully")
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. CYBER WARRIORS SEASON 1 ANNOUNCED"
              className="w-full rounded-lg border border-[#1f293d] bg-[#0a0e17] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#1f293d] bg-[#0a0e17] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                <option value="MATCH REPORT">MATCH REPORT</option>
                <option value="TOP PERFORMER">TOP PERFORMER</option>
                <option value="TOURNAMENT UPDATE">TOURNAMENT UPDATE</option>
                <option value="TRANSFER">TRANSFER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-lg border border-[#1f293d] bg-[#0a0e17] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://i.ibb.co/.../image.png"
              className="w-full rounded-lg border border-[#1f293d] bg-[#0a0e17] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Article Content *
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed news announcement here..."
              className="w-full rounded-lg border border-[#1f293d] bg-[#0a0e17] p-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#D4AF37] py-3 text-sm font-black uppercase text-black hover:bg-[#b8952b] transition disabled:opacity-50"
          >
            {loading ? "Publishing to Cloud..." : "Publish News Article"}
          </button>
        </form>
      </div>
    </div>
  );
}