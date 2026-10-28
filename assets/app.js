import {profile, projects, archive, research, engineering, experiences, honors, certificates, translations} from './content.js';

const app = document.querySelector('#app');
const path = document.body.dataset.page || 'academic';
const isCv = path.endsWith('-cv');
const isDirectory = path === 'projects';
const audience = path.startsWith('industry') ? 'industry' : 'academic';
const localKey = 'selim-portfolio-';
const stored = (k) => { try { return localStorage.getItem(localKey + k); } catch {return null;} };
const persist = (k,v) => {try {localStorage.setItem(localKey + k,v);} catch { /* localStorage unavailable */ }};
let lang = stored('language') === 'tr' ? 'tr' : 'en';
const savedTheme = stored('theme');
let theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'dark';
let menuOpen = false;
const other = audience === 'academic' ? 'industry' : 'academic';
const indexUrl = './index.html';
const cvUrl = audience === 'academic' ? './cv.html' : './industry-cv.html';
const routeUrl = {academic:'./index.html',industry:'./industry.html'};
let directoryFilter = 'all';
let directoryQuery = '';
const t = (key) => translations[lang][key] || key;
const tr = (obj) => typeof obj === 'string' ? obj : (obj?.[lang] ?? '');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ext = (href,label,cls='') => `<a href="${esc(href)}" class="${cls}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)} (${esc(t('external'))})">${esc(label)}<span aria-hidden="true"> ↗</span></a>`;
const pill = (txt) => `<span class="skill-pill">${esc(txt)}</span>`;
const number = n=>String(n).padStart(2,'0');

function header(){
 const sectionBase='./index.html';
 const nav=[[t('navWork'),sectionBase+'#work'],[t('directoryNav'),'./projects.html'],[t('navExperience'),sectionBase+'#experience'],[t('aboutNav')||'About',sectionBase+'#about']];
 const navLinks=nav.map(([label,url],i)=>`<a href="${url}" ${isDirectory&&i===1?'aria-current="page" class="active"':''}>${esc(label)}</a>`).join('');
 return `<a class="skip-link" href="#main">${esc(t('skip'))}</a><header class="site-header"><div class="shell header-inner">
 <a class="brand" href="./index.html" aria-label="Selim Uysal — Home"><span class="brand-mark">S<span class="brand-dot">.</span>U</span><span class="brand-info"><strong>Selim Uysal</strong><small>SOFTWARE ENGINEER</small></span></a>
 <nav class="desktop-links main-nav" aria-label="${esc(t('menu'))}">${navLinks}</nav>
 <div class="header-controls"><div class="lang-control" aria-label="${esc(t('language'))}"><button type="button" data-set-lang="en" aria-pressed="${lang==='en'}" class="${lang==='en'?'on':''}">EN</button><span aria-hidden="true">/</span><button type="button" data-set-lang="tr" aria-pressed="${lang==='tr'}" class="${lang==='tr'?'on':''}">TR</button></div>
 <button class="theme-button" type="button" data-toggle-theme aria-label="${esc(t('switchTheme'))}" title="${esc(theme==='dark'?t('themeLight'):t('themeDark'))}"><span aria-hidden="true">${theme==='dark'?'☀':'☾'}</span></button><button class="menu-button" type="button" data-toggle-menu aria-expanded="${menuOpen}" aria-controls="mobile-menu" aria-label="${esc(menuOpen?t('closeMenu'):t('menu'))}"><span aria-hidden="true">${menuOpen?'✕':'☰'}</span></button></div></div>
 <div id="mobile-menu" class="mobile-menu ${menuOpen?'open':''}"><div class="shell"><span class="mobile-menu-label">NAVIGATION</span><nav class="mobile-links">${navLinks}<a href="./cv.html">${esc(t('cvAcademic'))}</a><a href="./industry-cv.html">${esc(t('cvIndustry'))}</a></nav></div></div></header>`;
}

