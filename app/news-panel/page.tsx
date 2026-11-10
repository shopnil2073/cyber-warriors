"use client";

import { useCallback, useEffect, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  NEWS_CATEGORIES,
  NEWS_COLUMNS,
  formatDate,
  slugify,
  type NewsArticle,
  type NewsStatus,
} from "../lib/newsUtils";

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
  category: NEWS_CATEGORIES[0],
  author_name: "CW Admin",
  image_url: "",
  excerpt: "",
  content: "",
};

const inputCls =
  "w-full rounded-lg border border-black/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/60 dark:border-white/20 dark:focus:border-white/60";
const btnCls =
  "rounded-lg border border-black/20 px-4 py-2 text-sm font-medium transition hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10";
const btnPrimaryCls =
  "rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-black";

export default function NewsPanelPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
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

  const verifyAdmin = useCallback(
    async (s: Session | null) => {
      if (!s) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from("news_admins")
        .select("user_id")
        .eq("user_id", s.user.id)
        .maybeSingle();
      const ok = !!data;
      setIsAdmin(ok);
      if (ok) await loadArticles();
      setChecking(false);
    },
    [loadArticles]
  );

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // callback er bhitore sorasori await na kore alada kore chalano nirapod
      setTimeout(() => {
        void verifyAdmin(s);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [verifyAdmin]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setArticles([]);
    setForm(EMPTY_FORM);
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

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "err", text: "Shudhu image file dao." });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMsg({ type: "err", text: "Image 3MB er choto hote hobe." });
      return;
    }
    setBusy(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("news-images")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) {
      setMsg({ type: "err", text: `Upload hoyni: ${error.message}` });
    } else {
      const { data } = supabase.storage.from("news-images").getPublicUrl(path);
      setField("image_url", data.publicUrl);
      setMsg({ type: "ok", text: "Image upload hoyeche." });
    }
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
      author_name: form.author_name.trim() || "CW Admin",
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
    setMsg({ type: "ok", text: status === "published" ? "Published." : "Draft saved." });
    setForm(EMPTY_FORM);
    setSlugTouched(false);
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

  // ---------- UI ----------
  if (checking && !session) {
    return <main className="mx-auto max-w-md px-4 py-16 text-sm">Loading...</main>;
  }

  if (!session) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">News panel</h1>
        <p className="mt-1 text-sm text-zinc-500">Admin email diye login koro.</p>
        <form onSubmit={signIn} className="mt-6 space-y-3">
          <input
            className={inputCls}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputCls}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          <button type="submit" className={btnPrimaryCls} disabled={busy}>
            Sign in
          </button>
        </form>
      </main>
    );
  }

  if (checking) {
    return <main className="mx-auto max-w-md px-4 py-16 text-sm">Checking access...</main>;
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Access nai</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {session.user.email} ei email news admin list e nai. Onno email diye login koro.
        </p>
        <button className={`${btnCls} mt-4`} onClick={signOut}>
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News panel</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-500">{session.user.email}</span>
          <button className={btnCls} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>

      {msg && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            msg.type === "ok"
              ? "border-green-600/40 text-green-600"
              : "border-red-600/40 text-red-500"
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* Editor */}
      <section className="mt-6 space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/10">
        <h2 className="font-semibold">{form.id ? "Edit news" : "New news"}</h2>

        <input
          className={inputCls}
          placeholder="Title"
          value={form.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Slug (URL)</label>
            <input
              className={inputCls}
              placeholder="my-news-title"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Category</label>
            <select
              className={inputCls}
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {NEWS_CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Author name</label>
            <input
              className={inputCls}
              value={form.author_name}
              onChange={(e) => setField("author_name", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-500">Cover image (URL din, ba upload korun)</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputCls}
              placeholder="https://..."
              value={form.image_url}
              onChange={(e) => setField("image_url", e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadImage(f);
                e.target.value = "";
              }}
            />
          </div>
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="Preview" className="mt-2 max-h-40 rounded-lg" />
          )}
        </div>

        <textarea
          className={inputCls}
          rows={2}
          placeholder="Short summary (list page e dekhabe)"
          value={form.excerpt}
          onChange={(e) => setField("excerpt", e.target.value)}
        />
        <textarea
          className={inputCls}
          rows={10}
          placeholder="Full content (Enter dile notun paragraph hobe)"
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <button className={btnPrimaryCls} disabled={busy} onClick={() => save("published")}>
            Publish
          </button>
          <button className={btnCls} disabled={busy} onClick={() => save("draft")}>
            Save draft
          </button>
          {form.id && (
            <button
              className={btnCls}
              onClick={() => {
                setForm(EMPTY_FORM);
                setSlugTouched(false);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </section>

      {/* List */}
      <section className="mt-8">
        <h2 className="mb-3 font-semibold">All news ({articles.length})</h2>
        {articles.length === 0 ? (
          <p className="text-sm text-zinc-500">Ekhono kono news nai.</p>
        ) : (
          <ul className="space-y-2">
            {articles.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-lg border border-black/10 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{a.title}</div>
                  <div className="text-xs text-zinc-500">
                    {a.status === "published" ? "Published" : "Draft"} · /news/{a.slug}
                    {a.published_at ? ` · ${formatDate(a.published_at)}` : ""}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {a.status === "published" && (
                    <Link
                      href={`/news/${a.slug}` as Route}
                      target="_blank"
                      className={btnCls}
                    >
                      View
                    </Link>
                  )}
                  <button className={btnCls} onClick={() => startEdit(a)}>
                    Edit
                  </button>
                  <button className={btnCls} onClick={() => toggleStatus(a)}>
                    {a.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button className={btnCls} onClick={() => remove(a)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
