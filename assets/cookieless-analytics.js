/**
 * Privacy-minimal portfolio traffic counter.
 * No cookies, localStorage, fingerprinting, visitor IDs or persistent sessions.
 * Sends only one page view and broad category of user-initiated link clicks.
 * Enable only after private D1 aggregate schema and Worker have been deployed.
 */
const COLLECTOR_URL = "https://selim-analytics-collector.uys-selim.workers.dev/events";
const TRACKING_ENABLED = true; // Cookieless daily aggregates; no individual identity or cookies.
const PAGE_ALLOWLIST = new Set([
  "/selim/", "/selim/index.html", "/selim/projects.html", "/selim/case-studies.html"
]);
function deviceGroup() {
  const width = window.innerWidth;
  return width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
}
function classifyLink(link) {
  try {
    const url = new URL(link.href,location.href);
    if (url.pathname.toLowerCase().endsWith(".pdf")) return "pdf";
    if (/^(www\.)?(youtube\.com|youtu\.be)$/.test(url.hostname)) return "youtube";
    if (url.hostname === "github.com") return "github";
    if (url.hostname.endsWith("linkedin.com")) return "linkedin";
    if (url.hostname === location.hostname) return "internal";
    if (url.hostname.endsWith(".github.io")) return "project";
    return "external";
  } catch { return "external"; }
}
function track(event_type, link_category="-", target_key="") {
  if (!TRACKING_ENABLED || !PAGE_ALLOWLIST.has(location.pathname) ||
      navigator.globalPrivacyControl === true || navigator.doNotTrack === "1")
    return;
  // No identifying information enters the payload.
  const body = JSON.stringify({
    event_type, page_path: location.pathname === "/selim/" ? "/selim/index.html" : location.pathname,
    link_category, target_key, device_group: deviceGroup()
  });
  fetch(COLLECTOR_URL, {
    method: "POST", mode: "cors", keepalive: true,
    headers: { "Content-Type": "application/json" }, body
  }).catch(() => {});
}
track("page_view");
document.addEventListener("click", (e) => {
  const link = e.target.closest?.("a[href]");
  if (link) track("link_click",classifyLink(link),targetKey(link));
}, { capture: true, passive: true });


/**
 * Stable target IDs, never an arbitrary URL or visitor-supplied string.
 * These are aggregated daily, not associated with individuals.
 */
const TARGETS = Object.freeze({
  "/selim/assets/reports/teknofest-ai-transportation.pdf":"project:teknofest:report",
  "/selim/assets/reports/oracle-student-information-system.pdf":"project:oracle:report",
  "/selim/assets/reports/design_patterns_SE461.pdf":"project:patterns:report",
  "/selim/assets/certificates/generative-ai-llms-coursera.pdf":"certificate:genai-llm:pdf",
  "/selim/assets/certificates/oracle-sql-btk-akademi.pdf":"certificate:oracle-sql:pdf",
  "/selim/assets/certificates/deneyap-advanced-robotics-instructor.pdf":"certificate:deneyap-instructor:pdf"
});
const EXTERNAL_TARGETS = Object.freeze({
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
});
function targetKey(link) {
  try {
    const url=new URL(link.href,location.href);
    // Project cards also have links to the same resource from multiple pages.
    const full=url.origin+url.pathname;
    const local=TARGETS[url.pathname];
    if(local)return local;
    if(EXTERNAL_TARGETS[full])return EXTERNAL_TARGETS[full];
    const element=link.closest("[data-project]");
    const project=element?.getAttribute("data-project");
    const allowed=new Set(["hayat","video","telegram","quran","teknofest","oracle","patterns","python-exercises","c-exercises","sql-resources"]);
    if(project && allowed.has(project)){
      const category=classifyLink(link);
      if (["github","pdf","youtube","project","external"].includes(category))
        return "project:"+project+":"+({github:"source",pdf:"report",youtube:"video",project:"live",external:"live"}[category]);
    }
    if(url.origin===location.origin && url.pathname==="/selim/case-studies.html"){
      if(url.hash==="#teknofest")return "case:teknofest:details";
      if(url.hash==="#rims")return "case:rims:details";
    }
    if(url.origin===location.origin && url.pathname==="/selim/projects.html")return "navigation:projects";
    return "";
  }catch{return "";}
}
