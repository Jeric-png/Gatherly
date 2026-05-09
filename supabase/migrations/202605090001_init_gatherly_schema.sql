-- Gatherly MVP schema
-- Public discovery, organiser operations, AI workflows, marketing, attendees, and community coordination.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  headline text,
  city text,
  preferred_language text not null default 'en',
  account_role text not null default 'attendee'
    check (account_role in ('attendee', 'organiser', 'both', 'admin')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  city text,
  avatar_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (community_id, profile_id)
);

create table if not exists public.events (
  id uuid primary key default extensions.gen_random_uuid(),
  community_id uuid references public.communities(id) on delete set null,
  organizer_id uuid references public.profiles(id) on delete set null,
  host_name text not null default 'Gatherly host',
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null,
  format text not null default 'in_person' check (format in ('in_person', 'online', 'hybrid')),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'archived')),
  visibility text not null default 'public' check (visibility in ('public', 'private', 'unlisted')),
  city text,
  country text,
  timezone text not null default 'UTC',
  venue_name text,
  venue_address text,
  starts_at timestamptz,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity >= 0),
  price_amount numeric(10,2) check (price_amount is null or price_amount >= 0),
  currency text not null default 'USD',
  hero_image_url text,
  tags text[] not null default '{}'::text[],
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.event_collaborators (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  invited_email text,
  role text not null default 'viewer' check (role in ('owner', 'editor', 'ops', 'viewer')),
  status text not null default 'invited' check (status in ('invited', 'active', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_collaborator_identity check (profile_id is not null or invited_email is not null),
  unique (event_id, profile_id),
  unique (event_id, invited_email)
);

create table if not exists public.event_attendees (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  status text not null default 'confirmed'
    check (status in ('invited', 'confirmed', 'waitlist', 'cancelled', 'checked_in', 'no_show')),
  ticket_status text not null default 'not_required'
    check (ticket_status in ('not_required', 'reserved', 'issued', 'void')),
  payment_status text not null default 'not_required'
    check (payment_status in ('not_required', 'pending', 'paid', 'refunded')),
  segment text not null default 'general',
  preferred_language text not null default 'en',
  dietary_notes text,
  mailing_list_opt_in boolean not null default true,
  source text not null default 'rsvp' check (source in ('rsvp', 'import', 'manual', 'ai_suggested')),
  reminder_status text not null default 'not_scheduled'
    check (reminder_status in ('not_scheduled', 'draft_ready', 'scheduled', 'sent', 'failed')),
  check_in_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, email)
);

create table if not exists public.audience_segments (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  description text,
  filter jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, name)
);

