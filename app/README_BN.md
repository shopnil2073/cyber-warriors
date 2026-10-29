# Cyber Warriors News System — বাংলা Setup Guide

এই kit তোমার বর্তমান **Next.js App Router + Supabase** project-এর জন্য। Existing `app/news/page.tsx` ও `app/news-panel/page.tsx`-এর replacement, Supabase RLS schema, legacy JSONBin news migration script এবং Vercel build-fix notes এখানে আছে। Player/matches/tournament tables পরিবর্তন করে না।

## কোন URL হবে

- Public news list: `/news`
- একটি article: `/news/cyber-warriors-squad-update`
- Admin panel: `/news-panel`
- পুরোনো `/news?article=some-slug` links-ও redirect হবে নতুন article URL-এ।

TRC-BD-এর public list `/news`, আর তাদের article details `/news_view.php?id=35`-এর মতো ID-based URL-এ। তোমার Next.js app-এর জন্য `/news/[slug]` clean article URL রাখছি; list/card design একই ধরনের হবে।

## 0. আগে security cleanup

1. বর্তমান repo-র `utils/tournamentStore.ts`-এ JSONBin Master Key client-side code-এ আছে। Public GitHub-এ committed হওয়ায় **ওই key-কে compromised ধরে JSONBin থেকে rotate/revoke করো**। পুরোনো key আর ব্যবহার কোরো না। নতুন key একবারের local migration-এর জন্য `.env.local`-এ রাখবে; কখনো `NEXT_PUBLIC_` variable হবে না।
2. Current `utils/userStore.ts`-এ `players.password` field-এ password save এবং query করা হয়। এটা নিরাপদ authentication design নয়। এই News Panel `news_admins` table + Supabase Auth + RLS দিয়ে write access check করে, legacy `localStorage`-কে authorization ধরে না। Long-term-এ player login/register-ও Supabase Auth-এ migrate করবে।
3. কখনো Supabase `service_role` key browser code, `NEXT_PUBLIC_` env variable, GitHub বা Vercel client bundle-এ দেবে না। এই key কেবল one-time migration script-এর local environment-এ লাগে।

## 1. Supabase database তৈরি

1. Supabase Dashboard → **SQL Editor** খোলো।
2. `supabase/news-schema.sql` পুরোটা paste করে Run করো।
3. Supabase Dashboard → Authentication → Users থেকে fixed admin Gmail account-গুলোর Supabase Auth users তৈরি করো। Email confirm করে দাও। Current login একই সাথে News Panel-এ ঢোকাতে চাইলে Supabase Auth password-ও current site's login password-এর সঙ্গে match করতে হবে; নইলে `/news-panel` নিজস্ব sign-in form দেখাবে।
4. `news-schema.sql`-এর শেষে commented `insert into public.news_admins...` অংশটা uncomment করে `Sidebar.tsx`-এ থাকা approved admin Gmail-গুলোর list বসাও। তারপর SQL block run করো। শুধু email list-এ নাম থাকলেই যথেষ্ট নয়—তাদের Supabase Auth user এবং `news_admins` row দুটোই থাকতে হবে।

**গুরুত্বপূর্ণ:** RLS policies draft-কে public-এর কাছ থেকে লুকায়। `Published` article public visitor দেখতে পারবে; insert/update/delete শুধু `news_admins`-এ থাকা signed-in user পারবে। এই control database-এ enforced, শুধু UI hide/show নয়।

## 2. Environment variables

Project root-এ `.env.local` তৈরি করো। `.env.local.example` দেখে values বসাও। Supabase URL ও anon/publishable key Supabase Project Settings → API থেকে পাবে। Existing `.env.local` থাকলে overwrite না করে required variables যোগ করবে।

Vercel Dashboard → Project → Settings → Environment Variables-এ এই দুটো যোগ করো:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Production deployment-এ `SUPABASE_SERVICE_ROLE_KEY` add করার প্রয়োজন নেই—News Panel user session + RLS দিয়ে write করে। `service_role` শুধু local migration script-এ।

## 3. Code files বসানো

Project root `D:\cyber-warriors` ধরে instructions:

