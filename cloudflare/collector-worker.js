/**
 * Selim portfolio analytics v3 collector
 * D1 binding DB, Secret ANALYTICS_ENCRYPTION_KEY = 32-byte base64 AES key
 * Consented, privacy-limited analytics with secure IP storage and deletion.
 */
const SITE="https://selimuysal.github.io";
const PAGES=new Set(["/selim/","/selim/index.html","/selim/projects.html","/selim/case-studies.html"]);
const TYPES=new Set(["page_view","link_click","engagement"]);
const CATS=new Set(["-","pdf","github","youtube","linkedin","project","external","internal"]);
const DEVICES=new Set(["mobile","tablet","desktop","unknown"]);
const TARGETS=new Set([
 "project:teknofest:report","project:oracle:report","project:patterns:report",
 "project:hayat:live","project:hayat:source","project:hayat:video",
 "project:video:store","project:video:source","project:telegram:source","project:telegram:video",
 "project:quran:live","project:quran:source","project:python-exercises:source",
 "project:c-exercises:source","project:sql-resources:source","certificate:genai-llm:pdf",
 "certificate:genai-llm:verify","certificate:oracle-sql:pdf","certificate:deneyap-instructor:pdf",
 "volunteering:video","case:rims:video","case:teknofest:details","case:rims:details","navigation:projects"
]);
const DEVICE_FIELDS=["os_name","os_version","browser_name","browser_version","device_category","device_type","phone_brand","phone_model","device_name","screen_width","screen_height","viewport_width","viewport_height","device_pixel_ratio","logical_cores","device_memory_gb","gpu_vendor","gpu_renderer","browser_language","preferred_languages","browser_timezone","color_scheme","connection_type","connection_quality","connection_downlink_mbps","connection_rtt_ms","hardware_architecture","ua_mobile","platform","ua_model","source_url_host"];
const id=x=>typeof x==="string"&&/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(x);
const str=(x,n=100)=>typeof x==="string"?x.replace(/[\u0000-\u001f\u007f]/g,"").slice(0,n):"";
const bounded=(n,a,b)=>typeof n==="number"&&Number.isFinite(n)&&n>=a&&n<=b?n:null;
const allowed=r=>r.headers.get("Origin")===SITE;
function headers(r){return {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Vary":"Origin",...(allowed(r)?{"Access-Control-Allow-Origin":SITE,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}:{})}}
function json(r,x,s=200){return Response.json(x,{status:s,headers:headers(r)})}
async function read(r,max=16000){const mime=(r.headers.get("content-type")||"").split(";")[0].trim().toLowerCase();if(!["application/json","text/plain"].includes(mime))return null;const raw=await r.text();if(raw.length>max)return null;try{const x=JSON.parse(raw);return x&&typeof x==="object"&&!Array.isArray(x)?x:null}catch{return null}}
function valid(x){return x&&TYPES.has(x.event_type)&&PAGES.has(x.page_path)&&CATS.has(x.link_category)&&DEVICES.has(x.device_group)&&["anonymous","basic","extended"].includes(x.consent_mode)&&typeof x.target_key==="string"&&(!x.target_key||x.event_type==="link_click"&&TARGETS.has(x.target_key))&&
 (x.event_type==="link_click"||x.link_category==="-"&&x.target_key==="")&&
 (x.consent_mode!=="extended"||id(x.visitor_token)&&id(x.session_token)&&id(x.event_id))&&
 (x.consent_mode!=="anonymous"||(x.device_group==="unknown"&&x.event_type!=="engagement"&&!x.visitor_token&&!x.session_token&&!x.event_id&&!x.device&&!x.referrer_host&&!x.destination_url))}
function cleanDevice(raw){if(!raw||typeof raw!=="object"||Array.isArray(raw))return {};
 const out={};for(const k of DEVICE_FIELDS){const v=raw[k];if(k==="preferred_languages"&&Array.isArray(v))out[k]=v.slice(0,8).filter(y=>typeof y==="string").map(y=>str(y,32));
 else if(typeof v==="string")out[k]=str(v,k==="gpu_renderer"?170:100);
 else if(typeof v==="number")out[k]=bounded(v,-1e7,1e7);
 else if(typeof v==="boolean")out[k]=v;
 else out[k]=null}
 return out
}
function geo(r){const x=r.cf||{};return {
 country:/^[A-Z]{2}$/.test(x.country||"")?x.country:"XX",
 city:str(x.city,90),region:str(x.region,90),regionCode:str(x.regionCode,30),
 postal:str(x.postalCode,30),continent:str(x.continent,5),timezone:str(x.timezone,90),
 asn:bounded(x.asn,0,4294967295),organization:str(x.asOrganization,130)
}}
async function key(env){if(typeof env.ANALYTICS_ENCRYPTION_KEY!=="string")throw Error("Missing key");let bytes;
 try{bytes=Uint8Array.from(atob(env.ANALYTICS_ENCRYPTION_KEY),c=>c.charCodeAt(0))}catch{throw Error("Invalid key")}
 if(bytes.length!==32)throw Error("Invalid key size");
 return crypto.subtle.importKey("raw",bytes,{name:"AES-GCM"},false,["encrypt"])
}
async function ipCipher(r,env){const ip=str(r.headers.get("CF-Connecting-IP"),80);if(!ip)return null;
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},await key(env),new TextEncoder().encode(ip)));
 const all=new Uint8Array(iv.length+cipher.length);all.set(iv);all.set(cipher,iv.length);
 let binary="";for(const b of all)binary+=String.fromCharCode(b);
 return btoa(binary)
}
async function event(r,env){
 if(!allowed(r))return json(r,{error:"Forbidden"},403);
 if(r.headers.get("Sec-GPC")==="1"||r.headers.get("DNT")==="1")return json(r,{accepted:false},200);
 if(!env.DB)return json(r,{error:"Database not configured"},503);
 let d;try{d=await read(r)}catch{}
 if(!valid(d))return json(r,{error:"Invalid analytics event"},400);
 if(d.consent_mode==="extended")try{await key(env)}catch{return json(r,{error:"Encryption not configured"},503)}
 const now=new Date(),day=now.toISOString().slice(0,10),g=d.consent_mode==="anonymous"?null:geo(r),tasks=[];
 if(d.event_type!=="engagement"){
  tasks.push(env.DB.prepare(
   "INSERT INTO analytics_daily_summary (day,event_type,page_path,link_category,country_code,device_group,event_count) VALUES (?,?,?,?,?,?,1) ON CONFLICT(day,event_type,page_path,link_category,country_code,device_group) DO UPDATE SET event_count=event_count+1"
  ).bind(day,d.event_type,d.page_path,d.link_category,g?.country||"XX",d.consent_mode==="anonymous"?"unknown":d.device_group));
  if(d.event_type==="link_click"&&d.target_key)tasks.push(env.DB.prepare(
   "INSERT INTO analytics_click_targets(day,page_path,target_key,event_count) VALUES(?,?,?,1) ON CONFLICT(day,page_path,target_key) DO UPDATE SET event_count=event_count+1"
  ).bind(day,d.page_path,d.target_key))
 }
 if(d.consent_mode==="extended"){
  const view=d.event_type==="page_view",gg=view?g:{},device=view?cleanDevice(d.device):{},cipher=view?await ipCipher(r,env):null;
  tasks.push(env.DB.prepare(
   "INSERT OR IGNORE INTO analytics_detail_events(event_id,recorded_at,day,visitor_token,session_token,consent_version,event_type,page_path,target_key,destination_url,link_category,referrer_host,scroll_pct,active_seconds,ip_ciphertext,country_code,city,region,region_code,postal_code,continent,geo_timezone,asn,network_organization,isp_guess,vpn_proxy_status,device_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).bind(d.event_id,now.toISOString(),day,d.visitor_token,d.session_token,"v3",d.event_type,d.page_path,
    d.event_type==="link_click"?d.target_key:"",d.event_type==="link_click"?str(d.destination_url,180):"",d.link_category,
    view?str(d.referrer_host,130):"",d.event_type==="engagement"?bounded(d.scroll_pct,0,100):null,d.event_type==="engagement"?bounded(d.active_seconds,0,7200):null,
    cipher,gg.country||null,gg.city||null,gg.region||null,gg.regionCode||null,gg.postal||null,gg.continent||null,gg.timezone||null,gg.asn??null,gg.organization||null,gg.organization||null,"unknown",JSON.stringify(device)))
 }
 try{await env.DB.batch(tasks);return json(r,{accepted:true},202)}
 catch{return json(r,{error:"Storage temporarily unavailable"},503)}
}
async function forget(r,env){
 if(!allowed(r))return json(r,{error:"Forbidden"},403);
 if(!env.DB)return json(r,{error:"Database unavailable"},503);
 let x;try{x=await read(r,500)}catch{}
 if(!id(x?.visitor_token))return json(r,{error:"Invalid token"},400);
 try{await env.DB.prepare("DELETE FROM analytics_detail_events WHERE visitor_token=?").bind(x.visitor_token).run();return json(r,{deleted:true})}
 catch{return json(r,{error:"Delete unavailable"},503)}
}
export default {
 async fetch(request,env){
  const p=new URL(request.url).pathname;
  if(request.method==="OPTIONS"&&["/events","/forget"].includes(p))return allowed(request)?new Response(null,{status:204,headers:headers(request)}):json(request,{error:"Forbidden"},403);
  if(p==="/health"&&request.method==="GET")return json(request,{status:"ok",version:3,databaseBound:Boolean(env.DB)});
  if(request.method!=="POST")return json(request,{error:"Not found"},404);
  if(p==="/events")return event(request,env);
  if(p==="/forget")return forget(request,env);
  return json(request,{error:"Not found"},404)
 },
 async scheduled(_,env,ctx){
  if(!env.DB)return;
  ctx.waitUntil(env.DB.batch([
   env.DB.prepare("DELETE FROM analytics_detail_events WHERE day < date('now','-365 days')"),
   env.DB.prepare("DELETE FROM analytics_daily_summary WHERE day < date('now','-365 days')"),
   env.DB.prepare("DELETE FROM analytics_click_targets WHERE day < date('now','-365 days')")
  ]))
 }
};