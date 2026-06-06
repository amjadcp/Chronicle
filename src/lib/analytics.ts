/**
 * Google Analytics (GA4) Integration Module
 * Handles dynamic script injection, pageview tracking, and custom event logging.
 * Works seamlessly in client-side environments (SSR-friendly).
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let initialized = false;

/**
 * Initializes Google Analytics on the client-side.
 * Injects the gtag.js script dynamically if VITE_GA_MEASUREMENT_ID is configured.
 */
export function initGA() {
  if (typeof window === "undefined" || initialized) return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn(
      "Google Analytics Measurement ID (VITE_GA_MEASUREMENT_ID) is not set. Analytics will log to console in simulation mode."
    );
    return;
  }

  const scriptId = "ga-gtag-script";
  if (!document.getElementById(scriptId)) {
    // Inject the gtag script
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize global gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_path: window.location.pathname,
    });

    initialized = true;
  }
}

/**
 * Tracks a page view event.
 * @param path The URL path (e.g., '/timelines', '/timeline/123')
 */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.log(`[Analytics Simulation] Page View: ${path}`);
    return;
  }

  // Ensure init was called, but in case script is injected, dispatch gtag config
  if (window.gtag) {
    window.gtag("config", measurementId, {
      page_path: path,
    });
  }
}

/**
 * Logs a custom analytics event representing user interaction/engagement.
 * @param eventName The name of the event (e.g., 'timeline_create', 'event_add')
 * @param eventParams Optional key-value metadata to attach to the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === "undefined") return;

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.log(`[Analytics Simulation] Event: ${eventName}`, eventParams);
    return;
  }

  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
}
