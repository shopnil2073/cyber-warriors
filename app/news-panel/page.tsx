"use client";

import { useCallback, useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  NEWS_COLUMNS,
  formatDate,
  slugify,
  type NewsArticle,
  type NewsStatus,
} from "../lib/newsUtils";

const CUSTOM_CATEGORIES = [
  "Player Achievements",
  "Club Achievements",
  "Announcement",
  "Tournament Update",
  "Funny",
];

type FormState = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  author_name: string;
  image_url: string;
  excerpt: string;
  content: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  category: CUSTOM_CATEGORIES[0],
  author_name: "",
  image_url: "",
  excerpt: "",
  content: "",
};

const SUPER_ADMIN_EMAIL = "shopnilhossainhim@gmail.com";
const ALLOWED_ADMIN_EMAILS = [
  "razibulislamhridoy@gmail.com",
  "samiaakter2073@gmail.com",
  "hmmamun2010@gmail.com",
  "tanjimuddin1437@gmail.com",
  "mdharunanwer@gmail.com",
  "akasharsenal14@gmail.com",
  "samiulakter2075@gmail.com",
];

const inputCls =
  "w-full rounded-xl border border-zinc-700/50 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";
const btnCls =
  "rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white disabled:opacity-50";
const btnPrimaryCls =
  "rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-amber-500/10";