function art(symbol,id){
 return `<div class="card-art card-art-${esc(id)}" aria-hidden="true"><span class="art-noise"></span><div class="art-orbit orbit-1"></div><div class="art-orbit orbit-2"></div><span class="art-symbol">${esc(symbol)}</span><span class="art-index">SU / ${esc(id.toUpperCase())}</span><span class="art-corner">↗</span></div>`;
}
function projectCard(item,i){
 const buttons = item.links.map(l=>ext(l.url,t({source:'cardSource',live:'cardLive',store:'cardStore',video:'cardVideo',report:'cardReport'}[l.kind]),l.kind==='live' || l.kind==='store' || l.kind==='report'?'project-link primary-link':'project-link')).join('');
 return `<article class="project-card theme-${esc(item.theme)} ${i===0?'featured-card':''}">
 ${art(item.symbol,item.id)}<div class="project-body"><div class="project-meta"><span>${esc(tr(item.type))}</span><span>${esc(item.year)}</span></div>
 <h3>${esc(tr(item.name))}</h3><p>${esc(tr(item.description))}</p><div class="skill-row">${item.stack.map(pill).join('')}</div>
 ${buttons?`<div class="project-actions">${buttons}</div>`:''}</div></article>`;
}
function sectionHead(kicker,title,intro){return `<div class="section-head"><div class="section-kicker">${esc(kicker)}</div><div class="section-title-row"><h2>${esc(title)}</h2><p>${esc(intro)}</p></div></div>`;}
function focusCard(item,i){return `<article class="focus-card"><div class="focus-card-head"><span class="focus-symbol" aria-hidden="true">${esc(item.symbol)}</span><span class="focus-index">${number(i+1)}</span></div><h3>${esc(tr(item.title))}</h3><p>${esc(tr(item.description))}</p></article>`;}
function experienceCard(e,i){return `<div class="experience-item"><div class="experience-marker" aria-hidden="true">${number(i+1)}</div><div><div class="experience-role">${esc(tr(e.kind))}</div><h3>${esc(e.name)}</h3>${e.date?`<span class="experience-date">${esc(e.date)}</span>`:''}<p>${esc(tr(e.description))}</p></div></div>`;}
function awards(){return `<section class="section background-section" id="background"><div class="shell">${sectionHead(t('backgroundKicker'),t('backgroundTitle'),t('backgroundIntro'))}<div class="timeline">${honors.map(h=>`<article class="timeline-entry"><span class="timeline-date">${esc(h.date)}</span><div class="timeline-body"><div class="timeline-tag">${esc(tr(h.tag))}</div><h3>${esc(tr(h.name))}</h3><p>${esc(tr(h.detail))}</p></div><span class="timeline-arrow" aria-hidden="true">↗</span></article>`).join('')}</div></div></section>`;}
function certSection(){
 if(!certificates.length)return '';
 return `<section class="section certification-section" id="certificates"><div class="shell">${sectionHead('CERTIFICATIONS',t('certificatesTitle'),t('certificatesIntro'))}<div class="certificate-list">${certificates.map((x,i)=>`<article class="certificate"><div class="certificate-top"><span class="certificate-number">CERT / ${number(i+1)}</span><span class="certificate-medal" aria-hidden="true">✳</span></div><div class="certificate-inner"><h3>${esc(tr(x.title))}</h3><p>${esc(x.issuer)} · ${esc(x.year)}</p></div><div class="certificate-actions">${x.pdf?ext(x.pdf,t('cardCertificate'),'project-link primary-link'):''}${x.url?ext(x.url,t('cardVerify'),'project-link'):''}</div></article>`).join('')}</div></div></section>`;
}
function archiveSection(){
 if(audience!=='industry')return '';
 return `<section class="section archive-section" id="archive"><div class="shell">${sectionHead(t('archiveKicker'),t('archiveTitle'),t('archiveIntro'))}<div class="archive-grid">${archive.map((item,i)=>`<article class="archive-item"><div class="archive-index">${number(i+1)} <span>${esc(item.technology)}</span></div><h3>${esc(tr(item.name))}</h3><p>${esc(tr(item.description))}</p>${ext(item.url,t('cardSource'),'archive-link')}</article>`).join('')}</div></div></section>`;
}

