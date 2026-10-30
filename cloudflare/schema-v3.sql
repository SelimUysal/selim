-- Selim Portfolio Analytics v3; run once on existing D1 database.
-- Additive migration: keeps all existing aggregate counters.
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
 day TEXT NOT NULL, event_type TEXT NOT NULL CHECK(event_type IN ('page_view','link_click')),
 page_path TEXT NOT NULL, link_category TEXT NOT NULL DEFAULT '-',
 country_code TEXT NOT NULL DEFAULT 'XX',device_group TEXT NOT NULL DEFAULT 'unknown',
 event_count INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(day,event_type,page_path,link_category,country_code,device_group)
);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_summary_day ON analytics_daily_summary(day);
CREATE TABLE IF NOT EXISTS analytics_click_targets (
 day TEXT NOT NULL,page_path TEXT NOT NULL,target_key TEXT NOT NULL,
 event_count INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,page_path,target_key)
);
CREATE INDEX IF NOT EXISTS idx_analytics_click_targets_day ON analytics_click_targets(day);
CREATE TABLE IF NOT EXISTS analytics_detail_events (
 event_id TEXT PRIMARY KEY,recorded_at TEXT NOT NULL,day TEXT NOT NULL,
 visitor_token TEXT NOT NULL,session_token TEXT NOT NULL,
 consent_version TEXT NOT NULL,
 event_type TEXT NOT NULL CHECK(event_type IN ('page_view','link_click','engagement')),
 page_path TEXT NOT NULL,target_key TEXT NOT NULL DEFAULT '',
 destination_url TEXT NOT NULL DEFAULT '',link_category TEXT NOT NULL DEFAULT '-',
 referrer_host TEXT NOT NULL DEFAULT '',scroll_pct INTEGER,active_seconds INTEGER,
 ip_ciphertext TEXT,country_code TEXT,city TEXT,region TEXT,region_code TEXT,
 postal_code TEXT,continent TEXT,geo_timezone TEXT,asn INTEGER,
 network_organization TEXT,isp_guess TEXT,vpn_proxy_status TEXT NOT NULL DEFAULT 'unknown',
 device_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_analytics_detail_events_day ON analytics_detail_events(day);
CREATE INDEX IF NOT EXISTS idx_analytics_detail_events_visitor ON analytics_detail_events(visitor_token);
CREATE INDEX IF NOT EXISTS idx_analytics_detail_events_target ON analytics_detail_events(target_key,day);
-- Configure scheduled cleanup on collector: 0 3 * * * (UTC).
