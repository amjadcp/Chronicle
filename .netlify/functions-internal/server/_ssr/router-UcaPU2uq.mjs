import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, b as useLocation, O as Outlet, H as HeadContent, S as Scripts, d as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { C as Clock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-BSumpe_u.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function SiteHeader() {
  const linkBase = "text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md";
  const active = "text-foreground font-medium";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-semibold text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          "aria-hidden": true,
          className: "grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" })
        }
      ),
      "HistoryTimeline"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Primary", className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/timelines", className: linkBase, activeProps: { className: `${linkBase} ${active}` }, children: "Timelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contributor", className: linkBase, activeProps: { className: `${linkBase} ${active}` }, children: "Contribute" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: linkBase, activeProps: { className: `${linkBase} ${active}` }, children: "About" })
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border bg-surface", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "HistoryTimeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A modern interactive historical timeline builder." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/timelines", className: "hover:text-foreground", children: "Timelines" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-foreground", children: "About" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Community" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contributor", className: "hover:text-foreground", children: "Contributor Guide" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://github.com/PLACEHOLDER_OWNER/chronicle-timelines",
              className: "hover:text-foreground",
              target: "_blank",
              rel: "noreferrer",
              children: "GitHub Repository"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Legal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", hash: "privacy", className: "hover:text-foreground", children: "Privacy Policy" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contributor", className: "hover:text-foreground", children: "Contact" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border py-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " HistoryTimeline"
    ] })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-dvh items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-dvh items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#2563EB" },
      { title: "HistoryTimeline — Interactive Historical Timeline Builder" },
      {
        name: "description",
        content: "HistoryTimeline is a modern interactive historical timeline builder. Create, organize, and visualize historical events across centuries with a clean, fast, offline-capable timeline editor."
      },
      { name: "author", content: "HistoryTimeline" },
      { property: "og:site_name", content: "HistoryTimeline" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "HistoryTimeline — Interactive Historical Timeline Builder" },
      {
        property: "og:description",
        content: "Create, organize, and visualize historical events through interactive timelines."
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "HistoryTimeline — Interactive Historical Timeline Builder" },
      {
        name: "twitter:description",
        content: "Create, organize, and visualize historical events through interactive timelines."
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "HistoryTimeline",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Interactive historical timeline builder for researchers, educators, and history enthusiasts.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
        })
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  const location = useLocation();
  const showFooter = !location.pathname.startsWith("/timeline/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-dvh flex-col bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      showFooter && /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
const $$splitComponentImporter$5 = () => import("./timelines-BHOgutZP.mjs");
const Route$5 = createFileRoute("/timelines")({
  head: () => ({
    meta: [{
      title: "Timelines — HistoryTimeline"
    }, {
      name: "description",
      content: "Browse prebuilt historical timelines from the community library or create your own interactive timeline."
    }, {
      property: "og:title",
      content: "Timelines — HistoryTimeline"
    }, {
      property: "og:description",
      content: "Browse community timelines or create your own."
    }, {
      property: "og:url",
      content: "/timelines"
    }],
    links: [{
      rel: "canonical",
      href: "/timelines"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contributor-DdLf08ra.mjs");
const Route$4 = createFileRoute("/contributor")({
  head: () => ({
    meta: [{
      title: "Contribute to HistoryTimeline — Submit Historical Timelines"
    }, {
      name: "description",
      content: "Become a HistoryTimeline contributor and submit historical timelines to the public community library."
    }, {
      property: "og:title",
      content: "Contribute to HistoryTimeline"
    }, {
      property: "og:description",
      content: "Submit historical timelines to the HistoryTimeline community library."
    }, {
      property: "og:url",
      content: "/contributor"
    }],
    links: [{
      rel: "canonical",
      href: "/contributor"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./about-B0xFKasC.mjs");
const Route$3 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About HistoryTimeline — Historical Timeline Builder"
    }, {
      name: "description",
      content: "About HistoryTimeline: an open historical timeline builder for researchers, educators, and history enthusiasts."
    }, {
      property: "og:title",
      content: "About HistoryTimeline"
    }, {
      property: "og:description",
      content: "Open historical timeline builder for researchers and educators."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-9SBs3FdD.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "HistoryTimeline — Interactive Historical Timeline Builder"
    }, {
      name: "description",
      content: "Build interactive historical timelines. Create, organize, and visualize historical events across centuries with a clean, fast, offline-capable timeline editor."
    }, {
      property: "og:title",
      content: "HistoryTimeline — Interactive Historical Timeline Builder"
    }, {
      property: "og:description",
      content: "Create, organize, and visualize historical events through interactive timelines."
    }, {
      property: "og:url",
      content: "/"
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./timeline._id-DTYCSter.mjs");
const Route$1 = createFileRoute("/timeline/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: "Timeline — HistoryTimeline"
    }, {
      name: "description",
      content: "Edit an interactive historical timeline in HistoryTimeline."
    }, {
      property: "og:title",
      content: "Timeline — HistoryTimeline"
    }, {
      property: "og:description",
      content: "Edit a historical timeline in HistoryTimeline."
    }, {
      property: "og:url",
      content: `/timeline/${params.id}`
    }, {
      name: "robots",
      content: "noindex"
    }],
    links: [{
      rel: "canonical",
      href: `/timeline/${params.id}`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./prebuilt._file-Bs4DLe04.mjs");
const Route = createFileRoute("/prebuilt/$file")({
  head: () => ({
    meta: [{
      title: "Community Timeline — HistoryTimeline"
    }, {
      name: "description",
      content: "View a community-contributed historical timeline from the HistoryTimeline public library."
    }, {
      property: "og:title",
      content: "Community Timeline — HistoryTimeline"
    }, {
      property: "og:description",
      content: "Explore a community historical timeline."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TimelinesRoute = Route$5.update({
  id: "/timelines",
  path: "/timelines",
  getParentRoute: () => Route$6
});
const ContributorRoute = Route$4.update({
  id: "/contributor",
  path: "/contributor",
  getParentRoute: () => Route$6
});
const AboutRoute = Route$3.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const TimelineIdRoute = Route$1.update({
  id: "/timeline/$id",
  path: "/timeline/$id",
  getParentRoute: () => Route$6
});
const PrebuiltFileRoute = Route.update({
  id: "/prebuilt/$file",
  path: "/prebuilt/$file",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ContributorRoute,
  TimelinesRoute,
  PrebuiltFileRoute,
  TimelineIdRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  Route as a,
  router as r
};
