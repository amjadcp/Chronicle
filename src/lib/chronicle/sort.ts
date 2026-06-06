import { Group, SortKey, Timeline, TimelineEvent, toDecimalYear } from "./types";

/** Returns events sorted respecting group cohesion. */
export function sortEvents(
  events: TimelineEvent[],
  groups: Group[],
  sort: SortKey,
): TimelineEvent[] {
  const ungrouped: TimelineEvent[] = [];
  const byGroup = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    if (e.groupId) {
      if (!byGroup.has(e.groupId)) byGroup.set(e.groupId, []);
      byGroup.get(e.groupId)!.push(e);
    } else {
      ungrouped.push(e);
    }
  }

  const cmpEvent = (a: TimelineEvent, b: TimelineEvent) => {
    const aS = toDecimalYear(a.start),
      bS = toDecimalYear(b.start);
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

  // Within each group: keep insertion order? Spec says when grouped, sort entire groups only.
  // We don't reorder within groups; the group bloc is sorted as a whole.
  const groupBlocs: { id: string; sortVal: number; items: TimelineEvent[] }[] = [];
  for (const g of groups) {
    const items = byGroup.get(g.id);
    if (!items?.length) continue;
    // representative value = min start (or min duration) of the bloc
    const reps = items.map((e) => ({
      start: toDecimalYear(e.start),
      duration: Math.abs(toDecimalYear(e.end) - toDecimalYear(e.start)),
    }));
    const sortVal =
      sort === "duration-asc" || sort === "duration-desc"
        ? Math.min(...reps.map((r) => r.duration))
        : Math.min(...reps.map((r) => r.start));
    groupBlocs.push({ id: g.id, sortVal, items });
  }
  const desc = sort === "start-desc" || sort === "duration-desc";
  groupBlocs.sort((a, b) => (desc ? b.sortVal - a.sortVal : a.sortVal - b.sortVal));

  const ungroupedSorted = [...ungrouped].sort(cmpEvent);

  // Interleave: by representative start, choose smallest first to keep ordering meaningful.
  const result: TimelineEvent[] = [];
  let ui = 0;
  for (const bloc of groupBlocs) {
    while (
      ui < ungroupedSorted.length &&
      (sort.startsWith("start")
        ? desc
          ? toDecimalYear(ungroupedSorted[ui].start) > bloc.sortVal
          : toDecimalYear(ungroupedSorted[ui].start) < bloc.sortVal
        : false)
    ) {
      result.push(ungroupedSorted[ui++]);
    }
    result.push(...bloc.items);
  }
  while (ui < ungroupedSorted.length) result.push(ungroupedSorted[ui++]);
  return result;
}

export function updateEvent(t: Timeline, id: string, patch: Partial<TimelineEvent>): Timeline {
  return { ...t, events: t.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) };
}

export function removeEvent(t: Timeline, id: string): Timeline {
  return { ...t, events: t.events.filter((e) => e.id !== id) };
}

export function addEvent(t: Timeline, e: TimelineEvent): Timeline {
  return { ...t, events: [...t.events, e] };
}
