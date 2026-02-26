-------------------------------------------------------------------------------------------------
-- Profiles table & RLS policies
-- Each user has a UUID
-- RLS makes sure that users can only read, create, and update their own data
-------------------------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null unique,
    created_at timestamptz not null default now());

alter table public.profiles enable row level security;

-- Allow users to select their own profile
create policy "Users can view their own profile" 
on public.profiles for select 
to authenticated
using (id = auth.uid());

-- Allows authenticated users to create a profile
create policy "Authenticated users can create a profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

-- Allows authenticated users to update their own profile
create policy "Authenticated users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-------------------------------------------------------------------------------------------------
-- Planting actions table
-------------------------------------------------------------------------------------------------
create table if not exists public.planting_actions (
    id uuid primary key default gen_random_uuid(),
    plant text not null,
    variant text null,
    action text not null check (action in ('start_indoors', 'direct_sow', 'transplant')),
    seasons text[] not null default '{}'::text[],
    months int[] not null default '{}'::int[],
    created_at timestamptz not null default now(),
    constraint planting_actions_unique unique (plant, variant, action)
);

create index if not exists planting_actions_plant_idx 
on public.planting_actions (plant);

create index if not exists planting_actions_variant_idx 
on public.planting_actions (variant);

create index if not exists planting_actions_action_idx 
on public.planting_actions (action);

-- GIN index can search inside arrays (ex. find plants that can be started indoors in Feb)
create index if not exists planting_actions_months_gin_idx
  on public.planting_actions using gin (months);

create index if not exists planting_actions_seasons_gin_idx
  on public.planting_actions using gin (seasons);

alter table public.planting_actions enable row level security;

create policy "Users can view planting actions"
on public.planting_actions
for select
to authenticated
using (true);

-------------------------------------------------------------------------------------------------
-- Seed catalog table (main list of seeds)
-- Read only access for authenticated users
-------------------------------------------------------------------------------------------------
create table if not exists public.seed_catalog (
    id uuid primary key default gen_random_uuid(),
    sku text unique not null,
    name text not null,
    type text not null,
    category text,
    latin text,
    difficulty text,
    exposure text,
    matures_in_days integer,
    matures_under_days integer,
    description text,
    timing text,
    starting text,
    growing text,
    companion_planting text,
    handle text,
    url text,
    image text,
    created_at timestamptz not null default now());

-- Indexes for faster queries
create index if not exists seed_catalog_name_idx on public.seed_catalog (name);
create index if not exists seed_catalog_sku_idx on public.seed_catalog (sku);
create index if not exists seed_catalog_type_idx on public.seed_catalog (type);
create index if not exists seed_catalog_category_idx on public.seed_catalog (category);

alter table public.seed_catalog enable row level security;

-- Note: category is free text; for strict validation add a plants/categories table with a unique name and FK to it

create policy "Users can view the seed catalog"
on public.seed_catalog for select
to authenticated
using (true);

