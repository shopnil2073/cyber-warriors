-- ============================================================================
-- Cyber Warriors  |  Phase 2: Tournament schema + secure public views
-- Supabase -> SQL Editor -> New query -> paste ALL -> Run
-- Eta ekbar chalale hobe. Abar chalaleo safe (create if not exists / or replace).
-- ============================================================================

-- ---------- 1) TOURNAMENTS ---------------------------------------------------
create table if not exists public.tournaments (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  category     text not null check (category in ('solo','duo','4man','6man','teamup','friendly','bid')),
  season       text,
  format       text not null default 'league' check (format in ('league','knockout')),
  status       text not null default 'open'   check (status in ('open','live','completed')),
  description  text,
  prize        text,
  banner_url   text,
  max_entries  int,
  start_date   date,
  created_by   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists tournaments_cat_status_idx on public.tournaments (category, status, created_at desc);

-- ---------- 2) ENTRIES (solo te 1 player, team e onek player) ----------------
create table if not exists public.tournament_entries (
  id             uuid primary key default gen_random_uuid(),
  tournament_id  uuid not null references public.tournaments(id) on delete cascade,
  name           text not null,
  seed           int,
  created_at     timestamptz not null default now()
);
create index if not exists entries_tournament_idx on public.tournament_entries (tournament_id);

create table if not exists public.entry_members (
  entry_id   uuid not null references public.tournament_entries(id) on delete cascade,
  player_id  text not null references public.players(id) on delete cascade,
  primary key (entry_id, player_id)
);
create index if not exists entry_members_player_idx on public.entry_members (player_id);

-- ---------- 3) MATCHES (result-o ekhane: status='completed' mane result published) ----
create table if not exists public.matches (
  id               uuid primary key default gen_random_uuid(),
  tournament_id    uuid not null references public.tournaments(id) on delete cascade,
  stage            text not null default 'League',
  round_no         int  not null default 1,
  match_no         int  not null default 1,
  home_entry_id    uuid references public.tournament_entries(id) on delete set null,
  away_entry_id    uuid references public.tournament_entries(id) on delete set null,
  home_score       int,
  away_score       int,
  home_pens        int,
  away_pens        int,
  winner_entry_id  uuid references public.tournament_entries(id) on delete set null,
  motm_player_id   text references public.players(id) on delete set null,
  status           text not null default 'scheduled' check (status in ('scheduled','live','completed')),
  scheduled_at     timestamptz,
  completed_at     timestamptz,
  next_match_id    uuid references public.matches(id) on delete set null,
  next_slot        text check (next_slot in ('home','away')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists matches_tournament_idx on public.matches (tournament_id, round_no, match_no);
create index if not exists matches_status_idx on public.matches (status, completed_at desc);

-- ---------- 4) PLAYER LINES (prottek match e prottek player er goal/result) ---
create table if not exists public.match_player_stats (
  match_id   uuid not null references public.matches(id) on delete cascade,
  player_id  text not null references public.players(id) on delete cascade,
  entry_id   uuid references public.tournament_entries(id) on delete set null,
  goals      int not null default 0,
  conceded   int not null default 0,
  result     text not null check (result in ('W','D','L')),
  primary key (match_id, player_id)
);
create index if not exists mps_player_idx on public.match_player_stats (player_id);

-- ---------- 5) ROW LEVEL SECURITY --------------------------------------------
-- Public shudhu pore (select). Likha/edit shudhu server API (service role) diye hoy.
alter table public.tournaments        enable row level security;
alter table public.tournament_entries enable row level security;
alter table public.entry_members      enable row level security;
alter table public.matches            enable row level security;
alter table public.match_player_stats enable row level security;

