/**
 * Selim Portfolio Analytics — PUBLIC EVENT COLLECTOR.
 * Cloudflare Worker (module syntax); bind D1 database as "DB".
 * No raw IP, real names, email, or full user agent stored.
 * Portfolio-side client must request analytics consent before sending.
 */
const SITE = "https://selimuysal.github.io";
const TYPES = new Set(["page_view", "link_click", "scroll_depth", "engagement"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PATH = /^\/selim\/(?:index\.html|projects\.html|case-studies\.html)?$/;
function value(x, size=120) { return typeof x==="string" ? x.slice(0,size) : ""; }
function number(x, max) { return Number.isFinite(x) ? Math.max(0,Math.min(max,Math.floor(x))) : 0; }
function host(s) { try { let u=new URL(s); return ["https:","http:"].includes(u.protocol) ? u.hostname.slice(0,120) : ""; } catch { return ""; } }
function allowedHeaders() {
  return { "Access-Control-Allow-Origin":SITE,
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
    "Vary":"Origin", "Cache-Control":"no-store",
    "Content-Type":"application/json; charset=utf-8" };
}
function reply(body, status=200) { return Response.json(body,{status,headers:allowedHeaders()}); }
export default {
  async fetch(request, env) {
    if (request.headers.get("Origin")!==SITE) return reply({error:"Origin not allowed"},403);
    if (request.method==="OPTIONS") return new Response(null,{status:204,headers:allowedHeaders()});
    if (request.method!=="POST" || new URL(request.url).pathname!=="/events")
      return reply({error:"Not found"},404);
    if (!env.DB) return reply({error:"Database binding missing"},503);
    if (Number(request.headers.get("content-length")||0)>4096) return reply({error:"Payload too large"},413);
    let event;
    try {
      const input=await request.text();
      if (input.length>4096) return reply({error:"Payload too large"},413);
      event=JSON.parse(input);
    } catch { return reply({error:"Invalid JSON"},400); }
    if (!event || event.consent!==true || !TYPES.has(event.event_type) ||
        !UUID.test(event.visitor_id||"") || !UUID.test(event.session_id||"") ||
        !PATH.test(event.page_path||"")) return reply({error:"Invalid event"},400);
    const agent=request.headers.get("user-agent")||"";
    if (/bot|crawler|spider|headless|preview|facebookexternalhit|whatsapp/i.test(agent))
      return reply({accepted:false},202);
    const cf=request.cf||{};
    try {
      await env.DB.prepare(
        `INSERT INTO analytics_events (
          event_type,visitor_id,session_id,page_path,page_title,referrer_host,
          utm_source,utm_medium,utm_campaign,link_kind,link_host,link_path,
          country_code,region_code,device_type,browser_family,os_family,
          site_language,color_theme,active_seconds,scroll_percent,consent_version
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        event.event_type,event.visitor_id,event.session_id,event.page_path,
        value(event.page_title),host(value(event.referrer,500)),
        value(event.utm_source,100),value(event.utm_medium,100),value(event.utm_campaign,100),
        value(event.link_kind,50),host(value(event.link_url,500)),
        value(event.link_path,200),value(cf.country,3),value(cf.regionCode,16),
        value(event.device_type,30),value(event.browser_family,40),value(event.os_family,40),
        value(event.site_language,12),value(event.color_theme,12),
        number(event.active_seconds,600),number(event.scroll_percent,100),
        value(event.consent_version,32)
      ).run();
    } catch {
      return reply({error:"Event unavailable"},503);
    }
    return reply({accepted:true},202);
  }
};
