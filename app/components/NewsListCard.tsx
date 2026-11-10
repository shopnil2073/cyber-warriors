import type { Route } from "next";
import Link from "next/link";
import { formatDate, type NewsArticle } from "../lib/newsUtils";

export default function NewsListCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}` as Route}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition hover:border-black/30 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30"
    >
      {article.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image_url}
          alt={article.title}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {article.category}
          {article.published_at ? ` · ${formatDate(article.published_at)}` : ""}
        </div>
        <h2 className="text-lg font-semibold leading-snug group-hover:underline">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
            {article.excerpt}
          </p>
        )}
        <div className="mt-auto pt-2 text-xs text-zinc-500 dark:text-zinc-400">
          By {article.author_name}
        </div>
      </div>
    </Link>
  );
}
