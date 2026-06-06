import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchPrebuiltTimeline } from "@/lib/chronicle/prebuilt";
import { storage } from "@/lib/chronicle/storage";
import { Timeline, TimelineEvent, SortKey } from "@/lib/chronicle/types";
import { sortEvents } from "@/lib/chronicle/sort";
import { Button } from "@/components/ui/button";
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
    <div className="w-full px-6 py-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-transparent -ml-2 shrink-0"
          >
            <Link to="/timelines">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate leading-tight">
              {timeline.name}
            </h1>
            {timeline.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {timeline.description}
              </p>
            )}
          </div>
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

      {/* "Save to My Timelines" info dialog (shown when clicking Save) */}
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
  const groupMap = Object.fromEntries(groups.map((g) => [g.id, g]));

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        No events in this timeline.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="py-2.5 px-3 text-left font-semibold text-muted-foreground">Event</th>
            <th className="py-2.5 px-3 text-left font-semibold text-muted-foreground">Group</th>
            <th className="py-2.5 px-3 text-left font-semibold text-muted-foreground">Start</th>
            <th className="py-2.5 px-3 text-left font-semibold text-muted-foreground">End</th>
            <th className="py-2.5 px-3 text-center font-semibold text-muted-foreground">Notes</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, idx) => {
            const group = e.groupId ? groupMap[e.groupId] : null;
            const hasNotes = !!e.notesMarkdown?.trim() || e.resources.length > 0;
            return (
              <tr
                key={e.id}
                className={`border-b border-border/60 last:border-0 ${
                  idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                } hover:bg-muted/40 transition-colors`}
              >
                <td className="py-2 px-3 font-medium text-foreground">{e.name}</td>
                <td className="py-2 px-3">
                  {group ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: group.color + "22",
                        border: `1px solid ${group.color}55`,
                        color: group.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: group.color }}
                      />
                      {group.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </td>
                <td className="py-2 px-3 text-muted-foreground">
                  {formatDate(e.start)}
                </td>
                <td className="py-2 px-3 text-muted-foreground">
                  {formatDate(e.end)}
                </td>
                <td className="py-2 px-3 text-center">
                  {hasNotes ? (
                    <button
                      type="button"
                      onClick={() => onOpenNotes(e.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      title="View notes & resources"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      View
                    </button>
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d: { year: number; month?: number; day?: number }): string {
  const y = Math.abs(d.year);
  const era = d.year < 0 ? " BC" : " AD";
  const parts: string[] = [String(y)];
  if (d.month) parts.push(String(d.month).padStart(2, "0"));
  if (d.day) parts.push(String(d.day).padStart(2, "0"));
  return parts.join("-") + era;
}
