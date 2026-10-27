'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchNewsFromCloud,
  saveNews,
  deleteNewsFromCloud,
  NewsItem,
} from '../../utils/tournamentStore';
import { getActiveUser } from '../../utils/userStore';

export default function NewsPanel() {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ANNOUNCEMENT');
  const [status, setStatus] = useState('Published');
  const [image, setImage] = useState('');

  const activeUser = getActiveUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const cloudData = await fetchNewsFromCloud();
    setArticles(cloudData);
    setLoading(false);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out Headline and Content!');
      return;
    }

    setSaving(true);
    const newArticle: NewsItem = {
      id: editingId || `art_${Date.now()}`,
      title,
      slug: slug || `news-${Date.now()}`,
      content,
      category,
      status,
      imageUrl: image,
      author: activeUser?.name || 'SIAM HOSSAIN',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      updatedAt: new Date().toISOString(),
    };

    await saveNews(newArticle);
    await loadData();

    // Reset Form
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setImage('');
    setCategory('ANNOUNCEMENT');
    setStatus('Published');
    setSaving(false);

    alert('Article Published & Synced Globally!');
    setActiveTab('manage');
  };

  const handleEdit = (art: NewsItem) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug || '');
    setContent(art.content);
    setCategory(art.category);
    setStatus(art.status || 'Published');
    setImage(art.imageUrl || '');
    setActiveTab('add');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article globally?')) {
      setSaving(true);
      await deleteNewsFromCloud(id);
      await loadData();
      setSaving(false);
      alert('Article deleted globally!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#1f293d] pb-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-wider uppercase">
              NEWS MANAGEMENT
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              AUTHOR: {activeUser?.name || 'SIAM HOSSAIN'}
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-5 py-2.5 text-xs font-bold uppercase rounded-lg border transition-all ${
              activeTab === 'add'
                ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/20'
                : 'bg-[#121927] text-gray-400 border-[#1f293d] hover:text-white'
            }`}
          >
            + ADD ARTICLE
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-5 py-2.5 text-xs font-bold uppercase rounded-lg border transition-all ${
              activeTab === 'manage'
                ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/20'
                : 'bg-[#121927] text-gray-400 border-[#1f293d] hover:text-white'
            }`}
          >
            📋 MANAGE ARTICLES ({articles.length})
          </button>
        </div>

        {/* Tab 1: Create/Edit Article */}
        {activeTab === 'add' && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#121927] border border-[#1f293d] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-[#1f293d] pb-2">
              {editingId ? 'EDIT ARTICLE' : 'CREATE NEW ARTICLE'}
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                HEADLINE / TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="ENTER AN ENGAGING HEADLINE"
                className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                URL SLUG
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                ARTICLE CONTENT
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write full news article details here..."
                className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="MATCH REPORT">Match Report</option>
                  <option value="TOP PERFORMER">Top Performer</option>
                  <option value="TOURNAMENT UPDATE">Tournament Update</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                FEATURED IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-[#0a0e17] border border-[#1f293d] rounded-xl p-2 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400"
              />
              {image && (
                <div className="mt-4 w-40 h-24 border border-slate-700 rounded-lg overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? 'SYNCING TO CLOUD...' : '🚀 PUBLISH TO ALL VISITORS'}
            </button>
          </form>
        )}

        {/* Tab 2: Manage Articles */}
        {activeTab === 'manage' && (
          <div className="bg-[#121927] border border-[#1f293d] rounded-2xl p-6 md:p-8 shadow-2xl overflow-x-auto">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
              ALL PUBLISHED ARTICLES
            </h2>

            {loading ? (
              <p className="text-amber-400 text-sm font-mono animate-pulse">
                Fetching cloud database...
              </p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No news articles found in Cloud DB. Create one from the Add Article tab.
              </p>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1f293d] text-gray-400 uppercase font-mono">
                    <th className="py-3 px-2">ID / SLUG</th>
                    <th className="py-3 px-2">TITLE</th>
                    <th className="py-3 px-2">CATEGORY</th>
                    <th className="py-3 px-2">AUTHOR</th>
                    <th className="py-3 px-2">STATUS</th>
                    <th className="py-3 px-2">CREATED AT</th>
                    <th className="py-3 px-2 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f293d]">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#0a0e17]/50">
                      <td className="py-3 px-2 font-mono text-gray-400">{art.id}</td>
                      <td className="py-3 px-2 font-bold text-white max-w-xs truncate">
                        {art.title}
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded font-bold uppercase border border-amber-500/20">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-300">{art.author || 'ADMIN'}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded font-bold uppercase ${
                            art.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}
                        >
                          {art.status || 'Published'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-400 font-mono">{art.createdAt}</td>
                      <td className="py-3 px-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(art)}
                          className="px-3 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black font-bold rounded transition-all"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded transition-all"
                        >
                          DELETE
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