create table if not exists public.attendee_segment_members (
  segment_id uuid not null references public.audience_segments(id) on delete cascade,
  attendee_id uuid not null references public.event_attendees(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (segment_id, attendee_id)
);

create table if not exists public.event_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Guest',
  body text not null,
  language_code text not null default 'en',
  message_type text not null default 'message' check (message_type in ('message', 'announcement', 'ai_summary')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.message_translations (
  id uuid primary key default extensions.gen_random_uuid(),
  message_id uuid not null references public.event_messages(id) on delete cascade,
  target_language text not null,
  translated_body text not null,
  provider text not null default 'openai',
  model_name text,
  created_at timestamptz not null default now(),
  unique (message_id, target_language)
);

create table if not exists public.venue_leads (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  venue_type text,
  city text,
  address text,
  capacity_min integer check (capacity_min is null or capacity_min >= 0),
  capacity_max integer check (capacity_max is null or capacity_max >= 0),
  estimated_price numeric(10,2) check (estimated_price is null or estimated_price >= 0),
  currency text not null default 'USD',
  amenities text[] not null default '{}'::text[],
  source_provider text not null default 'seed' check (source_provider in ('seed', 'exa', 'manual')),
  source_url text,
  source_retrieved_at timestamptz,
  fit_score integer check (fit_score is null or (fit_score >= 0 and fit_score <= 100)),
  status text not null default 'suggested'
    check (status in ('suggested', 'shortlisted', 'selected', 'rejected', 'contacted')),
  ai_rationale text,
  missing_info text,
  contact_email text,
  contact_phone text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_leads (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  vendor_type text not null,
  city text,
  service_area text,
  estimated_price_min numeric(10,2) check (estimated_price_min is null or estimated_price_min >= 0),
  estimated_price_max numeric(10,2) check (estimated_price_max is null or estimated_price_max >= 0),
  currency text not null default 'USD',
  source_provider text not null default 'seed' check (source_provider in ('seed', 'exa', 'manual')),
  source_url text,
  source_retrieved_at timestamptz,
  fit_score integer check (fit_score is null or (fit_score >= 0 and fit_score <= 100)),
  status text not null default 'suggested'
    check (status in ('suggested', 'shortlisted', 'selected', 'rejected', 'contacted')),
  ai_rationale text,
  contact_email text,
  contact_phone text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discovery_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  run_type text not null check (run_type in ('venue', 'vendor', 'sponsor', 'campaign_research', 'comparable_event')),
  provider text not null default 'exa',
  query text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  result_count integer not null default 0 check (result_count >= 0),
  source_summary text,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_threads (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  lead_kind text not null check (lead_kind in ('venue', 'vendor')),
  venue_lead_id uuid references public.venue_leads(id) on delete cascade,
  vendor_lead_id uuid references public.vendor_leads(id) on delete cascade,
  channel text not null default 'email' check (channel in ('email', 'phone', 'in_app', 'simulation')),
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'simulated', 'contacted', 'responded', 'closed')),
  last_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint outreach_single_lead check (
    (lead_kind = 'venue' and venue_lead_id is not null and vendor_lead_id is null)
    or
    (lead_kind = 'vendor' and vendor_lead_id is not null and venue_lead_id is null)
  )
);

create table if not exists public.outreach_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  thread_id uuid not null references public.outreach_threads(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound', 'internal')),
  subject text,
  body text not null,
  language_code text not null default 'en',
  status text not null default 'draft' check (status in ('draft', 'approved', 'simulated', 'sent', 'received')),
  ai_generated boolean not null default false,
  approved_by uuid references public.profiles(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  workflow_type text not null,
  provider text not null,
  model_name text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  status text not null default 'completed' check (status in ('queued', 'running', 'completed', 'failed')),
  tokens_input integer check (tokens_input is null or tokens_input >= 0),
  tokens_output integer check (tokens_output is null or tokens_output >= 0),
  cost_estimate numeric(10,4) check (cost_estimate is null or cost_estimate >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.marketing_campaigns (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  objective text,
  audience text,
  channels text[] not null default '{}'::text[],
  status text not null default 'draft' check (status in ('draft', 'generated', 'approved', 'published', 'archived')),
  strategy_summary text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketing_assets (
  id uuid primary key default extensions.gen_random_uuid(),
  campaign_id uuid references public.marketing_campaigns(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  asset_type text not null
    check (asset_type in ('image', 'video', 'caption', 'email', 'ad_copy', 'poster_prompt', 'video_prompt', 'campaign_plan')),
  title text not null,
  prompt text,
  content text,
  asset_url text,
  provider text,
  model_name text,
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'approved', 'exported', 'published')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_publications (
  id uuid primary key default extensions.gen_random_uuid(),
  campaign_id uuid not null references public.marketing_campaigns(id) on delete cascade,
  asset_id uuid references public.marketing_assets(id) on delete set null,
  channel text not null,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'published', 'simulated', 'failed')),
  scheduled_at timestamptz,
  published_at timestamptz,
  provider text,
  external_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_jobs (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  segment_id uuid references public.audience_segments(id) on delete set null,
  ai_generation_id uuid references public.ai_generations(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  channel text not null default 'email' check (channel in ('email', 'sms', 'in_app')),
  purpose text not null
    check (purpose in ('invite', 'pre_event_reminder', 'last_call', 'announcement', 'post_event_follow_up')),
  subject text,
  body text not null,
  language_code text not null default 'en',
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'sent', 'simulated', 'failed')),
  provider text,
  provider_message_id text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operation_tasks (
  id uuid primary key default extensions.gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  category text not null default 'general'
    check (category in ('general', 'venue', 'vendor', 'marketing', 'attendee', 'community')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_at timestamptz,
  ai_suggested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function app_private.is_event_operator(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events e
    where e.id = target_event_id
      and e.organizer_id = auth.uid()
  )
  or exists (
    select 1
    from public.event_collaborators c
    where c.event_id = target_event_id
      and c.profile_id = auth.uid()
      and c.status = 'active'
      and c.role in ('owner', 'editor', 'ops')
  );
$$;

create or replace function app_private.is_event_participant(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select app_private.is_event_operator(target_event_id)
  or exists (
    select 1
    from public.event_attendees a
    where a.event_id = target_event_id
      and a.profile_id = auth.uid()
      and a.status in ('confirmed', 'checked_in')
  );
$$;

revoke all on function app_private.is_event_operator(uuid) from public;
revoke all on function app_private.is_event_participant(uuid) from public;
grant execute on function app_private.is_event_operator(uuid) to authenticated;
grant execute on function app_private.is_event_participant(uuid) to authenticated;

create index if not exists profiles_account_role_idx on public.profiles(account_role);
create index if not exists communities_created_by_idx on public.communities(created_by);
create index if not exists events_status_visibility_idx on public.events(status, visibility);
create index if not exists events_organizer_idx on public.events(organizer_id);
create index if not exists events_starts_at_idx on public.events(starts_at);
create index if not exists event_attendees_event_idx on public.event_attendees(event_id);
create index if not exists event_attendees_profile_idx on public.event_attendees(profile_id);
create index if not exists event_messages_event_idx on public.event_messages(event_id, created_at desc);
create index if not exists venue_leads_event_status_idx on public.venue_leads(event_id, status, fit_score desc);
create index if not exists vendor_leads_event_status_idx on public.vendor_leads(event_id, status, fit_score desc);
create index if not exists outreach_threads_event_idx on public.outreach_threads(event_id);
create index if not exists marketing_campaigns_event_idx on public.marketing_campaigns(event_id);
create index if not exists marketing_assets_event_idx on public.marketing_assets(event_id);
create index if not exists notification_jobs_event_status_idx on public.notification_jobs(event_id, status, scheduled_at);
create index if not exists operation_tasks_event_status_idx on public.operation_tasks(event_id, status);
create index if not exists ai_generations_event_workflow_idx on public.ai_generations(event_id, workflow_type, created_at desc);
create index if not exists discovery_runs_event_type_idx on public.discovery_runs(event_id, run_type, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_communities_updated_at on public.communities;
create trigger set_communities_updated_at before update on public.communities
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_event_collaborators_updated_at on public.event_collaborators;
create trigger set_event_collaborators_updated_at before update on public.event_collaborators
for each row execute function public.set_updated_at();

drop trigger if exists set_event_attendees_updated_at on public.event_attendees;
create trigger set_event_attendees_updated_at before update on public.event_attendees
for each row execute function public.set_updated_at();

drop trigger if exists set_audience_segments_updated_at on public.audience_segments;
create trigger set_audience_segments_updated_at before update on public.audience_segments
for each row execute function public.set_updated_at();

drop trigger if exists set_venue_leads_updated_at on public.venue_leads;
create trigger set_venue_leads_updated_at before update on public.venue_leads
for each row execute function public.set_updated_at();

drop trigger if exists set_vendor_leads_updated_at on public.vendor_leads;
create trigger set_vendor_leads_updated_at before update on public.vendor_leads
for each row execute function public.set_updated_at();

drop trigger if exists set_discovery_runs_updated_at on public.discovery_runs;
create trigger set_discovery_runs_updated_at before update on public.discovery_runs
for each row execute function public.set_updated_at();

drop trigger if exists set_outreach_threads_updated_at on public.outreach_threads;
create trigger set_outreach_threads_updated_at before update on public.outreach_threads
for each row execute function public.set_updated_at();

drop trigger if exists set_marketing_campaigns_updated_at on public.marketing_campaigns;
create trigger set_marketing_campaigns_updated_at before update on public.marketing_campaigns
for each row execute function public.set_updated_at();

drop trigger if exists set_marketing_assets_updated_at on public.marketing_assets;
create trigger set_marketing_assets_updated_at before update on public.marketing_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_campaign_publications_updated_at on public.campaign_publications;
create trigger set_campaign_publications_updated_at before update on public.campaign_publications
for each row execute function public.set_updated_at();

drop trigger if exists set_notification_jobs_updated_at on public.notification_jobs;
create trigger set_notification_jobs_updated_at before update on public.notification_jobs
for each row execute function public.set_updated_at();

drop trigger if exists set_operation_tasks_updated_at on public.operation_tasks;
create trigger set_operation_tasks_updated_at before update on public.operation_tasks
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.events enable row level security;
alter table public.event_collaborators enable row level security;
alter table public.event_attendees enable row level security;
alter table public.audience_segments enable row level security;
alter table public.attendee_segment_members enable row level security;
alter table public.event_messages enable row level security;
alter table public.message_translations enable row level security;
alter table public.venue_leads enable row level security;
alter table public.vendor_leads enable row level security;
alter table public.discovery_runs enable row level security;
alter table public.outreach_threads enable row level security;
alter table public.outreach_messages enable row level security;
alter table public.ai_generations enable row level security;
alter table public.marketing_campaigns enable row level security;
alter table public.marketing_assets enable row level security;
alter table public.campaign_publications enable row level security;
alter table public.notification_jobs enable row level security;
alter table public.operation_tasks enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.communities, public.events, public.event_messages, public.message_translations to anon, authenticated;
grant insert on public.event_attendees to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable"
on public.profiles for select
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "communities are publicly readable" on public.communities;
create policy "communities are publicly readable"
on public.communities for select
using (true);

drop policy if exists "authenticated users create communities" on public.communities;
create policy "authenticated users create communities"
on public.communities for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "community owners manage communities" on public.communities;
create policy "community owners manage communities"
on public.communities for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "community members are readable" on public.community_members;
create policy "community members are readable"
on public.community_members for select
using (true);

drop policy if exists "users join communities as self" on public.community_members;
create policy "users join communities as self"
on public.community_members for insert
to authenticated
with check (profile_id = auth.uid() and role = 'member');

drop policy if exists "public can read published events" on public.events;
create policy "public can read published events"
on public.events for select
using (status = 'published' and visibility in ('public', 'unlisted'));

drop policy if exists "operators can read owned events" on public.events;
create policy "operators can read owned events"
on public.events for select
to authenticated
using (organizer_id = auth.uid() or app_private.is_event_operator(id));

drop policy if exists "authenticated users create own events" on public.events;
create policy "authenticated users create own events"
on public.events for insert
to authenticated
with check (organizer_id = auth.uid());

drop policy if exists "operators update events" on public.events;
create policy "operators update events"
on public.events for update
to authenticated
using (organizer_id = auth.uid() or app_private.is_event_operator(id))
with check (organizer_id = auth.uid() or app_private.is_event_operator(id));

drop policy if exists "organizers delete own events" on public.events;
create policy "organizers delete own events"
on public.events for delete
to authenticated
using (organizer_id = auth.uid());

drop policy if exists "event collaborators read relevant rows" on public.event_collaborators;
create policy "event collaborators read relevant rows"
on public.event_collaborators for select
to authenticated
using (profile_id = auth.uid() or app_private.is_event_operator(event_id));

drop policy if exists "event operators manage collaborators" on public.event_collaborators;
create policy "event operators manage collaborators"
on public.event_collaborators for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "attendees can read own rows" on public.event_attendees;
create policy "attendees can read own rows"
on public.event_attendees for select
to authenticated
using (profile_id = auth.uid() or app_private.is_event_operator(event_id));

drop policy if exists "public can rsvp to published events" on public.event_attendees;
create policy "public can rsvp to published events"
on public.event_attendees for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and e.status = 'published'
      and e.visibility = 'public'
  )
  and (profile_id is null or profile_id = auth.uid())
);

drop policy if exists "attendees update own rows or operators manage" on public.event_attendees;
create policy "attendees update own rows or operators manage"
on public.event_attendees for update
to authenticated
using (profile_id = auth.uid() or app_private.is_event_operator(event_id))
with check (profile_id = auth.uid() or app_private.is_event_operator(event_id));

drop policy if exists "operators manage audience segments" on public.audience_segments;
create policy "operators manage audience segments"
on public.audience_segments for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage attendee segment members" on public.attendee_segment_members;
create policy "operators manage attendee segment members"
on public.attendee_segment_members for all
to authenticated
using (
  exists (
    select 1
    from public.audience_segments s
    where s.id = segment_id
      and app_private.is_event_operator(s.event_id)
  )
)
with check (
  exists (
    select 1
    from public.audience_segments s
    where s.id = segment_id
      and app_private.is_event_operator(s.event_id)
  )
);

drop policy if exists "public reads published event messages" on public.event_messages;
create policy "public reads published event messages"
on public.event_messages for select
using (
  exists (
    select 1
    from public.events e
    where e.id = event_id
      and e.status = 'published'
      and e.visibility in ('public', 'unlisted')
  )
);

drop policy if exists "participants post event messages" on public.event_messages;
create policy "participants post event messages"
on public.event_messages for insert
to authenticated
with check (
  profile_id = auth.uid()
  and app_private.is_event_participant(event_id)
);

drop policy if exists "operators update event messages" on public.event_messages;
create policy "operators update event messages"
on public.event_messages for update
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "public reads translations for visible messages" on public.message_translations;
create policy "public reads translations for visible messages"
on public.message_translations for select
using (
  exists (
    select 1
    from public.event_messages m
    join public.events e on e.id = m.event_id
    where m.id = message_id
      and e.status = 'published'
      and e.visibility in ('public', 'unlisted')
  )
);

drop policy if exists "participants add translations" on public.message_translations;
create policy "participants add translations"
on public.message_translations for insert
to authenticated
with check (
  exists (
    select 1
    from public.event_messages m
    where m.id = message_id
      and app_private.is_event_participant(m.event_id)
  )
);

drop policy if exists "operators manage venue leads" on public.venue_leads;
create policy "operators manage venue leads"
on public.venue_leads for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage vendor leads" on public.vendor_leads;
create policy "operators manage vendor leads"
on public.vendor_leads for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage discovery runs" on public.discovery_runs;
create policy "operators manage discovery runs"
on public.discovery_runs for all
to authenticated
using (event_id is not null and app_private.is_event_operator(event_id))
with check (event_id is not null and app_private.is_event_operator(event_id));

drop policy if exists "operators manage outreach threads" on public.outreach_threads;
create policy "operators manage outreach threads"
on public.outreach_threads for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage outreach messages" on public.outreach_messages;
create policy "operators manage outreach messages"
on public.outreach_messages for all
to authenticated
using (
  exists (
    select 1
    from public.outreach_threads t
    where t.id = thread_id
      and app_private.is_event_operator(t.event_id)
  )
)
with check (
  exists (
    select 1
    from public.outreach_threads t
    where t.id = thread_id
      and app_private.is_event_operator(t.event_id)
  )
);

drop policy if exists "users read own ai generations or event operators read event generations" on public.ai_generations;
create policy "users read own ai generations or event operators read event generations"
on public.ai_generations for select
to authenticated
using (
  profile_id = auth.uid()
  or (event_id is not null and app_private.is_event_operator(event_id))
);

drop policy if exists "users create own ai generations" on public.ai_generations;
create policy "users create own ai generations"
on public.ai_generations for insert
to authenticated
with check (
  (event_id is null and profile_id = auth.uid())
  or (event_id is not null and app_private.is_event_operator(event_id))
);

drop policy if exists "operators manage marketing campaigns" on public.marketing_campaigns;
create policy "operators manage marketing campaigns"
on public.marketing_campaigns for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage marketing assets" on public.marketing_assets;
create policy "operators manage marketing assets"
on public.marketing_assets for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage campaign publications" on public.campaign_publications;
create policy "operators manage campaign publications"
on public.campaign_publications for all
to authenticated
using (
  exists (
    select 1
    from public.marketing_campaigns c
    where c.id = campaign_id
      and app_private.is_event_operator(c.event_id)
  )
)
with check (
  exists (
    select 1
    from public.marketing_campaigns c
    where c.id = campaign_id
      and app_private.is_event_operator(c.event_id)
  )
);

drop policy if exists "operators manage notification jobs" on public.notification_jobs;
create policy "operators manage notification jobs"
on public.notification_jobs for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

drop policy if exists "operators manage operation tasks" on public.operation_tasks;
create policy "operators manage operation tasks"
on public.operation_tasks for all
to authenticated
using (app_private.is_event_operator(event_id))
with check (app_private.is_event_operator(event_id));

insert into public.communities (id, name, slug, description, city)
values
  ('00000000-0000-0000-0000-000000000001', 'Gatherly Labs', 'gatherly-labs', 'Demo community for AI-assisted social events.', 'Any city'),
  ('00000000-0000-0000-0000-000000000002', 'Maker Circle', 'maker-circle', 'Workshops and community sessions for builders.', 'Central neighbourhood'),
  ('00000000-0000-0000-0000-000000000003', 'Nomad Table Club', 'nomad-table-club', 'Warm dinners and social gatherings for curious people.', 'Riverside quarter')
on conflict (id) do nothing;

insert into public.events (
  id, community_id, host_name, title, slug, description, category, status, visibility,
  city, country, timezone, venue_name, venue_address, starts_at, ends_at, capacity,
  price_amount, currency, tags, ai_summary, published_at
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'Gatherly Labs',
    'Founders Dinner: Product Stories',
    'founders-dinner-product-stories',
    'A warm founder dinner for people building products, sharing lessons, and meeting practical collaborators.',
    'Networking dinner',
    'published',
    'public',
    'Any city',
    'Demo',
    'Asia/Singapore',
    'Studio Loft District',
    'Central creative district',
    '2026-10-24 11:30:00+00',
    '2026-10-24 14:30:00+00',
    100,
    0,
    'USD',
    array['networking', 'dinner', 'founders'],
    'Venue shortlist, attendee reminder draft, and marketing campaign are ready for organiser review.',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000002',
    'Maker Circle',
    'AI Creator Workshop',
    'ai-creator-workshop',
    'A hands-on workshop for creators learning how to turn event ideas into campaign assets with AI.',
    'Workshop',
    'published',
    'public',
    'Central neighbourhood',
    'Demo',
    'Asia/Singapore',
    'Creative Campus Hall',
    'Learning campus wing',
    '2026-11-07 06:00:00+00',
    '2026-11-07 09:00:00+00',
    160,
    24,
    'USD',
    array['workshop', 'ai', 'creator'],
    'Seeded workshop event for public discovery and RSVP testing.',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000003',
    'Nomad Table Club',
    'Community Supper Club',
    'community-supper-club',
    'An intimate supper club for community members to meet, exchange stories, and discover local collaborators.',
    'Social',
    'published',
    'public',
    'Riverside quarter',
    'Demo',
    'Asia/Singapore',
    'Greenhouse Kitchen',
    'Riverside dining room',
    '2026-11-15 10:00:00+00',
    '2026-11-15 13:00:00+00',
    60,
    18,
    'USD',
    array['social', 'dinner', 'community'],
    'Seeded social event for public discovery and community chat testing.',
    now()
  )
on conflict (id) do nothing;

insert into public.event_attendees (
  id, event_id, full_name, email, status, ticket_status, payment_status,
  segment, preferred_language, reminder_status, check_in_at
)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Amelia Wong', 'amelia@example.com', 'checked_in', 'issued', 'not_required', 'confirmed', 'en', 'scheduled', now()),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'Ravi Menon', 'ravi@example.com', 'confirmed', 'issued', 'not_required', 'vip', 'en', 'draft_ready', null),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'Mei Tan', 'mei@example.com', 'waitlist', 'reserved', 'not_required', 'waitlist', 'zh', 'draft_ready', null),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000101', 'Daniel Lim', 'daniel@example.com', 'confirmed', 'issued', 'not_required', 'confirmed', 'ms', 'sent', null)
on conflict (id) do nothing;

insert into public.audience_segments (id, event_id, name, description, filter)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000101', 'Confirmed attendees', 'Attendees eligible for pre-event reminder emails.', '{"status":["confirmed","checked_in"],"mailing_list_opt_in":true}'::jsonb),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000101', 'Waitlist', 'Waitlisted guests who should receive capacity updates.', '{"status":["waitlist"]}'::jsonb)
on conflict (id) do nothing;

insert into public.attendee_segment_members (segment_id, attendee_id)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201'),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000202'),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000204'),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000203')
on conflict do nothing;

insert into public.venue_leads (
  id, event_id, name, venue_type, city, address, capacity_min, capacity_max,
  estimated_price, currency, amenities, source_provider, fit_score, status,
  ai_rationale, missing_info
)
values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', 'The Assembly Loft', 'Creative venue', 'Any city', 'Studio district', 80, 120, 1400, 'USD', array['AV', 'flexible seating', 'catering access'], 'exa', 94, 'shortlisted', 'Strong match for a warm networking dinner with flexible layout and visual atmosphere.', 'Confirm final package pricing and weekend availability.'),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', 'Civic Hall Studio', 'Workshop space', 'Any city', 'Civic centre', 60, 100, 900, 'USD', array['projector', 'transit access'], 'seed', 88, 'suggested', 'Operationally simple venue with projector, transit access, and affordable weekday rates.', 'Check catering rules and after-hours access.'),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000101', 'Greenhouse Kitchen Room', 'Dining venue', 'Any city', 'Riverside quarter', 50, 90, 1750, 'USD', array['private dining', 'natural light'], 'exa', 82, 'suggested', 'Best atmosphere fit for intimate community events and creator dinners.', 'Confirm minimum spend and private room policy.')
on conflict (id) do nothing;

insert into public.vendor_leads (
  id, event_id, name, vendor_type, city, service_area, estimated_price_min,
  estimated_price_max, currency, source_provider, fit_score, status, ai_rationale
)
values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000101', 'Tablecraft Catering', 'Catering', 'Any city', 'Dinner events', 18, 28, 'USD', 'exa', 91, 'shortlisted', 'Good fit for flexible menus, halal-friendly requests, and plated or buffet service.'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000101', 'Signal AV Studio', 'AV support', 'Any city', 'Workshops and dinners', 600, 600, 'USD', 'seed', 86, 'suggested', 'Simple projector, microphone, lighting, and technician bundle.'),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000101', 'Lens & Light Collective', 'Photography', 'Any city', 'Community events', 450, 650, 'USD', 'exa', 79, 'suggested', 'Strong event recap style for community and creator gatherings.')
on conflict (id) do nothing;

insert into public.discovery_runs (id, event_id, run_type, provider, query, status, result_count, source_summary)
values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000101', 'venue', 'exa', 'creative dinner venues for 100 guests with AV support', 'completed', 3, 'Demo Exa-backed venue discovery run with source preservation placeholder.'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000101', 'vendor', 'exa', 'catering AV photography vendors for founder dinner', 'completed', 3, 'Demo Exa-backed vendor discovery run with fallback seeded results.')
on conflict (id) do nothing;

insert into public.outreach_threads (
  id, event_id, lead_kind, venue_lead_id, vendor_lead_id, channel, status, last_summary
)
values
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000101', 'venue', '00000000-0000-0000-0000-000000000401', null, 'simulation', 'simulated', 'Venue is interested but needs final date, layout, and AV confirmation.'),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000101', 'vendor', null, '00000000-0000-0000-0000-000000000501', 'simulation', 'draft', 'Initial catering outreach draft is ready for organiser approval.')
on conflict (id) do nothing;

