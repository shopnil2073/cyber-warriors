// Server ar client dutoi use korte pare (kono Supabase import nai)

export type NewsStatus = "draft" | "published";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author_name: string;
  image_url: string | null;
  status: NewsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const NEWS_COLUMNS =
  "id,title,slug,excerpt,content,category,author_name,image_url,status,published_at,created_at,updated_at";

export const NEWS_CATEGORIES = [
  "Announcement",
  "Tournament",
  "Results",
  "Update",
  "Community",
];

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  // Bangla title hole latin akkhor thake na, tai fallback
  return base || `news-${Date.now().toString(36)}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}