-------------------------------------------------------------------------------------------------
-- Custom seeds table (user-created seeds not in catalog)
-------------------------------------------------------------------------------------------------
create table if not exists public.custom_seeds (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id) on delete cascade,

  name text not null,

  -- constrained fields
  type text not null check (type in ('vegetable','flower','fruit','herb')),
  category text not null,
  latin text,
  difficulty text check (
    difficulty is null or difficulty in (
      'very easy',
      'easy',
      'moderately easy',
      'somewhat challenging',
      'moderately challenging',
      'challenging'
    )
  ),
  exposure text check (
    exposure is null or exposure in (
      'full sun',
      'part sun',
      'part shade',
      'full sun to part shade',
      'full sun to light shade',
      'shade'
    )
  ),

  -- days (nullable if user doesn't enter)
  matures_in_days integer check (matures_in_days is null or matures_in_days >= 0),
  matures_under_days integer check (matures_under_days is null or matures_under_days >= 0),

  -- content fields
  description text,
  timing text,
  starting text,
  growing text,
  companion_planting text,

  -- uploaded image URL/path (supabase storage public url or signed url or storage path)
  image text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_seeds_user_id_idx on public.custom_seeds (user_id);
create index if not exists custom_seeds_type_idx on public.custom_seeds (type);
create index if not exists custom_seeds_category_idx on public.custom_seeds (category);
create index if not exists custom_seeds_name_idx on public.custom_seeds (name);

alter table public.custom_seeds enable row level security;

create policy "Users can manage their own custom seeds"
on public.custom_seeds
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-------------------------------------------------------------------------------------------------
-- User seed collection table
-------------------------------------------------------------------------------------------------
create table if not exists public.user_seed_collection (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,

    catalog_seed_id uuid references public.seed_catalog(id) on delete restrict,
    custom_seed_id uuid references public.custom_seeds(id) on delete cascade,

    notes text,
    
    -- Only one of the two can be not null
    constraint user_seed_collection_chk check (
        (catalog_seed_id is not null and custom_seed_id is null)
        or 
        (catalog_seed_id is null and custom_seed_id is not null)
    ),
    
    created_at timestamptz not null default now());

create index if not exists user_seed_collection_user_idx
on public.user_seed_collection (user_id);

create index if not exists user_seed_collection_catalog_seed_idx
on public.user_seed_collection (catalog_seed_id);

create index if not exists user_seed_collection_custom_seed_idx
  on public.user_seed_collection (custom_seed_id);

  -- prevent duplicates for the same user
create unique index if not exists user_seed_collection_unique_catalog
  on public.user_seed_collection (user_id, catalog_seed_id)
  where catalog_seed_id is not null;

create unique index if not exists user_seed_collection_unique_custom
  on public.user_seed_collection (user_id, custom_seed_id)
  where custom_seed_id is not null;

  alter table public.user_seed_collection enable row level security;

  create policy "Users can view their own seed collection"
  on public.user_seed_collection
  for select
  to authenticated
  using (auth.uid() = user_id);

  create policy "Users can add to their own seed collection"
  on public.user_seed_collection
  for insert
  to authenticated
  with check (auth.uid() = user_id);

  create policy "Users can update their own seed collection"
  on public.user_seed_collection
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

  create policy "Users can delete from their own seed collection"
  on public.user_seed_collection
  for delete
  to authenticated
  using (auth.uid() = user_id);

-------------------------------------------------------------------------------------------------
-- User seed notes table
-------------------------------------------------------------------------------------------------
create table if not exists public.user_seed_notes (
    id uuid primary key default gen_random_uuid(),

  user_seed_collection_id uuid not null
    references public.user_seed_collection (id)
    on delete cascade,

  user_id uuid not null
    references public.profiles (id)
    on delete cascade,

  note text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_seed_notes_collection_idx
  on public.user_seed_notes (user_seed_collection_id);

create index if not exists user_seed_notes_user_idx
  on public.user_seed_notes (user_id);

alter table public.user_seed_notes enable row level security;

create policy "Users can view their seed notes"
on public.user_seed_notes for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their seed notes"
on public.user_seed_notes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their seed notes"
on public.user_seed_notes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their seed notes"
on public.user_seed_notes for delete
to authenticated
using (auth.uid() = user_id);

  -------------------------------------------------------------------------------------------------
-- User photos table
-------------------------------------------------------------------------------------------------
create table if not exists public.user_seed_photos (
  id uuid primary key default gen_random_uuid(),

  user_seed_collection_id uuid not null
    references public.user_seed_collection (id)
    on delete cascade,

  user_id uuid not null
    references public.profiles (id)
    on delete cascade,

  image_url text not null,

  created_at timestamptz not null default now()
);

create index if not exists user_seed_photos_collection_idx
  on public.user_seed_photos (user_seed_collection_id);

create index if not exists user_seed_photos_user_idx
  on public.user_seed_photos (user_id);

alter table public.user_seed_photos enable row level security;

create policy "Users can view their seed photos"
on public.user_seed_photos for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their seed photos"
on public.user_seed_photos for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their seed photos"
on public.user_seed_photos for delete
to authenticated
using (auth.uid() = user_id);

  -------------------------------------------------------------------------------------------------
-- User seed events table
-------------------------------------------------------------------------------------------------
create table if not exists public.user_seed_events (
  id uuid primary key default gen_random_uuid(),

  user_seed_collection_id uuid not null
    references public.user_seed_collection (id)
    on delete cascade,

  user_id uuid not null
    references public.profiles (id)
    on delete cascade,

  event_type text not null,

  event_date date not null,

  notes text,

  created_at timestamptz not null default now()
);

create index if not exists user_seed_events_collection_idx
  on public.user_seed_events (user_seed_collection_id);

create index if not exists user_seed_events_user_idx
  on public.user_seed_events (user_id);

create index if not exists user_seed_events_date_idx
  on public.user_seed_events (event_date);

alter table public.user_seed_events enable row level security;

create policy "Users can view their seed events"
on public.user_seed_events for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their seed events"
on public.user_seed_events for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their seed events"
on public.user_seed_events for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their seed events"
on public.user_seed_events for delete
to authenticated
using (auth.uid() = user_id);