drop policy if exists "public read tournaments" on public.tournaments;
create policy "public read tournaments" on public.tournaments for select to anon, authenticated using (true);
drop policy if exists "public read entries" on public.tournament_entries;
create policy "public read entries" on public.tournament_entries for select to anon, authenticated using (true);
drop policy if exists "public read members" on public.entry_members;
create policy "public read members" on public.entry_members for select to anon, authenticated using (true);
drop policy if exists "public read matches" on public.matches;
create policy "public read matches" on public.matches for select to anon, authenticated using (true);
drop policy if exists "public read player lines" on public.match_player_stats;
create policy "public read player lines" on public.match_player_stats for select to anon, authenticated using (true);

-- ---------- 6) PLAYERS TABLE LOCK + PUBLIC VIEW ------------------------------
-- players table (email/password/whatsapp shoho) ar browser theke pora jabe na.
alter table public.players enable row level security;
revoke all on public.players from anon, authenticated;

-- Browser/homepage/profile eta theke porbe. email, password, whatsapp ekhane NAI.
create or replace view public.players_public as
select id, name, avatar, konami_id, device, location, rank_badge, facebook
from public.players;

-- ---------- 7) VIEWS (auto-calculated, publish korlei update hoy) -------------
create or replace view public.match_cards as
select
  m.*,
  t.name  as tournament_name,
  t.slug  as tournament_slug,
  t.category,
  t.format,
  he.name as home_name,
  ae.name as away_name,
  (select p.id     from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.home_entry_id order by p.id limit 1) as home_player_id,
  (select p.id     from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.away_entry_id order by p.id limit 1) as away_player_id,
  (select p.avatar from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.home_entry_id order by p.id limit 1) as home_avatar,
  (select p.avatar from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.away_entry_id order by p.id limit 1) as away_avatar,
  (select p.device from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.home_entry_id order by p.id limit 1) as home_device,
  (select p.device from public.entry_members em join public.players p on p.id = em.player_id where em.entry_id = m.away_entry_id order by p.id limit 1) as away_device,
  mp.name   as motm_name,
  mp.avatar as motm_avatar
from public.matches m
join public.tournaments t on t.id = m.tournament_id
left join public.tournament_entries he on he.id = m.home_entry_id
left join public.tournament_entries ae on ae.id = m.away_entry_id
left join public.players mp on mp.id = m.motm_player_id;

create or replace view public.league_standings as
with sides as (
  select m.tournament_id, m.home_entry_id as entry_id, m.home_score as gf, m.away_score as ga
  from public.matches m
  where m.status = 'completed' and m.home_entry_id is not null and m.away_entry_id is not null
  union all
  select m.tournament_id, m.away_entry_id, m.away_score, m.home_score
  from public.matches m
  where m.status = 'completed' and m.home_entry_id is not null and m.away_entry_id is not null
)
select
  e.tournament_id,
  e.id   as entry_id,
  e.name,
  count(s.entry_id)::int                                  as mp,
  (count(*) filter (where s.gf >  s.ga))::int             as w,
  (count(*) filter (where s.gf =  s.ga))::int             as d,
  (count(*) filter (where s.gf <  s.ga))::int             as l,
  coalesce(sum(s.gf), 0)::int                             as gf,
  coalesce(sum(s.ga), 0)::int                             as ga,
  coalesce(sum(s.gf - s.ga), 0)::int                      as gd,
  (3 * count(*) filter (where s.gf > s.ga)
     + count(*) filter (where s.gf = s.ga))::int          as pts
from public.tournament_entries e
left join sides s on s.entry_id = e.id and s.tournament_id = e.tournament_id
group by e.tournament_id, e.id, e.name;

