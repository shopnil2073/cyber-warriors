import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "../../lib/newsService";
import { formatDate } from "../../lib/newsUtils";
import { supabase } from "../../lib/supabase";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "News not found | Cyber Warriors" };

  return {
    title: `${article.title} | Cyber Warriors`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  // Increment view count when user opens the article
  // @ts-expect-error views might exist on article
  const currentViews = (article.views ?? 0) + 1;
  await supabase
    .from("news_articles")
    .update({ views: currentViews })
    .eq("id", article.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Article Header Banner */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/50 to-zinc-950 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href={"/news" as Route}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:underline mb-6"
          >
            &larr; Back to News List
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-bold uppercase tracking-wider text-amber-400 text-xs">
              {article.category}
            </span>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span>{article.published_at ? formatDate(article.published_at) : ""}</span>
              <span>•</span>
              <span>Author: {article.author_name}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold" title="Total Views">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{currentViews}</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {article.image_url && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="whitespace-pre-line text-base leading-loose text-zinc-300 sm:text-lg">
            {article.content}
          </div>
        </article>
      </main>
    </div>
  );
}