export default function NewsPanelPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [customExcerpt, setCustomExcerpt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from("news_articles")
      .select(NEWS_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) {
      setMsg({ type: "err", text: `News load hoyni: ${error.message}` });
      return;
    }
    setArticles((data ?? []) as NewsArticle[]);
  }, []);

  const checkAdminAccess = useCallback(
    async (s: Session | null) => {
      let email = s?.user?.email;

      if (!email) {
        const cachedUser = localStorage.getItem("cw_active_user");
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            if (parsed && parsed.email) {
              email = parsed.email;
            }
          } catch (e) {}
        }
      }

      if (!email) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const isAllowed =
        cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() ||
        ALLOWED_ADMIN_EMAILS.includes(cleanEmail);

      setIsAdmin(isAllowed);

      if (isAllowed) {
        await loadArticles();
      }
      setChecking(false);
    },
    [loadArticles]
  );

  useEffect(() => {
    const cachedUser = localStorage.getItem("cw_active_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        if (parsed && parsed.email) {
          const clean = parsed.email.toLowerCase().trim();
          if (clean === SUPER_ADMIN_EMAIL.toLowerCase() || ALLOWED_ADMIN_EMAILS.includes(clean)) {
            setIsAdmin(true);
            setChecking(false);
            loadArticles();
          }
        }
      } catch (e) {}
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      void checkAdminAccess(s);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      void checkAdminAccess(s);
    });
    return () => data.subscription.unsubscribe();
  }, [checkAdminAccess, loadArticles]);

  async function signOut() {
    localStorage.removeItem("cw_active_user");
    await supabase.auth.signOut();
    setArticles([]);
    setForm(EMPTY_FORM);
    window.location.href = "/";
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched || f.id ? f.slug : value ? slugify(value) : "",
    }));
  }

  function onContentChange(value: string) {
    setForm((f) => {
      let updatedExcerpt = f.excerpt;
      if (!customExcerpt) {
        const lines = value.split("\n").filter((l) => l.trim().length > 0);
        updatedExcerpt = lines.slice(0, 2).join(" ");
      }
      return { ...f, content: value, excerpt: updatedExcerpt };
    });
  }

  async function uploadImages(files: FileList) {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setMsg({ type: "err", text: "Shudhu image file gulo select koro." });
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setMsg({ type: "err", text: "Protiti image 3MB er choto hote hobe." });
        return;
      }
    }

    setBusy(true);
    let firstUploadedUrl = form.image_url;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      
      const { error } = await supabase.storage
        .from("news-images")
        .upload(path, file, { contentType: file.type, cacheControl: "31536000" });

      if (error) {
        setMsg({ type: "err", text: `Upload failed: ${error.message}` });
        setBusy(false);
        return;
      } else {
        const { data } = supabase.storage.from("news-images").getPublicUrl(path);
        if (i === 0 && !firstUploadedUrl) {
          firstUploadedUrl = data.publicUrl;
        }
      }
    }

    setField("image_url", firstUploadedUrl);
    setMsg({ type: "ok", text: `${fileArray.length}ti image safollovabe upload hoyeche!` });
    setBusy(false);
  }

  async function save(status: NewsStatus) {
    setMsg(null);
    if (!form.title.trim() || !form.content.trim()) {
      setMsg({ type: "err", text: "Title ar content dite hobe." });
      return;
    }
    const slug = slugify(form.slug.trim() || form.title);
    const payload = {
      title: form.title.trim(),
      slug,
      category: form.category,
      author_name: form.author_name.trim() || "Cyber Warriors Admin",
      image_url: form.image_url.trim() || null,
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      status,
    };

    setBusy(true);
    const { error } = form.id
      ? await supabase.from("news_articles").update(payload).eq("id", form.id)
      : await supabase.from("news_articles").insert(payload);
    setBusy(false);

    if (error) {
      setMsg({
        type: "err",
        text:
          error.code === "23505"
            ? "Ei slug age theke ache. Onno ekta slug dao."
            : `Save hoyni: ${error.message}`,
      });
      return;
    }
    setMsg({ type: "ok", text: status === "published" ? "News successfully published!" : "Draft saved successfully!" });
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setCustomExcerpt(false);
    await loadArticles();
  }

  function startEdit(a: NewsArticle) {
    setForm({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      author_name: a.author_name,
      image_url: a.image_url ?? "",
      excerpt: a.excerpt ?? "",
      content: a.content,
    });
    setSlugTouched(true);
    setCustomExcerpt(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleStatus(a: NewsArticle) {
    const next: NewsStatus = a.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("news_articles").update({ status: next }).eq("id", a.id);
    if (error) setMsg({ type: "err", text: error.message });
    else await loadArticles();
  }

  async function remove(a: NewsArticle) {
    if (!window.confirm(`"${a.title}" delete korbe?`)) return;
    const { error } = await supabase.from("news_articles").delete().eq("id", a.id);
    if (error) setMsg({ type: "err", text: error.message });
    else await loadArticles();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="animate-pulse text-lg font-medium">Loading panel...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-900 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-3 text-sm text-zinc-400">
            You do not have permission to access the News Panel.
          </p>
          <Link href="/" className={`${btnPrimaryCls} mt-6 block text-center`}>
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        {/* Top Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Cyber Warriors News Console</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage club updates, match logs and announcements</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              Admin Access Active
            </span>
            <button className={btnCls} onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              msg.type === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* News Editor Section */}
        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold text-amber-400">
              {form.id ? "✏️ Edit News Article" : "✨ Create New Article"}
            </h2>
            {form.id && (
              <button
                className="text-xs font-semibold text-zinc-400 hover:text-white"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setSlugTouched(false);
                  setCustomExcerpt(false);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">News Title</label>
            <input
              className={inputCls}
              placeholder="Enter eye-catching headline..."
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">URL Slug</label>
              <input
                className={inputCls}
                placeholder="news-slug-url"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField("slug", e.target.value);
                }}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {CUSTOM_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-white capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Author Name</label>
              <input
                className={inputCls}
                placeholder="Admin Name ex. Siam Hossain"
                value={form.author_name}
                onChange={(e) => setField("author_name", e.target.value)}
              />
            </div>
          </div>

          {/* Multiple Image Uploader */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Cover Images (Select multiple files, 1st image will be default thumbnail)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-800/50 px-6 py-4 text-sm font-medium text-zinc-300 transition hover:border-amber-500 hover:bg-zinc-800 w-full">
                <span>📁 Click to choose multiple images from device</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      void uploadImages(e.target.files);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {form.image_url && (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Thumbnail preview" className="h-20 w-32 rounded-lg object-cover border border-zinc-700" />
                <div>
                  <p className="text-xs font-semibold text-emerald-400">Thumbnail Preview (1st Image)</p>
                  <p className="text-xs text-zinc-400 truncate max-w-md mt-1">{form.image_url}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Short Summary (Auto-generated from content) - Eta pic er niche show korbe
              </label>
              <button
                type="button"
                className="text-xs text-amber-400 hover:underline"
                onClick={() => setCustomExcerpt(!customExcerpt)}
              >
                {customExcerpt ? "Auto-sync with content" : "Edit manually"}
              </button>
            </div>
            <textarea
              className={`${inputCls} ${!customExcerpt ? "opacity-75 cursor-not-allowed" : ""}`}
              rows={2}
              readOnly={!customExcerpt}
              placeholder="First 2 lines will appear here automatically..."
              value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Content</label>
            <textarea
              className={inputCls}
              rows={10}
              placeholder="Write your full news content here..."
              value={form.content}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className={btnPrimaryCls} disabled={busy} onClick={() => save("published")}>
              {busy ? "Processing..." : "🚀 Publish News"}
            </button>
            <button className={btnCls} disabled={busy} onClick={() => save("draft")}>
              Save as Draft
            </button>
            {form.id && (
              <button
                className={btnCls}
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setSlugTouched(false);
                  setCustomExcerpt(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </section>

        {/* Existing Articles List */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-white">All Published & Draft Articles ({articles.length})</h2>
          {articles.length === 0 ? (
            <p className="text-sm text-zinc-500">Ekhono kono news create করা হয়নি।</p>
          ) : (
            <div className="space-y-3">
              {articles.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between backdrop-blur-sm transition hover:border-zinc-700"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${a.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <h3 className="truncate font-semibold text-white">{a.title}</h3>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="uppercase tracking-wider font-semibold text-amber-500/90">{a.category}</span>
                      <span>•</span>
                      <span>By {a.author_name}</span>
                      <span>•</span>
                      <span>/news/{a.slug}</span>
                      {a.published_at && <span>• {formatDate(a.published_at)}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {a.status === "published" && (
                      <Link
                        href={`/news/${a.slug}` as Route}
                        target="_blank"
                        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                      >
                        View Live
                      </Link>
                    )}
                    <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700" onClick={() => startEdit(a)}>
                      Edit
                    </button>
                    <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700" onClick={() => toggleStatus(a)}>
                      {a.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20" onClick={() => remove(a)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}