1. Backup/commit করে রাখো।
2. এই kit-এর `app/lib/supabase.ts` তোমার existing `app/lib/supabase.ts`-এর জায়গায় বসাও।
3. `app/lib/supabase/server-public.ts` নতুন file হিসেবে বসাও।
4. Kit-এর `app/news/page.tsx` দিয়ে existing `app/news/page.tsx` replace করো।
5. `app/news/[slug]/page.tsx` path-এ নতুন file তৈরি করো।
6. Kit-এর `app/news-panel/page.tsx` দিয়ে existing `app/news-panel/page.tsx` replace করো।
7. Existing `utils/tournamentStore.ts` পুরো replace করবে না—ওখানে fixtures/standings/ticker-ও আছে। `utils/tournamentStore-news-block.txt`-এর নির্দেশ অনুযায়ী শুধু পুরোনো JSONBin news block replace করে Supabase adapter বসাও। এতে Home page-এর latest-news cards-ও Supabase থেকে data পাবে।
8. Public `/news` route আর `app/page.tsx` home section দুটোই test করো।

`Sidebar.tsx`-এ `/news-panel` link আগে থেকেই Command Center-এর মধ্যে আছে, তাই design/menu link নতুন করে বানাতে হবে না। Existing email check শুধু menu দেখানোর জন্য; database writes-এর permission সেটা দেয় না। এক-login bridge চাইলে `patches/userStore-admin-session-snippet.txt` অনুসরণ করো।

## 4. পুরোনো JSONBin news Supabase-এ migrate

Migration করার আগে `news-schema.sql` run হয়ে গেছে এবং `.env.local`-এ **নতুন/rotated** JSONBin Master Key বসানো আছে নিশ্চিত করো। `SUPABASE_SERVICE_ROLE_KEY` কেবল local script-এর জন্য বসাবে।

Project root-এ terminal খুলে migration kit-এর `scripts/migrate-jsonbin-news.mjs` copy করো, তারপর চালাও:

```bash
node --env-file=.env.local scripts/migrate-jsonbin-news.mjs
```

Windows-এর Node.js version-এ `--env-file` supported না হলে PowerShell-এ variables set করে script run করো, অথবা local-only `.env` loader ব্যবহার করো। Service-role key GitHub-এ commit কোরো না। Script সফল হলে `/news` এবং `/news-panel`-এ articles যাচাই করো। তারপর পুরোনো JSONBin news integration আর ব্যবহার না করো।

## 5. Current Vercel build error

ভিডিওতে দেখা Vercel log-এ `@/app/lib/db` import resolve হতে গিয়ে alias `./app/app/lib/db` হচ্ছে। তোমার বর্তমান `tsconfig.json`-এর mapping:

```json
"paths": {
  "@/*": ["./app/*"]
}
```

এই mapping অনুযায়ী, actual file যদি `app/lib/db.ts` হয়, import হবে:

```ts
import { db } from "@/lib/db";
```

`@/app/lib/db` লিখলে `app/app/lib/db` খুঁজবে। VS Code → `Ctrl+Shift+F` দিয়ে `@/app/` খুঁজে এই ধরনের imports যাচাই করো; blind global replace করার আগে প্রতিটি target file সত্যিই `app/`-এর নিচে আছে কি না মিলিয়ে নাও।

তারপর:

```bash
npm run build
```

Local production build pass করার পরই:

```bash
git add .
git commit -m "Add secure Supabase news system"
git push origin main
```

Vercel-এ `NEXT_PUBLIC_SUPABASE_URL` ও `NEXT_PUBLIC_SUPABASE_ANON_KEY` Production/Preview/Development environments-এ যেগুলো দরকার সেগুলো configure করো, তারপর redeploy করো। Build log-এ বাকি errors থাকলে প্রথম red error থেকে fix করো—একটি alias fix করার পর পরের missing imports দেখা দিতে পারে।

## 6. Go-live checklist

- [ ] `news-schema.sql` run হয়েছে
- [ ] প্রতিটি news admin-এর Supabase Auth account আছে
- [ ] প্রতিটি admin `public.news_admins` table-এ আছে
- [ ] `news-covers` Storage bucket তৈরি হয়েছে
- [ ] JSONBin news পুরোনো data Supabase-এ migrate হয়েছে
- [ ] `/news` guest হিসেবে published articles দেখায়
- [ ] Draft guest view-তে দেখা যায় না
- [ ] Non-admin account দিয়ে `/news-panel` open করলে editor পাওয়া যায় না
- [ ] Admin account দিয়ে create/edit/publish/draft/delete কাজ করে
- [ ] `npm run build` local-এ pass করেছে
- [ ] JSONBin Master Key rotate করা হয়েছে; পুরোনো key source code থেকে সরানো হয়েছে
- [ ] player password field-এর legacy security migration plan করা হয়েছে
