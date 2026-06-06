import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/chronicle/storage";
import {
  GROUP_COLORS,
  Group,
  SortKey,
  Timeline,
  TimelineEvent,
  newId,
  EventDate,
} from "@/lib/chronicle/types";
import { sortEvents } from "@/lib/chronicle/sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventTable } from "@/components/chronicle/EventTable";
import { TimelineGraph } from "@/components/chronicle/TimelineGraph";
import { EventModal, EventDetailsModal } from "@/components/chronicle/EventModal";
import { ArrowLeft, FolderPlus, Group as GroupIcon, Trash2, Ungroup, Plus, Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/timeline/$id")({
  head: ({ params }) => ({
    meta: [
      { title: "Timeline — HistoryTimeline" },
      {
        name: "description",
        content: "Edit an interactive historical timeline in HistoryTimeline.",
      },
      { property: "og:title", content: "Timeline — HistoryTimeline" },
      { property: "og:description", content: "Edit a historical timeline in HistoryTimeline." },
      { property: "og:url", content: `/timeline/${params.id}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `/timeline/${params.id}` }],
  }),
  component: TimelineDetail,
});

function TimelineDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [sort, setSort] = useState<SortKey>("start-asc");
  const [singleRowPerGroup, setSingleRow] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  // Modal States
  const [openEventId, setOpenEventId] = useState<string | null>(null);     // Notes & Resources Modal
  const [editEventId, setEditEventId] = useState<string | null>(null);     // Event Details Modal (Edit)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);             // Event Details Modal (Add)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);             // Timeline Info Dialog

  // View States
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");

  useEffect(() => {
    const t = storage.get(id);
    if (!t) {
      toast.error("Timeline not found");
      navigate({ to: "/timelines" });
      return;
    }
    setTimeline(t);
  }, [id, navigate]);

  const sorted = useMemo(
    () => (timeline ? sortEvents(timeline.events, timeline.groups, sort) : []),
    [timeline, sort],
  );

  if (!timeline) return null;

  const persist = (next: Timeline) => {
    setTimeline(next);
    storage.save(next);
  };

  const toggleSel = (eid: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(eid) ? n.delete(eid) : n.add(eid);
      return n;
    });
  };

  const updateEvent = (eid: string, patch: Partial<TimelineEvent>) =>
    persist({ ...timeline, events: timeline.events.map((e) => (e.id === eid ? { ...e, ...patch } : e)) });

  const addEvent = (e: TimelineEvent) =>
    persist({ ...timeline, events: [...timeline.events, e] });

  const deleteEvent = (eid: string) =>
    persist({ ...timeline, events: timeline.events.filter((e) => e.id !== eid) });

  const doGroup = () => {
    if (!groupName.trim() || selected.size === 0) return;
    const usedColors = new Set(timeline.groups.map((g) => g.color));
    const color = GROUP_COLORS.find((c) => !usedColors.has(c)) ?? GROUP_COLORS[timeline.groups.length % GROUP_COLORS.length];
    const group: Group = { id: newId(), name: groupName.trim(), color };
    persist({
      ...timeline,
      groups: [...timeline.groups, group],
      events: timeline.events.map((e) => (selected.has(e.id) ? { ...e, groupId: group.id } : e)),
    });
    setSelected(new Set());
    setGroupName("");
    setGroupDialogOpen(false);
    toast.success(`Grouped ${selected.size} event(s) as "${group.name}"`);
  };

  const doUngroup = () => {
    if (selected.size === 0) return;
    persist({
      ...timeline,
      events: timeline.events.map((e) => (selected.has(e.id) ? { ...e, groupId: null } : e)),
    });
    setSelected(new Set());
  };

  const openEvent = timeline.events.find((e) => e.id === openEventId) ?? null;
  const editEvent = timeline.events.find((e) => e.id === editEventId) ?? null;

  // New Save Handlers
  const handleSaveNewEvent = (data: {
    name: string;
    start: EventDate;
    end: EventDate;
    groupId: string | null;
  }) => {
    const newEvt: TimelineEvent = {
      id: newId(),
      name: data.name,
      start: data.start,
      end: data.end,
      groupId: data.groupId,
      notesMarkdown: "",
      resources: [],
      iconResourceId: null,
    };
    addEvent(newEvt);
    toast.success("Event added successfully");
  };

  const handleSaveAndAddAnotherNewEvent = (data: {
    name: string;
    start: EventDate;
    end: EventDate;
    groupId: string | null;
  }) => {
    const newEvt: TimelineEvent = {
      id: newId(),
      name: data.name,
      start: data.start,
      end: data.end,
      groupId: data.groupId,
      notesMarkdown: "",
      resources: [],
      iconResourceId: null,
    };
    addEvent(newEvt);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* Header Area with back button containing Timeline Name and Info button */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
        >
          <Info className="h-4.5 w-4.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Toolbar */}
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

        <Button
          size="sm"
          variant="outline"
          disabled={selected.size === 0}
          onClick={() => setGroupDialogOpen(true)}
        >
          <FolderPlus className="mr-2 h-4 w-4" /> Group ({selected.size})
        </Button>
        <Button size="sm" variant="outline" disabled={selected.size === 0} onClick={doUngroup}>
          <Ungroup className="mr-2 h-4 w-4" /> Ungroup
        </Button>

        {viewMode === "graph" && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1">
            <Switch id="single-row" checked={singleRowPerGroup} onCheckedChange={setSingleRow} />
            <Label htmlFor="single-row" className="text-xs text-muted-foreground">
              Show group on single row
            </Label>
          </div>
        )}

        {/* View Toggle & Add Event on the right */}
        <div className="ml-auto flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
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

          {/* Add Event Button */}
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      {/* Graph Section */}
      {viewMode === "graph" && (
        <section className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300" aria-label="Timeline graph">
          <TimelineGraph
            events={timeline.events}
            groups={timeline.groups}
            singleRowPerGroup={singleRowPerGroup}
            onEventClick={(eid) => setOpenEventId(eid)}
          />
        </section>
      )}

      {/* Table Section */}
      {viewMode === "table" && (
        <section className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300" aria-label="Events table">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground">Events ({sorted.length})</h3>
          </div>
          <EventTable
            events={sorted}
            groups={timeline.groups}
            selected={selected}
            onToggleSelected={toggleSel}
            onToggleSelectAll={(all) =>
              setSelected(all ? new Set(timeline.events.map((e) => e.id)) : new Set())
            }
            onDelete={deleteEvent}
            onEditDetails={(eid) => setEditEventId(eid)}
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

      {/* Notes & Resources Modal */}
      <EventModal
        open={!!openEvent}
        event={openEvent}
        onClose={() => setOpenEventId(null)}
        onSave={(patch) => openEvent && updateEvent(openEvent.id, patch)}
      />

      {/* Edit Details Modal */}
      <EventDetailsModal
        open={!!editEvent && !isAddModalOpen}
        event={editEvent}
        isAdd={false}
        groups={timeline.groups}
        onClose={() => setEditEventId(null)}
        onSave={(data) => {
          if (editEventId) {
            updateEvent(editEventId, data);
            toast.success("Event details updated successfully");
          }
        }}
      />

      {/* Add Details Modal */}
      <EventDetailsModal
        open={isAddModalOpen}
        event={null}
        isAdd={true}
        groups={timeline.groups}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewEvent}
        onSaveAndAddAnother={handleSaveAndAddAnotherNewEvent}
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
                onChange={(e) => persist({ ...timeline, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tl-desc">Description</Label>
              <textarea
                id="tl-desc"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={timeline.description}
                placeholder="Add a description…"
                onChange={(e) => persist({ ...timeline, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create group</DialogTitle>
          </DialogHeader>
          <Label htmlFor="grpname" className="text-sm">Group name</Label>
          <Input
            id="grpname"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Mauryan Empire"
            onKeyDown={(e) => { if (e.key === "Enter") doGroup(); }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
            <Button onClick={doGroup} disabled={!groupName.trim()}>
              <GroupIcon className="mr-2 h-4 w-4" /> Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