insert into public.outreach_messages (id, thread_id, direction, subject, body, status, ai_generated)
values
  ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000701', 'outbound', 'Private dinner venue enquiry', 'Hi, we are planning a 100-person founder dinner and would like to confirm availability, AV support, and package pricing.', 'approved', true),
  ('00000000-0000-0000-0000-000000000712', '00000000-0000-0000-0000-000000000701', 'inbound', 'Re: Private dinner venue enquiry', 'Thanks for reaching out. We can support 100 guests and have AV available. Please confirm your preferred date and catering needs.', 'received', false)
on conflict (id) do nothing;

insert into public.ai_generations (
  id, event_id, workflow_type, provider, model_name, input, output, status
)
values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000101', 'event_plan', 'openai', 'gpt-5.5', '{"event_type":"founder dinner","capacity":100}'::jsonb, '{"summary":"Venue sourcing, vendor outreach, marketing, and reminder tasks prepared."}'::jsonb, 'completed'),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000101', 'marketing_campaign', 'openai', 'gpt-5.5', '{"selected_venue":"The Assembly Loft","selected_vendor":"Tablecraft Catering"}'::jsonb, '{"campaign":"Warm product stories dinner campaign"}'::jsonb, 'completed')
on conflict (id) do nothing;

insert into public.marketing_campaigns (
  id, event_id, title, objective, audience, channels, status, strategy_summary
)
values
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000101', 'Warm Product Stories Launch Campaign', 'Drive RSVPs from local founders and product builders.', 'Early-stage founders, product leads, and community operators.', array['email', 'instagram', 'linkedin', 'paid_social'], 'generated', 'Use venue warmth and founder storytelling as the creative anchor. Pair generated images with short founder-led copy and a vertical promo video.')
on conflict (id) do nothing;

