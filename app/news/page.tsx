import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNews } from "../lib/newsService";
import { formatDate } from "../lib/newsUtils";
import type { Route } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News | Cyber Warriors",
  description: "Latest news, announcements and updates from Cyber Warriors.",
};

const CATEGORIES = [
  "All",
  "player achievements",
  "club achievements",
  "announcement",
  "tournament update",
  "funny",
];

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentCategory = params.category || "All";
  const currentPage = Number(params.page) || 1;
  const pageSize = 6;

  const allArticles = await getPublishedNews();

  const filteredArticles =
    currentCategory === "All"
      ? allArticles
      : allArticles.filter(
          (a) => a.category.toLowerCase() === currentCategory.toLowerCase()
        );

  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/50 to-zinc-950 py-16 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
            Cyber Warriors Official Portal
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Latest News & Updates
          </h1>
          <p className="mt-3 text-base text-zinc-400 sm:text-lg">
            Stay updated with club milestones, player achievements, and tournament logs.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive =
              currentCategory.toLowerCase() === cat.toLowerCase();
            const href =
              cat === "All" ? ("/news" as Route) : (`/news?category=${encodeURIComponent(cat)}` as Route);

            return (
              <Link
                key={cat}
                href={href}
                className={`rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                    : "border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {paginatedArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center">
            <p className="text-sm text-zinc-500">No news articles found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => {
              // @ts-expect-error views might exist on article
              const viewsCount = article.views ?? 0;

              return (
                <article
                  key={article.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {article.image_url ? (
                    <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-lg bg-zinc-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md border border-zinc-700/50">
                        {article.category}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-zinc-950 text-xs text-zinc-600 uppercase tracking-widest border-b border-zinc-800">
                      Cyber Warriors
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
                      <span>{article.published_at ? formatDate(article.published_at) : ""}</span>
                      <div className="flex items-center gap-3">
                        <span>By {article.author_name}</span>
                        <div className="flex items-center gap-1 text-zinc-400" title="Total Views">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{viewsCount}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-white transition group-hover:text-amber-400 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="mt-3 text-sm text-zinc-400 line-clamp-2 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>

                    <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <Link
                        href={`/news/${article.slug}` as Route}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 transition hover:text-amber-300"
                      >
                        READ MORE &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === currentPage;
              const pageQuery = currentCategory !== "All" ? `?category=${encodeURIComponent(currentCategory)}&page=${p}` : `?page=${p}`;
              const pageHref = `/news${pageQuery}` as Route;

              return (
                <Link
                  key={p}
                  href={pageHref}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}