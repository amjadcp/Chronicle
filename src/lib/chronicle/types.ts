import { z } from "zod";

export const EraSchema = z.enum(["BC", "AD"]);
export type Era = z.infer<typeof EraSchema>;

export const ResourceTypeSchema = z.enum(["website", "image", "youtube"]);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

export const ResourceSchema = z.object({
  id: z.string(),
  type: ResourceTypeSchema,
  url: z.string().min(1),
  label: z.string().optional().default(""),
});
export type Resource = z.infer<typeof ResourceSchema>;

export const EventDateSchema = z.object({
  // Internal year: BC negative, AD positive. Year 0 is not used.
  year: z.number().int(),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
});
export type EventDate = z.infer<typeof EventDateSchema>;

export const TimelineEventSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  start: EventDateSchema,
  end: EventDateSchema,
  groupId: z.string().nullable().optional().default(null),
  notesMarkdown: z.string().default(""),
  resources: z.array(ResourceSchema).default([]),
  iconResourceId: z.string().nullable().optional().default(null),
  color: z.string().nullable().optional().default(null),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(120),
  color: z.string().min(1),
});
export type Group = z.infer<typeof GroupSchema>;

export const TimelineSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().default(""),
  contributor: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string(),
  events: z.array(TimelineEventSchema).default([]),
  groups: z.array(GroupSchema).default([]),
  schemaVersion: z.literal(1).default(1),
});
export type Timeline = z.infer<typeof TimelineSchema>;

export type SortKey = "start-asc" | "start-desc" | "duration-asc" | "duration-desc";

// Color-blind safe palette for groups
export const GROUP_COLORS = [
  "#2563EB",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
];

export function newId(): string {
  // Prefer native crypto.randomUUID()
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function eraOf(year: number): Era {
  return year < 0 ? "BC" : "AD";
}

export function absYear(year: number): number {
  return Math.abs(year);
}

export function applyEra(absYear: number, era: Era): number {
  const y = Math.max(1, Math.abs(absYear || 0));
  return era === "BC" ? -y : y;
}

/** Decimal year (e.g. 1492.34) used for graph positioning and duration. */
export function toDecimalYear(d: EventDate): number {
  const m = d.month ?? 1;
  const day = d.day ?? 1;
  // approximate
  return d.year + (m - 1) / 12 + (day - 1) / 365;
}

export function durationYears(start: EventDate, end: EventDate): number {
  return Math.abs(toDecimalYear(end) - toDecimalYear(start));
}

export function formatEventDate(d: EventDate): string {
  const y = Math.abs(d.year);
  const era = d.year < 0 ? " BC" : "";
  const parts = [String(y)];
  if (d.month) parts.push(String(d.month).padStart(2, "0"));
  if (d.day) parts.push(String(d.day).padStart(2, "0"));
  return parts.join("-") + era;
}

export function makeEmptyEvent(): TimelineEvent {
  return {
    id: newId(),
    name: "",
    start: { year: 0 },
    end: { year: 0 },
    groupId: null,
    notesMarkdown: "",
    resources: [],
    iconResourceId: null,
    color: null,
  };
}

export function makeEmptyTimeline(name = "Untitled Timeline"): Timeline {
  const now = new Date().toISOString();
  return {
    id: newId(),
    name,
    description: "",
    contributor: "",
    createdAt: now,
    updatedAt: now,
    events: [],
    groups: [],
    schemaVersion: 1,
  };
}
