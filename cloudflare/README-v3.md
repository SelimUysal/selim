# Selim Portfolio Analytics v3 — staged, NOT deployed

This directory contains a migration from the existing cookieless daily aggregate analytics to **opt-in, consent-aware** portfolio analytics.

**Current production remains unchanged.** Staged in the `analytics-v3-staging` branch only. Do not merge to `main` or deploy until all conditions below are complete.

## Files

- `assets/consent-analytics.js`: optional consent UI, basic aggregate and extended tracking
- `cloudflare/collector-worker.js`: Cloudflare ingestion, AES-GCM IP encryption, voluntary erasure, retention
- `cloudflare/report-worker.js`: private GitHub OAuth dashboard, summary, detail rows and CSV
- `cloudflare/schema-v3.sql`: additive D1 migration, preserves prior aggregates
- `cloudflare/wrangler.collector.toml`: D1 binding and 03:00 UTC daily cron
- `cloudflare/wrangler.reports.toml`: D1 binding for private reports
- `.github/workflows/deploy-analytics.yml`: manual-only deployment, requires owner-supplied secrets
- `privacy.html`: privacy notice **draft**, review before production

## Safe production rollout order

1. Review privacy notice, lawful consent, cross-border handling and necessity of IP+GPU+device metadata. No tracking before consent; reject and both opt-in options must work.
2. Take backups of **both Cloudflare Worker codes and the D1 database**. Keep existing GitHub OAuth app details and secrets unchanged.
3. D1 `selim-portfolio-analytics` > Console: run `cloudflare/schema-v3.sql`. The migration uses only CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS. Existing aggregate tables and test totals are preserved.
4. Create one secure **32-byte random base64 key** in Windows PowerShell:
   ```powershell
   $bytes = New-Object byte[] 32
   $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
   $rng.GetBytes($bytes); $rng.Dispose()
   [Convert]::ToBase64String($bytes)
   ```
   Add the **exact same value** to both `selim-analytics-collector` and `selim-analytics-reports` as **Secret** `ANALYTICS_ENCRYPTION_KEY`. Never send this value in chat or commit it. Keep `SESSION_SECRET` separate and unchanged. Both Workers must have D1 binding `DB`.
5. Deploy the collector code then the reports code manually **after** schema + secret setup, or configure GitHub Actions with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets (least privilege) to run the workflow manually.
6. Collector Settings > Triggers: daily cron `0 3 * * *` (UTC). Retention: encrypted IP, detailed events and aggregate counters up to 365 days, subject to daily cleanup.
7. Verify collector `/health` replies `version: 3`, reports GitHub OAuth login works, and `/api/details` is inaccessible to non-owner.
8. Only then merge `analytics-v3-staging` into `main`, so GitHub Pages loads `assets/consent-analytics.js` **instead of** the legacy `assets/cookieless-analytics.js`. The three HTML pages in the staging branch already perform the substitution.
9. In an incognito browser: Reject => no /events; Basic => aggregate increment; Extended => detailed rows + encrypted IP; opt-out => delete and no further tracking; DNT/GPC => no events. Verify project links and reports on mobile.
10. Complete a production smoke test and monitor D1 free-tier usage.

**Accuracy limits:** City, postal code, ISP and phone model are inexact/optional; browser cannot reveal a private hostname/device name; VPN/proxy detection is not reliable; linked sites and PDFs are not monitored by this site; page views are not unique humans. Unverified source fields remain unknown.

**Operational privacy note:** Aggregation is not a direct identification system; extended data could be personal data even if encrypted. Full IP is shown to the authorized owner only and exported CSV may contain personal data. Before public release, take a jurisdiction-specific legal review of collection and storage practices. 

### Local check
`node tests/analytics-staging-test.mjs`
