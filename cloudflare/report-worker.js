/**
 * PRIVATE portfolio reporting dashboard.
 *
 * Cloudflare Workers > create SECOND Worker (selim-analytics-reports).
 * Before using it:
 *  - Enable WORKER-LEVEL Cloudflare Access (protect production AND previews).
 *  - Access policy: ALLOW only the owner's verified email address.
 *  - Bind D1: DB -> selim-portfolio-analytics.
 *  - Set OWNER_EMAIL as an encrypted Worker secret with the same owner email.
 *
 * Fail closed: without ctx.access, owner email or DB, no report is served.
 * Never put this Worker URL in public portfolio navigation or publish secrets
 * in the GitHub repo.
 */
const REPORT_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};
const HTML_HEADERS = {
  ...REPORT_HEADERS,
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};
const JS_HEADERS = { ...REPORT_HEADERS, "Content-Type": "application/javascript; charset=utf-8" };
function json(data, status=200) { return Response.json(data,{status,headers:REPORT_HEADERS}); }
async function onlyOwner(ctx, env) {
  const owner = (env.OWNER_EMAIL || "").trim().toLowerCase();
  if (!owner || !env.DB || !ctx.access) return false;
  try {
    const identity = await ctx.access.getIdentity();
    return !!identity?.email && identity.email.trim().toLowerCase() === owner;
  } catch { return false; }
}
const DOCUMENT = \`<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Özel Analiz Paneli — Selim Uysal</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color-scheme:dark;background:#091523;color:#edf4fb}
*{box-sizing:border-box}body{margin:0;padding:30px 16px;line-height:1.5}
main{max-width:1120px;margin:auto}h1{font-size:clamp(24px,4vw,38px);margin:8px 0}h2{font-size:18px;margin:0 0 15px}
p,small{color:#a7bdd2}header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px}
.small{font-size:12px;letter-spacing:2px;color:#9bbde0;font-weight:700}
button,select{padding:11px 15px;border-radius:10px;color:#eaf3fc;background:#19334d;border:1px solid #466681;font:inherit}
button{cursor:pointer}button:hover{background:#244663}button:focus-visible,select:focus-visible{outline:3px solid #77b8fa}
label{color:#bdd0e1}button[disabled]{opacity:.5}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.card{background:linear-gradient(115deg,#122235,#1b3249);border:1px solid #36516d;border-radius:16px;padding:22px;margin:0 0 15px}
.card strong{display:block;font-size:clamp(25px,4vw,39px);margin-top:12px;letter-spacing:-1px}
.metrics{margin-bottom:8px}.panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
table{border-collapse:collapse;width:100%}td,th{padding:10px 0;text-align:left;border-bottom:1px solid #31465c;font-size:13px;overflow-wrap:anywhere}
td:last-child,th:last-child{text-align:right;font-variant-numeric:tabular-nums}
.tablewrap{overflow-x:auto}#message{min-height:20px}#chart{display:flex;align-items:end;gap:5px;height:130px;padding:10px 0;border-bottom:1px solid #39536b}
#chart span{flex:1;min-width:3px;max-width:48px;background:linear-gradient(0deg,#2d8ac1,#77c4b6);border-radius:4px 4px 0 0;position:relative}
#chart span:hover:after{content:attr(title);position:absolute;bottom:100%;background:#061522;color:white;white-space:nowrap;font-size:11px;padding:5px;z-index:1}
@media(max-width:800px){.grid{grid-template-columns:repeat(2,1fr)}.panels{grid-template-columns:1fr}.card{padding:16px}}
</style>
<script src="/app.js" defer></script></head>
<body><main>
<header><div><span class="small">PRIVATE PORTFOLIO ANALYTICS</span><h1>Ziyaretçi Analiz Paneli</h1><p>Toplu ve çerezsiz ziyaret istatistikleri. Tekil kişi veya IP bilgisi tutulmaz.</p></div>
<div><label for="period">Dönem: </label><select id="period"><option value="7">Son 7 gün</option><option value="30" selected>Son 30 gün</option><option value="90">Son 90 gün</option></select> <button id="refresh">Yenile</button></div></header>
<p id="message" role="status">Rapor yükleniyor…</p>
<section class="grid metrics" id="metrics"></section>
<section class="card"><h2>Günlük sayfa görüntülemeleri (UTC)</h2><div id="chart" role="img" aria-label="Günlük sayfa görüntüleme grafiği"></div></section>
<section class="panels" id="panels"></section>
<footer><small>Veriler gün/ülke/cihaz/sayfa kırılımında toplu sayımlardır. Bunlar benzersiz kişi sayısı değildir.</small></footer>
</main></body></html>\`;
const SCRIPT = String.raw\`"use strict";
const q=s=>document.querySelector(s);
function el(tag, txt, cls) {
  const n=document.createElement(tag);
  if(txt!==undefined)n.textContent=String(txt);
  if(cls)n.className=cls;
  return n;
}
function groupTable(label, rows){
  const area=el("section",undefined,"card");
  area.append(el("h2",label));
  const wrapper=el("div",undefined,"tablewrap"),t=el("table");
  const head=el("thead"),tr=el("tr");
  tr.append(el("th","Öğe"),el("th","Sayı"));
  head.append(tr);
  const body=el("tbody");
  for (const row of rows||[]) {
    const tr=el("tr");
    tr.append(el("td",row.name),el("td",row.count));
    body.append(tr);
  }
  if(!rows?.length){
    const row=el("tr"),td=el("td","Henüz kayıt yok");td.colSpan=2;
    row.append(td);body.append(row);
  }
  t.append(head,body);wrapper.append(t);area.append(wrapper);
  return area;
}
function drawChart(timeline){
  const canvas=q("#chart");canvas.replaceChildren();
  const rows=timeline||[];
  if(!rows.length){canvas.append(el("p","Henüz görüntüleme yok."));return;}
  const max=Math.max(1,...rows.map(r=>r.count));
  for(const row of rows){
    const bar=el("span");
    bar.style.height=Math.max(2,Math.round(100*row.count/max))+"%";
    bar.title=row.name+": "+row.count;canvas.append(bar);
  }
}
async function refresh(){
  q("#message").textContent="Rapor yükleniyor…";
  try{
    const days=Number(q("#period").value);
    const response=await fetch("/api/summary?days="+days,{credentials:"same-origin",cache:"no-store"});
    if(!response.ok)throw new Error("Rapor alınamadı ("+response.status+"). Access yetkini kontrol et.");
    const report=await response.json();
    const cards=[
      ["Sayfa görüntüleme",report.metrics.views],
      ["Bağlantı tıklaması",report.metrics.clicks],
      ["Tıklama oranı",report.metrics.clickRate+"%"],
      ["Kaydedilen gün",report.metrics.activeDays]
    ];
    const metrics=q("#metrics");metrics.replaceChildren();
    for(const [name,value] of cards){
      const c=el("div",undefined,"card");
      c.append(el("span",name),el("strong",value));metrics.append(c);
    }
    drawChart(report.timeline);
    const panels=q("#panels");panels.replaceChildren();
    [
      ["En çok açılan sayfalar",report.pages],
      ["Ülkeler",report.countries],
      ["Cihaz grupları",report.devices],
      ["Tıklama türleri",report.categories]
    ].forEach(([title,rows])=>panels.append(groupTable(title,rows)));
    q("#message").textContent=report.periodDays+" günlük toplu kayıtlar. Günler UTC'ye göredir.";
  }catch(error){q("#message").textContent=error.message;}
}
q("#refresh").addEventListener("click",refresh);
q("#period").addEventListener("change",refresh);
refresh();\`;
async function summary(env, days) {
  const since = new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
  const sql = (query) => env.DB.prepare(query).bind(since).all().then(r=>r.results||[]);
  const [totals,pages,countries,devices,categories,timeline] = await Promise.all([
    sql(\`SELECT event_type AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? GROUP BY event_type\`),
    sql(\`SELECT page_path AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY page_path ORDER BY count DESC LIMIT 20\`),
    sql(\`SELECT country_code AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY country_code ORDER BY count DESC LIMIT 30\`),
    sql(\`SELECT device_group AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY device_group ORDER BY count DESC LIMIT 5\`),
    sql(\`SELECT link_category AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='link_click'
      GROUP BY link_category ORDER BY count DESC LIMIT 20\`),
    sql(\`SELECT day AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY day ORDER BY day ASC LIMIT 90\`)
  ]);
  const views=Number(totals.find(r=>r.name==="page_view")?.count||0);
  const clicks=Number(totals.find(r=>r.name==="link_click")?.count||0);
  return { periodDays:days, metrics:{
      views,clicks,clickRate:views?Math.round(clicks/views*100):0,
      activeDays:timeline.length
    }, pages,countries,devices,categories,timeline };
}
export default {
  async fetch(request,env,ctx) {
    if(!await onlyOwner(ctx,env))return json({error:"Access required; owner-only"},403);
    if(request.method!=="GET")return json({error:"Method not allowed"},405);
    const url=new URL(request.url);
    if(url.pathname==="/")return new Response(DOCUMENT,{headers:HTML_HEADERS});
    if(url.pathname==="/app.js")return new Response(SCRIPT,{headers:JS_HEADERS});
    if(url.pathname==="/api/summary"){
      const days=Number(url.searchParams.get("days")||30);
      if(![7,30,90].includes(days))return json({error:"Invalid period"},400);
      try { return json(await summary(env,days)); }
      catch { return json({error:"Report database unavailable"},503); }
    }
    return json({error:"Not found"},404);
  }
};
