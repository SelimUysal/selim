import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomBytes, createHmac } from "node:crypto";

const read = p => readFileSync(p, "utf8");
async function load(p) {
  return (await import("data:text/javascript;base64,"+Buffer.from(read(p)).toString("base64"))).default;
}
const collector=await load("cloudflare/collector-worker.js");
const report=await load("cloudflare/report-worker.js");
const key=randomBytes(32).toString("base64");
let records=[], details=[];
const DB={
 prepare(sql) {
  const statement={sql,args:[]};
  statement.bind=(...args)=>{statement.args=args;return statement};
  statement.all=async()=>{records.push({...statement,kind:"all"});return {results:sql.includes("SELECT * FROM analytics_detail_events")?details:[]}};
  statement.run=async()=>{records.push({...statement,kind:"run"});return {success:true}};
  return statement;
 },
 async batch(items){records.push(...items.map(x=>({...x,kind:"batch"})));return items.map(()=>({success:true}))}
};
const env={DB,ANALYTICS_ENCRYPTION_KEY:key,GITHUB_CLIENT_ID:"testclient",GITHUB_CLIENT_SECRET:"testsecret",SESSION_SECRET:randomBytes(48).toString("base64")};
const base="https://selim-analytics-collector.uys-selim.workers.dev";
function req(path,body,{origin="https://selimuysal.github.io",headers={}}={}) {
 const r=new Request(base+path,{method:"POST",headers:{Origin:origin,"Content-Type":"application/json",...headers},body:JSON.stringify(body)});
 Object.defineProperty(r,"cf",{value:{country:"TR",city:"Istanbul",region:"Istanbul",regionCode:"34",postalCode:"34000",continent:"AS",timezone:"Europe/Istanbul",asn:64500,asOrganization:"Test Network"}});
 r.headers.set("CF-Connecting-IP","203.0.113.7");return r;
}
const common={event_type:"page_view",page_path:"/selim/index.html",target_key:"",link_category:"-",device_group:"desktop"};
assert.equal((await collector.fetch(new Request(base+"/health"),env)).status,200,"collector health");
assert.deepEqual((await (await collector.fetch(new Request(base+"/health"),env)).json()).version,3);
assert.equal((await collector.fetch(req("/events",common),env)).status,400,"consent value required");
assert.equal((await collector.fetch(req("/events",{...common,consent_mode:"basic"},{origin:"https://attacker.example"}),env)).status,403,"forged origin blocked");
assert.deepEqual((await (await collector.fetch(req("/events",{...common,consent_mode:"basic"},{headers:{"Sec-GPC":"1"}}),env)).json()).accepted,false,"GPC respected");
assert.deepEqual((await (await collector.fetch(req("/events",{...common,consent_mode:"basic"},{headers:{"DNT":"1"}}),env)).json()).accepted,false,"DNT respected");
records=[];
assert.equal((await collector.fetch(req("/events",{...common,consent_mode:"basic"}),env)).status,202,"basic pageview");
assert.equal(records.length,1,"basic stores only aggregate");
assert.ok(!JSON.stringify(records).includes("203.0.113.7"),"basic stores no IP");
records=[];
const visitor=crypto.randomUUID(),session=crypto.randomUUID(),event=crypto.randomUUID();
const extended={...common,consent_mode:"extended",visitor_token:visitor,session_token:session,event_id:event,referrer_host:"linkedin.com",device:{os_name:"Windows",browser_name:"Chrome",screen_width:1920,preferred_languages:["tr-TR","en-US"]}};
assert.equal((await collector.fetch(req("/events",extended),env)).status,202,"extended pageview");
const detail=records.find(x=>x.sql.includes("INSERT OR IGNORE INTO analytics_detail_events"));
assert.ok(detail,"detailed event inserted");
assert.ok(detail.args[14]&&!detail.args[14].includes("203.0.113.7"),"IP encrypted");
assert.ok(JSON.stringify(detail.args).includes("Istanbul"),"city captured");
assert.ok(JSON.stringify(detail.args).includes("Windows"),"device captured");
const countCols=(detail.sql.match(/INSERT OR IGNORE INTO analytics_detail_events\(([^)]+)\)/)||[])[1]?.split(",").length;
const countBind=(detail.sql.match(/VALUES\(([^)]+)\)/)||[])[1]?.match(/\?/g)?.length;
assert.equal(countCols,countBind,"detailed INSERT parameter count");
records=[];
assert.equal((await collector.fetch(req("/events",{...common,event_type:"link_click",consent_mode:"basic",link_category:"github",target_key:"project:hayat:source"}),env)).status,202);
assert.ok(records.some(x=>x.sql.includes("analytics_click_targets")),"target clicks aggregated");
records=[];
assert.equal((await collector.fetch(req("/forget",{visitor_token:visitor}),env)).status,200,"withdrawal deletion");
assert.ok(records.some(x=>x.sql.includes("DELETE FROM analytics_detail_events")&&x.args[0]===visitor));
assert.equal((await report.fetch(new Request("https://selim-analytics-reports.uys-selim.workers.dev/api/details"),env)).status,401,"private reports unauthenticated");
const now=Math.floor(Date.now()/1000);
const sessionBody=Buffer.from(JSON.stringify({sub:108689929,iat:now,exp:now+3600})).toString("base64url");
const mac=createHmac("sha256",env.SESSION_SECRET).update(sessionBody).digest("base64url");
const authenticated=new Request("https://selim-analytics-reports.uys-selim.workers.dev/api/details?days=365",{headers:{Cookie:"__Host-selim_report_session="+sessionBody+"."+mac}});
assert.equal((await report.fetch(authenticated,env)).status,200,"owner can read detail report");
details=[{event_id:event,recorded_at:new Date().toISOString(),day:new Date().toISOString().slice(0,10),visitor_token:visitor,session_token:session,event_type:"page_view",page_path:common.page_path,ip_ciphertext:detail.args[14],device_json:JSON.stringify({os_name:"Windows",browser_name:"Chrome"})}];
const d=(await (await report.fetch(authenticated,env)).json()).rows[0];
assert.equal(d.ip,"203.0.113.7","owner decrypts IP");
assert.equal(d.device.os_name,"Windows","device details decoded");
assert.equal(d.ip_ciphertext,undefined,"ciphertext is not exposed");
records=[];
const pending=[];
await collector.scheduled({},env,{waitUntil(p){pending.push(p)}});
await Promise.all(pending);
for(const table of ["analytics_detail_events","analytics_daily_summary","analytics_click_targets"]){
 assert.ok(records.some(x=>x.sql.includes("DELETE FROM "+table)&&x.sql.includes("-365 days")),"365-day cleanup "+table);
}
for(const page of ["index.html","projects.html","case-studies.html"]){
 const html=read(page);
 assert.ok(html.includes("assets/consent-analytics.js"),"v3 client installed "+page);
 assert.ok(!html.includes('src="./assets/cookieless-analytics.js'),"old tracker disabled "+page);
}
const client=read("assets/consent-analytics.js");
assert.ok(client.includes('let mode="reject",started=false'),"default opt-out");
assert.ok(client.includes('navigator.globalPrivacyControl'),"browser GPC respected");
assert.ok(client.includes('const old=mode==="extended"?"extended":read()'),"withdrawal after reload");
assert.ok(client.includes("navigator.sendBeacon"),"outbound event delivery fallback");
assert.ok(read("privacy.html").includes("365 gün"),"retention notice matches");
assert.ok(read("cloudflare/report-worker.js").includes('value="365"'),"annual selection available");
assert.ok(read("cloudflare/report-worker.js").includes("ORDER BY day ASC LIMIT 365"),"annual timeline includes 365 days");
console.log("PASS: health, consent, cross-origin, GPC/DNT, aggregation, AES-GCM, geo/device, clicks, deletion, auth, decryption, 365-day retention, three pages.");
