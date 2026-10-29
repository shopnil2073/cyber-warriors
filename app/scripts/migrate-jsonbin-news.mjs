import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  JSONBIN_BIN_ID,
  JSONBIN_MASTER_KEY,
} = process.env;

for (const [key, value] of Object.entries({
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  JSONBIN_BIN_ID,
  JSONBIN_MASTER_KEY,
})) {
  if (!value) {
    throw new Error(`Missing ${key}. Put it in a local .env file or provide it in the shell environment.`);
  }
}

const safeSlug = (value) => String(value || '')
  .normalize('NFKD')
  .toLowerCase()
  .trim()
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'cyber-warriors-news';

function validIso(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const response = await fetch(`https://api.jsonbin.io/v3/b/${encodeURIComponent(JSONBIN_BIN_ID)}/latest`, {
  headers: { 'X-Master-Key': JSONBIN_MASTER_KEY },
});

if (!response.ok) {
  throw new Error(`Could not read the legacy news bin (HTTP ${response.status}). Check the bin ID and rotated Master Key.`);
}

const payload = await response.json();
const source = payload?.record ?? payload?.data ?? payload;
const legacyArticles = Array.isArray(source) ? source : Array.isArray(source?.articles) ? source.articles : null;

if (!legacyArticles) {
  throw new Error('The legacy JSONBin response was not an article array. Export the record from JSONBin and inspect its shape before importing.');
}

if (legacyArticles.length === 0) {
  console.log('The legacy news bin is empty; nothing to migrate.');
  process.exit(0);
}

const seenSlugs = new Set();
const rows = legacyArticles.map((item, index) => {
  const title = String(item?.title || `Cyber Warriors News ${index + 1}`).trim();
  const rawSlug = safeSlug(item?.slug || title);
  const oldId = item?.id == null ? null : String(item.id);
  let slug = rawSlug;
  if (seenSlugs.has(slug)) {
    slug = `${rawSlug}-${safeSlug(oldId || String(index + 1)).slice(-18)}`;
  }
  if (seenSlugs.has(slug)) slug = `${rawSlug}-${index + 1}`;
  seenSlugs.add(slug);

  const status = String(item?.status || '').toLowerCase() === 'draft' ? 'Draft' : 'Published';
  const createdAt = validIso(item?.createdAt || item?.created_at) || new Date().toISOString();
  const updatedAt = validIso(item?.updatedAt || item?.updated_at) || createdAt;
  const publishedAt = status === 'Published'
    ? validIso(item?.publishedAt || item?.published_at || item?.updatedAt || item?.createdAt) || new Date().toISOString()
    : null;
  const content = String(item?.content || item?.body || '');

  return {
    legacy_id: oldId,
    title,
    slug,
    category: String(item?.category || 'ANNOUNCEMENT').toUpperCase(),
    excerpt: String(item?.excerpt || content.replace(/\s+/g, ' ').slice(0, 220)),
    content,
    image_url: item?.imageUrl || item?.image_url || null,
    author_name: String(item?.author || item?.author_name || 'CYBER WARRIORS'),
    status,
    created_at: createdAt,
    updated_at: updatedAt,
    published_at: publishedAt,
  };
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

let imported = 0;
for (let start = 0; start < rows.length; start += 100) {
  const batch = rows.slice(start, start + 100);
  const { error } = await supabase.from('news_articles').upsert(batch, { onConflict: 'slug' });
  if (error) {
    throw new Error(`Import failed around article ${start + 1}: ${error.message}`);
  }
  imported += batch.length;
}

console.log(`Successfully imported/upserted ${imported} article(s) into public.news_articles.`);
console.log('Check /news and /news-panel before removing the old JSONBin integration.');