insert into public.marketing_assets (
  id, campaign_id, event_id, asset_type, title, prompt, content, provider, model_name, status, metadata
)
values
  ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000101', 'poster_prompt', 'Warm dinner poster prompt', 'Create a warm editorial poster for a founder dinner in a loft venue with natural light, intimate tables, and thoughtful conversation.', '4:5 social poster concept using venue and catering context.', 'openai', 'chatgpt-image-2', 'generated', '{"aspect_ratio":"4:5"}'::jsonb),
  ('00000000-0000-0000-0000-000000000912', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000101', 'caption', 'LinkedIn invite caption', null, 'Join a small founder dinner built around honest product stories, practical lessons, and people you will actually want to follow up with.', 'openai', 'gpt-5.5', 'generated', '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000913', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000101', 'video_prompt', 'Vertical promo video direction', 'Use generated event images, venue details, and catering cues to create a 15-second vertical promo sequence.', 'Open on warm table details, cut to founder introductions, end with RSVP CTA.', 'openai', 'gpt-5.5', 'draft', '{"duration_seconds":15,"aspect_ratio":"9:16"}'::jsonb)
on conflict (id) do nothing;

insert into public.campaign_publications (id, campaign_id, asset_id, channel, status, provider, notes)
values
  ('00000000-0000-0000-0000-000000000921', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000912', 'linkedin', 'draft', 'simulation', 'Ready for organiser review before publish.'),
  ('00000000-0000-0000-0000-000000000922', '00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000911', 'instagram', 'draft', 'simulation', 'Awaiting approved generated image.')
on conflict (id) do nothing;

insert into public.notification_jobs (
  id, event_id, segment_id, ai_generation_id, channel, purpose, subject, body, language_code, status, provider, scheduled_at
)
values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000801', 'email', 'pre_event_reminder', 'Tomorrow: Founders Dinner logistics', 'Doors open at 7:00 PM. Dinner starts at 7:30 PM. Please reply with any dietary updates before noon.', 'en', 'scheduled', 'simulation', '2026-10-23 03:00:00+00'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000302', null, 'email', 'last_call', 'Waitlist update for Founders Dinner', 'We may release additional seats tomorrow. We will notify you as soon as capacity opens.', 'en', 'draft', 'simulation', null)
on conflict (id) do nothing;

