import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchPrebuiltTimeline } from "@/lib/chronicle/prebuilt";
import { storage } from "@/lib/chronicle/storage";
import { Timeline, TimelineEvent, SortKey, durationYears, formatEventDate } from "@/lib/chronicle/types";
import { sortEvents } from "@/lib/chronicle/sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TimelineGraph } from "@/components/chronicle/TimelineGraph";
import { EventTable } from "@/components/chronicle/EventTable";
import { EventModal } from "@/components/chronicle/EventModal";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Loader2,
  Users,
  Calendar,
  Lock,
  Info,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/prebuilt/$file")({
  head: () => ({
    meta: [
      { title: "Community Timeline — HistoryTimeline" },
      {
        name: "description",
        content: "View a community-contributed historical timeline from the HistoryTimeline public library.",
      },
      { property: "og:title", content: "Community Timeline — HistoryTimeline" },
      { property: "og:description", content: "Explore a community historical timeline." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrebuiltDetail,
});

function PrebuiltDetail() {
  const { file } = Route.useParams();
  const navigate = useNavigate();

  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("start-asc");
  const [singleRowPerGroup, setSingleRow] = useState(false);
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPrebuiltTimeline(file)
      .then((t) => {
        if (!t) {
          toast.error("Could not load this community timeline.");
          navigate({ to: "/timelines" });
          return;
        }
        setTimeline(t);
      })
      .catch(() => {
        toast.error("Failed to fetch timeline from GitHub.");
        navigate({ to: "/timelines" });
      })
      .finally(() => setLoading(false));
  }, [file, navigate]);

  const sorted = useMemo(
    () => (timeline ? sortEvents(timeline.events, timeline.groups, sort) : []),
    [timeline, sort]
  );

  const openEvent = timeline?.events.find((e) => e.id === openEventId) ?? null;

  function handleSaveToMine() {
    if (!timeline) return;
    setSaving(true);
    try {
      const local = storage.create(timeline.name);
      const merged: Timeline = { ...timeline, id: local.id };
      storage.save(merged);
      toast.success(`"${timeline.name}" saved to My Timelines!`);
      navigate({ to: "/timeline/$id", params: { id: merged.id } });
    } catch {
      toast.error("Failed to save timeline.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading community timeline…</span>
      </div>
    );
  }

  if (!timeline) return null;

  return (
    <div className="mx-auto max-w-[1400px] w-full px-6 py-6">
      {/* Header Area with back button containing Timeline Name and Info button */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground font-semibold text-lg hover:bg-transparent -ml-2">
            <Link to="/timelines">
              <ArrowLeft className="mr-2 h-5 w-5" /> {timeline.name}
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setInfoDialogOpen(true)}
            title="Timeline Info"
            className="shrink-0"
          >
            <Info className="h-4.5 w-4.5 text-muted-foreground" />
          </Button>
        </div>

        {/* Meta badges + Save button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Read-only badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Lock className="h-3 w-3" />
            Read-only
          </span>

          {/* Contributor */}
          {timeline.contributor && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              <Users className="h-3 w-3" />
              {timeline.contributor}
            </span>
          )}

          {/* Event count */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {timeline.events.length} events
          </span>

          {/* Save to My Timelines */}
          <Button size="sm" onClick={handleSaveToMine} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Save to My Timelines
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Toolbar — view controls only, no edit controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2">
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-36 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start-asc">Start ↑</SelectItem>
            <SelectItem value="start-desc">Start ↓</SelectItem>
            <SelectItem value="duration-asc">Duration ↑</SelectItem>
            <SelectItem value="duration-desc">Duration ↓</SelectItem>
          </SelectContent>
        </Select>

        {viewMode === "graph" && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1">
            <Switch
              id="single-row-pre"
              checked={singleRowPerGroup}
              onCheckedChange={setSingleRow}
            />
            <Label htmlFor="single-row-pre" className="text-xs text-muted-foreground">
              Show group on single row
            </Label>
          </div>
        )}

        {/* View toggle on the right */}
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
              viewMode === "graph"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Graph
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
              viewMode === "table"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Graph view */}
      {viewMode === "graph" && (
        <section
          className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-label="Timeline graph"
        >
          <TimelineGraph
            events={timeline.events}
            groups={timeline.groups}
            singleRowPerGroup={singleRowPerGroup}
            onEventClick={(eid) => setOpenEventId(eid)}
          />
        </section>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <section
          className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-label="Events table"
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              Events ({sorted.length})
            </h3>
          </div>
          {/* Read-only event table — no selection, no delete, no edit. Click notes icon to open notes modal. */}
          <ReadOnlyEventTable
            events={sorted}
            groups={timeline.groups}
            onOpenNotes={(eid) => setOpenEventId(eid)}
          />
          {timeline.groups.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Groups:</span>
              {timeline.groups.map((g) => (
                <span
                  key={g.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Read-only notes & resources modal */}
      <EventModal
        open={!!openEvent}
        event={openEvent}
        onClose={() => setOpenEventId(null)}
        onSave={() => {}}
        readOnly
      />

      {/* Timeline Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Timeline Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="tl-name">Name</Label>
              <Input
                id="tl-name"
                value={timeline.name}
                readOnly
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tl-desc">Description</Label>
              <textarea
                id="tl-desc"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeline.description || ""}
                placeholder="No description"
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Read-only event table (no checkboxes, no delete, no edit buttons)
// ---------------------------------------------------------------------------
function ReadOnlyEventTable({
  events,
  groups,
  onOpenNotes,
}: {
  events: TimelineEvent[];
  groups: { id: string; name: string; color: string }[];
  onOpenNotes: (eid: string) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        No events found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-surface text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Event</th>
            <th className="px-3 py-2 text-left font-medium">Start</th>
            <th className="px-3 py-2 text-left font-medium">End</th>
            <th className="px-3 py-2 text-left font-medium">Duration</th>
            <th className="px-3 py-2 text-left font-medium">Group</th>
            <th className="w-32 px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const dur = durationYears(e.start, e.end);
            const group = groups.find((g) => g.id === e.groupId);
            return (
              <tr key={e.id} className="border-t border-border align-middle hover:bg-surface/20 transition-colors">
                <td className="min-w-[12rem] px-3 py-3 font-medium text-foreground">
                  {e.name}
                </td>
                <td className="px-3 py-3 text-foreground whitespace-nowrap">
                  {formatEventDate(e.start)}
                </td>
                <td className="px-3 py-3 text-foreground whitespace-nowrap">
                  {formatEventDate(e.end)}
                </td>
                <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                  {dur.toFixed(dur < 10 ? 1 : 0)} yr
                </td>
                <td className="px-3 py-3">
                  {group ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ background: group.color }} />
                      {group.name}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Open notes & resources"
                      onClick={() => onOpenNotes(e.id)}
                      title="Notes & Resources"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
