import { supabase } from './supabase';

export async function fetchPublishedNews() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('status', 'Published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }
  return data;
}

export async function createNewsArticle(article: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url?: string;
  author_name?: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('news_articles')
    .insert([article])
    .select();

  if (error) {
    console.error('Error creating news article:', error);
    throw error;
  }
  return data;
}