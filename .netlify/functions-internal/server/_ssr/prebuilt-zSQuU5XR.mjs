import { T as TimelineSchema } from "./types-CWdzg89e.mjs";
const GITHUB_REPO = "amjadcp/Chronicle-Data";
const GITHUB_BRANCH = "main";
const TIMELINES_PATH = "timelines";
const PREBUILT_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${TIMELINES_PATH}/`;
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents/${TIMELINES_PATH}`;
async function fetchPrebuiltIndex() {
  try {
    const dirRes = await fetch(`${GITHUB_API_BASE}?ref=${GITHUB_BRANCH}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      cache: "no-store"
    });
    if (!dirRes.ok) return [];
    const entries = await dirRes.json();
    const jsonFiles = entries.filter(
      (e) => e.name.endsWith(".json") && e.name !== "index.json"
    );
    if (jsonFiles.length === 0) return [];
    const results = await Promise.allSettled(
      jsonFiles.map(async (entry) => {
        const res = await fetch(entry.download_url, { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        const parsed = TimelineSchema.safeParse(data);
        if (!parsed.success) return null;
        const t = parsed.data;
        const summary = {
          file: entry.name,
          name: t.name,
          description: t.description || "",
          contributor: t.contributor || "Community",
          eventCount: t.events.length,
          updatedAt: t.updatedAt
        };
        return summary;
      })
    );
    return results.filter(
      (r) => r.status === "fulfilled" && r.value !== null
    ).map((r) => r.value).sort((a, b) => b.updatedAt > a.updatedAt ? 1 : -1);
  } catch {
    return [];
  }
}
async function fetchPrebuiltTimeline(file) {
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
export {
  PREBUILT_BASE as P,
  fetchPrebuiltTimeline as a,
  fetchPrebuiltIndex as f
};
