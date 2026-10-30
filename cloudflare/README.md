# Cloudflare D1 — Selim Portfolio Analytics
The database is created in the owner's Cloudflare Free account.
The schema tracks consented usage and interaction events only. It deliberately
excludes raw IP, name, email, precise location, fingerprints and full User-Agent.
Identifiers must only be created after legally appropriate opt-in.
Do not expose this table to any public unauthenticated read endpoint.

## Step 1
Cloudflare dashboard > Storage & databases > D1 SQL Database >
selim-portfolio-analytics > Console.
Paste the contents of schema.sql and select Execute.
Then check the Overview shows one table: analytics_events.
If your Console accepts only one SQL statement at a time, execute each
statement in schema.sql in order.

## Step 2
A public **collection** Worker may INSERT only validated, consented
events into the DB. A separate owner-only **report** Worker must be secured
with Cloudflare Access BEFORE it is deployed. Protect every route, preview,
and workers.dev hostname of that Worker.

## Step 3
Bind both Workers to the same D1 database using the binding name `DB`.
The public GitHub Pages site must never contain a privileged Cloudflare token
or a D1 credential. Data collection remains OFF until access control,
retention cleanup and consent UX have been verified.

## Retention
Proposed retention: 90 days. A daily Cloudflare Cron Trigger or scheduled
administrative task should run:
`DELETE FROM analytics_events WHERE received_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-90 days');`
Test deletion and backups. D1's Time Travel duration on the Free plan is
limited and is NOT a substitute for a full independent backup.
