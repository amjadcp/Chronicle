import { t as toDecimalYear, f as formatEventDate, n as newId, e as eraOf, a as applyEra } from "./types-CWdzg89e.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root, T as Thumb } from "../_libs/radix-ui__react-switch.mjs";
import { c as cn, B as Button } from "./button-BXrfXN_b.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, e as DialogFooter } from "./dialog-BpPGN8RI.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c5KQ8wMi.mjs";
import { R as Root2, V as Value, T as Trigger, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label$1, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { u as useEditor, E as EditorContent } from "../_libs/tiptap__react.mjs";
import { i as index_default } from "../_libs/tiptap__starter-kit.mjs";
import { i as index_default$1 } from "../_libs/tiptap__extension-underline.mjs";
import { i as index_default$2 } from "../_libs/tiptap__extension-link.mjs";
import { g } from "../_libs/marked.mjs";
import { T as TurndownService } from "../_libs/turndown.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as ChevronDown, g as Check, d as Lock, Y as Youtube, u as Image, v as Link, w as Star, T as Trash2, P as Plus, x as ChevronUp, y as Bold, z as Italic, H as Underline, J as Heading2, K as List } from "../_libs/lucide-react.mjs";
import { M as Markdown } from "../_libs/react-markdown.mjs";
function sortEvents(events, groups, sort) {
  const ungrouped = [];
  const byGroup = /* @__PURE__ */ new Map();
  for (const e of events) {
    if (e.groupId) {
      if (!byGroup.has(e.groupId)) byGroup.set(e.groupId, []);
      byGroup.get(e.groupId).push(e);
    } else {
      ungrouped.push(e);
    }
  }
  const cmpEvent = (a, b) => {
    const aS = toDecimalYear(a.start), bS = toDecimalYear(b.start);
    const aD = Math.abs(toDecimalYear(a.end) - aS);
    const bD = Math.abs(toDecimalYear(b.end) - bS);
    switch (sort) {
      case "start-asc":
        return aS - bS;
      case "start-desc":
        return bS - aS;
      case "duration-asc":
        return aD - bD;
      case "duration-desc":
        return bD - aD;
    }
  };
  const groupBlocs = [];
  for (const g2 of groups) {
    const items = byGroup.get(g2.id);
    if (!items?.length) continue;
    const reps = items.map((e) => ({
      start: toDecimalYear(e.start),
      duration: Math.abs(toDecimalYear(e.end) - toDecimalYear(e.start))
    }));
    const sortVal = sort === "duration-asc" || sort === "duration-desc" ? Math.min(...reps.map((r) => r.duration)) : Math.min(...reps.map((r) => r.start));
    groupBlocs.push({ id: g2.id, sortVal, items });
  }
  const desc = sort === "start-desc" || sort === "duration-desc";
  groupBlocs.sort((a, b) => desc ? b.sortVal - a.sortVal : a.sortVal - b.sortVal);
  const ungroupedSorted = [...ungrouped].sort(cmpEvent);
  const result = [];
  let ui = 0;
  for (const bloc of groupBlocs) {
    while (ui < ungroupedSorted.length && (sort.startsWith("start") ? desc ? toDecimalYear(ungroupedSorted[ui].start) > bloc.sortVal : toDecimalYear(ungroupedSorted[ui].start) < bloc.sortVal : false)) {
      result.push(ungroupedSorted[ui++]);
    }
    result.push(...bloc.items);
  }
  while (ui < ungroupedSorted.length) result.push(ungroupedSorted[ui++]);
  return result;
}
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
function assignLanes(events, groups, singleRowPerGroup) {
  const groupLanes = /* @__PURE__ */ new Map();
  const items = [];
  let nextLane = 0;
  const computeRange = (e) => {
    const a = toDecimalYear(e.start);
    const b = toDecimalYear(e.end);
    return { startYear: Math.min(a, b), endYear: Math.max(a, b) };
  };
  const groupOrder = groups.filter((g2) => events.some((e) => e.groupId === g2.id));
  for (const g2 of groupOrder) {
    const groupEvents = events.filter((e) => e.groupId === g2.id);
    const groupStart = nextLane;
    if (singleRowPerGroup) {
      const lane = nextLane;
      for (const e of groupEvents) {
        const { startYear, endYear } = computeRange(e);
        items.push({ event: e, startYear, endYear, lane, groupId: g2.id });
      }
      nextLane += 1;
    } else {
      const laneEnds2 = [];
      for (const e of [...groupEvents].sort(
        (a, b) => toDecimalYear(a.start) - toDecimalYear(b.start)
      )) {
        const { startYear, endYear } = computeRange(e);
        let laneIdx = laneEnds2.findIndex((endY) => endY <= startYear);
        if (laneIdx === -1) {
          laneEnds2.push(endYear);
          laneIdx = laneEnds2.length - 1;
        } else {
          laneEnds2[laneIdx] = endYear;
        }
        items.push({ event: e, startYear, endYear, lane: groupStart + laneIdx, groupId: g2.id });
      }
      nextLane += Math.max(1, laneEnds2.length);
    }
    groupLanes.set(g2.id, { start: groupStart, end: nextLane - 1 });
  }
  const ungrouped = events.filter((e) => !e.groupId);
  const laneEnds = [];
  for (const e of [...ungrouped].sort(
    (a, b) => toDecimalYear(a.start) - toDecimalYear(b.start)
  )) {
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
function formatYearLabel(y) {
  const abs = Math.abs(Math.round(y));
  return y < 0 ? `${abs} BC` : `${abs}`;
}
function TimelineGraph({ events, groups, singleRowPerGroup, onEventClick }) {
  const wrapRef = reactExports.useRef(null);
  const [width, setWidth] = reactExports.useState(800);
  reactExports.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    });
    ro.observe(wrapRef.current);
    setWidth(wrapRef.current.clientWidth);
    return () => ro.disconnect();
  }, []);
  const { items, laneCount, groupLanes } = reactExports.useMemo(
    () => assignLanes(events, groups, singleRowPerGroup),
    [events, groups, singleRowPerGroup]
  );
  const { minYear, maxYear } = reactExports.useMemo(() => {
    if (items.length === 0) return { minYear: 0, maxYear: 100 };
    let mn = Infinity, mx = -Infinity;
    for (const it of items) {
      if (it.startYear < mn) mn = it.startYear;
      if (it.endYear > mx) mx = it.endYear;
    }
    if (mn === mx) {
      mn -= 5;
      mx += 5;
    }
    const pad = (mx - mn) * 0.05;
    return { minYear: mn - pad, maxYear: mx + pad };
  }, [items]);
  const [view, setView] = reactExports.useState({ min: minYear, max: maxYear });
  const lastBoundsRef = reactExports.useRef({ minYear, maxYear });
  reactExports.useEffect(() => {
    const prev = lastBoundsRef.current;
    if (prev.minYear !== minYear || prev.maxYear !== maxYear) {
      lastBoundsRef.current = { minYear, maxYear };
      setView({ min: minYear, max: maxYear });
    }
  }, [minYear, maxYear]);
  const LANE_H = 28;
  const LANE_GAP = 4;
  const AXIS_H = 28;
  const PADDING_X = 16;
  const SVG_H = Math.max(500, AXIS_H + laneCount * (LANE_H + LANE_GAP) + 32);
  const innerW = Math.max(200, width - PADDING_X * 2);
  const yearToX = (y) => {
    const span = view.max - view.min || 1;
    return PADDING_X + (y - view.min) / span * innerW;
  };
  function onWheel(e) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const span = view.max - view.min;
    const yearAtCursor = view.min + (px - PADDING_X) / innerW * span;
    const zoom = e.deltaY > 0 ? 1.2 : 0.8333;
    const newSpan = Math.max(0.5, Math.min(span * zoom, (maxYear - minYear) * 20));
    const ratio = (yearAtCursor - view.min) / span;
    const newMin = yearAtCursor - ratio * newSpan;
    const newMax = newMin + newSpan;
    setView({ min: newMin, max: newMax });
  }
  const panRef = reactExports.useRef(null);
  function onPointerDown(e) {
    if (e.target.closest("[data-event-bar]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panRef.current = { startX: e.clientX, startView: { ...view } };
  }
  function onPointerMove(e) {
    if (!panRef.current) return;
    const dx = e.clientX - panRef.current.startX;
    const span = panRef.current.startView.max - panRef.current.startView.min;
    const dy = dx / innerW * span;
    setView({ min: panRef.current.startView.min - dy, max: panRef.current.startView.max - dy });
  }
  function onPointerUp(e) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    panRef.current = null;
  }
  const ticks = reactExports.useMemo(() => {
    const span = view.max - view.min;
    const targetCount = Math.max(4, Math.floor(innerW / 110));
    const rawStep = span / targetCount;
    const mag = Math.pow(10, Math.floor(Math.log10(Math.max(1, rawStep))));
    const norm = rawStep / mag;
    const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
    const start = Math.ceil(view.min / step) * step;
    const out = [];
    for (let y = start; y <= view.max; y += step) out.push(y);
    return out;
  }, [view, innerW]);
  const visible = items.filter((it) => it.endYear >= view.min && it.startYear <= view.max);
  const groupColorMap = new Map(groups.map((g2) => [g2.id, g2.color]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapRef, className: "w-full select-none overflow-hidden rounded-lg border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        formatYearLabel(view.min),
        " → ",
        formatYearLabel(view.max)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
            onClick: () => {
              const span = view.max - view.min;
              const c = (view.min + view.max) / 2;
              setView({ min: c - span * 0.4, max: c + span * 0.4 });
            },
            "aria-label": "Zoom in",
            children: "+"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
            onClick: () => {
              const span = view.max - view.min;
              const c = (view.min + view.max) / 2;
              setView({ min: c - span * 0.625, max: c + span * 0.625 });
            },
            "aria-label": "Zoom out",
            children: "−"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "rounded-md border border-border bg-background px-2 py-1 hover:bg-accent",
            onClick: () => setView({ min: minYear, max: maxYear }),
            children: "Fit"
          }
        )
      ] })
    ] }),
    events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-48 place-items-center text-sm text-muted-foreground", children: "Add events to see them on the timeline." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        role: "img",
        "aria-label": "Timeline graph",
        width,
        height: SVG_H,
        onWheel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        style: { touchAction: "none", cursor: panRef.current ? "grabbing" : "grab" },
        children: [
          Array.from(groupLanes.entries()).map(([gid, range]) => {
            const color = groupColorMap.get(gid) ?? "#94a3b8";
            const y = AXIS_H + range.start * (LANE_H + LANE_GAP) - 2;
            const h = (range.end - range.start + 1) * (LANE_H + LANE_GAP);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: 0,
                y,
                width,
                height: h,
                fill: color,
                opacity: 0.08
              },
              gid
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: 0, x2: width, y1: AXIS_H, y2: AXIS_H, stroke: "var(--color-border)" }),
          ticks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "line",
              {
                x1: yearToX(t),
                x2: yearToX(t),
                y1: AXIS_H,
                y2: SVG_H,
                stroke: "var(--color-border)",
                opacity: 0.5
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "text",
              {
                x: yearToX(t),
                y: AXIS_H - 8,
                textAnchor: "middle",
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
                children: formatYearLabel(t)
              }
            )
          ] }, t)),
          visible.map((it) => {
            const x1 = yearToX(it.startYear);
            const x2 = yearToX(it.endYear);
            const w = Math.max(4, x2 - x1);
            const y = AXIS_H + it.lane * (LANE_H + LANE_GAP) + 2;
            const color = it.groupId ? groupColorMap.get(it.groupId) ?? "#2563EB" : "#2563EB";
            const hasIcon = !!it.event.iconResourceId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "g",
              {
                "data-event-bar": "1",
                onClick: () => onEventClick(it.event.id),
                style: { cursor: "pointer" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: x1,
                      y,
                      width: w,
                      height: LANE_H - 4,
                      rx: 6,
                      ry: 6,
                      fill: color,
                      fillOpacity: 0.9,
                      stroke: color
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("foreignObject", { x: x1 + 6, y: y + 3, width: Math.max(0, w - 12), height: LANE_H - 10, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        height: "100%"
                      },
                      children: [
                        hasIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, style: { opacity: 0.9 }, children: "★" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it.event.name || "(untitled)" })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
                    it.event.name,
                    ": ",
                    formatEventDate(it.event.start),
                    " – ",
                    formatEventDate(it.event.end)
                  ] })
                ]
              },
              it.event.id
            );
          })
        ]
      }
    )
  ] });
}
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });
function RichEditor({ valueMarkdown, onChangeMarkdown }) {
  const initialHTML = reactExports.useMemo(
    () => valueMarkdown ? g.parse(valueMarkdown) : "<p></p>",
    // only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const editor = useEditor({
    extensions: [
      index_default,
      index_default$1,
      index_default$2.configure({ openOnClick: false, autolink: true })
    ],
    content: initialHTML,
    editorProps: { attributes: { class: "tiptap prose prose-sm max-w-none focus:outline-none" } },
    onUpdate: ({ editor: editor2 }) => {
      const md = td.turndown(editor2.getHTML());
      onChangeMarkdown(md);
    }
  });
  reactExports.useEffect(() => () => editor?.destroy(), [editor]);
  if (!editor) return null;
  const btn = (active) => `inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Bold",
          className: btn(editor.isActive("bold")),
          onClick: () => editor.chain().focus().toggleBold().run(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Italic",
          className: btn(editor.isActive("italic")),
          onClick: () => editor.chain().focus().toggleItalic().run(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Underline",
          className: btn(editor.isActive("underline")),
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Heading",
          className: btn(editor.isActive("heading", { level: 2 })),
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heading2, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Bulleted list",
          className: btn(editor.isActive("bulletList")),
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Link",
          className: btn(editor.isActive("link")),
          onClick: () => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => {
            editor.chain().focus().clearContent().run();
            onChangeMarkdown("");
          },
          children: "Clear"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorContent, { editor }) })
  ] });
}
const ICONS = {
  website: Link,
  image: Image,
  youtube: Youtube
};
function EventModal({ open, event, onClose, onSave, readOnly = false }) {
  const [notes, setNotes] = reactExports.useState("");
  const [resources, setResources] = reactExports.useState([]);
  const [iconResourceId, setIconResourceId] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("notes");
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [newUrl, setNewUrl] = reactExports.useState("");
  const [newLabel, setNewLabel] = reactExports.useState("");
  const [newType, setNewType] = reactExports.useState("website");
  reactExports.useEffect(() => {
    if (open && event) {
      setNotes(event.notesMarkdown || "");
      setResources(event.resources || []);
      setIconResourceId(event.iconResourceId || null);
      setActiveTab("notes");
      setShowAddForm(false);
      setNewUrl("");
      setNewLabel("");
      setNewType("website");
    }
  }, [open, event]);
  if (!event) return null;
  const handleNotesChange = (val) => {
    setNotes(val);
  };
  const handleAddResource = () => {
    if (!newUrl.trim()) return;
    const nextResources = [
      ...resources,
      {
        id: newId(),
        type: newType,
        url: newUrl.trim(),
        label: newLabel.trim()
      }
    ];
    setResources(nextResources);
    onSave({ resources: nextResources });
    setNewUrl("");
    setNewLabel("");
    setNewType("website");
    setShowAddForm(false);
    toast.success("Resource link added");
  };
  const removeResource = (id) => {
    if (!window.confirm("Are you sure you want to remove this resource link?")) return;
    const nextResources = resources.filter((x) => x.id !== id);
    setResources(nextResources);
    let nextIconId = iconResourceId;
    if (iconResourceId === id) {
      nextIconId = null;
      setIconResourceId(null);
    }
    onSave({ resources: nextResources, iconResourceId: nextIconId });
  };
  const handleToggleIcon = (rid) => {
    const nextIconId = iconResourceId === rid ? null : rid;
    setIconResourceId(nextIconId);
    onSave({ iconResourceId: nextIconId });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "truncate flex items-center gap-2", children: [
      "Notes & Resources: ",
      event.name || "Event",
      readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
        " Read-only"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full justify-start border-b rounded-none bg-transparent h-auto p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "notes",
            className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2",
            children: "Notes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "resources",
            className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2",
            children: [
              "Resources (",
              resources.length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notes", className: "mt-4 focus-visible:outline-none", children: readOnly ? notes.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/60 bg-muted/20 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { children: notes }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground", children: "No notes for this event." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RichEditor, { valueMarkdown: notes, onChangeMarkdown: handleNotesChange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "resources", className: "mt-4 focus-visible:outline-none space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
          resources.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground", children: readOnly ? "No resources attached to this event." : 'No resources yet. Click "Add Link" to attach a website, image, or YouTube link.' }),
          resources.map((r) => {
            const Icon2 = ICONS[r.type];
            const isIcon = iconResourceId === r.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-surface/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: r.url.startsWith("http") ? r.url : `https://${r.url}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex flex-1 items-center gap-3 min-w-0 mr-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${r.type === "youtube" ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" : r.type === "image" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-5 w-5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate hover:underline", children: r.label || r.url }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: r.url })
                    ] })
                  ]
                }
              ),
              !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "icon",
                    variant: isIcon ? "default" : "outline",
                    className: "h-8 w-8",
                    title: isIcon ? "Selected as icon" : "Mark as icon",
                    onClick: () => handleToggleIcon(r.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-4 w-4 ${isIcon ? "fill-current" : ""}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "icon",
                    variant: "outline",
                    className: "h-8 w-8 border-destructive/20 hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
                    title: "Remove resource",
                    onClick: () => removeResource(r.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }, r.id);
          })
        ] }),
        !readOnly && (showAddForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-lg border border-border bg-surface/40 p-3 animate-in fade-in slide-in-from-top-2 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground", children: "Add new resource link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "res-type", className: "text-[11px] text-muted-foreground", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newType, onValueChange: (v) => setNewType(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "res-type", className: "h-8 text-xs bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "website", children: "Link" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "image", children: "Image" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "youtube", children: "YouTube" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "res-label", className: "text-[11px] text-muted-foreground", children: "Title (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "res-label",
                  placeholder: "e.g. Wikipedia page",
                  className: "h-8 text-xs bg-background",
                  value: newLabel,
                  onChange: (e) => setNewLabel(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "res-url", className: "text-[11px] text-muted-foreground", children: "URL *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "res-url",
                  placeholder: "e.g. https://wikipedia.org/...",
                  className: "h-8 text-xs bg-background",
                  value: newUrl,
                  onChange: (e) => setNewUrl(e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", className: "h-8 text-xs", onClick: () => setShowAddForm(false), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", className: "h-8 text-xs", onClick: handleAddResource, disabled: !newUrl.trim(), children: "Add Link" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "w-full border-dashed", onClick: () => setShowAddForm(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
          " Add Link / Resource"
        ] }))
      ] })
    ] }),
    !readOnly && activeTab === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        onSave({ notesMarkdown: notes });
        onClose();
      }, children: "Save Changes" })
    ] }),
    readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
  ] }) });
}
function EventDetailsModal({
  open,
  event,
  isAdd = false,
  groups,
  onClose,
  onSave,
  onSaveAndAddAnother
}) {
  const [name, setName] = reactExports.useState("");
  const [start, setStart] = reactExports.useState({ year: 0 });
  const [end, setEnd] = reactExports.useState({ year: 0 });
  const [groupId, setGroupId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) {
      if (event && !isAdd) {
        setName(event.name || "");
        setStart(event.start || { year: 0 });
        setEnd(event.end || { year: 0 });
        setGroupId(event.groupId || null);
      } else {
        setName("");
        setStart({ year: 0 });
        setEnd({ year: 0 });
        setGroupId(null);
      }
    }
  }, [open, event, isAdd]);
  const isValid = name.trim().length > 0 && start.year !== 0;
  const handleSave = () => {
    if (!isValid) return;
    onSave({
      name: name.trim(),
      start,
      end: end.year ? end : start,
      groupId
    });
    onClose();
  };
  const handleSaveAndAddAnother = () => {
    if (!isValid || !onSaveAndAddAnother) return;
    onSaveAndAddAnother({
      name: name.trim(),
      start,
      end: end.year ? end : start,
      groupId
    });
    toast.success(`Added event "${name.trim()}"`);
    setName("");
    setStart({ year: 0 });
    setEnd({ year: 0 });
    setGroupId(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isAdd ? "Add New Event" : event ? `Edit Event Details: ${event.name}` : "Edit Event Details" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "det-name", children: "Event Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "det-name",
            placeholder: "e.g. Declaration of Independence",
            value: name,
            onChange: (e) => setName(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "det-group", children: "Group" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: groupId ?? "__none",
            onValueChange: (v) => setGroupId(v === "__none" ? null : v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "det-group", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "None" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none", children: "None" }),
                groups.map((g2) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g2.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full", style: { background: g2.color } }),
                  g2.name
                ] }) }, g2.id))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DateFields,
        {
          label: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Start Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-normal text-muted-foreground", children: "(Year is required, Month/Day optional)" })
          ] }),
          value: start,
          onChange: setStart
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DateFields,
        {
          label: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "End Date (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-normal text-muted-foreground", children: "(Year is required, Month/Day optional)" })
          ] }),
          value: end,
          onChange: setEnd
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      isAdd && onSaveAndAddAnother && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "secondary",
          onClick: handleSaveAndAddAnother,
          disabled: !isValid,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            " Save & Add Another"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: !isValid, children: isAdd ? "Add Event" : "Save Changes" })
    ] })
  ] }) });
}
function DateFields({
  label,
  value,
  onChange
}) {
  const era = eraOf(value.year || 1);
  const yearAbs = Math.abs(value.year || 0) || "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium flex flex-wrap items-center gap-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "flex-1 min-w-[70px] text-sm h-9",
          type: "text",
          inputMode: "numeric",
          value: yearAbs,
          placeholder: "Year",
          onChange: (e) => {
            const val = e.target.value.replace(/\D/g, "");
            const n = val ? Number(val) : 0;
            onChange({ ...value, year: applyEra(n, era) });
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "w-16 text-sm text-center h-9",
          type: "text",
          inputMode: "numeric",
          maxLength: 2,
          value: value.month ?? "",
          placeholder: "MM",
          onChange: (e) => {
            const val = e.target.value.replace(/\D/g, "");
            onChange({ ...value, month: val ? Math.min(12, Math.max(1, Number(val))) : void 0 });
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "w-16 text-sm text-center h-9",
          type: "text",
          inputMode: "numeric",
          maxLength: 2,
          value: value.day ?? "",
          placeholder: "DD",
          onChange: (e) => {
            const val = e.target.value.replace(/\D/g, "");
            onChange({ ...value, day: val ? Math.min(31, Math.max(1, Number(val))) : void 0 });
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: era,
          onValueChange: (v) => onChange({ ...value, year: applyEra(Math.abs(value.year || 1), v) }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-20 h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "BC", children: "BC" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AD", children: "AD" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  EventModal as E,
  Select as S,
  TimelineGraph as T,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d,
  Switch as e,
  EventDetailsModal as f,
  sortEvents as s
};
