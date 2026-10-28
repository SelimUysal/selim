/* Rebuild static English HTML snapshots for search engines and no-JS readers.
   npm not needed: run `node scripts/prerender.mjs` after editing content.js. */
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const pages=[['index.html','academic'],['projects.html','projects'],['cv.html','academic-cv'],['industry-cv.html','industry-cv']];
for(const [file,page] of pages){
 const app={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
 globalThis.matchMedia=()=>({matches:false});
 globalThis.document={body:{dataset:{page}},documentElement:{dataset:{},lang:''},title:'',addEventListener:()=>{},querySelector:q=>q==='#app'?app:{content:''}};
 globalThis.window={addEventListener:()=>{},print:()=>{}};
 await import(new URL((page==='academic'?'../assets/landing.js?static=':'../assets/app.js?static=')+page,import.meta.url));
 const p=path.join(root,file);
 const original=fs.readFileSync(p,'utf8');
 const updated=original.replace(/<!-- PRERENDER:START -->[\s\S]*?<!-- PRERENDER:END -->/,`<!-- PRERENDER:START -->\n${app.innerHTML}\n<!-- PRERENDER:END -->`);
 if(!original.includes('<!-- PRERENDER:START -->') || !original.includes('<!-- PRERENDER:END -->')) throw new Error('Prerender marker missing in '+file);
 fs.writeFileSync(p,updated,'utf8');
 console.log(file,app.innerHTML.length,'HTML characters');
}
