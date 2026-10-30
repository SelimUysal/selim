/**
 * Portfolio Analytics v2 — cookieless, non-identifying DAILY AGGREGATES.
 * Deployed as Cloudflare Worker with D1 binding name DB.
 *
 * Stores day/page/country/device/category COUNTS only. No IP, cookies,
 * fingerprint, long-lived visitor/session IDs or full referring URLs.
 *
 * Note: IPs are necessarily processed by network infrastructure in transit.
 * Personal-data law still requires a context-specific legal assessment.
 */
const ORIGIN = "https://selimuysal.github.io";
const PAGES = new Set([
  "/selim/", "/selim/index.html", "/selim/projects.html", "/selim/case-studies.html"
]);
const TYPES = new Set(["page_view", "link_click"]);
const CATEGORIES = new Set(["-", "pdf", "github", "youtube", "linkedin", "project", "external", "internal"]);
const DEVICES = new Set(["mobile", "tablet", "desktop", "unknown"]);
const ALLOWED_TARGETS = new Set(["project:teknofest:report","project:oracle:report","project:patterns:report","project:hayat:live","project:hayat:source","project:hayat:video","project:video:store","project:video:source","project:telegram:source","project:telegram:video","project:quran:live","project:quran:source","project:python-exercises:source","project:c-exercises:source","project:sql-resources:source","certificate:genai-llm:pdf","certificate:genai-llm:verify","certificate:oracle-sql:pdf","certificate:deneyap-instructor:pdf","volunteering:video","case:rims:video","case:teknofest:details","case:rims:details","navigation:projects"]);
const responseHeaders = Object.freeze({
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
  "Vary": "Origin",
  "Content-Type": "application/json; charset=utf-8"
});
const output = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: responseHeaders });
function safeCountry(country) {
  return typeof country === "string" && /^[A-Z]{2}$/.test(country) ? country : "XX";
}
function parseEvent(body) {
  if (!body || typeof body !== "object") return null;
  const event_type = String(body.event_type || "");
  const page_path = String(body.page_path || "");
  const link_category = String(body.link_category || "-");
  const device_group = String(body.device_group || "unknown");
  if (!TYPES.has(event_type) || !PAGES.has(page_path) ||
      !CATEGORIES.has(link_category) || !DEVICES.has(device_group) ||
      (event_type === "page_view" && link_category !== "-")) return null;
  const target_key = typeof body.target_key === "string" ? body.target_key : "";
  if (target_key && (event_type!=="link_click" || !ALLOWED_TARGETS.has(target_key))) return null;
  return { event_type, page_path, link_category, device_group, target_key };
}
async function accept(request, env) {
  if (request.headers.get("Origin") !== ORIGIN) return output({ error: "Origin not allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders });
  if (request.method !== "POST") return output({ error: "Method not allowed" }, 405);
  if (!env.DB) return output({ error: "D1 binding DB missing" }, 503);
  if (!String(request.headers.get("Content-Type") || "").startsWith("application/json")) return output({ error: "JSON required" }, 415);
  if (Number(request.headers.get("Content-Length") || 0) > 650) return output({ error: "Payload too large" }, 413);
  let body;
  try {
    const s = await request.text();
    if (s.length > 650) return output({ error: "Payload too large" }, 413);
    body = JSON.parse(s);
  } catch { return output({ error: "Invalid JSON" }, 400); }
  const ev = parseEvent(body);
  if (!ev) return output({ error: "Invalid event" }, 400);
  const userAgent = request.headers.get("user-agent") || "";
  if (/bot|spider|crawler|headless|lighthouse|preview|facebookexternalhit|whatsapp/i.test(userAgent))
    return output({ accepted: false, reason: "automated" }, 202);
  const country = safeCountry(request.cf?.country);
  const day = new Date().toISOString().slice(0, 10);
  try {
    await env.DB.prepare(
      `INSERT INTO analytics_daily_summary
       (day,event_type,page_path,link_category,country_code,device_group,event_count)
       VALUES (?,?,?,?,?,?,1)
       ON CONFLICT(day,event_type,page_path,link_category,country_code,device_group)
       DO UPDATE SET event_count = event_count + 1`
    ).bind(day,ev.event_type,ev.page_path,ev.link_category,country,ev.device_group).run();
    if (ev.target_key) {
      // The original category count is already committed. This second aggregate
      // enriches reports and never stores per-visitor records.
      await env.DB.prepare(
        `INSERT INTO analytics_click_targets (day,page_path,target_key,event_count)
         VALUES (?,?,?,1)
         ON CONFLICT(day,page_path,target_key)
         DO UPDATE SET event_count=event_count+1`
      ).bind(day,ev.page_path,ev.target_key).run();
    }
    return output({ accepted: true }, 202);
  } catch {
    return output({ error: "Collection unavailable" }, 503);
  }
}
export default {
  async fetch(request, env) {
    const route = new URL(request.url).pathname;
    if (route === "/health" && request.method === "GET")
      return output({ status: "ok", mode: "cookieless-daily-aggregate", databaseBound: Boolean(env.DB) });
    if (route !== "/events") return output({ error: "Not found" }, 404);
    return accept(request, env);
  },
  async scheduled(_event, env, ctx) {
    if (!env.DB) return;
    ctx.waitUntil(
      Promise.all([
        env.DB.prepare("DELETE FROM analytics_daily_summary WHERE day < date('now','-90 days')").run(),
        env.DB.prepare("DELETE FROM analytics_click_targets WHERE day < date('now','-90 days')").run()
      ])
    );
  }
};