-- Ranking (overall / monthly / weekly). Rating formula (chaile bodlate paro):
--   1000 + 25*Win + 8*Draw - 10*Loss + 2*(Goals - Conceded)
create or replace function public.get_ranking(p_period text default 'overall', p_limit int default 20)
returns table (
  player_id text, name text, avatar text, rank_badge text,
  matches int, wins int, draws int, losses int,
  goals int, conceded int, win_rate numeric, rating int
)
language sql stable security definer set search_path = public as $$
  with since as (
    select case lower(p_period)
             when 'weekly'  then date_trunc('week',  now())
             when 'monthly' then date_trunc('month', now())
             else '-infinity'::timestamptz end as ts
  ),
  agg as (
    select s.player_id,
           count(*)                                  as matches,
           count(*) filter (where s.result = 'W')    as wins,
           count(*) filter (where s.result = 'D')    as draws,
           count(*) filter (where s.result = 'L')    as losses,
           coalesce(sum(s.goals), 0)                 as goals,
           coalesce(sum(s.conceded), 0)              as conceded
    from public.match_player_stats s
    join public.matches m on m.id = s.match_id and m.status = 'completed'
    cross join since
    where m.completed_at >= since.ts
    group by s.player_id
  )
  select p.id, p.name, p.avatar, p.rank_badge,
         a.matches::int, a.wins::int, a.draws::int, a.losses::int,
         a.goals::int, a.conceded::int,
         round(100.0 * a.wins / nullif(a.matches, 0), 1),
         (1000 + 25 * a.wins + 8 * a.draws - 10 * a.losses + 2 * (a.goals - a.conceded))::int
  from agg a
  join public.players p on p.id = a.player_id
  order by 12 desc, a.wins desc, a.goals desc
  limit greatest(p_limit, 1);
$$;

create or replace function public.get_top_scorers(
  p_period text default 'overall', p_tournament uuid default null, p_limit int default 10
)
returns table (player_id text, name text, avatar text, matches int, goals int, ratio numeric)
language sql stable security definer set search_path = public as $$
  with since as (
    select case lower(p_period)
             when 'weekly'  then date_trunc('week',  now())
             when 'monthly' then date_trunc('month', now())
             else '-infinity'::timestamptz end as ts
  )
  select p.id, p.name, p.avatar,
         count(*)::int, coalesce(sum(s.goals), 0)::int,
         round(coalesce(sum(s.goals), 0)::numeric / nullif(count(*), 0), 2)
  from public.match_player_stats s
  join public.matches m on m.id = s.match_id and m.status = 'completed'
  join public.players p on p.id = s.player_id
  cross join since
  where m.completed_at >= since.ts
    and (p_tournament is null or m.tournament_id = p_tournament)
  group by p.id, p.name, p.avatar
  having coalesce(sum(s.goals), 0) > 0
  order by 5 desc, 6 desc
  limit greatest(p_limit, 1);
$$;

-- ---------- 8) RESULT PUBLISH / RESET (shudhu server API call korte parbe) -----
create or replace function public.publish_match_result(
  p_match_id uuid,
  p_home_score int, p_away_score int,
  p_home_pens int default null, p_away_pens int default null,
  p_motm_player_id text default null,
  p_player_goals jsonb default null
) returns public.matches
language plpgsql security definer set search_path = public as $$
declare
  m public.matches;
  t public.tournaments;
  nm public.matches;
  v_winner uuid;
