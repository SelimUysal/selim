-- Optional no-cookie analytics scheme (Cloudflare D1 / SQLite).
-- Run AFTER reviewing in the D1 SQL Console.
-- Does not alter or delete the existing analytics_events table.
-- No IP, session ID, visitor ID, full user agent, precise location or URL query stored.
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
  day TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('page_view','link_click')),
  page_path TEXT NOT NULL CHECK(page_path IN (
    '/selim/', '/selim/index.html', '/selim/projects.html', '/selim/case-studies.html'
  )),
  link_category TEXT NOT NULL DEFAULT '-',
  country_code TEXT NOT NULL DEFAULT 'XX',
  device_group TEXT NOT NULL DEFAULT 'unknown',
  event_count INTEGER NOT NULL DEFAULT 0 CHECK(event_count >= 0),
  PRIMARY KEY (day,event_type,page_path,link_category,country_code,device_group)
);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_day
 ON analytics_daily_summary(day);
-- Execute regularly via the Worker scheduled() handler and a Cron Trigger:
-- DELETE FROM analytics_daily_summary WHERE day < date('now','-90 days');
