/*
 * Public configuration only. No passwords, service-role keys, IP logs or owner
 * identifiers belong in this public GitHub Pages repository.
 * Analytics is disabled until the private Supabase backend is configured.
 */
export const ANALYTICS_CONFIG = Object.freeze({
  enabled: false,
  supabaseUrl: "",
  publishableKey: "",
  functionName: "portfolio-analytics",
  consentVersion: "2026-10-30-v1",
});
