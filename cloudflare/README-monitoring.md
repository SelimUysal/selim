# Private Cloudflare Worker Monitoring (Analytics v3)

The owner-only report Worker now includes a **Cloudflare Sistem Durumu** section in the same panel at
`https://selim-analytics-reports.uys-selim.workers.dev/`.

## Required setup (once)

1. Cloudflare Dashboard → **Profile** → **API Tokens** → Create Token → Custom Token.
2. Grant only **Account → Workers Scripts → Read** (deployment/version history) and
   **Account → Account Analytics → Read** (Worker invocation statistics).
   Restrict the token to the Cloudflare account containing the two Workers.
3. In `selim-analytics-reports` → **Settings → Variables and Secrets**, set:
   - `CLOUDFLARE_ACCOUNT_ID` as Text: exact 32-character Cloudflare account ID.
   - `CLOUDFLARE_MONITOR_TOKEN` as Secret: value of the read-only token.
4. Deploy the current `cloudflare/report-worker.js` from `main` into
   `selim-analytics-reports`. Do not change the collector or its Cron, D1 binding,
   GitHub OAuth settings, session secret or encryption secret.
5. Reload the private report panel and log in using the allowed GitHub account.
   A missing permission or unavailable API appears as an explicit warning; the
   ordinary visitor D1 reports continue working.

**Never commit the API token to GitHub, include it in screenshots or share it in chat.**
A read-only token is enough; no edit/deployment privileges are needed.

## What the panel displays

- Both `selim-analytics-collector` and `selim-analytics-reports`.
- Latest active deployment ID, active Worker version ID(s), traffic percentages,
  created/deployed timestamps, trigger/source and available author/message.
- Recent Worker deployments and version history returned by Cloudflare's API.
- Past-24-hour request totals, **average requests/second**, error rate and an
  **approximate** p50 CPU time in milliseconds, derived from GraphQL analytics buckets.

Cloudflare Dashboard's instantaneous requests/sec, exact global CPU p50,
its Ready badges and manually composed rollout history screens are **not**
necessarily available identically via the APIs. The private report labels
differences and omits unavailable fields, instead of inventing values.
The current endpoint fetches the latest first page of deployments and versions;
it does not promise a complete indefinite deployment archive.

## Security

- Endpoint: `GET /api/system` in the report Worker only.
- Existing owner-only GitHub OAuth authorization is required **before** API calls.
- Both Cloudflare API requests are server-side; no token is sent to a browser.
- `Cache-Control: no-store, private` on the private JSON response.
- Never embed the token in JavaScript or GitHub Pages.
- The Cloudflare monitoring API is independent of visitor consent and D1.
