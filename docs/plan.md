
# Chronicle — Phase 1 Plan

Building the full app minus HTML export and the contributor submission/login flow. Those land in Phase 2.

## What ships in Phase 1

**Pages (TanStack Start routes)**
- `/` — Home: hero, intro, "What makes Chronicle different" cards, use-case grid, contributor CTA, footer
- `/timelines` — Tabs for Prebuilt (from GitHub) and My Timelines (local storage), with Create button
- `/timeline/$id` — Toolbar + event table + SVG graph + event modal
- `/contributor` — Info page with LinkedIn / Email contact buttons (submission UI deferred)
- `/about` — About + tech + links
- Each route gets its own `head()` with unique title, description, OG tags. JSON-LD `SoftwareApplication` on `/`.

**Timeline editor**
- Event table: Select, Name, Start (year+month?+day?+era), End, Era, Duration (auto), Group, Actions. Last row always an inline "add" row, no modal.
- Era handling: BC→negative, AD→positive year internally. Sortable by start asc/desc, duration asc/desc. Group-aware sorting (groups stay contiguous).
- Multi-select → Group / Ungroup with name + color (color-blind safe palette).
- Toolbar: Sort, Group, Ungroup, Fit, Zoom +/−, Toggle "Show group on single row", Import JSON, Export JSON, Delete timeline.

**SVG timeline graph**
- Pure SVG (no canvas). Horizontal bars per event with name + optional resource icon.
- Pan (drag), zoom (wheel/pinch + buttons), fit-to-screen.
- Virtualization: only render bars whose date range intersects the current viewport; tested at 500 events.
- Group lanes: tinted background lane per group; single-row mode collapses group members into one lane.
- Click bar → Event Details modal.

**Event Details modal**
- Tabs: Notes (Tiptap rich editor → markdown via `turndown` + `marked` round-trip; user never sees syntax) and Resources (Website / Image / YouTube URL, edit, delete, "Mark as icon" — single selection).

**Storage**
- All user timelines in `localStorage` under a versioned key (`chronicle:v1:timelines`).
- JSON export/import with Zod schema validation; invalid files rejected with a toast.

**Prebuilt timelines**
- Fetched from a configurable GitHub raw URL (placeholder repo path in `src/lib/prebuilt.ts` — easy to swap once you provide the repo). Index file lists timelines, each timeline = one JSON.
- Read-only; user can open, then "Duplicate to My Timelines" to edit.

**PWA**
- `vite-plugin-pwa` with `generateSW`, guarded registration wrapper (no register in dev/preview/iframe, `?sw=off` kill switch), `NetworkFirst` for navigations, `CacheFirst` for hashed assets.
- Manifest + icons + theme color. Installable + offline app shell.

**Design system**
- Inter via `<link>` in `__root.tsx`, registered in `@theme` (Tailwind v4).
- Color tokens in `src/styles.css` using `oklch` equivalents of the spec hexes (#2563EB primary, #64748B secondary, #F8FAFC surface, #E2E8F0 border, #22C55E/#F59E0B/#EF4444).
- shadcn components for buttons, dialogs, tabs, dropdowns, inputs, tables, toasts.

**Accessibility**
- Keyboard nav on table + graph bars (focus ring, Enter to open), ARIA labels on icon buttons, color-blind safe group palette, semantic headings, single `<main>` per route.

**SEO**
- Per-route `head()` (title, description, og:*, twitter:*). JSON-LD `SoftwareApplication` on `/`, `AboutPage` on `/about`. `robots.txt` + `sitemap.xml` with relative URLs (no project domain yet).

## Deferred to Phase 2 (after Phase 1 ships)
- **HTML standalone export** — single-file interactive viewer. Non-trivial; want Phase 1 stable first.
- **Contributor submission flow** — you chose Firebase + Netlify. Important caveat: this Lovable project runs on TanStack Start on Cloudflare Workers, not Netlify. Netlify Functions won't execute in this preview or in Lovable's published hosting. To make Firebase + Netlify work you'd self-host the GitHub export on Netlify. We can revisit in Phase 2 — either (a) wire it as code that only runs when you deploy to Netlify yourself, or (b) port to a TanStack server route + Lovable Cloud auth. The contributor *page* (info + contact buttons) still ships in Phase 1.

## Tech details
- Stack: TanStack Start, React 19, TS, Tailwind v4, shadcn, Tiptap, `vite-plugin-pwa`, Zod, `marked` + `turndown`, `uuid`.
- No backend writes in Phase 1. GitHub reads happen client-side via `fetch` to raw.githubusercontent.com.
- Performance budget: 500 events, <2s initial render, virtualized SVG, memoized selectors.

## Open item
GitHub repo URL for prebuilt timelines — I'll wire a placeholder constant (`https://raw.githubusercontent.com/PLACEHOLDER_OWNER/chronicle-timelines/main/`) and a small `index.json` shape; swap the constant when you have the repo.
