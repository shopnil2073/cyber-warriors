export interface NewsItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  content: string;
  date: string;
  author?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsArticle = NewsItem;

// Public Cloud API Storage (npoint / myjson)
const CLOUD_NEWS_API = "https://api.myjson.online/v1/records/46d6b88e-f1ed-0bc2-bd4d";

export const getStoredNews = (): NewsItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("cw_news");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const fetchNewsFromCloud = async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch(CLOUD_NEWS_API, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      const data = result.data || result;
      if (Array.isArray(data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cw_news", JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (e) {
    console.error("Cloud news fetch error:", e);
  }
  return getStoredNews();
};

export const saveAllNews = async (newsArray: NewsItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cw_news", JSON.stringify(newsArray));
  }
  try {
    await fetch(CLOUD_NEWS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: newsArray }),
    });
  } catch (e) {
    console.error("Cloud news save error:", e);
  }
};