function hero(){
 const academic=audience==='academic';
 const eyebrow=t(academic?'academicEyebrow':'industryEyebrow');
 const top=t(academic?'academicHeroTop':'industryHeroTop');
 const bottom=t(academic?'academicHeroBottom':'industryHeroBottom');
 const lead=t(academic?'academicLead':'industryLead');
 const edu=t(academic?'academicEducation':'industryEducation');
 const panel=academic ? `<div class="panel-diagram" aria-hidden="true"><svg viewBox="0 0 420 220" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="academicGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a6b5ff"/><stop offset="1" stop-color="#6ee7c6"/></linearGradient></defs><g fill="none" stroke="currentColor" stroke-opacity=".24" stroke-width="1.5"><path d="M72 110L168 54 256 111 352 63M168 54L181 177 256 111M256 111L347 179 352 63M72 110L181 177"/></g><g fill="url(#academicGradient)"><circle cx="72" cy="110" r="8"/><circle cx="168" cy="54" r="11"/><circle cx="256" cy="111" r="16"/><circle cx="352" cy="63" r="9"/><circle cx="181" cy="177" r="9"/><circle cx="347" cy="179" r="7"/></g><circle cx="256" cy="111" r="36" fill="none" stroke="#a6b5ff" opacity=".38" stroke-dasharray="3 5"/><g font-size="11" font-family="monospace" fill="currentColor" opacity=".7"><text x="25" y="92">DATA</text><text x="128" y="35">SYSTEMS</text><text x="260" y="160">AI</text><text x="337" y="47">IDEAS</text></g></svg></div><div class="panel-tags"><span>ML / LLM</span><span>AGENTS</span><span>SOFTWARE QUALITY</span></div>` : `<div class="panel-showcase" aria-hidden="true"><div class="mock-browser"><div class="mock-topbar"><div class="mock-dots"><i></i><i></i><i></i></div><span>PROJECT / PREVIEW</span><span class="mock-spark">✦</span></div><div class="mock-grid"><div class="mock-block major"><div class="mock-block-text"><span>01 / PRODUCT</span><b>HAYAT<br>REHBERİ.</b></div><div class="mock-ring"></div></div><div class="mock-stack"><div class="mock-block small"><span>VIDEO<br>SPEED</span><strong>▷</strong></div><div class="mock-block small second"><span>AUTOMATION</span><strong>↗</strong></div></div></div></div></div><div class="panel-tags"><span>WEB APPLICATIONS</span><span>EXTENSIONS</span><span>AUTOMATION</span></div>`;
 const rows=academic?[
  [t('highlight1Academic'),t('highlight1AcademicSub')],[t('highlight2Academic'),t('highlight2AcademicSub')],[t('highlight3Academic'),t('highlight3AcademicSub')]
 ]:[
  [t('highlight1Industry'),t('highlight1IndustrySub')],[t('highlight2Industry'),t('highlight2IndustrySub')],[t('highlight3Industry'),t('highlight3IndustrySub')]
 ];
 return `<section class="hero-section"><div class="hero-halo" aria-hidden="true"></div><div class="shell hero-layout"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span>${esc(eyebrow)}<span class="eyebrow-slash">/</span> ${new Date().getFullYear()}</div><h1>${esc(top)}<span>${esc(bottom)}</span></h1><p class="hero-lead">${esc(lead)}</p><div class="hero-education"><span class="tiny-star" aria-hidden="true">✳</span>${esc(edu)}</div><div class="hero-actions"><a class="button-primary" href="#work">${esc(t('viewWork'))}<span aria-hidden="true">↗</span></a><a class="button-secondary" href="${cvUrl}">${esc(t('viewCV'))}<span aria-hidden="true">↗</span></a>${academic?`<a class="hero-download" href="${esc(profile.academicCvPdf)}" target="_blank" rel="noopener noreferrer">PDF CV ↓</a>`:''}</div></div><aside class="hero-panel"><div class="hero-panel-top"><span>${esc(t(academic?'panelAcademic':'panelIndustry'))}</span><span class="panel-plus">✳</span></div><h2>${esc(t(academic?'panelAcademicHead':'panelIndustryHead'))}</h2>${panel}<p class="panel-footer">${esc(t(academic?'panelAcademicFoot':'panelIndustryFoot'))}</p></aside></div><div class="shell highlights" aria-label="Highlights">${rows.map(([v,d],i)=>`<div class="highlight"><span class="highlight-num">${number(i+1)}</span><strong>${esc(v)}</strong><span>${esc(d)}</span></div>`).join('')}</div></section>`;
}
function portfolio(){
 const academic=audience==='academic';
 const list=projects.filter(p=>p.showOn.includes(audience));
 const areas=academic?research:engineering;
 const html= `${header()}<main id="main">${hero()}
 <section class="section work-section" id="work"><div class="shell">${sectionHead(t('workKicker'),t(academic?'workTitleAcademic':'workTitleIndustry'),t(academic?'workIntroAcademic':'workIntroIndustry'))}<div class="project-grid">${list.map(projectCard).join('')}</div></div></section>
 <div class="shell directory-teaser"><span>${esc(t('directoryTeaser'))}</span><a href="./projects.html">${esc(t('directoryCTA'))}<span aria-hidden="true"> ↗</span></a></div>
 <section class="section focus-section" id="focus"><div class="shell">${sectionHead(t(academic?'focusKicker':'focusKickerIndustry'),t(academic?'focusTitleAcademic':'focusTitleIndustry'),t(academic?'focusIntroAcademic':'focusIntroIndustry'))}<div class="focus-grid">${areas.map(focusCard).join('')}</div></div></section>
 ${academic?awards():archiveSection()}
 <section class="section experience-section" id="experience"><div class="shell">${sectionHead(t(academic?'experienceKickerAcademic':'experienceKickerIndustry'),t('experienceTitle'),t('experienceIntro'))}<div class="experience-layout"><div class="experience-lede"><span class="experience-glyph" aria-hidden="true">✳</span><p>BUILDING, LEARNING<br>& SHARING KNOWLEDGE.</p></div><div class="experience-list">${experiences.map(experienceCard).join('')}</div></div></div></section>
 ${certSection()}
 <section class="section contact-section" id="contact"><div class="shell"><div class="contact-box"><div><div class="section-kicker">${esc(t(academic?'contactKickerAcademic':'contactKickerIndustry'))}</div><h2>${esc(t(academic?'contactTitleAcademic':'contactTitleIndustry'))}</h2><p>${esc(t(academic?'contactIntroAcademic':'contactIntroIndustry'))}</p></div><div class="contact-actions">${ext(profile.github,t('contactButton'),'button-light')}${ext(profile.linktree,t('contactOther'),'text-contact')}</div><span class="contact-decor" aria-hidden="true">↗</span></div></div></section></main>${footer()}`;
 return html;
}
function directoryCard(p,i){
 const actions=p.links.map(l=>ext(l.url,t({source:'cardSource',live:'cardLive',store:'cardStore',video:'cardVideo',report:'cardReport'}[l.kind]),'directory-action '+(l.kind==='live'||l.kind==='store'||l.kind==='report'?'is-primary':''))).join('');
 return `<article class="directory-card" data-project="${esc(p.id)}"><div class="directory-card-top"><span class="directory-card-icon">${esc(p.symbol)}</span><span class="directory-category">${esc(p.showOn[0]==='academic'?t('academic'):t('industry'))}</span></div><h3>${esc(tr(p.name))}</h3><p>${esc(tr(p.description))}</p><div class="directory-stack">${p.stack.slice(0,4).map(pill).join('')}</div><div class="directory-actions">${actions}</div></article>`;
}
function directory(){
 return `${header()}<main id="main" class="directory-page"><section class="directory-hero"><div class="shell"><div class="section-kicker">PROJECTS / OPEN WORK</div><h1>${esc(t('directoryTitle'))}</h1><p>${esc(t('directoryIntro'))}</p><div class="directory-toolbar"><label class="directory-search"><span class="sr-only">${esc(t('directorySearchLabel'))}</span><span aria-hidden="true">⌕</span><input data-directory-search type="search" placeholder="${esc(t('directorySearch'))}" value="${esc(directoryQuery)}" autocomplete="off" /></label><div class="directory-filters" role="group" aria-label="${esc(t('directoryFilter'))}">${[['all','directoryAll'],['academic','academic'],['industry','industry']].map(([id,label])=>`<button type="button" data-directory-filter="${id}" class="${directoryFilter===id?'active':''}" aria-pressed="${directoryFilter===id}">${esc(t(label))}</button>`).join('')}</div></div><div class="directory-meta"><span>${projects.length} ${esc(t('directoryFeatured'))} · ${archive.length} ${esc(t('directoryArchiveCount'))}</span><span>${esc(t('directorySource'))}</span></div></div></section><section class="section directory-results" id="projects"><div class="shell"><div class="directory-grid" data-directory-results>${projects.filter(p=>directoryFilter==='all'||p.showOn.includes(directoryFilter)).map(directoryCard).join('')}</div><p class="directory-empty" data-directory-empty hidden>${esc(t('directoryEmpty'))}</p></div></section><section class="section archive-section" id="archive"><div class="shell">${sectionHead(t('archiveKicker'),t('archiveTitle'),t('archiveIntro'))}<div class="archive-grid" data-archive-results>${archive.map((item,i)=>`<article class="archive-item"><div class="archive-index">${number(i+1)} <span>${esc(item.technology)}</span></div><h3>${esc(tr(item.name))}</h3><p>${esc(tr(item.description))}</p>${ext(item.url,t('cardSource'),'archive-link')}</article>`).join('')}</div></div></section></main>${footer()}`;
}
function renderDirectoryResults(){
 if(!isDirectory)return;
 const target=app.querySelector('[data-directory-results]'); if(!target)return;
 const search=directoryQuery.toLocaleLowerCase(lang==='tr'?'tr-TR':'en-US').trim();
 const visible=projects.filter(p=>(directoryFilter==='all'||p.showOn.includes(directoryFilter)) && (!search || [tr(p.name),tr(p.description),p.stack.join(' '),tr(p.type)].join(' ').toLocaleLowerCase(lang==='tr'?'tr-TR':'en-US').includes(search)));
 target.innerHTML=visible.map(directoryCard).join('');
 const archiveTarget=app.querySelector('[data-archive-results]');
 if(archiveTarget){
  const showArchive=directoryFilter!=='academic';
  const archiveVisible=archive.filter(item=>showArchive && (!search||[tr(item.name),tr(item.description),item.technology].join(' ').toLocaleLowerCase(lang==='tr'?'tr-TR':'en-US').includes(search)));
  archiveTarget.innerHTML=archiveVisible.map((item,i)=>`<article class="archive-item"><div class="archive-index">${number(i+1)} <span>${esc(item.technology)}</span></div><h3>${esc(tr(item.name))}</h3><p>${esc(tr(item.description))}</p>${ext(item.url,t('cardSource'),'archive-link')}</article>`).join('');
  const archiveSection=app.querySelector('#archive');if(archiveSection)archiveSection.hidden=archiveVisible.length===0;
  const empty=app.querySelector('[data-directory-empty]');if(empty)empty.hidden=visible.length+archiveVisible.length!==0;
 }
}
function footer(){return `<footer class="footer"><div class="shell footer-inner"><div class="footer-left"><div class="footer-name">Selim Uysal <span>✳</span></div><p>${esc(t('unifiedFooter'))}</p><small>${esc(t('footerLocation'))}</small></div><div class="footer-right"><div><a href="./index.html#work">${esc(t('navWork'))}</a><a href="./projects.html">${esc(t('directoryNav'))}</a><a href="./index.html#about">${esc(t('aboutNav'))}</a></div><div><a href="./cv.html">${esc(t('cvAcademic'))}</a><a href="./industry-cv.html">${esc(t('cvIndustry'))}</a><a href="mailto:${esc(profile.email)}">Email</a></div><small>© ${new Date().getFullYear()} SELIM UYSAL</small></div></div></footer>`;}

