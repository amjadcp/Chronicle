import { o as objectType, l as literalType, a as arrayType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
enumType(["BC", "AD"]);
const ResourceTypeSchema = enumType(["website", "image", "youtube"]);
const ResourceSchema = objectType({
  id: stringType(),
  type: ResourceTypeSchema,
  url: stringType().min(1),
  label: stringType().optional().default("")
});
const EventDateSchema = objectType({
  // Internal year: BC negative, AD positive. Year 0 is not used.
  year: numberType().int(),
  month: numberType().int().min(1).max(12).optional(),
  day: numberType().int().min(1).max(31).optional()
});
const TimelineEventSchema = objectType({
  id: stringType(),
  name: stringType().min(1).max(200),
  start: EventDateSchema,
  end: EventDateSchema,
  groupId: stringType().nullable().optional().default(null),
  notesMarkdown: stringType().default(""),
  resources: arrayType(ResourceSchema).default([]),
  iconResourceId: stringType().nullable().optional().default(null)
});
const GroupSchema = objectType({
  id: stringType(),
  name: stringType().min(1).max(120),
  color: stringType().min(1)
});
const TimelineSchema = objectType({
  id: stringType(),
  name: stringType().min(1).max(200),
  description: stringType().default(""),
  contributor: stringType().default(""),
  createdAt: stringType(),
  updatedAt: stringType(),
  events: arrayType(TimelineEventSchema).default([]),
  groups: arrayType(GroupSchema).default([]),
  schemaVersion: literalType(1).default(1)
});
const GROUP_COLORS = [
  "#2563EB",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1"
];
function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function eraOf(year) {
  return year < 0 ? "BC" : "AD";
}
function applyEra(absYear2, era) {
  const y = Math.max(1, Math.abs(absYear2 || 0));
  return era === "BC" ? -y : y;
}
function toDecimalYear(d) {
  const m = d.month ?? 1;
  const day = d.day ?? 1;
  return d.year + (m - 1) / 12 + (day - 1) / 365;
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
function makeEmptyTimeline(name = "Untitled Timeline") {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: newId(),
    name,
    description: "",
    contributor: "",
    createdAt: now,
    updatedAt: now,
    events: [],
    groups: [],
    schemaVersion: 1
  };
}
export {
  GROUP_COLORS as G,
  TimelineSchema as T,
  applyEra as a,
  durationYears as d,
  eraOf as e,
  formatEventDate as f,
  makeEmptyTimeline as m,
  newId as n,
  toDecimalYear as t
};
