import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/server-public";

export const dynamic = "force-dynamic";

type Article = {
  id: string;
  legacy_id: string | null;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author_name: string;
  status: "Draft" | "Published";
  created_at: string;
  published_at: string | null;
};

async function findPublishedArticle(slug: string): Promise<Article | null> {
  const supabase = createPublicSupabaseClient();
  const fields = "id,legacy_id,title,slug,category,excerpt,content,image_url,author_name,status,created_at,published_at";

  const bySlug = await supabase
    .from("news_articles")
    .select(fields)
    .eq("slug", slug)
    .eq("status", "Published")
    .maybeSingle();

  if (bySlug.data) return bySlug.data as Article;

  // Backwards compatibility for old /news?article=<legacy-id> links.
  const byLegacyId = await supabase
    .from("news_articles")
    .select(fields)
    .eq("legacy_id", slug)
    .eq("status", "Published")
    .maybeSingle();

  return (byLegacyId.data as Article | null) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await findPublishedArticle(decodeURIComponent(slug));
  if (!article) return { title: "News | Cyber Warriors" };
  return {
    title: `${article.title} | Cyber Warriors`,
    description: article.excerpt || article.content.slice(0, 160),
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await findPublishedArticle(decodeURIComponent(slug));
  if (!article) notFound();

  const dateValue = article.published_at || article.created_at;
  const date = new Date(dateValue);
  const dateLabel = Number.isNaN(date.getTime())
    ? "Cyber Warriors"
    : new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(date);

  return (
    <div className="min-h-screen bg-[#0a0e17] px-4 py-8 text-gray-200 md:py-12">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#1f293d] bg-[#121927] shadow-2xl shadow-black/30">
        <div className="p-5 md:p-10">
          <Link
            href="/news"
            className="inline-flex rounded-lg border border-[#D4AF37]/40 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
          >
            ← All News
          </Link>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-[#D4AF37] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              {article.category}
            </span>
            <span className="text-xs text-gray-500">{dateLabel}</span>
            <span className="text-xs text-gray-500">• By {article.author_name || "CYBER WARRIORS"}</span>
          </div>
          <h1 className="mt-5 text-2xl font-black uppercase leading-tight text-white md:text-4xl">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mt-4 border-l-2 border-[#D4AF37] pl-4 text-base leading-7 text-gray-300 md:text-lg">
              {article.excerpt}
            </p>
          ) : null}
        </div>

        {article.image_url ? (
          <div className="max-h-[560px] overflow-hidden border-y border-[#1f293d] bg-black">
            <img src={article.image_url} alt={article.title} className="mx-auto max-h-[560px] w-full object-contain" />
          </div>
        ) : null}

        <div className="p-5 md:p-10">
          <div className="whitespace-pre-line break-words text-sm leading-8 text-gray-300 md:text-base">
            {article.content}
          </div>
          <div className="mt-10 border-t border-[#1f293d] pt-5 text-center text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
            Cyber Warriors • Driven by Passion. Defined by Glory.
          </div>
        </div>
      </article>
    </div>
  );
}
