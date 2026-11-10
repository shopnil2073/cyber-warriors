import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "../../lib/newsService";
import { formatDate } from "../../lib/newsUtils";

export const revalidate = 60;

// Next.js 15/16: params ekhon Promise (await korte hobe)
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

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href={"/news" as Route}
        className="text-sm text-zinc-500 hover:underline dark:text-zinc-400"
      >
        Back to news
      </Link>

      <article className="mt-4">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {article.category}
          {article.published_at ? ` · ${formatDate(article.published_at)}` : ""}
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight">{article.title}</h1>
        <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          By {article.author_name}
        </div>

        {article.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title}
            className="mt-6 w-full rounded-xl object-cover"
          />
        )}

        {/* whitespace-pre-line: Enter dile notun line/paragraph hobe. HTML inject hoy na (safe). */}
        <div className="mt-6 whitespace-pre-line text-base leading-relaxed">
          {article.content}
        </div>
      </article>
    </main>
  );
}
