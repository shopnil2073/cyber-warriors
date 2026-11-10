import { createPublicClient } from "./supabase/server-public";
import { NEWS_COLUMNS, type NewsArticle } from "./newsUtils";

export async function getPublishedNews(limit = 60): Promise<NewsArticle[]> {
  const { data, error } = await createPublicClient()
    .from("news_articles")
    .select(NEWS_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPublishedNews:", error.message);
    return [];
  }
  return (data ?? []) as NewsArticle[];
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const { data, error } = await createPublicClient()
    .from("news_articles")
    .select(NEWS_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getNewsBySlug:", error.message);
    return null;
  }
  return (data as NewsArticle | null) ?? null;
}
