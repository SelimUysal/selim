/**
 * Privacy-minimal portfolio traffic counter.
 * No cookies, localStorage, fingerprinting, visitor IDs or persistent sessions.
 * Sends only one page view and broad category of user-initiated link clicks.
 * Enable only after private D1 aggregate schema and Worker have been deployed.
 */
const COLLECTOR_URL = "https://selim-analytics-collector.uys-selim.workers.dev/events";
const TRACKING_ENABLED = false; // Switch to true after retention Cron and privacy review.
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
function track(event_type, link_category="-") {
  if (!TRACKING_ENABLED || !PAGE_ALLOWLIST.has(location.pathname) ||
      navigator.globalPrivacyControl === true || navigator.doNotTrack === "1")
    return;
  // No identifying information enters the payload.
  const body = JSON.stringify({
    event_type, page_path: location.pathname === "/selim/" ? "/selim/index.html" : location.pathname,
    link_category, device_group: deviceGroup()
  });
  fetch(COLLECTOR_URL, {
    method: "POST", mode: "cors", keepalive: true,
    headers: { "Content-Type": "application/json" }, body
  }).catch(() => {});
}
track("page_view");
document.addEventListener("click", (e) => {
  const link = e.target.closest?.("a[href]");
  if (link) track("link_click",classifyLink(link));
}, { capture: true, passive: true });
