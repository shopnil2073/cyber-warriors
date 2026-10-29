-- Cyber Warriors News: secure database, admin roles, and image uploads.
-- Run this in Supabase Dashboard -> SQL Editor.

create table if not exists public.news_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  title text not null,
  slug text not null unique,
  category text not null default 'ANNOUNCEMENT',
  excerpt text not null default '',
  content text not null,
  image_url text,
  author_name text not null default 'CYBER WARRIORS',
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_articles_public_order_idx
  on public.news_articles (status, published_at desc, created_at desc);

create index if not exists news_articles_slug_idx
  on public.news_articles (slug);

alter table public.news_admins enable row level security;
alter table public.news_articles enable row level security;

-- Public visitors can read only published articles. Admins can also read drafts.
drop policy if exists "news_admins_read_own_role" on public.news_admins;
create policy "news_admins_read_own_role"
  on public.news_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "news_public_read_published" on public.news_articles;
create policy "news_public_read_published"
  on public.news_articles for select to anon, authenticated
  using (
    status = 'Published'
    and (published_at is null or published_at <= now())
  );

drop policy if exists "news_admin_read_all" on public.news_articles;
create policy "news_admin_read_all"
  on public.news_articles for select to authenticated
  using (
    exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

drop policy if exists "news_admin_insert" on public.news_articles;
create policy "news_admin_insert"
  on public.news_articles for insert to authenticated
  with check (
    exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

drop policy if exists "news_admin_update" on public.news_articles;
create policy "news_admin_update"
  on public.news_articles for update to authenticated
  using (
    exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

drop policy if exists "news_admin_delete" on public.news_articles;
create policy "news_admin_delete"
  on public.news_articles for delete to authenticated
  using (
    exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

-- Grant SQL operations; RLS above still decides which rows can be accessed.
revoke all on table public.news_admins from anon, authenticated;
revoke all on table public.news_articles from anon, authenticated;
grant select on table public.news_admins to authenticated;
grant select on table public.news_articles to anon, authenticated;
grant insert, update, delete on table public.news_articles to authenticated;

-- Public image delivery, admin-only upload/update/delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-covers',
  'news-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "news_covers_admin_upload" on storage.objects;
create policy "news_covers_admin_upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'news-covers'
    and exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

drop policy if exists "news_covers_admin_update" on storage.objects;
create policy "news_covers_admin_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'news-covers'
    and exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'news-covers'
    and exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

drop policy if exists "news_covers_admin_delete" on storage.objects;
create policy "news_covers_admin_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'news-covers'
    and exists (
      select 1 from public.news_admins na
      where na.user_id = (select auth.uid())
    )
  );

-- IMPORTANT: after each admin has a Supabase Auth account, register those users below.
-- Replace the sample addresses with the fixed admin Gmail addresses already used in Sidebar.tsx.
-- Run this block AFTER the Auth users have been created.
/*
insert into public.news_admins (user_id, email)
select id, lower(email)
from auth.users
where lower(email) in (
  lower('first-admin@gmail.com'),
  lower('second-admin@gmail.com')
)
on conflict (user_id) do update set email = excluded.email;
*/
