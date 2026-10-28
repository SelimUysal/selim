import { DATA } from './data.js';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const getPreference = (name, fallback) => { try { return localStorage.getItem(name) || fallback; } catch { return fallback; } };
const setPreference = (name, value) => { try { localStorage.setItem(name, value); } catch {} };
const state = {lang:getPreference('selim-language','en'),theme:getPreference('selim-theme','dark'),filter:'all'};
if (!['tr','en'].includes(state.lang)) state.lang='en';
if (!['dark','light'].includes(state.theme)) state.theme='dark';

const i18n = {
  en: {
    work:'Work',allProjects:'All Projects',experience:'Experience',research:'Research',about:'About',contact:'Contact',
    heroEyebrow:'SOFTWARE ENGINEER · AI & AUTONOMOUS SYSTEMS',heroTitle:'Building practical solutions with <span>AI and software engineering.</span>',
    heroLead:'I develop real-world software applications and explore intelligent systems that connect machine learning, autonomous technologies and modern software design.',
    viewWork:'View My Work →',downloadCv:'Download CV ↧',featured:'Featured Projects',featuredLead:'A curated selection of software and research work.',
    exploreAll:'Explore all projects ↗',smartSearch:'Smart Project Search',results:'Projects',searchHint:'Search by technology, project, description, abbreviation or typo.',viewAll:'Browse all projects ↗',
    researchTitle:'Research Statement',researchAreas:'Key Research Areas',academicNote:'Academic reports are undergraduate project work, not peer-reviewed publications.',
    experienceLead:'Industry practice, embedded systems and teaching.',aboutLead:'A software engineer with a growing interest in research.',education:'EDUCATION',recognition:'RECOGNITION',certificates:'Certificates',
    resume:'Two résumés. One identity.',academicCv:'Academic CV',industryCv:'Software Engineering CV',academicCvLead:'Research direction, education and undergraduate studies.',
    industryCvLead:'Applications, engineering practice and technical experience.',openCv:'Open CV ↗',contactTitle:"Let's build something useful.",contactLead:'Open to conversations on software engineering and graduate research.',emailMe:'Email me ↗',
    mobilePreview:'Mobile Preview',socialPreview:'Social Link Preview',projectsTitle:'Projects & experiments.',projectsLead:'Search verified software projects, undergraduate research reports and code exercises. Each project links to its source, live app, store listing or report where available.',
    all:'All',software:'Software',researchFilter:'Academic',archive:'Learning repositories',back:'← Back to portfolio',print:'Print / Save as PDF'
  },
  tr: {
    work:'Çalışmalar',allProjects:'Tüm Projeler',experience:'Deneyim',research:'Araştırma',about:'Hakkımda',contact:'İletişim',
    heroEyebrow:'YAZILIM MÜHENDİSİ · YAPAY ZEKÂ VE OTONOM SİSTEMLER',heroTitle:'<span>Yapay zekâ ve yazılım mühendisliğiyle</span> gerçek çözümler geliştiriyorum.',
    heroLead:'Gerçek yaşamda kullanılan yazılımlar geliştiriyor; makine öğrenmesi, otonom teknolojiler ve modern yazılım tasarımını birleştiren akıllı sistemleri araştırıyorum.',
    viewWork:'Çalışmalarımı İncele →',downloadCv:'CV İndir ↧',featured:'Öne Çıkan Projeler',featuredLead:'Yazılım ve araştırma çalışmalarından seçtiklerim.',
    exploreAll:'Tüm projeleri keşfet ↗',smartSearch:'Akıllı Proje Araması',results:'Projeler',searchHint:'Teknoloji, proje, açıklama, kısaltma veya yazım hatasıyla arayın.',viewAll:'Bütün projeleri incele ↗',
    researchTitle:'Araştırma Beyanım',researchAreas:'Temel Araştırma Alanları',academicNote:'Akademik raporlar hakemli yayın değil, lisans düzeyindeki proje çalışmalarıdır.',
    experienceLead:'Sektör, gömülü sistemler ve eğitmenlik deneyimlerim.',aboutLead:'Araştırmaya ilgi duyan bir yazılım mühendisi.',education:'EĞİTİM',recognition:'BAŞARI',certificates:'Sertifikalar',
    resume:'Tek kimlik. İki farklı CV.',academicCv:'Akademik CV',industryCv:'Yazılım Mühendisliği CV',academicCvLead:'Araştırma hedefleri, eğitim ve lisans çalışmaları.',
    industryCvLead:'Uygulamalar, mühendislik ve teknik deneyim.',openCv:'CV’yi aç ↗',contactTitle:'Birlikte değerli bir şey üretelim.',contactLead:'Yazılım mühendisliği ve lisansüstü araştırmalar üzerine iletişime açığım.',emailMe:'E-posta gönder ↗',
    mobilePreview:'Mobil Görünüm',socialPreview:'Sosyal Medya Link Önizlemesi',projectsTitle:'Projelerim ve denemelerim.',projectsLead:'Yazılım projelerimi, lisans raporlarımı ve kod çalışmalarımı arayın. Varsa kaynak kodu, canlı uygulama, mağaza veya raporu doğrudan açabilirsiniz.',
    all:'Tümü',software:'Yazılım',researchFilter:'Akademik',archive:'Öğrenme depoları',back:'← Portfolyoya dön',print:'Yazdır / PDF Kaydet'
  }
};
const localize = (obj) => typeof obj === 'string' ? obj : (obj?.[state.lang] ?? obj?.en ?? '');
const linkLabels = {en:{live:'Live App',source:'GitHub',store:'Chrome Store',video:'Video',report:'Report (PDF)'},tr:{live:'Canlı Uygulama',source:'GitHub',store:'Chrome Mağazası',video:'Video',report:'Rapor (PDF)'}};
function actionButtons(project){return (project.links || []).map(item => `<a href="${escapeHtml(item.url)}" class="${['live','store','report'].includes(item.kind)?'action-primary':''}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkLabels[state.lang][item.kind] || 'Open')} ↗</a>`).join('');}
function tagList(items,max=3){return (items||[]).slice(0,max).map(value=>`<span class="tag">${escapeHtml(value)}</span>`).join('');}
function projectSummary(item){
 if(state.lang==='en'){
  if(item.id==='hayat')return 'Prayer schedules, Quran reading, memorization and learning tools in one responsive app.';
  if(item.id==='teknofest')return 'Aerial object detection with YOLO and SAHI. 11th of 198 teams in preliminary design evaluation.';
  if(item.id==='video')return 'Control HTML5 video speed, shortcuts and saved preferences.';
  if(item.id==='telegram')return 'News gathering and Telegram Bot API automation prototype.';
 } else {
  if(item.id==='hayat')return 'Namaz vakitleri, Kur’an okuma, ezber ve öğrenme araçlarını buluşturan mobil uyumlu uygulama.';
  if(item.id==='teknofest')return 'YOLO ve SAHI ile havadan nesne tespiti; ön tasarım değerlendirmesinde 198 takım arasında 11’incilik.';
  if(item.id==='video')return 'HTML5 video hızını, kısayollarını ve kayıtlı tercihleri yöneten eklenti.';
  if(item.id==='telegram')return 'Haber toplama ve Telegram Bot API otomasyon prototipi.';
 }
 return localize(item.description);
}
function homeCard(p){return `<article class="project-card" data-project="${escapeHtml(p.id)}"><div class="project-head"><span class="project-symbol symbol-${escapeHtml(p.id)}">${escapeHtml(p.icon)}</span><span class="small-text">↗</span></div><h3>${escapeHtml(localize(p.name))}</h3><div class="tags">${tagList(p.stack)}</div><p>${escapeHtml(projectSummary(p))}</p><div class="links">${actionButtons(p)}</div></article>`;}
const projects = [...DATA.projects];
const archived = DATA.archive.map(p=>({...p,category:'archive',stack:[p.technology],links:[{kind:'source',url:p.url}],icon:'⌁'}));
const catalog = [...projects,...archived];
const normalize = value => String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase().replace(/[^a-z0-9+#.]+/g,' ').trim();
const tokenize = value => normalize(value).split(/\s+/).filter(Boolean);
const aliases = {
 pyt:['python'],py:['python'],pyth:['python'],pyhton:['python'],pytjon:['python'],python3:['python'],
 yapay:['ai','artificial','machine','yolo'],zeka:['ai','intelligence','machine','yolo'],ai:['artificial','yapay','zeka','machine','yolo'],
 drone:['aerial','transportation','yolo'],dron:['aerial','transportation','yolo'],iha:['aerial','transportation','yolo'],
 db:['database','oracle','sql'],veritabani:['oracle','sql','database'],veri:['database','sql'],
 ml:['learning','machine','yolo'],llm:['gemini','language','models'],
 otomasyon:['automation','telegram','puppeteer'],automation:['otomasyon','telegram','puppeteer'],
 extension:['chrome','browser','speed'],eklenti:['chrome','browser','speed'],
 web:['react','vite','typescript','html'],js:['javascript'],ts:['typescript'],reactjs:['react'],
 cv:['vision','yolo','computer'],goruntu:['vision','detection','yolo'],quran:['quran','kur','arabic'],kuran:['quran','arabic']
};
function distance(a,b){
 if(Math.abs(a.length-b.length)>2)return 3;
 let old=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  let next=[i];for(let j=1;j<=b.length;j++)next.push(Math.min(next[j-1]+1,old[j]+1,old[j-1]+(a[i-1]===b[j-1]?0:1)));
  old=next;
 }
 return old[b.length];
}
function tokenScore(query, words){
 const terms=[query,...(aliases[query]||[])];let best=0;
 for(let k=0;k<terms.length;k++)for(const word of words){
  const term=terms[k],alias=k!==0;
  if(term===word)best=Math.max(best,alias?.9:1);
  else if(term.length>=3&&word.startsWith(term))best=Math.max(best,alias?.65:.8);
  else if(term.length>=4&&word.includes(term))best=Math.max(best,alias?.42:.52);
  else if(term.length>=4&&!alias&&word.length>=4&&distance(term,word)<=(term.length>=8?2:1))best=Math.max(best,.39);
 }
 return best;
}
function matchScore(item,words){
 const fields = [[localize(item.name),13],[Object.values(item.name).join(' '),9],[(item.stack||[]).join(' '),11],[localize(item.description),3],[Object.values(item.description).join(' '),2],[item.category,2]];
 let total=0;
 for(const word of words){
  const match=Math.max(...fields.map(([value,weight])=>weight*tokenScore(word,tokenize(value))));
  if(!match)return null;
  total+=match;
 }
 return total;
}
function search(query,filter='all'){
 const words=tokenize(query).slice(0,8);
 return catalog.map((item,index)=>({item,index,score:words.length?matchScore(item,words):0}))
  .filter(x=>x.score!==null&&(filter==='all'||(filter==='software'?(x.item.category==='software'||x.item.category==='archive'):x.item.category==='research')))
  .sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);
}
function quickResults(){
 const field=$('#quick-search');if(!field)return;
 const query=field.value;const matches=search(query);
 $('#quick-count').textContent=`${matches.length} ${state.lang==='tr'?'sonuç':'results'}`;
 const shown=matches.slice(0,5);
 $('#quick-list').innerHTML=shown.length?shown.map(p=>{
  const tags=tagList(p.stack,3);
  const url=p.links?.[0]?.url||'#';
  return `<a class="result-item" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><span class="result-icon">${escapeHtml(p.icon)}</span><span><h3>${escapeHtml(localize(p.name))}</h3><span class="tags">${tags}</span></span><span class="arrow">›</span></a>`;
 }).join(''):`<div class="empty-results">${state.lang==='tr'?'Sonuç bulunamadı. Başka bir kelime deneyin.':'No projects found. Try another keyword.'}</div>`;
}
function directoryResults(){
 const target=$('#directory-results');if(!target)return;
 const input=$('#directory-search');const results=search(input?.value||'',state.filter);
 const main=results.filter(p=>p.category!=='archive');
 const archiveMatches=results.filter(p=>p.category==='archive');
 target.innerHTML=main.length?main.map(p=>`<article class="directory-card"><span class="project-symbol symbol-${escapeHtml(p.id)}">${escapeHtml(p.icon)}</span><h2>${escapeHtml(localize(p.name))}</h2><p>${escapeHtml(localize(p.description))}</p><div class="tags">${tagList(p.stack,5)}</div><div class="links">${actionButtons(p)}</div></article>`).join(''):`<div class="empty-results">${state.lang==='tr'?'Eşleşen proje bulunamadı.':'No matching projects found.'}</div>`;
 const archiveSection=$('.archive-heading');const ag=$('#archive-grid');
 if(ag){ag.innerHTML=archiveMatches.map(p=>`<article class="archive-item"><h3>${escapeHtml(localize(p.name))}</h3><p>${escapeHtml(localize(p.description))}</p>${actionButtons(p)}</article>`).join('');if(archiveSection)archiveSection.hidden=archiveMatches.length===0;ag.hidden=archiveMatches.length===0;}
 $('#directory-count').textContent=`${results.length} ${state.lang==='tr'?'sonuç':'results'} · ${state.lang==='tr'?'Projeler gerçek kaynak bağlantılarıyla sunuluyor.':'Links point to real repositories, demos and reports.'}`;
}
function renderHome(){
 const grid=$('#home-projects');if(!grid)return;
 grid.innerHTML=['hayat','teknofest','video','telegram'].map(id=>projects.find(p=>p.id===id)).filter(Boolean).map(homeCard).join('');
 $('#statement-copy').textContent=localize(DATA.researchStatement);
 const timeline=$('#timeline');if(timeline)timeline.innerHTML=DATA.experiences.map(e=>`<article><span class="year">${escapeHtml(e.date)}</span><h3>${escapeHtml(e.name)}</h3><strong>${escapeHtml(localize(e.kind))}</strong><p>${escapeHtml(localize(e.description))}</p></article>`).join('');
 const cert=$('#cert-list');if(cert)cert.innerHTML=DATA.certificates.map(c=>`<article class="credential-card"><span class="mini-label">${escapeHtml(c.issuer)}</span><h3>${escapeHtml(localize(c.title))}</h3><p>${escapeHtml(c.year)}</p><a href="${escapeHtml(c.pdf)}" target="_blank" rel="noopener noreferrer">${state.lang==='tr'?'Sertifikayı görüntüle ↗':'View certificate ↗'}</a></article>`).join('');
 quickResults();
}
function applyLanguage(){
 document.documentElement.lang=state.lang;
 $$('[data-i18n]').forEach(el=>{const translation=i18n[state.lang][el.dataset.i18n];if(translation)el.textContent=translation;});
 $$('[data-i18n-html]').forEach(el=>{const translation=i18n[state.lang][el.dataset.i18nHtml];if(translation)el.innerHTML=translation;});
 document.title=state.lang==='tr'?'Selim Uysal | Yazılım Mühendisi':'Selim Uysal | Software Engineer';
 renderHome();directoryResults();
}
function applyTheme(){document.documentElement.dataset.theme=state.theme;}
function init(){
 applyTheme();applyLanguage();
 $$('[data-language]').forEach(b=>b.addEventListener('click',()=>{state.lang=state.lang==='tr'?'en':'tr';setPreference('selim-language',state.lang);applyLanguage();}));
 $$('[data-theme]').forEach(b=>b.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';setPreference('selim-theme',state.theme);applyTheme();}));
 $$('[data-menu]').forEach(button=>button.addEventListener('click',()=>{const nav=$('#mobile-nav');nav.classList.toggle('open');button.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');}));
 $$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('#mobile-nav')?.classList.remove('open');$('[data-menu]')?.setAttribute('aria-expanded','false');}));
 $('#quick-search')?.addEventListener('input',quickResults);
 $$('[data-query]').forEach(b=>b.addEventListener('click',()=>{const input=$('#quick-search');input.value=b.dataset.query;quickResults();input.focus();}));
 $('#directory-search')?.addEventListener('input',directoryResults);
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));directoryResults();}));
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();const input=$('#quick-search')||$('#directory-search');input?.focus();}});
}
init();
