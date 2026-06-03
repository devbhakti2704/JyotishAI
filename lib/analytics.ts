// Lightweight, SSR-safe wrapper around gtag.
// No-ops if GA hasn't loaded (e.g. NEXT_PUBLIC_GA_ID unset, or on the server).
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
