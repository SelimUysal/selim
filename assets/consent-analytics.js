/* Consent-aware portfolio analytics v3; no tracking before visitor choice. */
(()=>{'use strict';
const ENDPOINT="https://selim-analytics-collector.uys-selim.workers.dev";
const KEY="selim-analytics-consent-v3", TOKEN="selim-analytics-token-v3", SESSION="selim-analytics-session-v3";
const PAGES=new Set(["/selim/","/selim/index.html","/selim/projects.html","/selim/case-studies.html"]);
if(!PAGES.has(location.pathname))return;
const page=location.pathname==="/selim/"?"/selim/index.html":location.pathname;
const DNT=navigator.globalPrivacyControl===true||navigator.doNotTrack==="1";
const PROJECTS={
"https://selimuysal.github.io/hayat-rehberi/":"project:hayat:live",
"https://github.com/SelimUysal/hayat-rehberi":"project:hayat:source",
"https://youtu.be/V_ogWBPFksc":"project:hayat:video",
"https://chromewebstore.google.com/detail/video-speed/cmjafmcaccbhfgcjnfldaahebnbbppje":"project:video:store",
"https://github.com/SelimUysal/video-speed":"project:video:source",
"https://github.com/SelimUysal/telegramaHaberGonder":"project:telegram:source",
"https://www.youtube.com/watch?v=R9HX1uPrGEg":"project:telegram:video",
"https://selimuysal.github.io/kuran-ezber/":"project:quran:live",
"https://github.com/SelimUysal/kuran-ezber":"project:quran:source",
"https://github.com/SelimUysal/Python-simple-code":"project:python-exercises:source",
"https://github.com/SelimUysal/C-dili-ornekler":"project:c-exercises:source",
"https://github.com/SelimUysal/SQL-examples":"project:sql-resources:source",
"https://www.coursera.org/verify/FZD64R69X7BA":"certificate:genai-llm:verify",
"https://youtu.be/OMY7bTeTMcM":"volunteering:video",
"https://www.youtube.com/watch?v=ZgHwIUqJTao":"case:rims:video"
};
const LOCAL={
"/selim/assets/reports/teknofest-ai-transportation.pdf":"project:teknofest:report",
"/selim/assets/reports/oracle-student-information-system.pdf":"project:oracle:report",
"/selim/assets/reports/design_patterns_SE461.pdf":"project:patterns:report",
"/selim/assets/certificates/generative-ai-llms-coursera.pdf":"certificate:genai-llm:pdf",
"/selim/assets/certificates/oracle-sql-btk-akademi.pdf":"certificate:oracle-sql:pdf",
"/selim/assets/certificates/deneyap-advanced-robotics-instructor.pdf":"certificate:deneyap-instructor:pdf"
};
function storage(){try{return localStorage}catch{return null}}
function session(){try{return sessionStorage}catch{return null}}
const uuid=()=>crypto.randomUUID();
function read(){try{const x=JSON.parse(storage()?.getItem(KEY)||"null");return x&&["basic","extended","reject"].includes(x.mode)&&Date.now()-x.ts<180*864e5?x.mode:null}catch{return null}}
function write(mode){try{storage()?.setItem(KEY,JSON.stringify({mode,ts:Date.now()}))}catch{}}
function group(){return innerWidth<640?"mobile":innerWidth<1024?"tablet":"desktop"}
function category(link){const u=new URL(link.href,location.href),h=u.hostname;
return u.pathname.endsWith(".pdf")?"pdf":/^(www\.)?(youtube\.com|youtu\.be)$/.test(h)?"youtube":h==="github.com"?"github":h.endsWith("linkedin.com")?"linkedin":h===location.hostname?"internal":h.endsWith(".github.io")?"project":"external"}
function target(link){try{const u=new URL(link.href,location.href),full=u.origin+u.pathname;
if(LOCAL[u.pathname])return LOCAL[u.pathname];
if(PROJECTS[full])return PROJECTS[full];
if(u.pathname==="/selim/case-studies.html"&&u.origin===location.origin&&["#teknofest","#rims"].includes(u.hash))return "case:"+u.hash.slice(1)+":details";
if(u.origin===location.origin&&u.pathname==="/selim/projects.html")return "navigation:projects";
const id=link.closest("[data-project]")?.dataset.project;
if(id&&/^(hayat|video|telegram|quran|teknofest|oracle|patterns|python-exercises|c-exercises|sql-resources)$/.test(id)){
const type={github:"source",pdf:"report",youtube:"video",project:"live",external:"live"}[category(link)];return type?"project:"+id+":"+type:""}
return ""}catch{return ""}}
function dest(link){try{const u=new URL(link.href,location.href);return (u.origin===location.origin?u.pathname:(u.hostname+u.pathname)).slice(0,180)}catch{return ""}}
function host(){try{return new URL(document.referrer).hostname.slice(0,130)}catch{return ""}}
function parseUA(){const ua=navigator.userAgent||"";
const b=/Edg\/([\d.]+)/.exec(ua)||/OPR\/([\d.]+)/.exec(ua)||/(?:CriOS|Chrome)\/([\d.]+)/.exec(ua)||/(?:FxiOS|Firefox)\/([\d.]+)/.exec(ua)||/Version\/([\d.]+).*Safari/.exec(ua);
const bn=/Edg\//.test(ua)?"Edge":/OPR\//.test(ua)?"Opera":/Chrome|CriOS/.test(ua)?"Chrome":/Firefox|FxiOS/.test(ua)?"Firefox":/Safari/.test(ua)?"Safari":"Unknown";
const o=/Windows NT ([\d.]+)/.exec(ua)||/Android[ /]([\d.]+)/.exec(ua)||/(?:iPhone OS|CPU OS) ([\d_]+)/.exec(ua)||/Mac OS X ([\d_.]+)/.exec(ua);
const on=/Windows/.test(ua)?"Windows":/Android/.test(ua)?"Android":/iPhone|iPad/.test(ua)?"iOS":/Macintosh/.test(ua)?"macOS":/Linux/.test(ua)?"Linux":"Unknown";
return {browser_name:bn,browser_version:b?.[1]||null,os_name:on,os_version:o?.[1]?.replaceAll("_",".")||null}}
async function device(){const d=parseUA(),c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
let hi={};try{hi=await navigator.userAgentData?.getHighEntropyValues?.(["architecture","model","platformVersion","fullVersionList","formFactors"])||{}}catch{}
let gpu_vendor=null,gpu_renderer=null;try{const gl=document.createElement("canvas").getContext("webgl");const ext=gl?.getExtension("WEBGL_debug_renderer_info");if(ext){gpu_vendor=String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)).slice(0,120);gpu_renderer=String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).slice(0,170)}}catch{}
const model=hi.model||null;
const phone_brand=model&&/^SM-/i.test(model)?"Samsung":model&&/^Pixel/i.test(model)?"Google":/iPhone/.test(navigator.userAgent)?"Apple":null;
return {...d,os_version:hi.platformVersion||d.os_version,device_category:group(),device_type:navigator.userAgentData?.mobile?"phone":group(),device_name:null,phone_brand,phone_model:model,screen_width:screen.width,screen_height:screen.height,viewport_width:innerWidth,viewport_height:innerHeight,device_pixel_ratio:devicePixelRatio,logical_cores:navigator.hardwareConcurrency??null,device_memory_gb:navigator.deviceMemory??null,gpu_vendor,gpu_renderer,browser_language:navigator.language,preferred_languages:(navigator.languages||[]).slice(0,8),browser_timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,color_scheme:matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light",connection_type:c?.type||null,connection_quality:c?.effectiveType||null,connection_downlink_mbps:c?.downlink||null,connection_rtt_ms:c?.rtt||null,hardware_architecture:hi.architecture||null,ua_mobile:navigator.userAgentData?.mobile??null,platform:hi.platform||null,ua_model:model,source_url_host:host()}}
let mode="reject",started=false,token="",sid="",maxScroll=0,active=0,since=0;
function send(event_type,link_category="-",target_key="",rest={}){if(!started||DNT)return;
const data={event_type,page_path:page,link_category,target_key,device_group:group(),consent_mode:mode,...rest};
if(mode==="extended")Object.assign(data,{event_id:uuid(),visitor_token:token,session_token:sid});
const payload=JSON.stringify(data);
if(event_type!=="page_view"&&navigator.sendBeacon){
 try{if(navigator.sendBeacon(ENDPOINT+"/events",new Blob([payload],{type:"text/plain;charset=UTF-8"})))return}catch{}
}
fetch(ENDPOINT+"/events",{method:"POST",mode:"cors",credentials:"omit",keepalive:true,headers:{"Content-Type":"application/json"},body:payload}).catch(()=>{})}
function sc(){const total=Math.max(0,document.documentElement.scrollHeight-innerHeight);maxScroll=Math.max(maxScroll,total?Math.round(Math.min(100,scrollY/total*100)):100)}
function end(){if(mode!=="extended"||!started)return;if(since){active+=performance.now()-since;since=0}send("engagement","-","",{scroll_pct:maxScroll,active_seconds:Math.min(7200,Math.round(active/1000))})}
async function begin(choice){if(started||DNT||choice==="reject")return;mode=choice;started=true;
if(mode==="extended"){token=storage()?.getItem(TOKEN)||uuid();sid=session()?.getItem(SESSION)||uuid();try{storage()?.setItem(TOKEN,token);session()?.setItem(SESSION,sid)}catch{};since=document.visibilityState==="visible"?performance.now():0;sc()}
const details=mode==="extended"?await device():null;if(!started)return;send("page_view","-","",{referrer_host:host(),...(details?{device:details}:{})})}
async function forget(){const t=token||storage()?.getItem(TOKEN);if(t)try{await fetch(ENDPOINT+"/forget",{method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"application/json"},body:JSON.stringify({visitor_token:t})})}catch{};token="";sid="";try{storage()?.removeItem(TOKEN);session()?.removeItem(SESSION)}catch{}}
function choose(choice){const old=mode;started=false;mode="reject";since=0;const work=async()=>{if(choice!=="extended"&&old==="extended")await forget();write(choice);document.querySelector("#selim-analytics-prefs")?.remove();if(choice!=="reject")begin(choice)};work()}
function el(t,txt){const n=document.createElement(t);if(txt!=null)n.textContent=txt;return n}
function prefs(){document.querySelector("#selim-analytics-prefs")?.remove();
const pane=el("section");pane.id="selim-analytics-prefs";pane.setAttribute("role","dialog");pane.setAttribute("aria-label","Ziyaretçi analiz tercihleri");
const h=el("h2","Ziyaret analizi tercihleri");
const p=el("p","Bu portfolyoda analiz isteğe bağlıdır. Temel analiz yalnızca toplu sayılar; ayrıntılı analiz ise izinle şifreli IP, yaklaşık konum, cihaz bilgileri, sayfa ve bağlantı etkileşimlerini kaydeder. Reddetmek siteyi etkilemez.");
const l=el("a","Gizlilik ve verilerin kullanımı");l.href="./privacy.html";pane.append(h,p,l);
if(!DNT){const bar=el("div");bar.className="actions";for(const [v,label] of [["reject","Reddet"],["basic","Temel analize izin ver"],["extended","Ayrıntılı analize izin ver"]]){const b=el("button",label);b.type="button";b.addEventListener("click",()=>choose(v));bar.append(b)}pane.append(bar)}
else pane.append(el("p","Tarayıcınız takip edilmemesini istiyor; analiz kapalı."));
document.body.append(pane)}
function setup(){const st=el("style");st.textContent="#selim-analytics-prefs{position:fixed;z-index:2147480000;bottom:12px;left:12px;right:12px;max-width:760px;margin:auto;padding:18px;background:#102239;color:#eff6ff;border:1px solid #7a93ac;border-radius:14px;box-shadow:0 10px 35px #0009;font:14px/1.5 system-ui}#selim-analytics-prefs h2{font-size:18px;margin:0 0 8px}#selim-analytics-prefs p{margin:0 0 12px}#selim-analytics-prefs a{color:#b9dcff}#selim-analytics-prefs .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}#selim-analytics-prefs button,#selim-analytics-settings{font:inherit;background:#254962;color:#fff;border:1px solid #b2c5d8;border-radius:8px;padding:8px 10px;cursor:pointer}#selim-analytics-settings{position:fixed;z-index:2147479999;right:8px;bottom:8px;font-size:11px;padding:5px 7px}#selim-analytics-prefs :focus-visible,#selim-analytics-settings:focus-visible{outline:3px solid #66bdee}@media(max-width:600px){#selim-analytics-prefs{left:7px;right:7px;bottom:7px;padding:12px}}";document.head.append(st);
const b=el("button","Analiz tercihleri");b.id="selim-analytics-settings";b.type="button";b.addEventListener("click",prefs);document.body.append(b);const v=read();if(!DNT){if(!v)prefs();else if(v!=="reject")begin(v)}}
document.addEventListener("click",e=>{const a=e.target.closest?.("a[href]");if(a&&started){try{send("link_click",category(a),target(a),{destination_url:mode==="extended"?dest(a):""})}catch{}}},{capture:true,passive:true});
addEventListener("scroll",()=>{if(started&&mode==="extended")sc()},{passive:true});
document.addEventListener("visibilitychange",()=>{if(!started||mode!=="extended")return;const t=performance.now();if(document.visibilityState==="hidden"){if(since){active+=t-since;since=0}}else if(!since)since=t});
addEventListener("pagehide",end);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();