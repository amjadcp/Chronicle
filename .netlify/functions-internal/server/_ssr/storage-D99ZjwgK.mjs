import { T as TimelineSchema, m as makeEmptyTimeline } from "./types-CWdzg89e.mjs";
const KEY = "chronicle:v1:timelines";
function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((t) => TimelineSchema.safeParse(t)).filter((r) => r.success).map((r) => r.data);
  } catch {
    return [];
  }
}
function write(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("chronicle:timelines-changed"));
}
const storage = {
  list() {
    return read().sort((a, b) => b.updatedAt < a.updatedAt ? -1 : 1);
  },
  get(id) {
    return read().find((t) => t.id === id);
  },
  save(timeline) {
    const list = read();
    const idx = list.findIndex((t) => t.id === timeline.id);
    const next = { ...timeline, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    if (idx >= 0) list[idx] = next;
    else list.push(next);
    write(list);
  },
  create(name) {
    const t = makeEmptyTimeline(name);
    const list = read();
    list.push(t);
    write(list);
    return t;
  },
  duplicate(id) {
    const src = read().find((t) => t.id === id);
    if (!src) return void 0;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = crypto.randomUUID();
    copy.name = `${src.name} (Copy)`;
    copy.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    copy.updatedAt = copy.createdAt;
    const list = read();
    list.push(copy);
    write(list);
    return copy;
  },
  remove(id) {
    write(read().filter((t) => t.id !== id));
  },
  importJSON(raw) {
    const parsed = JSON.parse(raw);
    const result = TimelineSchema.safeParse(parsed);
    if (!result.success) throw new Error("Invalid timeline JSON: schema mismatch");
    const t = { ...result.data, id: crypto.randomUUID() };
    const list = read();
    list.push(t);
    write(list);
    return t;
  }
};
function subscribeTimelines(cb) {
  const handler = () => cb();
  window.addEventListener("chronicle:timelines-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("chronicle:timelines-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
export {
  subscribeTimelines as a,
  storage as s
};
