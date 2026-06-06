import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DU714E9E.mjs";
import { S as Sparkles, A as ArrowRight, b as Calendar, l as Layers, m as FileText, n as Database, D as Download, U as Users } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const FEATURES = [{
  icon: Calendar,
  title: "Interactive Historical Timelines",
  body: "Create timelines spanning thousands of years with support for BC and AD dates."
}, {
  icon: Layers,
  title: "Timeline Grouping",
  body: "Organize events into dynasties, kingdoms, empires, movements, eras, or custom categories."
}, {
  icon: FileText,
  title: "Historical Research Workspace",
  body: "Attach notes, references, images, videos, and external sources to every event."
}, {
  icon: Database,
  title: "Offline-First Timeline Builder",
  body: "Create and manage timelines without requiring an account."
}, {
  icon: Download,
  title: "Interactive Timeline Export",
  body: "Export complete timeline data as portable JSON files."
}, {
  icon: Users,
  title: "Open Community Timeline Library",
  body: "Browse community-created historical timelines from researchers and history enthusiasts."
}];
const USE_CASES = ["World History Timelines", "Ancient Civilization Timelines", "Political History Timelines", "Scientific Discovery Timelines", "Historical Biography Timelines", "Cultural History Timelines", "War and Conflict Timelines", "Historical Research Projects", "Educational Timeline Creation", "Historical Event Visualization"];
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
        "Modern timeline builder for historians and educators"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl", children: "Build Interactive Historical Timelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-lg text-muted-foreground", children: "Create, organize, and visualize historical events through interactive timelines. Explore centuries of history, compare events across eras, and build timelines that make complex historical narratives easier to understand." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/timelines", children: [
          "Explore Timelines ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/timelines", children: "Create Your Timeline" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", children: "A Modern Historical Timeline Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4 text-base leading-relaxed text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "HistoryTimeline is an interactive timeline creator designed for historians, educators, students, researchers, writers, and lifelong learners." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Create detailed timelines with historical events, visualize timelines across centuries, organize events into meaningful groups, attach research notes and resources, and export timelines as portable interactive files." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Whether you are studying ancient civilizations, world history, political movements, scientific discoveries, cultural evolution, military campaigns, or historical biographies, HistoryTimeline helps transform historical information into visual knowledge." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", children: "What Makes HistoryTimeline Different" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: f.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-sm text-muted-foreground", children: f.body })
      ] }, f.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", children: "Use Cases" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: USE_CASES.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground", children: u }, u)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl", children: "Contribute Historical Timelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-2xl text-base text-muted-foreground", children: "HistoryTimeline maintains a growing collection of community-contributed timelines. If you are interested in contributing, connect with us to request contributor access." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contributor", children: "Become a contributor" }) }) })
    ] }) })
  ] });
}
export {
  Home as component
};
