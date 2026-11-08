import { create } from 'zustand';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string;
  author_name: string;
  status: 'Draft' | 'Published';
  published_at: string;
}

interface NewsState {
  articles: NewsArticle[];
  setArticles: (articles: NewsArticle[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useNewsStore;