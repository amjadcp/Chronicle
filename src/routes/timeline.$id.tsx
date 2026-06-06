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
  formatEventDate,
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
import { Checkbox } from "@/components/ui/checkbox";
import { EventTable } from "@/components/chronicle/EventTable";
import { TimelineGraph } from "@/components/chronicle/TimelineGraph";
import { EventModal, EventDetailsModal } from "@/components/chronicle/EventModal";
import {
  ArrowLeft,
  FolderPlus,
  Group as GroupIcon,
  Trash2,
  Ungroup,
  Plus,
  Info,
  Pencil,
  Check,
  X,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

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
  const [openEventId, setOpenEventId] = useState<string | null>(null); // Notes & Resources Modal
  const [editEventId, setEditEventId] = useState<string | null>(null); // Event Details Modal (Edit)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Event Details Modal (Add)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false); // Timeline Info Dialog

  // Import Dialog States
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [sourceTimelineId, setSourceTimelineId] = useState<string | null>(null);
  const [selectedSourceEventIds, setSelectedSourceEventIds] = useState<Set<string>>(new Set());
  const [importGroups, setImportGroups] = useState(true);
  const [importSearchQuery, setImportSearchQuery] = useState("");

  // View States
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");

  useEffect(() => {
    trackEvent("view_mode_change", { timeline_id: id, mode: viewMode });
  }, [viewMode, id]);

  // Name Inline Edit States
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const handleSaveName = () => {
    if (!tempName.trim()) {
      toast.error("Timeline name cannot be empty");
      return;
    }
    persist({ ...timeline, name: tempName.trim() });
    trackEvent("timeline_rename", { timeline_id: id, new_name: tempName.trim() });
    setIsEditingName(false);
    toast.success("Timeline renamed successfully");
  };

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

  const otherTimelines = useMemo(() => {
    if (!timeline) return [];
    return storage.list().filter((t) => t.id !== timeline.id);
  }, [timeline]);

  const selectedSourceTimeline = useMemo(() => {
    return otherTimelines.find((t) => t.id === sourceTimelineId) ?? null;
  }, [otherTimelines, sourceTimelineId]);

  const filteredSourceEvents = useMemo(() => {
    if (!selectedSourceTimeline) return [];
    return selectedSourceTimeline.events.filter((e) =>
      e.name.toLowerCase().includes(importSearchQuery.toLowerCase()),
    );
  }, [selectedSourceTimeline, importSearchQuery]);

  if (!timeline) return null;

  const persist = (next: Timeline) => {
    setTimeline(next);
    storage.save(next);
  };

  const toggleSel = (eid: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(eid)) {
        n.delete(eid);
      } else {
        n.add(eid);
      }
      return n;
    });
  };

  const updateEvent = (eid: string, patch: Partial<TimelineEvent>) => {
    trackEvent("event_edit", {
      timeline_id: id,
      event_id: eid,
      updated_fields: Object.keys(patch),
    });
    persist({
      ...timeline,
      events: timeline.events.map((e) => (e.id === eid ? { ...e, ...patch } : e)),
    });
  };

  const addEvent = (e: TimelineEvent) => {
    trackEvent("event_create", { timeline_id: id, event_id: e.id, event_name: e.name });
    persist({ ...timeline, events: [...timeline.events, e] });
  };

  const deleteEvent = (eid: string) => {
    trackEvent("event_delete", { timeline_id: id, event_id: eid });
    persist({ ...timeline, events: timeline.events.filter((e) => e.id !== eid) });
  };

  const doGroup = () => {
    if (!groupName.trim() || selected.size === 0) return;
    const usedColors = new Set(timeline.groups.map((g) => g.color));
    const color =
      GROUP_COLORS.find((c) => !usedColors.has(c)) ??
      GROUP_COLORS[timeline.groups.length % GROUP_COLORS.length];
    const group: Group = { id: newId(), name: groupName.trim(), color };
    persist({
      ...timeline,
      groups: [...timeline.groups, group],
      events: timeline.events.map((e) => (selected.has(e.id) ? { ...e, groupId: group.id } : e)),
    });
    trackEvent("event_group", {
      timeline_id: id,
      group_name: groupName.trim(),
      grouped_events_count: selected.size,
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
    trackEvent("event_ungroup", {
      timeline_id: id,
      ungrouped_events_count: selected.size,
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
    color: string | null;
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
      color: data.color ?? null,
    };
    addEvent(newEvt);
    toast.success("Event added successfully");
  };

  const handleSaveAndAddAnotherNewEvent = (data: {
    name: string;
    start: EventDate;
    end: EventDate;
    groupId: string | null;
    color: string | null;
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
      color: data.color ?? null,
    };
    addEvent(newEvt);
  };

  const handleImportEvents = () => {
    if (!sourceTimelineId || !timeline) return;
    const sourceTimeline = storage.get(sourceTimelineId);
    if (!sourceTimeline) {
      toast.error("Source timeline not found");
      return;
    }

    const eventsToImport = sourceTimeline.events.filter((e) => selectedSourceEventIds.has(e.id));
    if (eventsToImport.length === 0) {
      toast.error("No events selected to import");
      return;
    }

    const groupMap: Record<string, string> = {};
    const nextGroups = [...timeline.groups];

    if (importGroups) {
      const referencedGroupIds = new Set<string>();
      eventsToImport.forEach((e) => {
        if (e.groupId) referencedGroupIds.add(e.groupId);
      });

      sourceTimeline.groups.forEach((sourceGroup) => {
        if (!referencedGroupIds.has(sourceGroup.id)) return;

        const existingGroup = nextGroups.find(
          (g) => g.name.toLowerCase().trim() === sourceGroup.name.toLowerCase().trim(),
        );

        if (existingGroup) {
          groupMap[sourceGroup.id] = existingGroup.id;
        } else {
          const newGroupId = newId();
          nextGroups.push({
            id: newGroupId,
            name: sourceGroup.name,
            color: sourceGroup.color,
          });
          groupMap[sourceGroup.id] = newGroupId;
        }
      });
    }

    const importedEvents: TimelineEvent[] = eventsToImport.map((e) => ({
      ...e,
      id: newId(),
      groupId: e.groupId && importGroups ? (groupMap[e.groupId] ?? null) : null,
      resources: e.resources ? e.resources.map((r) => ({ ...r, id: newId() })) : [],
    }));

    persist({
      ...timeline,
      groups: nextGroups,
      events: [...timeline.events, ...importedEvents],
    });

    trackEvent("events_import", {
      timeline_id: id,
      source_timeline_id: sourceTimelineId,
      imported_events_count: importedEvents.length,
      imported_groups: importGroups,
    });

    setImportDialogOpen(false);
    setSourceTimelineId(null);
    setSelectedSourceEventIds(new Set());
    setImportSearchQuery("");

    toast.success(
      `Successfully imported ${importedEvents.length} event(s)${
        importGroups && Object.keys(groupMap).length > 0
          ? ` and ${Object.keys(groupMap).length} group(s)`
          : ""
      }`,
    );
  };

  return (
    <div className="mx-auto max-w-[1400px] w-full px-6 py-6">
      {/* Header Area with back button, inline editable Timeline Name, and Info button */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-transparent -ml-2 shrink-0"
        >
          <Link to="/timelines">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                className="h-8 font-semibold text-lg max-w-[200px] sm:max-w-[300px] bg-background"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:text-green-700"
                onClick={handleSaveName}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => setIsEditingName(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-semibold text-lg text-foreground truncate max-w-[200px] sm:max-w-[350px]">
                {timeline.name}
              </h1>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  setTempName(timeline.name);
                  setIsEditingName(true);
                }}
                title="Edit timeline name"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>

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

          {/* Import Events Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setImportDialogOpen(true);
              setSourceTimelineId(null);
              setSelectedSourceEventIds(new Set());
              setImportSearchQuery("");
            }}
          >
            <FileUp className="mr-1.5 h-4 w-4" /> Import Events
          </Button>

          {/* Add Event Button */}
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      {/* Graph Section */}
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

      {/* Table Section */}
      {viewMode === "table" && (
        <section
          className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-label="Events table"
        >
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
          <Label htmlFor="grpname" className="text-sm">
            Group name
          </Label>
          <Input
            id="grpname"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. Mauryan Empire"
            onKeyDown={(e) => {
              if (e.key === "Enter") doGroup();
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={doGroup} disabled={!groupName.trim()}>
              <GroupIcon className="mr-2 h-4 w-4" /> Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Events Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Events</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Timeline Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="import-source-select">Source Timeline</Label>
              {otherTimelines.length === 0 ? (
                <div className="rounded-md border border-dashed border-border bg-surface p-6 text-center text-muted-foreground">
                  <Info className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-semibold">No other timelines found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create another timeline first to import events from it.
                  </p>
                </div>
              ) : (
                <Select
                  value={sourceTimelineId || ""}
                  onValueChange={(val) => {
                    setSourceTimelineId(val);
                    const selectedTl = otherTimelines.find((t) => t.id === val);
                    if (selectedTl) {
                      setSelectedSourceEventIds(new Set(selectedTl.events.map((e) => e.id)));
                    } else {
                      setSelectedSourceEventIds(new Set());
                    }
                    setImportSearchQuery("");
                  }}
                >
                  <SelectTrigger id="import-source-select" className="w-full bg-background">
                    <SelectValue placeholder="Choose a timeline to import from..." />
                  </SelectTrigger>
                  <SelectContent>
                    {otherTimelines.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.events.length} events)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Events Selection Checklist */}
            {selectedSourceTimeline && (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Select Events to Import</Label>
                    <span className="text-xs text-muted-foreground">
                      {selectedSourceEventIds.size} of {selectedSourceTimeline.events.length}{" "}
                      selected
                    </span>
                  </div>

                  <Input
                    placeholder="Filter events by name..."
                    value={importSearchQuery}
                    onChange={(e) => setImportSearchQuery(e.target.value)}
                    className="h-9 bg-background"
                  />

                  {filteredSourceEvents.length === 0 ? (
                    <div className="rounded-md border border-border bg-surface p-6 text-center text-xs text-muted-foreground">
                      No matching events found.
                    </div>
                  ) : (
                    <>
                      {/* Checkbox Checklist Panel */}
                      <div className="max-h-[220px] overflow-y-auto rounded-md border border-border bg-background p-2 space-y-1">
                        {filteredSourceEvents.map((e) => {
                          const isChecked = selectedSourceEventIds.has(e.id);
                          const grp = selectedSourceTimeline.groups.find((g) => g.id === e.groupId);
                          return (
                            <label
                              key={e.id}
                              className="flex items-start gap-2.5 rounded px-2.5 py-2 hover:bg-surface/50 transition-colors cursor-pointer select-none"
                            >
                              <Checkbox
                                id={`event-check-${e.id}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  setSelectedSourceEventIds((prev) => {
                                    const next = new Set(prev);
                                    if (checked) {
                                      next.add(e.id);
                                    } else {
                                      next.delete(e.id);
                                    }
                                    return next;
                                  });
                                }}
                              />
                              <div className="flex-1 min-w-0 text-xs">
                                <div className="font-semibold text-foreground truncate">
                                  {e.name}
                                </div>
                                <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                                  <span>{formatEventDate(e.start)}</span>
                                  <span>•</span>
                                  {grp && (
                                    <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.25 text-[10px] text-foreground border border-border">
                                      <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ background: grp.color }}
                                      />
                                      {grp.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Select All Filtered Toggle */}
                      <div className="flex items-center gap-2 px-1">
                        <Checkbox
                          id="select-all-filtered"
                          checked={
                            filteredSourceEvents.length > 0 &&
                            filteredSourceEvents.every((e) => selectedSourceEventIds.has(e.id))
                          }
                          onCheckedChange={(checked) => {
                            setSelectedSourceEventIds((prev) => {
                              const next = new Set(prev);
                              filteredSourceEvents.forEach((e) => {
                                if (checked) {
                                  next.add(e.id);
                                } else {
                                  next.delete(e.id);
                                }
                              });
                              return next;
                            });
                          }}
                        />
                        <Label
                          htmlFor="select-all-filtered"
                          className="text-xs text-muted-foreground cursor-pointer select-none"
                        >
                          Select All Filtered ({filteredSourceEvents.length})
                        </Label>
                      </div>
                    </>
                  )}
                </div>

                {/* Import Groups Switch */}
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <Switch
                    id="import-groups-switch"
                    checked={importGroups}
                    onCheckedChange={setImportGroups}
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="import-groups-switch"
                      className="text-xs font-semibold text-foreground cursor-pointer"
                    >
                      Import and Map Groups
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      Copy referenced color groups. Reuses existing groups if names match.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setSourceTimelineId(null);
                setSelectedSourceEventIds(new Set());
                setImportSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportEvents}
              disabled={!sourceTimelineId || selectedSourceEventIds.size === 0}
            >
              Import {selectedSourceEventIds.size > 0 ? `${selectedSourceEventIds.size} ` : ""}
              Event(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
