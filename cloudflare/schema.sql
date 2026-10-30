-- Selim Uysal / Portfolio Analytics / Cloudflare D1 (SQLite)
-- This database is PRIVATE. Do not publish an API that allows anonymous SELECT.
-- Records only consented, pseudonymous interaction events. Do not store raw IP.
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'link_click', 'scroll_depth', 'engagement'
  )),
  visitor_id TEXT NOT NULL CHECK (length(visitor_id) BETWEEN 16 AND 64),
  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 16 AND 64),
  page_path TEXT NOT NULL CHECK (length(page_path) BETWEEN 1 AND 260),
  page_title TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  link_kind TEXT NOT NULL DEFAULT '',
  link_host TEXT NOT NULL DEFAULT '',
  link_path TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '',
  region_code TEXT NOT NULL DEFAULT '',
  device_type TEXT NOT NULL DEFAULT '',
  browser_family TEXT NOT NULL DEFAULT '',
  os_family TEXT NOT NULL DEFAULT '',
  site_language TEXT NOT NULL DEFAULT '',
  color_theme TEXT NOT NULL DEFAULT '',
  active_seconds INTEGER NOT NULL DEFAULT 0
    CHECK(active_seconds BETWEEN 0 AND 600),
  scroll_percent INTEGER NOT NULL DEFAULT 0
    CHECK(scroll_percent BETWEEN 0 AND 100),
  consent_version TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date
  ON analytics_events(received_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session
  ON analytics_events(session_id, received_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor
  ON analytics_events(visitor_id, received_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date
  ON analytics_events(event_type, received_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_date
  ON analytics_events(page_path, received_at);
