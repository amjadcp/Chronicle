import { Timeline, TimelineSchema } from "./types";

// Placeholder GitHub repo. Replace with the real repo once available.
// Expected layout:
//   /timelines/index.json  -> { timelines: [{ file: "ancient-india-xxx.json", ... }] }
//   /timelines/<file>      -> Timeline JSON matching TimelineSchema
export const PREBUILT_BASE =
  "https://raw.githubusercontent.com/PLACEHOLDER_OWNER/chronicle-timelines/main/timelines/";

export interface PrebuiltSummary {
  file: string;
  name: string;
  description: string;
  contributor: string;
  eventCount: number;
  updatedAt: string;
}

export interface PrebuiltIndex {
  timelines: PrebuiltSummary[];
}

export async function fetchPrebuiltIndex(): Promise<PrebuiltSummary[]> {
  try {
    const res = await fetch(`${PREBUILT_BASE}index.json`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as PrebuiltIndex;
    return Array.isArray(data?.timelines) ? data.timelines : [];
  } catch {
    return [];
  }
}

export async function fetchPrebuiltTimeline(file: string): Promise<Timeline | null> {
  try {
    const res = await fetch(`${PREBUILT_BASE}${file}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = TimelineSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
