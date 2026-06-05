import { Timeline, TimelineSchema, makeEmptyTimeline } from "./types";

const KEY = "chronicle:v1:timelines";

function read(): Timeline[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((t) => TimelineSchema.safeParse(t))
      .filter((r) => r.success)
      .map((r) => (r as { success: true; data: Timeline }).data);
  } catch {
    return [];
  }
}

function write(list: Timeline[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("chronicle:timelines-changed"));
}

export const storage = {
  list(): Timeline[] {
    return read().sort((a, b) => (b.updatedAt < a.updatedAt ? -1 : 1));
  },
  get(id: string): Timeline | undefined {
    return read().find((t) => t.id === id);
  },
  save(timeline: Timeline) {
    const list = read();
    const idx = list.findIndex((t) => t.id === timeline.id);
    const next = { ...timeline, updatedAt: new Date().toISOString() };
    if (idx >= 0) list[idx] = next;
    else list.push(next);
    write(list);
  },
  create(name?: string): Timeline {
    const t = makeEmptyTimeline(name);
    const list = read();
    list.push(t);
    write(list);
    return t;
  },
  duplicate(id: string): Timeline | undefined {
    const src = read().find((t) => t.id === id);
    if (!src) return undefined;
    const copy: Timeline = JSON.parse(JSON.stringify(src));
    copy.id = crypto.randomUUID();
    copy.name = `${src.name} (Copy)`;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = copy.createdAt;
    const list = read();
    list.push(copy);
    write(list);
    return copy;
  },
  remove(id: string) {
    write(read().filter((t) => t.id !== id));
  },
  importJSON(raw: string): Timeline {
    const parsed = JSON.parse(raw);
    const result = TimelineSchema.safeParse(parsed);
    if (!result.success) throw new Error("Invalid timeline JSON: schema mismatch");
    const t: Timeline = { ...result.data, id: crypto.randomUUID() };
    const list = read();
    list.push(t);
    write(list);
    return t;
  },
};

export function subscribeTimelines(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener("chronicle:timelines-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("chronicle:timelines-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
