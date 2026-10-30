-- Cloudflare D1: project-by-project click totals.
-- Run in D1 Console AFTER analytics_daily_summary was created.
-- Non-destructive: existing traffic stats are unaffected.
-- Stores daily aggregate counts for predefined links only. No IP or visitor IDs.
CREATE TABLE IF NOT EXISTS analytics_click_targets (
  day TEXT NOT NULL,
  page_path TEXT NOT NULL CHECK(page_path IN (
    '/selim/', '/selim/index.html', '/selim/projects.html', '/selim/case-studies.html'
  )),
  target_key TEXT NOT NULL CHECK(length(target_key) BETWEEN 3 AND 100),
  event_count INTEGER NOT NULL DEFAULT 0 CHECK(event_count >= 0),
  PRIMARY KEY(day, page_path, target_key)
);
CREATE INDEX IF NOT EXISTS idx_analytics_click_targets_day
  ON analytics_click_targets(day);
-- Scheduled cleanup for 90-day retention:
-- DELETE FROM analytics_click_targets WHERE day < date('now','-90 days');
