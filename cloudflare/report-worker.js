/**
 * Selim Portfolio — private analytics, FREE Github OAuth authorization.
 * Does not require Cloudflare Zero Trust / payment card.
 *
 * Bind D1 as DB and configure Worker Variables & Secrets:
 *   GITHUB_CLIENT_ID (plain text), GITHUB_CLIENT_SECRET (Secret),
 *   SESSION_SECRET (Secret, strong random 32+ bytes).
 *
 * OAuth app callback (exact):
 * https://selim-analytics-reports.uys-selim.workers.dev/auth/callback
 * Only GitHub numeric user ID 108689929 (SelimUysal) may view reports.
 * Fail closed on missing credentials. No public data read route.
 */
const REPORT_BASE = "https://selim-analytics-reports.uys-selim.workers.dev";
const OWNER_GITHUB_ID = 108689929;
const COOKIE_SESSION = "__Host-selim_report_session";
const COOKIE_OAUTH_STATE = "__Host-selim_oauth_state";
const COOKIE_PKCE = "__Host-selim_oauth_pkce";
const SESSION_SECONDS = 8 * 3600;
const enc = new TextEncoder();
const dec = new TextDecoder();

const REPORT_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};
const HTML_HEADERS = {
  ...REPORT_HEADERS,
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};
const JS_HEADERS = { ...REPORT_HEADERS, "Content-Type": "application/javascript; charset=utf-8" };
function json(data, status=200) { return Response.json(data,{status,headers:REPORT_HEADERS}); }
function html(markup, status=200) { return new Response(markup,{status,headers:HTML_HEADERS}); }
function base64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function unbase64url(str) {
  if (!/^[A-Za-z0-9_-]+$/.test(str) || str.length>1000) throw new Error("Invalid base64");
  const clean = str.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(clean + "=".repeat((4-clean.length%4)%4)), c=>c.charCodeAt(0));
}
function randomToken() { return base64url(crypto.getRandomValues(new Uint8Array(32))); }
function readCookie(request, name) {
  const parts = (request.headers.get("cookie") || "").split(/;\s*/);
  const field = parts.find(part => part.startsWith(name+"="));
  return field ? field.slice(name.length+1) : "";
}
function secureCookie(name, value, ttl) {
  return name+"="+value+"; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age="+ttl;
}
function redirect(location, cookies=[]) {
  const headers = new Headers(REPORT_HEADERS);
  headers.set("Location", location);
  for(const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, {status:302, headers});
}
function configured(env) {
  return Boolean(env.DB && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
    && typeof env.SESSION_SECRET==="string" && env.SESSION_SECRET.length>=32);
}
async function signingKey(env) {
  return crypto.subtle.importKey("raw",enc.encode(env.SESSION_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);
}
async function makeSession(env) {
  const now=Math.floor(Date.now()/1000);
  const body=base64url(enc.encode(JSON.stringify({sub:OWNER_GITHUB_ID,iat:now,exp:now+SESSION_SECONDS})));
  const mac=await crypto.subtle.sign("HMAC",await signingKey(env),enc.encode(body));
  return body+"."+base64url(new Uint8Array(mac));
}
async function onlyOwner(request, env) {
  if (!configured(env)) return false;
  const token=readCookie(request,COOKIE_SESSION);
  const parts=token.split(".");
  if(parts.length!==2 || parts.some(x=> !x || x.length>500))return false;
  try{
    const payload=JSON.parse(dec.decode(unbase64url(parts[0])));
    const now=Math.floor(Date.now()/1000);
    if(payload.sub!==OWNER_GITHUB_ID ||
       !Number.isInteger(payload.exp) || !Number.isInteger(payload.iat) ||
       payload.iat>now+60 || payload.exp<=now ||
       payload.exp>payload.iat+SESSION_SECONDS)return false;
    return crypto.subtle.verify("HMAC",await signingKey(env),
      unbase64url(parts[1]),enc.encode(parts[0]));
  }catch{return false;}
}
async function login(request,env) {
  if(!configured(env))return html("<h1>Panel yapılandırması tamamlanmadı.</h1>",503);
  const state=randomToken(), verifier=randomToken();
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode(verifier)));
  const auth=new URL("https://github.com/login/oauth/authorize");
  auth.searchParams.set("client_id",env.GITHUB_CLIENT_ID);
  auth.searchParams.set("redirect_uri",REPORT_BASE+"/auth/callback");
  auth.searchParams.set("state",state);
  auth.searchParams.set("code_challenge",base64url(digest));
  auth.searchParams.set("code_challenge_method","S256");
  auth.searchParams.set("scope","");
  auth.searchParams.set("allow_signup","false");
  return redirect(auth.toString(),[
    secureCookie(COOKIE_OAUTH_STATE,state,600),
    secureCookie(COOKIE_PKCE,verifier,600)
  ]);
}
async function callback(request,env) {
  if(!configured(env))return html("<h1>Panel yapılandırması tamamlanmadı.</h1>",503);
  const incoming=new URL(request.url);
  const code=incoming.searchParams.get("code");
  const state=incoming.searchParams.get("state");
  const stored=readCookie(request,COOKIE_OAUTH_STATE);
  const verifier=readCookie(request,COOKIE_PKCE);
  const expired=[
    secureCookie(COOKIE_OAUTH_STATE,"",0),
    secureCookie(COOKIE_PKCE,"",0)
  ];
  if(!code || !state || !stored || state!==stored || !verifier ||
     !/^[A-Za-z0-9_-]{43,128}$/.test(verifier))return html(LOGIN_FAILED_HTML,403);
  try{
    const exchange=await fetch("https://github.com/login/oauth/access_token",{
      method:"POST",
      headers:{"Accept":"application/json","Content-Type":"application/json"},
      body:JSON.stringify({
        client_id:env.GITHUB_CLIENT_ID,
        client_secret:env.GITHUB_CLIENT_SECRET,
        code,redirect_uri:REPORT_BASE+"/auth/callback",code_verifier:verifier
      })
    });
    if(!exchange.ok)return html(LOGIN_FAILED_HTML,403);
    const tokenData=await exchange.json();
    if(!tokenData.access_token)return html(LOGIN_FAILED_HTML,403);
    const who=await fetch("https://api.github.com/user",{
      headers:{"Authorization":"Bearer "+tokenData.access_token,
        "Accept":"application/vnd.github+json",
        "X-GitHub-Api-Version":"2022-11-28",
        "User-Agent":"Selim-Portfolio-Analytics"}
    });
    if(!who.ok)return html(LOGIN_FAILED_HTML,403);
    const user=await who.json();
    if(user.id!==OWNER_GITHUB_ID)return html(LOGIN_FAILED_HTML,403);
    return redirect(REPORT_BASE+"/",[
      ...expired,
      secureCookie(COOKIE_SESSION,await makeSession(env),SESSION_SECONDS)
    ]);
  }catch{return html(LOGIN_FAILED_HTML,403);}
}

