/**
 * Tracks which timelines have been pushed to GitHub and when.
 * Stored separately from the timeline data so it doesn't affect the Zod schema.
 *
 * Shape: { [timelineId]: { pushedAt: ISO string, updatedAtSnapshot: ISO string } }
 */

const KEY = "chronicle:v1:sync-state";

export interface SyncEntry {
  /** ISO timestamp of the last successful GitHub push */
  pushedAt: string;
  /** The timeline's updatedAt value at the time of the push */
  updatedAtSnapshot: string;
}

type SyncMap = Record<string, SyncEntry>;

function read(): SyncMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SyncMap) : {};
  } catch {
    return {};
  }
}

function write(map: SyncMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export const syncState = {
  /** Record a successful push for a timeline. */
  markPushed(timelineId: string, updatedAt: string) {
    const map = read();
    map[timelineId] = {
      pushedAt: new Date().toISOString(),
      updatedAtSnapshot: updatedAt,
    };
    write(map);
  },

  /** Get the sync entry for a timeline, or undefined if never pushed. */
  get(timelineId: string): SyncEntry | undefined {
    return read()[timelineId];
  },

  /**
   * Returns the button status for a timeline card:
   *  - "not-pushed"  → never pushed  → show "Submit Contribution"
   *  - "synced"      → pushed, no edits since  → show "Synced"
   *  - "needs-sync"  → pushed but edited since  → show "Sync Now"
   */
  status(timelineId: string, currentUpdatedAt: string): "not-pushed" | "synced" | "needs-sync" {
    const entry = read()[timelineId];
    if (!entry) return "not-pushed";
    if (entry.updatedAtSnapshot === currentUpdatedAt) return "synced";
    return "needs-sync";
  },
};
