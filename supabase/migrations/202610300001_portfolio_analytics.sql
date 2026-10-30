-- Private portfolio analytics. Never expose records through PostgREST.
create table if not exists public.portfolio_analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_type text not null check (event_type in ('page_view','click','engagement','scroll')),
  visitor_id uuid not null,
  session_id uuid not null,
  page_path text not null check (char_length(page_path) between 1 and 260),
  page_title text not null default '',
  referrer_host text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  link_kind text not null default '',
  link_host text not null default '',
  link_path text not null default '',
  link_label text not null default '',
  active_seconds integer not null default 0 check (active_seconds between 0 and 600),
  scroll_percent integer not null default 0 check (scroll_percent between 0 and 100),
  site_language text not null default '',
  color_theme text not null default '',
  viewport_width integer not null default 0,
  viewport_height integer not null default 0,
  screen_width integer not null default 0,
  timezone text not null default '',
  user_agent text not null default '',
  country_code text not null default '',
  region text not null default '',
  ip_daily_digest text not null default ''
);
create index if not exists portfolio_analytics_time on public.portfolio_analytics_events (occurred_at desc);
create index if not exists portfolio_analytics_session on public.portfolio_analytics_events (session_id, occurred_at desc);
create index if not exists portfolio_analytics_visitor on public.portfolio_analytics_events (visitor_id, occurred_at desc);
create index if not exists portfolio_analytics_type on public.portfolio_analytics_events (event_type, occurred_at desc);

alter table public.portfolio_analytics_events enable row level security;
-- Explicitly disallow all access for anonymous and authenticated browser users.
-- All reads and writes happen through Edge Functions using server-only credentials.
revoke all on table public.portfolio_analytics_events from anon, authenticated, public;
revoke all on sequence public.portfolio_analytics_events_id_seq from anon, authenticated, public;
grant select, insert, update, delete on table public.portfolio_analytics_events to service_role;
grant usage, select on sequence public.portfolio_analytics_events_id_seq to service_role;

comment on table public.portfolio_analytics_events is
  'Opt-in portfolio telemetry; daily IP HMAC only, never raw IP. Delete after 90 days.';

-- Optional retention job, run once in Supabase SQL Editor if pg_cron is enabled:
-- select cron.schedule(
--   'portfolio-analytics-90-day-cleanup',
--   '20 3 * * *',
--   $$delete from public.portfolio_analytics_events where occurred_at < now() - interval '90 days'$$
-- );