const LOGIN_HTML = "<!doctype html><html lang=\"tr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>Özel Analiz Paneli - Giriş</title><style>:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0b1628;color:#f3f6fb}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px}.box{max-width:460px;padding:35px;background:linear-gradient(115deg,#17273c,#243a4e);border-radius:18px;border:1px solid #587189}h1{margin:0 0 12px}p{line-height:1.6;color:#cad8e7}a.button{display:inline-block;background:#eef4ff;color:#0d2438;padding:13px 18px;text-decoration:none;border-radius:10px;font-weight:750;margin-top:12px}small{color:#b5c5d5}</style></head><body><main class=\"box\"><h1>Özel Ziyaretçi Analizleri</h1><p>Bu panel yalnızca yetkili GitHub hesabıyla açılabilir. Ziyaretçilerden herhangi bir bilgi istenmez.</p><a class=\"button\" href=\"/auth/login\">GitHub ile giriş yap</a><p><small>Yalnızca temel GitHub hesap kimliği kontrol edilir. Depo erişimi istenmez.</small></p></main></body></html>";
const LOGIN_FAILED_HTML = "<!doctype html><html lang=\"tr\"><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title>Giriş doğrulanamadı</title><body style=\"font-family:system-ui;background:#101d30;color:white;padding:2rem\"><h1>Giriş doğrulanamadı</h1><p>İzinli GitHub hesabıyla tekrar giriş yap.</p><a style=\"color:#8cbeff\" href=\"/\">Panele dön</a></body></html>";
const DOCUMENT = `<!doctype html>
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
<header><div><span class="small">PRIVATE PORTFOLIO ANALYTICS</span><h1>Ziyaretçi Analiz Paneli</h1><p>Toplu sayılar ve yalnızca açık izinli ziyaretçilerin ayrıntılı kayıtları.</p></div>
<div><a href="/auth/logout" style="color:#9ccdfa;margin-right:12px">Çıkış yap</a><label for="period">Dönem: </label><select id="period"><option value="7">Son 7 gün</option><option value="30" selected>Son 30 gün</option><option value="90">Son 90 gün</option><option value="365">Son 365 gün</option></select> <button id="export">CSV dışa aktar</button> <button id="refresh">Yenile</button></div></header>
<p id="message" role="status">Rapor yükleniyor…</p>
<section class="grid metrics" id="metrics"></section>
<section class="card"><h2>Sayfa görüntülemeleri: günlük, yıllık görünümde aylık (UTC)</h2><div id="chart" role="img" aria-label="Günlük sayfa görüntüleme grafiği"></div></section>
<section class="panels" id="panels"></section><section class="card"><h2>İzinli ayrıntılı olay kayıtları</h2><p>İzinli IP verileri ve ayrıntılı olay kayıtları en fazla 365 gün saklanır; süresi dolan kayıtlar günlük temizlik göreviyle silinir.</p><div class="tablewrap" id="details"></div></section>
<footer><small>Toplu sayılar benzersiz kişi sayısı değildir. CSV dosyaları kişisel veri içerebilir.</small></footer>
</main></body></html>`;
const SCRIPT = String.raw`"use strict";
const q=s=>document.querySelector(s);
function el(tag, txt, cls) {
  const n=document.createElement(tag);
  if(txt!==undefined)n.textContent=String(txt);
  if(cls)n.className=cls;
  return n;
}
const FRIENDLY_TARGETS = {
  "project:teknofest:report":"TEKNOFEST — Ön tasarım raporu (PDF)",
  "project:oracle:report":"Öğrenci Bilgi Sistemi — Veritabanı raporu (PDF)",
  "project:patterns:report":"SE461 — Tasarım kalıpları raporu (PDF)",
  "project:hayat:live":"Hayat Rehberi — Canlı uygulama",
  "project:hayat:source":"Hayat Rehberi — GitHub kaynak kodu",
  "project:hayat:video":"Hayat Rehberi — Video",
  "project:video:store":"Video Speed — Chrome Web Store",
  "project:video:source":"Video Speed — GitHub kaynak kodu",
  "project:telegram:source":"Telegram Haber Otomasyonu — Kaynak kodu",
  "project:telegram:video":"Telegram Haber Otomasyonu — Video",
  "project:quran:live":"Kur’an Ezber — Canlı uygulama",
  "project:quran:source":"Kur’an Ezber — GitHub kaynak kodu",
  "project:python-exercises:source":"Python Örnekleri — Kaynak kodu",
  "project:c-exercises:source":"C Örnekleri — Kaynak kodu",
  "project:sql-resources:source":"SQL Örnekleri — Kaynak kodu",
  "certificate:genai-llm:pdf":"Üretken Yapay Zekâ — Sertifika PDF",
  "certificate:genai-llm:verify":"Üretken Yapay Zekâ — Sertifika doğrulama",
  "certificate:oracle-sql:pdf":"Oracle SQL — Sertifika PDF",
  "certificate:deneyap-instructor:pdf":"DENEYAP İleri Robotik — Teşekkür belgesi",
  "volunteering:video":"Gönüllülük Portfolyosu — Video",
  "case:rims:video":"AYESAŞ RIMS — Proje videosu",
  "case:teknofest:details":"TEKNOFEST — Teknik inceleme",
  "case:rims:details":"AYESAŞ RIMS — Teknik inceleme",
  "navigation:projects":"Tüm projeler sayfasına geçiş"
};
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
  const daily=timeline||[];
  // Annual view is grouped by month for legibility; all 365 days still count.
  const rows=daily.length>90?Array.from(daily.reduce((m,r)=>{
    const label=String(r.name).slice(0,7);
    m.set(label,{name:label,count:Number(r.count||0)+(m.get(label)?.count||0)});
    return m;
  },new Map()).values()):daily;
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
      ["Tıklama türleri",report.categories],["Şehirler (izinli)",report.cities],["Bölgeler (izinli)",report.regions],["Ağ kuruluşları (izinli)",report.networks],["Yönlendiren siteler",report.referrers],["Tıklanan adresler",report.destinations],["Tarayıcılar",report.browsers],["İşletim sistemleri",report.systems],
      ["Proje, belge ve bağlantı detayları",(report.targets||[]).map(row=>({name:FRIENDLY_TARGETS[row.name]||row.name,count:row.count}))]
    ].forEach(([title,rows])=>panels.append(groupTable(title,rows)));
    const detail=await fetch("/api/details?days="+days,{credentials:"same-origin",cache:"no-store"});if(!detail.ok)throw Error("İzinli ayrıntılı rapor okunamadı.");showDetails((await detail.json()).rows||[]);
    q("#message").textContent=report.periodDays+" günlük toplamlar ve izinli detaylar. Günler UTC'ye göredir.";
  }catch(error){q("#message").textContent=error.message;}
}

function showDetails(rows){const root=q("#details");root.replaceChildren();const t=el("table"),header=el("tr");
 for(const name of ["UTC","Olay","Sayfa / hedef","Ülke / şehir","IP","Tarayıcı / OS","Tüm alanlar"])header.append(el("th",name));t.append(header);
 for(const row of rows){const tr=el("tr");for(const v of [row.recorded_at,row.event_type,row.target_label||row.page_path,[row.country_code,row.city].filter(Boolean).join(" / "),row.ip||"—",[row.device?.browser_name,row.device?.os_name].filter(Boolean).join(" / ")])tr.append(el("td",v||"—"));
 const cell=el("td"),details=el("details"),title=el("summary","Görüntüle"),pre=el("pre",JSON.stringify(row,null,2));pre.style.whiteSpace="pre-wrap";pre.style.wordBreak="break-word";details.append(title,pre);cell.append(details);tr.append(cell);t.append(tr)}
 if(!rows.length){const tr=el("tr"),td=el("td","Henüz izinli ayrıntılı kayıt yok.");td.colSpan=7;tr.append(td);t.append(tr)}
 root.append(t)}
q("#export").addEventListener("click",()=>{if(confirm("CSV izinli kişisel verileri içerebilir. İndirilsin mi?"))location.href="/api/export?days="+q("#period").value});
q("#refresh").addEventListener("click",refresh);
q("#period").addEventListener("change",refresh);
refresh();`;
async function summary(env, days) {
  const since = new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
  const sql = (query) => env.DB.prepare(query).bind(since).all().then(r=>r.results||[]);
  const [totals,pages,countries,devices,categories,timeline,targets,cities,regions,networks,referrers,destinations,browsers,systems] = await Promise.all([
    sql(`SELECT event_type AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? GROUP BY event_type`),
    sql(`SELECT page_path AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY page_path ORDER BY count DESC LIMIT 20`),
    sql(`SELECT country_code AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY country_code ORDER BY count DESC LIMIT 30`),
    sql(`SELECT device_group AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY device_group ORDER BY count DESC LIMIT 5`),
    sql(`SELECT link_category AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='link_click'
      GROUP BY link_category ORDER BY count DESC LIMIT 20`),
    sql(`SELECT day AS name, SUM(event_count) AS count
      FROM analytics_daily_summary WHERE day>=? AND event_type='page_view'
      GROUP BY day ORDER BY day ASC LIMIT 365`),
    sql(`SELECT target_key AS name, SUM(event_count) AS count
      FROM analytics_click_targets WHERE day>=?
      GROUP BY target_key ORDER BY count DESC LIMIT 80`),
    sql(`SELECT COALESCE(NULLIF(city,''),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(NULLIF(region,''),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(NULLIF(network_organization,''),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(NULLIF(referrer_host,''),'Doğrudan / bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(NULLIF(destination_url,''),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='link_click' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(json_extract(device_json,'$.browser_name'),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`),
    sql(`SELECT COALESCE(json_extract(device_json,'$.os_name'),'Bilinmiyor') AS name, COUNT(*) AS count FROM analytics_detail_events WHERE day>=? AND event_type='page_view' GROUP BY name ORDER BY count DESC LIMIT 20`)
  ]);
  const views=Number(totals.find(r=>r.name==="page_view")?.count||0);
  const clicks=Number(totals.find(r=>r.name==="link_click")?.count||0);
  return { periodDays:days, metrics:{
      views,clicks,clickRate:views?Math.round(clicks/views*100):0,
      activeDays:timeline.length
    }, pages,countries,devices,categories,timeline,targets,cities,regions,networks,referrers,destinations,browsers,systems };
}

