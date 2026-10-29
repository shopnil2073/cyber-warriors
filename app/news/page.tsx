import Link from "next/link";
import { redirect } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/server-public";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

type SearchParams = Promise<{
  page?: string | string[];
  article?: string | string[];
}>;

type NewsCard = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author_name: string;
  created_at: string;
  published_at: string | null;
};

function dateLabel(value: string | null, fallback: string) {
  const dateValue = value || fallback;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "CYBER WARRIORS";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const oldArticleParam = Array.isArray(params.article)
    ? params.article[0]
    : params.article;

  // Keep old URLs such as /news?article=my-slug working.
  if (oldArticleParam) {
    redirect(`/news/${encodeURIComponent(oldArticleParam)}`);
  }

  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const supabase = createPublicSupabaseClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("news_articles")
    .select(
      "id,title,slug,category,excerpt,content,image_url,author_name,created_at,published_at",
      { count: "exact" }
    )
    .eq("status", "Published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const articles = (data || []) as NewsCard[];
  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-[#0a0e17] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-[#D4AF37]/30 pb-7 text-center">
          <span className="inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
            Cyber Warriors H.Q.
          </span>
          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
            Club <span className="text-[#D4AF37]">Headlines</span>
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-gray-400 md:text-sm">
            Official News &amp; Announcements
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-center text-sm text-red-200">
            News could not be loaded. Check the Supabase table and RLS policies.
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-[#1f293d] bg-[#121927] p-10 text-center">
            <h2 className="text-xl font-black text-[#D4AF37]">NO NEWS PUBLISHED YET</h2>
            <p className="mt-2 text-sm text-gray-400">
              Official Cyber Warriors announcements will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const excerpt =
                article.excerpt?.trim() ||
                article.content.replace(/\s+/g, " ").slice(0, 180);

              return (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-[#1f293d] bg-[#121927] transition hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-black/30"
                >
                  <Link href={`/news/${encodeURIComponent(article.slug)}`} className="block">
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#080b12]">
                      {article.image_url ? (
                        // Remote news-cover URLs are stored in Supabase; a plain img avoids remote-domain config issues.
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#171b29] to-[#080b12] text-sm font-black tracking-[0.25em] text-[#D4AF37]">
                          CYBER WARRIORS
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-md bg-[#D4AF37] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                        {article.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {dateLabel(article.published_at, article.created_at)}
                        <span className="px-2 text-[#D4AF37]">•</span>
                        {article.author_name || "CYBER WARRIORS"}
                      </p>
                      <h2 className="mt-3 line-clamp-3 text-lg font-extrabold leading-snug text-white transition group-hover:text-[#D4AF37]">
                        {article.title}
                      </h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-400">
                        {excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
                        Read Article <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="News pages">
            {page > 1 ? (
              <Link
                href={`/news?page=${page - 1}`}
                className="rounded-lg border border-[#1f293d] px-4 py-2 text-xs font-bold text-gray-200 hover:border-[#D4AF37]"
              >
                ← Previous
              </Link>
            ) : null}
            <span className="text-xs font-bold tracking-widest text-gray-400">
              PAGE {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={`/news?page=${page + 1}`}
                className="rounded-lg border border-[#1f293d] px-4 py-2 text-xs font-bold text-gray-200 hover:border-[#D4AF37]"
              >
                Next →
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </div>
  );
}
