import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const p of ['cloudflare/collector-worker.js','cloudflare/report-worker.js','assets/consent-analytics.js']){
 const s=readFileSync(p,'utf8');assert.ok(s.length>4000);assert.ok(s.includes('analytics'));
 if(p.includes('collector')){assert.ok(s.includes('ANALYTICS_ENCRYPTION_KEY'));assert.ok(s.includes("scheduled("));assert.ok(s.includes('analytics_detail_events'));}
 if(p.includes('report')){assert.ok(s.includes('onlyOwner'));assert.ok(s.includes('/api/details'));}
 if(p.includes('consent')){assert.ok(s.includes('read()'));assert.ok(s.includes('prefs()'));}
 console.log('PASS',p);
}
for(const p of ['index.html','projects.html','case-studies.html']){
 const s=readFileSync(p,'utf8');
 assert.ok(s.includes('consent-analytics.js'));assert.ok(!s.includes('<script defer src="./assets/cookieless-analytics.js'));
 console.log('PASS',p);
}
console.log('Static staging checks passed; not a production D1/OAuth test');
