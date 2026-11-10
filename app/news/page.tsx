import type { Metadata } from "next";
import NewsListCard from "../components/NewsListCard";
import { getPublishedNews } from "../lib/newsService";

// Prati 60 second e Supabase theke notun news ane (ISR)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "News | Cyber Warriors",
  description: "Latest news, announcements and results from Cyber Warriors.",
};

export default async function NewsPage() {
  const articles = await getPublishedNews();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">News</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Latest announcements and updates from Cyber Warriors.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/20 p-10 text-center text-zinc-500 dark:border-white/20">
          No news published yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <NewsListCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
