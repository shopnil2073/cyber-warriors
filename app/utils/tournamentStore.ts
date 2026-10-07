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
  date: string;
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

// Fixtures Store
export const getStoredFixtures = (): Fixture[] => {
  if (typeof window === "undefined") return DEFAULT_FIXTURES;
  const saved = localStorage.getItem("cw_fixtures");
  return saved ? JSON.parse(saved) : DEFAULT_FIXTURES;
};

export const saveFixture = (newFixture: Fixture) => {
  const current = getStoredFixtures();
  const updated = [newFixture, ...current];
  localStorage.setItem("cw_fixtures", JSON.stringify(updated));
};

export const updateFixtureScore = (id: string, p1Score: number, p2Score: number) => {
  const current = getStoredFixtures();
  const updated = current.map((f) => (f.id === id ? { ...f, p1Score, p2Score } : f));
  localStorage.setItem("cw_fixtures", JSON.stringify(updated));
};

// Standings Store
export const getStoredStandings = (): Standing[] => {
  if (typeof window === "undefined") return DEFAULT_STANDINGS;
  const saved = localStorage.getItem("cw_standings");
  return saved ? JSON.parse(saved) : DEFAULT_STANDINGS;
};

export const saveStandings = (standings: Standing[]) => {
  localStorage.setItem("cw_standings", JSON.stringify(standings));
};

export const updatePlayerInfo = (rank: number, newName: string, pts: number) => {
  const current = getStoredStandings();
  const updated = current.map((s) => (s.rank === rank ? { ...s, name: newName, pts } : s));
  localStorage.setItem("cw_standings", JSON.stringify(updated));
};

// --- GLOBAL CLOUD NEWS STORE (JSONBin) ---
const JSONBIN_BIN_ID = "66fbe5d8e41b4d34e4399c5a"; // Shared Global Storage Bin
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

export const getStoredNews = (): NewsItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("cw_news");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

// Cloud Sync Get Function (Async)
export const fetchNewsFromCloud = async (): Promise<NewsItem[]> => {
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { "X-Bin-Meta": "false" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cw_news", JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (e) {
    console.error("Cloud fetch failed, fallback to local", e);
  }
  return getStoredNews();
};

// Cloud Sync Save Function
export const saveAllNews = async (newsArray: NewsItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cw_news", JSON.stringify(newsArray));
  }
  try {
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsArray),
    });
  } catch (e) {
    console.error("Failed to sync news with cloud", e);
  }
};

export const saveNews = async (article: NewsItem) => {
  const current = getStoredNews();
  const updated = [article, ...current];
  await saveAllNews(updated);
};

// Ticker Store
export const getStoredTicker = (): string => {
  if (typeof window === "undefined") return "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
  return localStorage.getItem("cw_ticker") || "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
};

export const saveTicker = (text: string) => {
  localStorage.setItem("cw_ticker", text);
};