async function decryptedIp(cipher,env){
 if(!cipher||!env.ANALYTICS_ENCRYPTION_KEY)return null;
 try{const raw=Uint8Array.from(atob(env.ANALYTICS_ENCRYPTION_KEY),c=>c.charCodeAt(0));if(raw.length!==32)return null;
 const data=Uint8Array.from(atob(cipher),c=>c.charCodeAt(0));
 const key=await crypto.subtle.importKey("raw",raw,{name:"AES-GCM"},false,["decrypt"]);
 return dec.decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:data.slice(0,12)},key,data.slice(12)))}catch{return null}
}
async function detailRows(env,days,limit=100){
 const since=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
 const list=await env.DB.prepare("SELECT * FROM analytics_detail_events WHERE day>=? ORDER BY recorded_at DESC LIMIT ?").bind(since,limit).all();
 return Promise.all((list.results||[]).map(async row=>{
 let device={};try{device=JSON.parse(row.device_json)}catch{}
 const {ip_ciphertext,device_json,...rest}=row;
 return {...rest,visitor_token:row.visitor_token.slice(0,8)+"…",session_token:row.session_token.slice(0,8)+"…",ip:await decryptedIp(ip_ciphertext,env),device,target_label:row.target_key||""}
 }))
}
function csvCell(x){let s=x==null?"":String(x);if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
async function exportCsv(env,days){
 const rows=await detailRows(env,days,2000);
 const cols=["recorded_at","event_type","page_path","target_label","destination_url","country_code","city","region","region_code","postal_code","continent","geo_timezone","asn","network_organization","isp_guess","vpn_proxy_status","ip","referrer_host","scroll_pct","active_seconds","device"];
 const lines=[cols.join(","),...rows.map(r=>cols.map(k=>csvCell(k==="device"?JSON.stringify(r.device):r[k])).join(","))];
 return new Response("\uFEFF"+lines.join("\r\n"),{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="selim-private-analytics.csv"',"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}})
}
export default {
  async fetch(request, env) {
    const url=new URL(request.url);
    const path=url.pathname;
    if(request.method!=="GET")return json({error:"Method not allowed"},405);
    if(path==="/auth/login")return login(request,env);
    if(path==="/auth/callback")return callback(request,env);
    if(path==="/auth/logout"){
      return redirect(REPORT_BASE+"/",[secureCookie(COOKIE_SESSION,"",0)]);
    }
    if(!configured(env))return html("<h1>Panel yapılandırması tamamlanmadı.</h1>",503);
    if(!await onlyOwner(request,env)){
      if(path==="/")return html(LOGIN_HTML);
      return json({error:"Unauthorized"},401);
    }
    if(path==="/")return new Response(DOCUMENT,{headers:HTML_HEADERS});
    if(path==="/app.js")return new Response(SCRIPT,{headers:JS_HEADERS});
    if(path==="/api/summary"){
      const days=Number(url.searchParams.get("days")||30);
      if(![7,30,90,365].includes(days))return json({error:"Invalid period"},400);
      try{return json(await summary(env,days));}
      catch{return json({error:"Report database unavailable"},503);}
    }
    if(["/api/details","/api/export"].includes(path)){const days=Number(url.searchParams.get("days")||30);if(![7,30,90,365].includes(days))return json({error:"Invalid period"},400);try{if(path==="/api/details")return json({rows:await detailRows(env,days,100)});return exportCsv(env,days)}catch{return json({error:"Private detail query unavailable"},503)}}
    return json({error:"Not found"},404);
  }
};
