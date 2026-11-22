-- The restaurant menu and the outlet details shown beside it.
--
--   menu_groups        the big headings: Food, Drinks, Others
--   menu_categories    the tabs and sections under a heading: Rice, Noodles, ...
--   menu_items         one dish or drink and its price
--   outlet             the outlet's name and contact details (one row)
--   outlet_hours       opening hours, one row per day of the week
--   menu_admins        the logins that may change any of the above
--
-- Guests read the menu with the public anon key, so anyone may read what is
-- shown. Only a login listed in menu_admins may change anything, or see what
-- has been hidden. Logins are added to menu_admins by hand, in the SQL editor
-- (see the README), never from the app.
--
-- Every price is whole rupiah.
--
-- Run in the SQL editor, before 0002_menu_seed.sql. Safe to re-run.


-- 1. Who may edit.

create table if not exists public.menu_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Security definer so a policy can ask without the asker needing to read
-- menu_admins themselves. An empty search_path keeps it from being tricked by
-- a look-alike table in another schema.
create or replace function public.is_menu_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.menu_admins where user_id = (select auth.uid())
  )
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;


-- 2. The menu.

create table if not exists public.menu_groups (
  -- Seeded rows keep readable ids ('food'); ones added in the admin get a uuid.
  id         text primary key default gen_random_uuid()::text,
  name_en    text not null check (btrim(name_en) <> '' and char_length(name_en) <= 60),
  name_id    text not null check (btrim(name_id) <> '' and char_length(name_id) <= 60),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id         text primary key default gen_random_uuid()::text,
  -- Restrict: a group with categories in it cannot be deleted by accident.
  group_id   text not null references public.menu_groups (id) on update cascade on delete restrict,
  name_en    text not null check (btrim(name_en) <> '' and char_length(name_en) <= 60),
  name_id    text not null check (btrim(name_id) <> '' and char_length(name_id) <= 60),
  -- Extra words that find every item in this section, for sections whose item
  -- names don't say what they are: typing "beer" should also list Heineken.
  keywords   text[] not null default '{}',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_categories_group_id on public.menu_categories (group_id);

create table if not exists public.menu_items (
  -- Seeded rows keep the restaurant's own numbering (hf-3 = heavy food no. 3).
  id           text primary key default gen_random_uuid()::text,
  category_id  text not null references public.menu_categories (id) on update cascade on delete restrict,
  name         text not null check (btrim(name) <> '' and char_length(name) <= 120),
  price        integer not null check (price >= 0 and price <= 100000000),
  sort_order   integer not null default 0,
  -- Hidden items stay in the admin but leave the guest menu (sold out, seasonal).
  is_available boolean not null default true,
  -- Set to list the item under "Most ordered", 1 first. Fill this from real
  -- sales (POS) data, not guesses: the section stays hidden while none is set.
  popular_rank integer check (popular_rank between 1 and 999),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists menu_items_category_id on public.menu_items (category_id);


-- 3. The outlet.

create table if not exists public.outlet (
  -- Always true: there is exactly one outlet row.
  id         boolean primary key default true check (id),
  name       text not null check (btrim(name) <> '' and char_length(name) <= 80),
  address    text not null default '' check (char_length(address) <= 300),
  phone      text not null default '' check (char_length(phone) <= 30),
  maps_url   text not null default '' check (char_length(maps_url) <= 300),
  updated_at timestamptz not null default now()
);

create table if not exists public.outlet_hours (
  -- 0 = Sunday, matching JavaScript's Date#getDay().
  day        smallint primary key check (day between 0 and 6),
  opens_at   time not null default '06:00',
  closes_at  time not null default '19:00',
  is_closed  boolean not null default false,
  updated_at timestamptz not null default now()
);


-- 4. Keep updated_at honest.

do $$
declare
  table_name text;
begin
  foreach table_name in array array['menu_groups', 'menu_categories', 'menu_items', 'outlet', 'outlet_hours']
  loop
    execute format('drop trigger if exists touch_updated_at on public.%I', table_name);
    execute format(
      'create trigger touch_updated_at before update on public.%I
         for each row execute function public.touch_updated_at()',
      table_name
    );
  end loop;
end
$$;


-- 5. Who may do what.
--
-- Supabase grants every table to anon and authenticated by default; the
-- grants below narrow that first, then row level security decides per row.

alter table public.menu_admins     enable row level security;
alter table public.menu_groups     enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.outlet          enable row level security;
alter table public.outlet_hours    enable row level security;

-- menu_admins is managed in the SQL editor only. A login may see its own row,
-- which is how the app tells an admin from anyone else who signs in.
revoke all on public.menu_admins from anon, authenticated;
grant select on public.menu_admins to authenticated;

drop policy if exists "see own admin row" on public.menu_admins;
create policy "see own admin row" on public.menu_admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Everything else: anyone reads, only admins write.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['menu_groups', 'menu_categories', 'menu_items', 'outlet', 'outlet_hours']
  loop
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);

    execute format('drop policy if exists "admins add" on public.%I', table_name);
    execute format(
      'create policy "admins add" on public.%I for insert to authenticated
         with check ((select public.is_menu_admin()))',
      table_name
    );
    execute format('drop policy if exists "admins change" on public.%I', table_name);
    execute format(
      'create policy "admins change" on public.%I for update to authenticated
         using ((select public.is_menu_admin())) with check ((select public.is_menu_admin()))',
      table_name
    );
    execute format('drop policy if exists "admins remove" on public.%I', table_name);
    execute format(
      'create policy "admins remove" on public.%I for delete to authenticated
         using ((select public.is_menu_admin()))',
      table_name
    );
  end loop;
end
$$;

-- Reading: guests see only what is shown; admins see everything.
drop policy if exists "anyone reads" on public.menu_groups;
create policy "anyone reads" on public.menu_groups
  for select to anon, authenticated using (true);

drop policy if exists "anyone reads shown" on public.menu_categories;
create policy "anyone reads shown" on public.menu_categories
  for select to anon, authenticated
  using (is_visible or (select public.is_menu_admin()));

drop policy if exists "anyone reads shown" on public.menu_items;
create policy "anyone reads shown" on public.menu_items
  for select to anon, authenticated
  using (is_available or (select public.is_menu_admin()));

drop policy if exists "anyone reads" on public.outlet;
create policy "anyone reads" on public.outlet
  for select to anon, authenticated using (true);

drop policy if exists "anyone reads" on public.outlet_hours;
create policy "anyone reads" on public.outlet_hours
  for select to anon, authenticated using (true);
