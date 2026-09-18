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

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
}

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

const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: "n1",
    title: "PFG Season 2 Grand Finals Announced!",
    date: "15 SEP 2026",
    category: "ANNOUNCEMENT",
    content: "Get ready for the biggest showdown of Cyber Warriors Season 2.",
  },
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

// News Store
export const getStoredNews = (): NewsArticle[] => {
  if (typeof window === "undefined") return DEFAULT_NEWS;
  const saved = localStorage.getItem("cw_news");
  return saved ? JSON.parse(saved) : DEFAULT_NEWS;
};

export const saveNews = (article: NewsArticle) => {
  const current = getStoredNews();
  const updated = [article, ...current];
  localStorage.setItem("cw_news", JSON.stringify(updated));
};

// Ticker Store
export const getStoredTicker = (): string => {
  if (typeof window === "undefined") return "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
  return localStorage.getItem("cw_ticker") || "WELCOME TO CYBER WARRIORS OFFICIAL WEBSITE!";
};

export const saveTicker = (text: string) => {
  localStorage.setItem("cw_ticker", text);
};