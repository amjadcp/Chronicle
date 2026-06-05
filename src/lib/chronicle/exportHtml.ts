import { Timeline } from "./types";

export function exportTimelineHtml(timeline: Timeline): string {
  const timelineJson = JSON.stringify(timeline);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(timeline.name)} — Interactive Timeline</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
  <header class="border-b border-slate-200 bg-white py-5 px-6 shadow-sm">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">${escapeHtml(timeline.name)}</h1>
        <p class="text-sm text-slate-500 mt-1">${escapeHtml(timeline.description || "Interactive historical timeline viewer.")}</p>
      </div>
      <div class="flex items-center gap-3 text-xs text-slate-500 shrink-0">
        <span class="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
          <i data-lucide="calendar" class="h-3.5 w-3.5"></i>
          <span id="event-count-header">${timeline.events.length}</span> events
        </span>
        <a href="${origin || '/'}" target="_blank" class="hover:text-blue-600 transition-colors hover:underline">Created with Chronicle</a>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
    <!-- Graph Board -->
    <section class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden select-none">
      <div class="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <div id="viewport-label">Loading timeline...</div>
        <div class="flex gap-2">
          <button id="zoom-in" title="Zoom In" class="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-bold">+</button>
          <button id="zoom-out" title="Zoom Out" class="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-bold">−</button>
          <button id="zoom-fit" class="px-2.5 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-medium">Fit</button>
        </div>
      </div>
      <div id="canvas-container" class="w-full relative bg-white overflow-hidden custom-scrollbar">
        <svg id="timeline-svg" class="w-full touch-none" style="cursor: grab;"></svg>
      </div>
    </section>

    <!-- Toolbar & Events List -->
    <section class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div class="flex flex-wrap items-center gap-2 flex-1">
          <div class="relative flex-1 max-w-xs">
            <i data-lucide="search" class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400"></i>
            <input id="search-input" type="text" placeholder="Search events..." class="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <select id="sort-select" class="px-3 py-1.5 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="start-asc">Start ↑</option>
            <option value="start-desc">Start ↓</option>
            <option value="duration-asc">Duration ↑</option>
            <option value="duration-desc">Duration ↓</option>
          </select>
        </div>
        <div id="group-tags" class="flex flex-wrap gap-1.5"></div>
      </div>

      <!-- Events Grid -->
      <div id="events-list" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
    </section>
  </main>

  <!-- Event Modal Dialog -->
  <div id="event-modal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 id="modal-title" class="text-lg font-bold text-slate-800 truncate">Event Title</h2>
        <button id="modal-close" class="text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="h-5 w-5"></i>
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
        <!-- Date and Group Tag -->
        <div class="flex flex-wrap gap-2 items-center text-xs">
          <span id="modal-date" class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">Date</span>
          <span id="modal-group" class="hidden items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
            <span id="modal-group-dot" class="h-2 w-2 rounded-full"></span>
            <span id="modal-group-name">Group</span>
          </span>
        </div>

        <hr class="border-slate-100" />

        <!-- Tab Controls -->
        <div class="border-b border-slate-100 flex gap-4">
          <button id="tab-notes" class="border-b-2 border-blue-600 text-blue-600 font-semibold px-2 py-2 text-sm focus:outline-none">Notes</button>
          <button id="tab-resources" class="border-b-2 border-transparent text-slate-500 font-medium px-2 py-2 text-sm focus:outline-none">Resources (<span id="modal-res-count">0</span>)</button>
        </div>

        <!-- Notes Tab Content -->
        <div id="content-notes" class="prose prose-sm max-w-none text-slate-700"></div>

        <!-- Resources Tab Content -->
        <div id="content-resources" class="space-y-2.5 hidden"></div>
      </div>
    </div>
  </div>

  <script>
    // Embedded Timeline Data
    const TIMELINE = ${timelineJson};
    
    // Parse Dates
    function toDecimalYear(d) {
      const m = d.month ?? 1;
      const day = d.day ?? 1;
      return d.year + ((m - 1) / 12) + ((day - 1) / 365);
    }

    function durationYears(start, end) {
      return Math.abs(toDecimalYear(end) - toDecimalYear(start));
    }

    function formatEventDate(d) {
      const y = Math.abs(d.year);
      const era = d.year < 0 ? " BC" : "";
      const parts = [String(y)];
      if (d.month) parts.push(String(d.month).padStart(2, "0"));
      if (d.day) parts.push(String(d.day).padStart(2, "0"));
      return parts.join("-") + era;
    }

    // Lane Layout Algorithm
    function assignLanes(events, groups) {
      const groupLanes = new Map();
      const items = [];
      let nextLane = 0;

      const computeRange = (e) => {
        const a = toDecimalYear(e.start);
        const b = toDecimalYear(e.end);
        return { startYear: Math.min(a, b), endYear: Math.max(a, b) };
      };

      const groupOrder = groups.filter((g) => events.some((e) => e.groupId === g.id));
      for (const g of groupOrder) {
        const groupEvents = events.filter((e) => e.groupId === g.id);
        const groupStart = nextLane;

        const laneEnds = [];
        for (const e of [...groupEvents].sort((a, b) => toDecimalYear(a.start) - toDecimalYear(b.start))) {
          const { startYear, endYear } = computeRange(e);
          let laneIdx = laneEnds.findIndex((endY) => endY <= startYear);
          if (laneIdx === -1) {
            laneEnds.push(endYear);
            laneIdx = laneEnds.length - 1;
          } else {
            laneEnds[laneIdx] = endYear;
          }
          items.push({ event: e, startYear, endYear, lane: groupStart + laneIdx, groupId: g.id });
        }
        nextLane += Math.max(1, laneEnds.length);
        groupLanes.set(g.id, { start: groupStart, end: nextLane - 1 });
      }

      const ungrouped = events.filter((e) => !e.groupId);
      const laneEnds = [];
      for (const e of [...ungrouped].sort((a, b) => toDecimalYear(a.start) - toDecimalYear(b.start))) {
        const { startYear, endYear } = computeRange(e);
        let laneIdx = laneEnds.findIndex((endY) => endY <= startYear);
        if (laneIdx === -1) {
          laneEnds.push(endYear);
          laneIdx = laneEnds.length - 1;
        } else {
          laneEnds[laneIdx] = endYear;
        }
        items.push({ event: e, startYear, endYear, lane: nextLane + laneIdx, groupId: null });
      }
      nextLane += Math.max(0, laneEnds.length);

      return { items, laneCount: Math.max(1, nextLane), groupLanes };
    }

    // Graph Visual Config
    const LANE_H = 28;
    const LANE_GAP = 4;
    const AXIS_H = 28;
    const PADDING_X = 16;
    let width = 800;
    
    const container = document.getElementById("canvas-container");
    const svg = document.getElementById("timeline-svg");
    
    // Assign Lanes
    const { items, laneCount, groupLanes } = assignLanes(TIMELINE.events, TIMELINE.groups);
    const SVG_H = Math.max(500, AXIS_H + laneCount * (LANE_H + LANE_GAP) + 32);
    svg.setAttribute("height", SVG_H);

    // Calculate overall boundaries
    let minYear = 0;
    let maxYear = 100;
    if (items.length > 0) {
      let mn = Infinity, mx = -Infinity;
      for (const it of items) {
        if (it.startYear < mn) mn = it.startYear;
        if (it.endYear > mx) mx = it.endYear;
      }
      if (mn === mx) { mn -= 5; mx += 5; }
      const pad = (mx - mn) * 0.05;
      minYear = mn - pad;
      maxYear = mx + pad;
    }

    let view = { min: minYear, max: maxYear };

    function getYearX(y, innerW) {
      const span = view.max - view.min || 1;
      return PADDING_X + ((y - view.min) / span) * innerW;
    }

    function formatYearLabel(y) {
      const abs = Math.abs(Math.round(y));
      return y < 0 ? abs + " BC" : String(abs);
    }

    // Render Graph SVG
    function renderGraph() {
      width = container.clientWidth;
      svg.setAttribute("width", width);
      const innerW = Math.max(200, width - PADDING_X * 2);

      // Refresh viewport label
      document.getElementById("viewport-label").innerText = formatYearLabel(view.min) + " → " + formatYearLabel(view.max);

      // Clear SVG
      svg.innerHTML = "";

      const groupColorMap = new Map(TIMELINE.groups.map(g => [g.id, g.color]));

      // 1. Group Background Lanes
      groupLanes.forEach((range, gid) => {
        const color = groupColorMap.get(gid) ?? "#94a3b8";
        const y = AXIS_H + range.start * (LANE_H + LANE_GAP) - 2;
        const h = (range.end - range.start + 1) * (LANE_H + LANE_GAP);
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", 0);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", h);
        rect.setAttribute("fill", color);
        rect.setAttribute("opacity", 0.08);
        svg.appendChild(rect);
      });

      // Calculate ticks
      const span = view.max - view.min;
      const targetCount = Math.max(4, Math.floor(innerW / 110));
      const rawStep = span / targetCount;
      const mag = Math.pow(10, Math.floor(Math.log10(Math.max(1, rawStep))));
      const norm = rawStep / mag;
      const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
      const start = Math.ceil(view.min / step) * step;
      
      const ticks = [];
      for (let y = start; y <= view.max; y += step) ticks.push(y);

      // 2. Grids and Axis Ticks
      const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      axisLine.setAttribute("x1", 0);
      axisLine.setAttribute("x2", width);
      axisLine.setAttribute("y1", AXIS_H);
      axisLine.setAttribute("y2", AXIS_H);
      axisLine.setAttribute("stroke", "#e2e8f0");
      svg.appendChild(axisLine);

      ticks.forEach(t => {
        const x = getYearX(t, innerW);
        if (x < PADDING_X || x > width - PADDING_X) return;

        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", x);
        gridLine.setAttribute("x2", x);
        gridLine.setAttribute("y1", AXIS_H);
        gridLine.setAttribute("y2", SVG_H);
        gridLine.setAttribute("stroke", "#e2e8f0");
        gridLine.setAttribute("opacity", 0.5);
        svg.appendChild(gridLine);

        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", x);
        txt.setAttribute("y", AXIS_H - 8);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("font-size", 11);
        txt.setAttribute("fill", "#64748b");
        txt.textContent = formatYearLabel(t);
        svg.appendChild(txt);
      });

      // 3. Render Event Bars
      items.forEach(it => {
        if (it.endYear < view.min || it.startYear > view.max) return;

        const x1 = getYearX(it.startYear, innerW);
        const x2 = getYearX(it.endYear, innerW);
        const w = Math.max(4, x2 - x1);
        const y = AXIS_H + it.lane * (LANE_H + LANE_GAP) + 2;
        const color = it.groupId ? groupColorMap.get(it.groupId) ?? "#2563EB" : "#2563EB";
        const hasIcon = !!it.event.iconResourceId;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "group cursor-pointer");
        g.addEventListener("click", () => openEventDetails(it.event.id));

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x1);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", LANE_H - 4);
        rect.setAttribute("rx", 6);
        rect.setAttribute("ry", 6);
        rect.setAttribute("fill", color);
        rect.setAttribute("fill-opacity", 0.9);
        rect.setAttribute("stroke", color);
        g.appendChild(rect);

        // Text inside bar
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", x1 + 6);
        fo.setAttribute("y", y + 3);
        fo.setAttribute("width", Math.max(0, w - 12));
        fo.setAttribute("height", LANE_H - 10);

        const textDiv = document.createElement("div");
        textDiv.style.fontSize = "12px";
        textDiv.style.lineHeight = "1.4";
        textDiv.style.color = "white";
        textDiv.style.whiteSpace = "nowrap";
        textDiv.style.overflow = "hidden";
        textDiv.style.textOverflow = "ellipsis";
        textDiv.style.display = "flex";
        textDiv.style.alignItems = "center";
        textDiv.style.gap = "4px";
        textDiv.style.height = "100%";
        textDiv.innerHTML = (hasIcon ? '<span style="opacity: 0.9;">★</span>' : '') + '<span>' + escapeHtml(it.event.name || "(untitled)") + '</span>';
        fo.appendChild(textDiv);
        g.appendChild(fo);

        // Tooltip title
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = it.event.name + ": " + formatEventDate(it.event.start) + " - " + formatEventDate(it.event.end);
        g.appendChild(title);

        svg.appendChild(g);
      });
    }

    // Zoom & Fit Controls
    document.getElementById("zoom-in").addEventListener("click", () => {
      const span = view.max - view.min;
      const c = (view.min + view.max) / 2;
      view = { min: c - span * 0.4, max: c + span * 0.4 };
      renderGraph();
    });

    document.getElementById("zoom-out").addEventListener("click", () => {
      const span = view.max - view.min;
      const c = (view.min + view.max) / 2;
      view = { min: c - span * 0.625, max: c + span * 0.625 };
      renderGraph();
    });

    document.getElementById("zoom-fit").addEventListener("click", () => {
      view = { min: minYear, max: maxYear };
      renderGraph();
    });

    // Resize Observer
    const ro = new ResizeObserver(() => {
      renderGraph();
    });
    ro.observe(container);

    // Pan (Drag to scroll) Interactivity
    let isDragging = false;
    let dragStartX = 0;
    let dragStartView = null;

    svg.addEventListener("pointerdown", (e) => {
      if (e.target.closest("g.group")) return; // click on event bar
      svg.setPointerCapture(e.pointerId);
      isDragging = true;
      dragStartX = e.clientX;
      dragStartView = { ...view };
      svg.style.cursor = "grabbing";
    });

    svg.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const innerW = Math.max(200, width - PADDING_X * 2);
      const span = dragStartView.max - dragStartView.min;
      const dy = (dx / innerW) * span;
      view = { min: dragStartView.min - dy, max: dragStartView.max - dy };
      renderGraph();
    });

    svg.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      svg.releasePointerCapture(e.pointerId);
      isDragging = false;
      svg.style.cursor = "grab";
    });

    svg.addEventListener("pointercancel", () => {
      isDragging = false;
      svg.style.cursor = "grab";
    });

    // Zoom on mouse wheel scroll
    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const innerW = Math.max(200, width - PADDING_X * 2);
      const span = view.max - view.min;
      const yearAtCursor = view.min + ((px - PADDING_X) / innerW) * span;
      const zoom = e.deltaY > 0 ? 1.2 : 0.8333;
      const newSpan = Math.max(0.5, Math.min(span * zoom, (maxYear - minYear) * 20));
      const ratio = (yearAtCursor - view.min) / span;
      const newMin = yearAtCursor - ratio * newSpan;
      const newMax = newMin + newSpan;
      view = { min: newMin, max: newMax };
      renderGraph();
    });

    // Render group tags under search bar
    const groupColorMap = new Map(TIMELINE.groups.map(g => [g.id, g.color]));
    const groupTagsDiv = document.getElementById("group-tags");
    TIMELINE.groups.forEach(g => {
      const tag = document.createElement("span");
      tag.className = "inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full text-xs text-slate-600 font-medium";
      tag.innerHTML = '<span class="h-2 w-2 rounded-full" style="background: ' + g.color + '"></span>' + escapeHtml(g.name);
      groupTagsDiv.appendChild(tag);
    });

    // Render Events List Table / Cards
    let activeSort = "start-asc";
    let activeSearch = "";

    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const eventsList = document.getElementById("events-list");

    searchInput.addEventListener("input", (e) => {
      activeSearch = e.target.value.toLowerCase().trim();
      renderEvents();
    });

    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderEvents();
    });

    function getSortedEvents() {
      const filtered = TIMELINE.events.filter(e => 
        e.name.toLowerCase().includes(activeSearch) || 
        (e.notesMarkdown && e.notesMarkdown.toLowerCase().includes(activeSearch))
      );

      return filtered.sort((a, b) => {
        if (activeSort === "start-asc") return toDecimalYear(a.start) - toDecimalYear(b.start);
        if (activeSort === "start-desc") return toDecimalYear(b.start) - toDecimalYear(a.start);
        
        const durA = durationYears(a.start, a.end);
        const durB = durationYears(b.start, b.end);
        if (activeSort === "duration-asc") return durA - durB;
        if (activeSort === "duration-desc") return durB - durA;
        return 0;
      });
    }

    function renderEvents() {
      eventsList.innerHTML = "";
      const list = getSortedEvents();

      if (list.length === 0) {
        eventsList.innerHTML = '<div class="col-span-full py-8 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-lg">No events match your criteria.</div>';
        return;
      }

      list.forEach(e => {
        const dur = durationYears(e.start, e.end);
        const group = TIMELINE.groups.find(g => g.id === e.groupId);

        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer";
        card.addEventListener("click", () => openEventDetails(e.id));

        let groupMarkup = '';
        if (group) {
          groupMarkup = '<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-100 bg-slate-50 text-[10px] font-medium text-slate-600">' +
            '<span class="h-1.5 w-1.5 rounded-full" style="background: ' + group.color + '"></span>' +
            escapeHtml(group.name) +
            '</span>';
        }

        card.innerHTML = '<div>' +
          '<div class="text-sm font-semibold text-slate-800 hover:underline line-clamp-1">' + escapeHtml(e.name) + '</div>' +
          '<div class="text-[11px] text-slate-500 mt-1.5 flex flex-wrap gap-2 items-center">' +
            '<span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">' + formatEventDate(e.start) + ' – ' + formatEventDate(e.end) + '</span>' +
            '<span>' + dur.toFixed(dur < 10 ? 1 : 0) + ' yr</span>' +
          '</div>' +
          '</div>' +
          '<div class="mt-3 flex items-center justify-between">' +
            groupMarkup +
            '<span class="text-xs text-blue-600 font-medium hover:underline flex items-center gap-0.5">View details <i data-lucide="arrow-right" class="h-3 w-3"></i></span>' +
          '</div>';
        
        eventsList.appendChild(card);
      });
      
      lucide.createIcons();
    }

    // Modal Control
    const modal = document.getElementById("event-modal");
    const mTitle = document.getElementById("modal-title");
    const mDate = document.getElementById("modal-date");
    const mGroup = document.getElementById("modal-group");
    const mGroupName = document.getElementById("modal-group-name");
    const mGroupDot = document.getElementById("modal-group-dot");
    const mResCount = document.getElementById("modal-res-count");
    
    const tabNotes = document.getElementById("tab-notes");
    const tabResources = document.getElementById("tab-resources");
    const contentNotes = document.getElementById("content-notes");
    const contentResources = document.getElementById("content-resources");

    let activeModalEvent = null;

    function openEventDetails(id) {
      const e = TIMELINE.events.find(x => x.id === id);
      if (!e) return;

      activeModalEvent = e;
      mTitle.innerText = e.name;
      mDate.innerText = formatEventDate(e.start) + " – " + formatEventDate(e.end);

      // Group markup
      const group = TIMELINE.groups.find(g => g.id === e.groupId);
      if (group) {
        mGroupDot.style.background = group.color;
        mGroupName.innerText = group.name;
        mGroup.style.display = "inline-flex";
      } else {
        mGroup.style.display = "none";
      }

      // Resources count
      const resList = e.resources || [];
      mResCount.innerText = resList.length;

      // Render Notes markdown
      contentNotes.innerHTML = e.notesMarkdown ? marked.parse(e.notesMarkdown) : '<p class="text-slate-400 italic">No notes written for this event.</p>';
      
      // Render Resources Notion cards
      contentResources.innerHTML = "";
      if (resList.length === 0) {
        contentResources.innerHTML = '<p class="text-slate-400 italic text-sm">No resources attached.</p>';
      } else {
        const icons = {
          website: 'link',
          image: 'image',
          youtube: 'video'
        };
        const colors = {
          youtube: 'bg-red-50 text-red-600',
          image: 'bg-emerald-50 text-emerald-600',
          website: 'bg-blue-50 text-blue-600'
        };

        resList.forEach(r => {
          const card = document.createElement("a");
          card.href = r.url.startsWith("http") ? r.url : "https://" + r.url;
          card.target = "_blank";
          card.rel = "noopener noreferrer";
          card.className = "flex items-center gap-3 border border-slate-200 bg-slate-50/50 p-2.5 rounded-lg hover:bg-slate-50 transition-colors";
          
          const iconName = icons[r.type] || 'link';
          const colorClass = colors[r.type] || 'bg-blue-50 text-blue-600';

          card.innerHTML = '<div class="h-9 w-9 shrink-0 rounded-full flex items-center justify-center ' + colorClass + '">' +
            '<i data-lucide="' + iconName + '" class="h-4.5 w-4.5"></i>' +
            '</div>' +
            '<div class="min-w-0 flex-1">' +
            '<div class="text-sm font-semibold text-slate-800 truncate hover:underline">' + escapeHtml(r.label || r.url) + '</div>' +
            '<div class="text-[11px] text-slate-400 truncate mt-0.5">' + escapeHtml(r.url) + '</div>' +
            '</div>' +
            '<i data-lucide="external-link" class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0"></i>';

          contentResources.appendChild(card);
        });
      }

      // Default back to notes tab
      selectTab("notes");

      modal.classList.remove("hidden");
      lucide.createIcons();
    }

    function selectTab(tab) {
      if (tab === "notes") {
        tabNotes.className = "border-b-2 border-blue-600 text-blue-600 font-semibold px-2 py-2 text-sm focus:outline-none";
        tabResources.className = "border-b-2 border-transparent text-slate-500 font-medium px-2 py-2 text-sm focus:outline-none";
        contentNotes.classList.remove("hidden");
        contentResources.classList.add("hidden");
      } else {
        tabNotes.className = "border-b-2 border-transparent text-slate-500 font-medium px-2 py-2 text-sm focus:outline-none";
        tabResources.className = "border-b-2 border-blue-600 text-blue-600 font-semibold px-2 py-2 text-sm focus:outline-none";
        contentNotes.classList.add("hidden");
        contentResources.classList.remove("hidden");
      }
    }

    tabNotes.addEventListener("click", () => selectTab("notes"));
    tabResources.addEventListener("click", () => selectTab("resources"));
    
    document.getElementById("modal-close").addEventListener("click", () => {
      modal.classList.add("hidden");
      activeModalEvent = null;
    });

    // Close on click outside modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        activeModalEvent = null;
      }
    });

    // Escape character entities in HTML
    function escapeHtml(str) {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Init Page elements
    renderGraph();
    renderEvents();
    lucide.createIcons();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
