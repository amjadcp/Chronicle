import { Timeline, TimelineSchema } from "./types";

// Real GitHub repository storing community-contributed timeline JSON files.
// Layout: /timelines/<name-id.json>  (no index.json required — listed via API)
const GITHUB_REPO = "amjadcp/Chronicle-Data";
const GITHUB_BRANCH = "main";
const TIMELINES_PATH = "timelines";

export const PREBUILT_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${TIMELINES_PATH}/`;
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents/${TIMELINES_PATH}`;

export interface PrebuiltSummary {
  file: string;
  name: string;
  description: string;
  contributor: string;
  eventCount: number;
  updatedAt: string;
}

/**
 * Lists all .json files in the timelines/ folder via GitHub Contents API,
 * then fetches each one in parallel to build the summary list.
 * No index.json needed — the file list is discovered dynamically.
 */
export async function fetchPrebuiltIndex(): Promise<PrebuiltSummary[]> {
  try {
    // 1. Get directory listing from GitHub API
    const dirRes = await fetch(`${GITHUB_API_BASE}?ref=${GITHUB_BRANCH}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      cache: "no-store",
    });
    if (!dirRes.ok) return [];

    const entries: { name: string; download_url: string }[] = await dirRes.json();
    const jsonFiles = entries.filter((e) => e.name.endsWith(".json") && e.name !== "index.json");

    if (jsonFiles.length === 0) return [];

    // 2. Fetch all timeline files in parallel
    const results = await Promise.allSettled(
      jsonFiles.map(async (entry) => {
        const res = await fetch(entry.download_url, { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        const parsed = TimelineSchema.safeParse(data);
        if (!parsed.success) return null;
        const t = parsed.data;
        const summary: PrebuiltSummary = {
          file: entry.name,
          name: t.name,
          description: t.description || "",
          contributor: t.contributor || "Community",
          eventCount: t.events.length,
          updatedAt: t.updatedAt,
        };
        return summary;
      }),
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<PrebuiltSummary> =>
          r.status === "fulfilled" && r.value !== null,
      )
      .map((r) => r.value)
      .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
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