insert into public.event_messages (id, event_id, author_name, body, language_code, message_type, is_pinned)
values
  ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000101', 'Sophia', 'Is there a dress code for the dinner?', 'en', 'message', false),
  ('00000000-0000-0000-0000-000000001102', '00000000-0000-0000-0000-000000000101', 'Gatherly AI', 'Draft announcement ready: doors open at 7:00 PM, dinner starts at 7:30 PM.', 'en', 'ai_summary', true),
  ('00000000-0000-0000-0000-000000001103', '00000000-0000-0000-0000-000000000101', 'Marcus', 'Can I bring a founder friend if there is space?', 'en', 'message', false)
on conflict (id) do nothing;

insert into public.message_translations (id, message_id, target_language, translated_body, provider, model_name)
values
  ('00000000-0000-0000-0000-000000001111', '00000000-0000-0000-0000-000000001101', 'es', 'Hay algun codigo de vestimenta para la cena?', 'openai', 'gpt-5.5'),
  ('00000000-0000-0000-0000-000000001112', '00000000-0000-0000-0000-000000001102', 'zh', '公告草稿已准备好：晚上 7:00 开门，晚餐 7:30 开始。', 'openai', 'gpt-5.5')
on conflict (id) do nothing;

insert into public.operation_tasks (id, event_id, title, description, category, status, priority, due_at, ai_suggested)
values
  ('00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000101', 'Approve event brief', 'Audience, budget, vibe, and city constraints saved.', 'general', 'done', 'high', now() - interval '2 days', true),
  ('00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000101', 'Review venue shortlist', 'Compare top venue matches and confirm availability questions.', 'venue', 'in_progress', 'high', now() + interval '2 days', true),
  ('00000000-0000-0000-0000-000000001203', '00000000-0000-0000-0000-000000000101', 'Approve campaign assets', 'Review poster prompt, email invite, ad copy, and video direction.', 'marketing', 'todo', 'medium', now() + interval '4 days', true),
  ('00000000-0000-0000-0000-000000001204', '00000000-0000-0000-0000-000000000101', 'Schedule attendee reminder', 'Use AI-drafted logistics email for confirmed attendee segment.', 'attendee', 'todo', 'medium', now() + interval '6 days', true)
on conflict (id) do nothing;
