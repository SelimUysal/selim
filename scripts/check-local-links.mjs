import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const pages=['index.html','industry.html','projects.html','cv.html','industry-cv.html'];
let failures=[];
const check=(url,origin)=>{
  if(!url || url.startsWith('#') || /^(https?:|mailto:|tel:|data:)/.test(url))return;
  if(url.startsWith('javascript:')){failures.push(`${origin}: forbidden javascript URL`);return;}
  const target=decodeURIComponent(url.split('#')[0].split('?')[0]);
  const resolved=path.resolve(root,target);
  if(!resolved.startsWith(root+path.sep) && resolved!==root)failures.push(`${origin}: out-of-root path ${url}`);
  else if(!fs.existsSync(resolved))failures.push(`${origin}: missing ${url}`);
};
for(const file of pages){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g))check(m[1],file);
}
const code=fs.readFileSync(path.join(root,'assets/content.js'),'utf8');
for(const m of code.matchAll(/['"](\.\/assets\/[^'"]+)['"]/g))check(m[1],'assets/content.js');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('PASS: local page, image, report and certificate references exist.');