function cv(){
 const academic=audience==='academic';
 const selected=projects.filter(p=>p.showOn.includes(audience));
 const areas=academic?research:engineering;
 return `${header()}<main id="main" class="cv-main"><div class="shell cv-shell"><div class="cv-toolbar"><a href="${indexUrl}">← ${esc(t('back'))}</a><button type="button" class="button-primary" data-print>${esc(t('print'))} ↗</button></div><div class="cv-document"><div class="cv-header"><div><p class="cv-label">${esc(t(academic?'cvAcademicTitle':'cvIndustryTitle'))}</p><h1>Selim Uysal</h1><h2>SOFTWARE ENGINEERING GRADUATE</h2></div><div class="cv-links">${ext(profile.github,'GitHub')}<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>${academic?ext(profile.academicCvPdf,'Full academic CV · PDF'): ''}</div></div><p class="cv-intro">${esc(t(academic?'cvSummaryAcademic':'cvSummaryIndustry'))}</p>
 <section class="cv-section"><h3>${esc(t('education'))}</h3><div class="cv-item"><div><h4>${esc(profile.education.degree)}</h4><p>${esc(profile.education.school)}</p></div><strong>2025</strong></div></section>
 ${academic?`<section class="cv-section"><h3>${esc(t('honorsTitle'))}</h3>${honors.slice(1).map(h=>`<div class="cv-item"><div><h4>${esc(tr(h.name))}</h4><p>${esc(tr(h.detail))}</p></div><strong>${esc(h.date)}</strong></div>`).join('')}</section>`:''}
 <section class="cv-section"><h3>${esc(t('projects'))}</h3>${selected.map(p=>`<div class="cv-item cv-project"><div><h4>${esc(tr(p.name))}</h4><p>${esc(tr(p.description))}</p><div class="cv-tech">${esc(p.stack.join(' · '))}</div>${p.links?.length?`<div class="cv-project-links">${p.links.map(l=>ext(l.url,t({source:'cardSource',live:'cardLive',store:'cardStore',video:'cardVideo',report:'cardReport'}[l.kind]))).join(' ')}</div>`:''}</div></div>`).join('')}</section>
 <section class="cv-section"><h3>${esc(t('experience'))}</h3>${experiences.map(e=>`<div class="cv-item"><div><h4>${esc(e.name)} <span class="cv-muted">/ ${esc(tr(e.kind))}${e.date?` · ${esc(e.date)}`:''}</span></h4><p>${esc(tr(e.description))}</p></div></div>`).join('')}</section>
 <section class="cv-section"><h3>${esc(t('certificatesTitle'))}</h3>${certificates.map(c=>`<div class="cv-item"><div><h4>${esc(tr(c.title))}</h4><p>${esc(c.issuer)} · ${esc(c.year)}</p></div>${c.pdf?ext(c.pdf,'PDF'): ''}</div>`).join('')}</section>
 <section class="cv-section"><h3>${esc(t('interests'))}</h3><p>${areas.map(a=>esc(tr(a.title))).join(' · ')}</p></section>
 <div class="cv-document-footer"><span>SELIM UYSAL / ${esc(t(academic?'cvAcademicTitle':'cvIndustryTitle').toUpperCase())}</span><span>${esc(t('printNote'))}</span></div></div></div></main>${footer()}`;
}

