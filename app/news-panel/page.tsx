"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type ArticleRow = {
  id: string;
  legacy_id: string | null;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author_name: string;
  status: "Draft" | "Published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type ArticleForm = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  status: "Draft" | "Published";
};

const EMPTY_FORM: ArticleForm = {
  title: "",
  slug: "",
  category: "ANNOUNCEMENT",
  excerpt: "",
  content: "",
  image_url: "",
  status: "Draft",
};

const CATEGORIES = ["ANNOUNCEMENT", "TRANSFER", "TOURNAMENT", "ACADEMY", "RULES", "TOP PERFORMER"];

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fieldClass() {
  return "w-full rounded-xl border border-[#293248] bg-[#0a0e17] px-4 py-3 text-sm text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]";
}

export default function NewsPanelPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const adminEmail = useMemo(() => user?.email || "CYBER WARRIORS ADMIN", [user]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user && mounted) {
          await verifyAdmin(data.user, () => mounted);
        }
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : "Could not check your login.");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    void loadSession();
    return () => {
      mounted = false;
    };
    // This page checks the session once on initial load. Login/logout actions update state directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadArticles() {
    setArticlesLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(`Could not load news: ${error.message}`);
      setArticles([]);
    } else {
      setArticles((data || []) as ArticleRow[]);
    }

    setArticlesLoading(false);
  }

  async function verifyAdmin(nextUser: User, isStillMounted: () => boolean = () => true) {
    const { data: adminRow, error } = await supabase
      .from("news_admins")
      .select("user_id")
      .eq("user_id", nextUser.id)
      .maybeSingle();

    if (!isStillMounted()) return;

    if (error) {
      setErrorMessage(`Could not verify admin access: ${error.message}`);
      setUser(null);
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }

    if (!adminRow) {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setArticles([]);
      setErrorMessage("This Supabase account is not on the Cyber Warriors news-admin list.");
      setAuthLoading(false);
      return;
    }

    setUser(nextUser);
    setIsAdmin(true);
    setAuthLoading(false);
    await loadArticles();
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setAuthLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword,
    });

    if (error || !data.user) {
      setAuthLoading(false);
      setErrorMessage(error?.message || "Sign-in failed.");
      return;
    }

    await verifyAdmin(data.user);
    setLoginPassword("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setArticles([]);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage("Signed out.");
    setErrorMessage("");
  }

  function updateField<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "title" && !editingId) {
      setForm((current) => ({
        ...current,
        title: value as string,
        slug: slugify(value as string),
      }));
    }
  }

  async function uploadCover(file: File): Promise<string> {
    if (!user) throw new Error("You need to sign in first.");
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Cover image must be 5 MB or smaller.");

    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
    const objectPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("news-covers").upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from("news-covers").getPublicUrl(objectPath);
    return data.publicUrl;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !isAdmin) {
      setErrorMessage("Only verified news admins can publish or edit articles.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setMessage("");

    try {
      const title = form.title.trim();
      const slug = slugify(form.slug || title);
      const content = form.content.trim();
      if (!title || !slug || !content) throw new Error("Headline, article URL, and content are required.");

      let imageUrl = form.image_url.trim() || null;
      if (coverFile) imageUrl = await uploadCover(coverFile);

      const previous = editingId ? articles.find((item) => item.id === editingId) : undefined;
      const now = new Date().toISOString();
      const row = {
        title,
        slug,
        category: form.category,
        excerpt: form.excerpt.trim(),
        content,
        image_url: imageUrl,
        author_name: user.email || "CYBER WARRIORS ADMIN",
        status: form.status,
        published_at:
          form.status === "Published" ? previous?.published_at || now : null,
        updated_at: now,
      };

      const result = editingId
        ? await supabase.from("news_articles").update(row).eq("id", editingId)
        : await supabase.from("news_articles").insert(row);

      if (result.error) throw result.error;

      setForm(EMPTY_FORM);
      setEditingId(null);
      setCoverFile(null);
      setMessage(form.status === "Published" ? "News published successfully." : "Draft saved successfully.");
      await loadArticles();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save this article.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(article: ArticleRow) {
    setEditingId(article.id);
    setCoverFile(null);
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      excerpt: article.excerpt || "",
      content: article.content,
      image_url: article.image_url || "",
      status: article.status,
    });
    setMessage("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteArticle(article: ArticleRow) {
    const confirmed = window.confirm(`Delete “${article.title}” permanently?`);
    if (!confirmed) return;

    setErrorMessage("");
    setMessage("");
    const { error } = await supabase.from("news_articles").delete().eq("id", article.id);
    if (error) {
      setErrorMessage(`Could not delete article: ${error.message}`);
      return;
    }

    if (editingId === article.id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
    setMessage("Article deleted.");
    await loadArticles();
  }

  if (authLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#0a0e17] px-4 text-sm font-bold tracking-widest text-[#D4AF37]">
        CHECKING NEWS ADMIN ACCESS...
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#0a0e17] px-4 py-10 text-white">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-5 rounded-2xl border border-[#293248] bg-[#121927] p-6 shadow-2xl md:p-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#D4AF37]">Cyber Warriors</p>
            <h1 className="mt-3 text-2xl font-black uppercase">News Admin Login</h1>
            <p className="mt-2 text-sm text-gray-400">Sign in with the Supabase Auth account assigned to a news admin.</p>
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Admin Gmail
            <input className={`${fieldClass()} mt-2`} type="email" autoComplete="username" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@gmail.com" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Password
            <input className={`${fieldClass()} mt-2`} type="password" autoComplete="current-password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Supabase Auth password" />
          </label>
          {errorMessage ? <p role="alert" className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{errorMessage}</p> : null}
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          <button className="w-full rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#e7c34b] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={authLoading}>
            {authLoading ? "VERIFYING..." : "SIGN IN"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e17] px-4 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#293248] pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Cyber Warriors H.Q.</p>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-wider md:text-3xl">News Management</h1>
            <p className="mt-1 text-xs text-gray-500">Signed in as {adminEmail}</p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-[#293248] px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Sign Out
          </button>
        </header>

        {errorMessage ? <p role="alert" className="mb-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">{errorMessage}</p> : null}
        {message ? <p role="status" className="mb-5 rounded-xl border border-emerald-900 bg-emerald-950/20 p-4 text-sm text-emerald-200">{message}</p> : null}

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
          <section className="rounded-2xl border border-[#293248] bg-[#121927] p-5 md:p-7">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#293248] pb-4">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">{editingId ? "Edit Article" : "Create Article"}</h2>
                <p className="mt-1 text-xs text-gray-500">Drafts remain hidden from public visitors.</p>
              </div>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setCoverFile(null); }} className="text-xs font-bold text-gray-400 hover:text-white">CANCEL EDIT</button> : null}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Headline
                <input className={`${fieldClass()} mt-2`} value={form.title} required maxLength={180} onChange={(e) => updateField("title", e.target.value)} placeholder="A strong news headline" />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Article URL Slug
                <input className={`${fieldClass()} mt-2`} value={form.slug} required onChange={(e) => updateField("slug", e.target.value)} placeholder="cyber-warriors-squad-update" />
                <span className="mt-1 block normal-case tracking-normal text-gray-600">Public URL: /news/{slugify(form.slug || form.title) || "article-slug"}</span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Category
                  <select className={`${fieldClass()} mt-2`} value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                    {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Status
                  <select className={`${fieldClass()} mt-2`} value={form.status} onChange={(e) => updateField("status", e.target.value as ArticleForm["status"])}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Short Introduction
                <textarea className={`${fieldClass()} mt-2 min-h-24 resize-y`} value={form.excerpt} maxLength={360} onChange={(e) => updateField("excerpt", e.target.value)} placeholder="A short summary shown on the news card." />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Article Content
                <textarea className={`${fieldClass()} mt-2 min-h-64 resize-y leading-7`} value={form.content} required onChange={(e) => updateField("content", e.target.value)} placeholder="Write the full announcement here. New lines are preserved." />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Cover Image (optional)
                <input className={`${fieldClass()} mt-2 file:mr-3 file:rounded-md file:border-0 file:bg-[#D4AF37] file:px-3 file:py-2 file:text-xs file:font-black file:text-black`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                <span className="mt-1 block normal-case tracking-normal text-gray-600">JPG, PNG, WebP or AVIF; max 5 MB. Uploading a new image replaces the URL below.</span>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Or Existing Cover Image URL
                <input className={`${fieldClass()} mt-2`} type="url" value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} placeholder="https://..." />
              </label>

              {form.image_url && !coverFile ? <img src={form.image_url} alt="Cover preview" className="max-h-56 w-full rounded-xl border border-[#293248] object-contain" /> : null}

              <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#D4AF37] px-5 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#e7c34b] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "SAVING..." : editingId ? "SAVE ARTICLE CHANGES" : form.status === "Published" ? "PUBLISH NEWS" : "SAVE DRAFT"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#293248] bg-[#121927] p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#293248] pb-4">
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-[#D4AF37]">Manage News</h2>
                <p className="mt-1 text-xs text-gray-500">{articles.length} article(s), including drafts</p>
              </div>
              <button type="button" onClick={() => void loadArticles()} className="rounded-lg border border-[#293248] px-3 py-2 text-[10px] font-black uppercase tracking-wider hover:border-[#D4AF37]">Refresh</button>
            </div>

            {articlesLoading ? <p className="py-8 text-center text-sm text-gray-500">Loading news...</p> : articles.length === 0 ? <p className="py-8 text-center text-sm text-gray-500">No articles yet. Create the first announcement.</p> : (
              <div className="space-y-3">
                {articles.map((article) => (
                  <div key={article.id} className="flex gap-3 rounded-xl border border-[#293248] bg-[#0a0e17]/70 p-3">
                    {article.image_url ? <img src={article.image_url} alt="" className="h-20 w-24 shrink-0 rounded-lg object-cover" /> : <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-[#1b2232] text-[9px] font-black text-[#D4AF37]">CW NEWS</div>}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded px-2 py-1 text-[9px] font-black uppercase ${article.status === "Published" ? "bg-emerald-950/60 text-emerald-300" : "bg-amber-950/60 text-amber-300"}`}>{article.status}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{article.category}</span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-snug">{article.title}</h3>
                      <p className="mt-1 truncate text-[10px] text-gray-600">/news/{article.slug}</p>
                      <div className="mt-3 flex gap-3">
                        <button type="button" onClick={() => startEdit(article)} className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] hover:text-white">Edit</button>
                        <button type="button" onClick={() => void deleteArticle(article)} className="text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300">Delete</button>
                        {article.status === "Published" ? <a href={`/news/${encodeURIComponent(article.slug)}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white">View</a> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
