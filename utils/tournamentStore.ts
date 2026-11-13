export interface Fixture {
  id: string;
  group: string;
  tournament: string;
  date: string;
  p1: string;
  p1Device: string;
  p1Score: number;
  p2: string;
  p2Device: string;
  p2Score: number;
  status: string;
}

export interface Standing {
  rank: number;
  name: string;
  mp: number;
  w: number;
  gd: number;
  pts: number;
}

export interface NewsItem {
  id: string;
  title: string;
  slug?: string;
  category: string;
  content: string;
  date?: string;
  author?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsArticle = NewsItem;

const DEFAULT_FIXTURES: Fixture[] = [
  {
    id: "m1",
    group: "GROUP STAGE",
    tournament: "PFG PREMIER LEAGUE S2",
    date: "THURSDAY, 10 SEP 2026",
    p1: "Md Rakib Hossain",
    p1Device: "Redmi note 11 pro 5g",
    p1Score: 5,
    p2: "Falaj Al raeid",
    p2Device: "Redmi 12 5g",
    p2Score: 5,
    status: "FT",
  },
];

const DEFAULT_STANDINGS: Standing[] = [
  { rank: 1, name: "Md mahi", mp: 9, w: 8, gd: 15, pts: 25 },
  { rank: 2, name: "Raiyan Anwar", mp: 10, w: 7, gd: 19, pts: 23 },
  { rank: 3, name: "Sezan Mahfuj", mp: 10, w: 7, gd: 18, pts: 23 },
];

export const getStoredFixtures = (): Fixture[] => {
  if (typeof window === "undefined") return DEFAULT_FIXTURES;
  try {
    const saved = localStorage.getItem("cw_fixtures");
    return saved ? JSON.parse(saved) : DEFAULT_FIXTURES;
  } catch (e) {
    return DEFAULT_FIXTURES;
  }
};

export const saveFixture = (newFixture: Fixture) => {
  try {
    const current = getStoredFixtures();
    const updated = [newFixture, ...current];
    localStorage.setItem("cw_fixtures", JSON.stringify(updated));
  } catch (e) {
    console.error("Save fixture error:", e);
  }
};

export const updateFixtureScore = (id: string, p1Score: number, p2Score: number) => {
  try {
    const current = getStoredFixtures();
    const updated = current.map((f) => (f.id === id ? { ...f, p1Score, p2Score } : f));
    localStorage.setItem("cw_fixtures", JSON.stringify(updated));
  } catch (e) {
    console.error("Update fixture error:", e);
  }
};

export const getStoredStandings = (): Standing[] => {
  if (typeof window === "undefined") return DEFAULT_STANDINGS;
  try {
    const saved = localStorage.getItem("cw_standings");
    return saved ? JSON.parse(saved) : DEFAULT_STANDINGS;
  } catch (e) {
    return DEFAULT_STANDINGS;
  }
};

export const saveStandings = (standings: Standing[]) => {
  try {
    localStorage.setItem("cw_standings", JSON.stringify(standings));
  } catch (e) {
    console.error("Save standings error:", e);
  }
};

export const updatePlayerInfo = (rank: number, newName: string, pts: number) => {
  try {
    const current = getStoredStandings();
    const updated = current.map((s) => (s.rank === rank ? { ...s, name: newName, pts } : s));
    localStorage.setItem("cw_standings", JSON.stringify(updated));
  } catch (e) {
    console.error("Update player info error:", e);
  }
};

// --- GLOBAL CLOUD DB CONFIG (JSONBIN / PUBLIC API) ---
const GLOBAL_CLOUD_URL = "https://api.jsonbin.io/v3/b/66fa19b0e41b4d34e438e89a";

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
    const res = await fetch(GLOBAL_CLOUD_URL, {
      method: "GET",
      headers: {
        "X-Master-Key": "$2a$10$wKk3x08GZJ.N1jGv8QpX.uA8U3xT2Yj/e1lH5.q4.o1r1iK4i1i1G",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      const data = result.record || result.data || result;
      if (Array.isArray(data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cw_news", JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (e) {
    // Fail silently and fallback to local storage to prevent UI crash
  }
  return getStoredNews();
};

export const saveAllNews = async (newsArray: NewsItem[]): Promise<boolean> => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cw_news", JSON.stringify(newsArray));
    } catch (e) {}
  }
  try {
    const res = await fetch(GLOBAL_CLOUD_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$wKk3x08GZJ.N1jGv8QpX.uA8U3xT2Yj/e1lH5.q4.o1r1iK4i1i1G",
      },
      body: JSON.stringify(newsArray),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const saveNewsToCloud = saveAllNews;

export const saveNews = async (article: NewsItem): Promise<boolean> => {
  try {
    const current = await fetchNewsFromCloud();
    const updated = [article, ...current.filter((item) => item.id !== article.id)];
    return await saveAllNews(updated);
  } catch (e) {
    return false;
  }
};

export const deleteNewsFromCloud = async (id: string): Promise<boolean> => {
  try {
    const current = await fetchNewsFromCloud();
    const updated = current.filter((item) => item.id !== id);
    return await saveAllNews(updated);
  } catch (e) {
    return false;
  }
};

export const deleteNews = deleteNewsFromCloud;

// --- TICKER STORE ---
export const getStoredTicker = (): string => {
  if (typeof window === "undefined") return "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
  try {
    return localStorage.getItem("cw_ticker") || "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
  } catch (e) {
    return "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
  }
};

export const saveTicker = (text: string) => {
  try {
    localStorage.setItem("cw_ticker", text);
  } catch (e) {}
};