function apply(){
 document.documentElement.lang=lang;
 document.documentElement.dataset.theme=theme;
 document.body.dataset.audience=audience;
 document.title=`Selim Uysal — ${isDirectory?t('directoryNav'):t(audience==='academic'?'academic':'industry')} ${isCv?t('cv'):'Portfolio'}`;
 let meta=document.querySelector('meta[name="description"]');
 if(meta)meta.content=t(isCv?(audience==='academic'?'cvSummaryAcademic':'cvSummaryIndustry'):(audience==='academic'?'academicLead':'industryLead'));
 app.innerHTML=isCv?cv():(isDirectory?directory():portfolio());
 setup();
}
function setup(){
 if(isDirectory){app.querySelector('[data-directory-search]')?.addEventListener('input',e=>{directoryQuery=e.target.value;renderDirectoryResults();});app.querySelectorAll('[data-directory-filter]').forEach(btn=>btn.addEventListener('click',()=>{directoryFilter=btn.dataset.directoryFilter;app.querySelectorAll('[data-directory-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.directoryFilter===directoryFilter);b.setAttribute('aria-pressed',String(b.dataset.directoryFilter===directoryFilter));});renderDirectoryResults();}));renderDirectoryResults();}
 app.querySelectorAll('[data-set-lang]').forEach(el=>el.addEventListener('click',()=>{lang=el.dataset.setLang;persist('language',lang);apply();}));
 app.querySelector('[data-toggle-theme]')?.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';persist('theme',theme);apply();});
 app.querySelector('[data-toggle-menu]')?.addEventListener('click',()=>{menuOpen=!menuOpen;apply();});
 app.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
 app.querySelectorAll('.mobile-menu a').forEach(el=>el.addEventListener('click',()=>{menuOpen=false;}));
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen){menuOpen=false;apply();}});
window.addEventListener('storage', e=>{if(e.key===localKey+'language'||e.key===localKey+'theme'){lang=stored('language')==='tr'?'tr':'en';theme=stored('theme')==='light'?'light':'dark';apply();}});
apply();
