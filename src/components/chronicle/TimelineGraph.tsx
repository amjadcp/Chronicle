import { useMemo, useRef, useState, useEffect, type WheelEvent } from "react";
import { Info } from "lucide-react";
import { Group, TimelineEvent, toDecimalYear, formatEventDate } from "@/lib/chronicle/types";

/** Duration helper: returns human-readable span like "~2 000 years" */
function describeDuration(startYear: number, endYear: number): string {
  const diff = Math.abs(endYear - startYear);
  if (diff < 0.01) return "single point";
  if (diff < 1) return `~${Math.round(diff * 12)} months`;
  if (diff < 10) return `~${diff.toFixed(1)} years`;
  if (diff < 1000) return `~${Math.round(diff)} years`;
  return `~${(diff / 1000).toFixed(1)} k years`;
}

interface Props {
  events: TimelineEvent[];
  groups: Group[];
  singleRowPerGroup: boolean;
  onEventClick: (id: string) => void;
}

interface LaidOut {
  event: TimelineEvent;
  startYear: number;
  endYear: number;
  lane: number;
  groupId: string | null;
}

/** Assign lane indices so bars don't overlap. */
function assignLanes(
  events: TimelineEvent[],
  groups: Group[],
  singleRowPerGroup: boolean,
): {
  items: LaidOut[];
  laneCount: number;
  groupLanes: Map<string, { start: number; end: number }>;
} {
  const groupLanes = new Map<string, { start: number; end: number }>();
  const items: LaidOut[] = [];
  let nextLane = 0;

  const computeRange = (e: TimelineEvent) => {
    const a = toDecimalYear(e.start);
    const b = toDecimalYear(e.end);
    return { startYear: Math.min(a, b), endYear: Math.max(a, b) };
  };

  // Process groups first (so their lanes are contiguous), then ungrouped
  const groupOrder = groups.filter((g) => events.some((e) => e.groupId === g.id));
  for (const g of groupOrder) {
    const groupEvents = events.filter((e) => e.groupId === g.id);
    const groupStart = nextLane;

    if (singleRowPerGroup) {
      const lane = nextLane;
      for (const e of groupEvents) {
        const { startYear, endYear } = computeRange(e);
        items.push({ event: e, startYear, endYear, lane, groupId: g.id });
      }
      nextLane += 1;
    } else {
      const laneEnds: number[] = []; // absolute year end for each lane within this group
      for (const e of [...groupEvents].sort(
        (a, b) => toDecimalYear(a.start) - toDecimalYear(b.start),
      )) {
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
    }

    groupLanes.set(g.id, { start: groupStart, end: nextLane - 1 });
  }

  // Ungrouped — pack into their own lanes
  const ungrouped = events.filter((e) => !e.groupId);
  const laneEnds: number[] = [];
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

function formatYearLabel(y: number): string {
  const abs = Math.abs(Math.round(y));
  return y < 0 ? `${abs} BC` : `${abs}`;
}

/**
 * Computes an initial view that focuses on the cluster where most events occur.
 * Uses the 5th–95th percentile of all event year endpoints to ignore outliers
 * (e.g. a single enormous Paleolithic event shouldn't dwarf all other events).
 */
function computeSmartInitialView(items: LaidOut[]): { min: number; max: number } {
  if (items.length === 0) return { min: 0, max: 100 };

  const allYears = items
    .flatMap((it) => [it.startYear, it.endYear])
    .sort((a, b) => a - b);
  const n = allYears.length;

  // With very few data points just use the full range
  if (n <= 4) {
    const lo = allYears[0];
    const hi = allYears[n - 1];
    const span = Math.max(1, hi - lo);
    return { min: lo - span * 0.06, max: hi + span * 0.06 };
  }

  // 5th – 95th percentile focuses the view on the dense cluster
  const lo = allYears[Math.floor(n * 0.05)];
  const hi = allYears[Math.min(n - 1, Math.floor(n * 0.95))];
  const span = Math.max(1, hi - lo);
  const pad = span * 0.08;
  return { min: lo - pad, max: hi + pad };
}

export function TimelineGraph({ events, groups, singleRowPerGroup, onEventClick }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    });
    ro.observe(wrapRef.current);
    setWidth(wrapRef.current.clientWidth);
    return () => ro.disconnect();
  }, []);

  const { items, laneCount, groupLanes } = useMemo(
    () => assignLanes(events, groups, singleRowPerGroup),
    [events, groups, singleRowPerGroup],
  );

  const { minYear, maxYear } = useMemo(() => {
    if (items.length === 0) return { minYear: 0, maxYear: 100 };
    let mn = Infinity,
      mx = -Infinity;
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

  // viewport: year domain visible; start = smart cluster focus
  const [view, setView] = useState(() => computeSmartInitialView(items));
  // refit to smart cluster when the overall bounds change (events added/removed)
  const lastBoundsRef = useRef({ minYear, maxYear });
  useEffect(() => {
    const prev = lastBoundsRef.current;
    if (prev.minYear !== minYear || prev.maxYear !== maxYear) {
      lastBoundsRef.current = { minYear, maxYear };
      setView(computeSmartInitialView(items));
    }
  }, [minYear, maxYear, items]);

  const LANE_H = 28;
  const LANE_GAP = 4;
  const AXIS_H = 28;
  const PADDING_X = 16;
  const SVG_H = Math.max(500, AXIS_H + laneCount * (LANE_H + LANE_GAP) + 32);
  const innerW = Math.max(200, width - PADDING_X * 2);

  const yearToX = (y: number) => {
    const span = view.max - view.min || 1;
    return PADDING_X + ((y - view.min) / span) * innerW;
  };

  function onWheel(e: WheelEvent<SVGSVGElement>) {
    e.preventDefault();
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const span = view.max - view.min;
    const yearAtCursor = view.min + ((px - PADDING_X) / innerW) * span;
    const zoom = e.deltaY > 0 ? 1.2 : 0.8333;
    const newSpan = Math.max(0.5, Math.min(span * zoom, (maxYear - minYear) * 20));
    const ratio = (yearAtCursor - view.min) / span;
    const newMin = yearAtCursor - ratio * newSpan;
    const newMax = newMin + newSpan;
    setView({ min: newMin, max: newMax });
  }

  // drag to pan
  const panRef = useRef<{ startX: number; startView: { min: number; max: number } } | null>(null);
  const [hoveredItem, setHoveredItem] = useState<LaidOut | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if ((e.target as Element).closest("[data-event-bar]")) return;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    panRef.current = { startX: e.clientX, startView: { ...view } };
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!panRef.current) return;
    const dx = e.clientX - panRef.current.startX;
    const span = panRef.current.startView.max - panRef.current.startView.min;
    const dy = (dx / innerW) * span;
    setView({ min: panRef.current.startView.min - dy, max: panRef.current.startView.max - dy });
  }
  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
    panRef.current = null;
  }

  // Axis ticks
  const ticks = useMemo(() => {
    const span = view.max - view.min;
    const targetCount = Math.max(4, Math.floor(innerW / 110));
    const rawStep = span / targetCount;
    const mag = Math.pow(10, Math.floor(Math.log10(Math.max(1, rawStep))));
    const norm = rawStep / mag;
    const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
    const start = Math.ceil(view.min / step) * step;
    const out: number[] = [];
    for (let y = start; y <= view.max; y += step) out.push(y);
    return out;
  }, [view, innerW]);

  // Count events outside the visible range
  const hiddenLeft = items.filter((it) => it.endYear < view.min).length;
  const hiddenRight = items.filter((it) => it.startYear > view.max).length;
  const hiddenCount = hiddenLeft + hiddenRight;

  // virtualize: only render visible bars
  const visible = items.filter((it) => it.endYear >= view.min && it.startYear <= view.max);

  const groupColorMap = new Map(groups.map((g) => [g.id, g.color]));

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
        <div>
          {formatYearLabel(view.min)} → {formatYearLabel(view.max)}
        </div>
        <div className="flex gap-2">
          {/* Pan to hidden left events */}
          {hiddenLeft > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-primary hover:bg-accent"
              onClick={() => setView({ min: minYear, max: minYear + (view.max - view.min) })}
              title={`${hiddenLeft} event(s) earlier — click to pan left`}
            >
              ← {hiddenLeft}
            </button>
          )}
          {/* Pan to hidden right events */}
          {hiddenRight > 0 && (
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-primary hover:bg-accent"
              onClick={() => setView({ min: maxYear - (view.max - view.min), max: maxYear })}
              title={`${hiddenRight} event(s) later — click to pan right`}
            >
              {hiddenRight} →
            </button>
          )}
          <button
            type="button"
            className="rounded-md border border-border bg-background px-2 py-1 hover:bg-accent"
            onClick={() => {
              const span = view.max - view.min;
              const c = (view.min + view.max) / 2;
              setView({ min: c - span * 0.4, max: c + span * 0.4 });
            }}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="rounded-md border border-border bg-background px-2 py-1 hover:bg-accent"
            onClick={() => {
              const span = view.max - view.min;
              const c = (view.min + view.max) / 2;
              setView({ min: c - span * 0.625, max: c + span * 0.625 });
            }}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className="rounded-md border border-border bg-background px-2 py-1 hover:bg-accent"
            onClick={() => setView({ min: minYear, max: maxYear })}
          >
            Fit
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="grid h-48 place-items-center text-sm text-muted-foreground">
          Add events to see them on the timeline.
        </div>
      ) : (
        <>
          <svg
            role="img"
            aria-label="Timeline graph"
            width={width}
            height={SVG_H}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "none", cursor: panRef.current ? "grabbing" : "grab" }}
          >
            {/* group background lanes */}
            {Array.from(groupLanes.entries()).map(([gid, range]) => {
              const color = groupColorMap.get(gid) ?? "#94a3b8";
              const y = AXIS_H + range.start * (LANE_H + LANE_GAP) - 2;
              const h = (range.end - range.start + 1) * (LANE_H + LANE_GAP);
              return (
                <rect key={gid} x={0} y={y} width={width} height={h} fill={color} opacity={0.08} />
              );
            })}

            {/* axis */}
            <line x1={0} x2={width} y1={AXIS_H} y2={AXIS_H} stroke="var(--color-border)" />
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={yearToX(t)}
                  x2={yearToX(t)}
                  y1={AXIS_H}
                  y2={SVG_H}
                  stroke="var(--color-border)"
                  opacity={0.5}
                />
                <text
                  x={yearToX(t)}
                  y={AXIS_H - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--color-muted-foreground)"
                >
                  {formatYearLabel(t)}
                </text>
              </g>
            ))}

            {/* bars */}
            {visible.map((it) => {
              const x1 = yearToX(it.startYear);
              const x2 = yearToX(it.endYear);
              const w = Math.max(4, x2 - x1);
              const y = AXIS_H + it.lane * (LANE_H + LANE_GAP) + 2;
              const groupColor = it.groupId ? (groupColorMap.get(it.groupId) ?? "#2563EB") : "#2563EB";
              const color = it.event.color ?? groupColor;
              const hasIcon = !!it.event.iconResourceId;
              return (
                <g
                  key={it.event.id}
                  data-event-bar="1"
                  onClick={() => onEventClick(it.event.id)}
                  onMouseEnter={(e) => {
                    if (!panRef.current) {
                      setHoveredItem(it);
                      const rect = wrapRef.current?.getBoundingClientRect();
                      if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!panRef.current && hoveredItem?.event.id === it.event.id) {
                      const rect = wrapRef.current?.getBoundingClientRect();
                      if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x1}
                    y={y}
                    width={w}
                    height={LANE_H - 4}
                    rx={6}
                    ry={6}
                    fill={color}
                    fillOpacity={0.9}
                    stroke={color}
                  />
                  <foreignObject
                    x={x1 + 6}
                    y={y + 3}
                    width={Math.max(0, w - 12)}
                    height={LANE_H - 10}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        height: "100%",
                      }}
                    >
                      {hasIcon && (
                        <span aria-hidden style={{ opacity: 0.9 }}>
                          ★
                        </span>
                      )}
                      <span>{it.event.name || "(untitled)"}</span>
                    </div>
                  </foreignObject>
                  <title>
                    {it.event.name}: {formatEventDate(it.event.start)} –{" "}
                    {formatEventDate(it.event.end)}
                  </title>
                </g>
              );
            })}
          </svg>

          {/* Hover info card */}
          {hoveredItem && (() => {
            const it = hoveredItem;
            const groupName = it.groupId
              ? (groups.find((g) => g.id === it.groupId)?.name ?? null)
              : null;
            const groupColor = it.groupId ? (groupColorMap.get(it.groupId) ?? "#2563EB") : null;
            const barColor = it.event.color ?? groupColor ?? "#2563EB";
            const CARD_W = 240;
            const CARD_H = 120;
            const leftPos = Math.min(mousePos.x + 12, width - CARD_W - 8);
            const topPos = mousePos.y - CARD_H - 12 < 0
              ? mousePos.y + 18
              : mousePos.y - CARD_H - 12;
            return (
              <div
                style={{
                  position: "absolute",
                  left: leftPos,
                  top: topPos,
                  width: CARD_W,
                  pointerEvents: "none",
                  zIndex: 50,
                }}
                className="rounded-xl border border-border bg-popover shadow-xl backdrop-blur-sm"
              >
                {/* colour accent stripe */}
                <div
                  className="h-1 w-full rounded-t-xl"
                  style={{ background: barColor }}
                />
                <div className="px-3 py-2.5 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <div
                      className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: barColor }}
                    />
                    <p className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                      {it.event.name || "(untitled)"}
                    </p>
                  </div>
                  {groupName && (
                    <div className="text-[11px] text-muted-foreground pl-4">
                      Group: <span className="font-medium text-foreground">{groupName}</span>
                    </div>
                  )}
                  <div className="border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground space-y-0.5 pl-4">
                    <div>
                      <span className="font-medium text-foreground">Start:</span>{" "}
                      {formatEventDate(it.event.start)}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">End:</span>{" "}
                      {formatEventDate(it.event.end)}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Duration:</span>{" "}
                      {describeDuration(it.startYear, it.endYear)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Off-screen events notice banner */}
          {hiddenCount > 0 && (
            <div className="flex items-center justify-between gap-2 border-t border-border bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold text-foreground">{hiddenCount}</span>{" "}
                  {hiddenCount === 1 ? "event is" : "events are"} outside the current view
                  {hiddenLeft > 0 && hiddenRight > 0
                    ? ` (${hiddenLeft} earlier, ${hiddenRight} later)`
                    : hiddenLeft > 0
                      ? ` — scroll left or zoom out to see them`
                      : ` — scroll right or zoom out to see them`}
                  .
                </span>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md border border-border bg-background px-2 py-1 hover:bg-accent"
                onClick={() => setView({ min: minYear, max: maxYear })}
              >
                Fit All
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