begin
  select * into m from public.matches where id = p_match_id for update;
  if not found then raise exception 'Match paowa jayni'; end if;
  if m.home_entry_id is null or m.away_entry_id is null then
    raise exception 'Duto side-i thaka lagbe (age agher round er result publish koro)';
  end if;
  if p_home_score is null or p_away_score is null or p_home_score < 0 or p_away_score < 0 then
    raise exception 'Score valid na';
  end if;
  select * into t from public.tournaments where id = m.tournament_id;

  if p_home_score > p_away_score then v_winner := m.home_entry_id;
  elsif p_away_score > p_home_score then v_winner := m.away_entry_id;
  elsif p_home_pens is not null and p_away_pens is not null and p_home_pens <> p_away_pens then
    v_winner := case when p_home_pens > p_away_pens then m.home_entry_id else m.away_entry_id end;
  else v_winner := null;
  end if;

  if t.format = 'knockout' and v_winner is null then
    raise exception 'Knockout match e draw hobe na. Penalty score dao.';
  end if;

  -- result bodlale next round er match jodi ageii khela hoye thake, ata block
  if m.next_match_id is not null and m.winner_entry_id is distinct from v_winner then
    select * into nm from public.matches where id = m.next_match_id;
    if nm.status = 'completed' then
      raise exception 'Porer round er match ageii complete. Age oita reset koro.';
    end if;
  end if;

  update public.matches set
    home_score = p_home_score, away_score = p_away_score,
    home_pens = p_home_pens, away_pens = p_away_pens,
    winner_entry_id = v_winner,
    motm_player_id = nullif(p_motm_player_id, ''),
    status = 'completed',
    completed_at = coalesce(completed_at, now()),
    updated_at = now()
  where id = p_match_id
  returning * into m;

  -- player lines
  delete from public.match_player_stats where match_id = p_match_id;
  insert into public.match_player_stats (match_id, player_id, entry_id, goals, conceded, result)
  select p_match_id, em.player_id, em.entry_id,
    case when (select count(*) from public.entry_members x where x.entry_id = em.entry_id) = 1
         then (case when em.entry_id = m.home_entry_id then p_home_score else p_away_score end)
         else coalesce((p_player_goals ->> em.player_id)::int, 0) end,
    case when em.entry_id = m.home_entry_id then p_away_score else p_home_score end,
    case when em.entry_id = m.home_entry_id
         then (case when p_home_score > p_away_score then 'W' when p_home_score < p_away_score then 'L' else 'D' end)
         else (case when p_away_score > p_home_score then 'W' when p_away_score < p_home_score then 'L' else 'D' end) end
  from public.entry_members em
  where em.entry_id in (m.home_entry_id, m.away_entry_id);

  -- winner ke porer round e pathao
  if m.next_match_id is not null and v_winner is not null then
    if m.next_slot = 'home' then
      update public.matches set home_entry_id = v_winner, updated_at = now() where id = m.next_match_id;
    else
      update public.matches set away_entry_id = v_winner, updated_at = now() where id = m.next_match_id;
    end if;
  end if;

  -- knockout er final shesh hole tournament completed
  if t.format = 'knockout' and m.next_match_id is null then
    update public.tournaments set status = 'completed', updated_at = now() where id = t.id;
  end if;

  return m;
end;
$$;

create or replace function public.reset_match_result(p_match_id uuid)
returns public.matches
language plpgsql security definer set search_path = public as $$
declare m public.matches; nm public.matches;
begin
  select * into m from public.matches where id = p_match_id for update;
  if not found then raise exception 'Match paowa jayni'; end if;

  if m.next_match_id is not null then
    select * into nm from public.matches where id = m.next_match_id;
    if nm.status = 'completed' then
      raise exception 'Porer round er match ageii complete. Age oita reset koro.';
    end if;
    if m.next_slot = 'home' then
      update public.matches set home_entry_id = null, updated_at = now() where id = m.next_match_id;
    else
      update public.matches set away_entry_id = null, updated_at = now() where id = m.next_match_id;
    end if;
  end if;

  delete from public.match_player_stats where match_id = p_match_id;
  update public.matches set
    home_score = null, away_score = null, home_pens = null, away_pens = null,
    winner_entry_id = null, motm_player_id = null,
    status = 'scheduled', completed_at = null, updated_at = now()
  where id = p_match_id returning * into m;

  update public.tournaments set status = 'live', updated_at = now()
   where id = m.tournament_id and status = 'completed' and format = 'knockout';
  return m;
end;
$$;

-- ---------- 9) GRANTS --------------------------------------------------------
grant select on public.players_public, public.match_cards, public.league_standings to anon, authenticated;
grant execute on function public.get_ranking(text, int) to anon, authenticated;
grant execute on function public.get_top_scorers(text, uuid, int) to anon, authenticated;

revoke all on function public.publish_match_result(uuid, int, int, int, int, text, jsonb) from public, anon, authenticated;
revoke all on function public.reset_match_result(uuid) from public, anon, authenticated;
grant execute on function public.publish_match_result(uuid, int, int, int, int, text, jsonb) to service_role;
grant execute on function public.reset_match_result(uuid) to service_role;
