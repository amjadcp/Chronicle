import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Group,
  Resource,
  ResourceType,
  TimelineEvent,
  newId,
  EventDate,
  Era,
  eraOf,
  applyEra,
} from "@/lib/chronicle/types";
import { RichEditor } from "./RichEditor";
import {
  ImageIcon,
  Link as LinkIcon,
  Star,
  Trash2,
  Youtube,
  Plus,
  ExternalLink,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ==========================================
// 1. NOTES & RESOURCES MODAL (EventModal)
// ==========================================
interface EventModalProps {
  open: boolean;
  event: TimelineEvent | null;
  onClose: () => void;
  onSave: (patch: Partial<TimelineEvent>) => void;
  /** When true, all editing controls are hidden — notes are rendered as markdown, resources as links only */
  readOnly?: boolean;
}

const ICONS: Record<ResourceType, typeof LinkIcon> = {
  website: LinkIcon,
  image: ImageIcon,
  youtube: Youtube,
};

export function EventModal({ open, event, onClose, onSave, readOnly = false }: EventModalProps) {
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [iconResourceId, setIconResourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("notes");

  // Add Link form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<ResourceType>("website");

  // Sync state when open state or event changes
  useEffect(() => {
    if (open && event) {
      setNotes(event.notesMarkdown || "");
      setResources(event.resources || []);
      setIconResourceId(event.iconResourceId || null);
      setActiveTab("notes");
      // Reset form state
      setShowAddForm(false);
      setNewUrl("");
      setNewLabel("");
      setNewType("website");
    }
  }, [open, event]);

  if (!event) return null;

  const handleNotesChange = (val: string) => {
    setNotes(val);
  };

  const handleAddResource = () => {
    if (!newUrl.trim()) return;
    const nextResources = [
      ...resources,
      {
        id: newId(),
        type: newType,
        url: newUrl.trim(),
        label: newLabel.trim(),
      },
    ];
    setResources(nextResources);
    onSave({ resources: nextResources });

    setNewUrl("");
    setNewLabel("");
    setNewType("website");
    setShowAddForm(false);
    toast.success("Resource link added");
  };

  const removeResource = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this resource link?")) return;
    const nextResources = resources.filter((x) => x.id !== id);
    setResources(nextResources);
    let nextIconId = iconResourceId;
    if (iconResourceId === id) {
      nextIconId = null;
      setIconResourceId(null);
    }
    onSave({ resources: nextResources, iconResourceId: nextIconId });
  };

  const handleToggleIcon = (rid: string) => {
    const nextIconId = iconResourceId === rid ? null : rid;
    setIconResourceId(nextIconId);
    onSave({ iconResourceId: nextIconId });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="truncate flex items-center gap-2">
            Notes & Resources: {event.name || "Event"}
            {readOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <Lock className="h-2.5 w-2.5" /> Read-only
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="notes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Resources ({resources.length})
            </TabsTrigger>
          </TabsList>

          {/* Notes tab */}
          <TabsContent value="notes" className="mt-4 focus-visible:outline-none">
            {readOnly ? (
              notes.trim() ? (
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-border/60 bg-muted/20 px-4 py-3">
                  <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
              ) : (
                <p className="rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground">
                  No notes for this event.
                </p>
              )
            ) : (
              <RichEditor valueMarkdown={notes} onChangeMarkdown={handleNotesChange} />
            )}
          </TabsContent>

          {/* Resources tab */}
          <TabsContent value="resources" className="mt-4 focus-visible:outline-none space-y-4">
            <div className="space-y-2.5">
              {resources.length === 0 && (
                <p className="rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground">
                  {readOnly
                    ? "No resources attached to this event."
                    : 'No resources yet. Click "Add Link" to attach a website, image, or YouTube link.'}
                </p>
              )}
              {resources.map((r) => {
                const Icon = ICONS[r.type];
                const isIcon = iconResourceId === r.id;
                return (
                  <div
                    key={r.id}
                    className="relative flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-surface/30"
                  >
                    <a
                      href={r.url.startsWith("http") ? r.url : `https://${r.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center gap-3 min-w-0 mr-4"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          r.type === "youtube"
                            ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                            : r.type === "image"
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-foreground truncate hover:underline">
                          {r.label || r.url}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{r.url}</div>
                      </div>
                    </a>

                    {/* Edit actions — hidden in read-only mode */}
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant={isIcon ? "default" : "outline"}
                          className="h-8 w-8"
                          title={isIcon ? "Selected as icon" : "Mark as icon"}
                          onClick={() => handleToggleIcon(r.id)}
                        >
                          <Star className={`h-4 w-4 ${isIcon ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-destructive/20 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Remove resource"
                          onClick={() => removeResource(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add link form — hidden in read-only mode */}
            {!readOnly &&
              (showAddForm ? (
                <div className="space-y-3 rounded-lg border border-border bg-surface/40 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-xs font-semibold text-foreground">Add new resource link</div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="res-type" className="text-[11px] text-muted-foreground">
                        Type
                      </Label>
                      <Select value={newType} onValueChange={(v) => setNewType(v as ResourceType)}>
                        <SelectTrigger id="res-type" className="h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Link</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="res-label" className="text-[11px] text-muted-foreground">
                        Title (Optional)
                      </Label>
                      <Input
                        id="res-label"
                        placeholder="e.g. Wikipedia page"
                        className="h-8 text-xs bg-background"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="res-url" className="text-[11px] text-muted-foreground">
                        URL *
                      </Label>
                      <Input
                        id="res-url"
                        placeholder="e.g. https://wikipedia.org/..."
                        className="h-8 text-xs bg-background"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleAddResource}
                      disabled={!newUrl.trim()}
                    >
                      Add Link
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Link / Resource
                </Button>
              ))}
          </TabsContent>
        </Tabs>

        {/* Save button — hidden in read-only mode */}
        {!readOnly && activeTab === "notes" && (
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave({ notesMarkdown: notes });
                onClose();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        )}

        {/* Read-only close button */}
        {readOnly && (
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// 2. EVENT DETAILS MODAL (EventDetailsModal)
// ==========================================
interface EventDetailsModalProps {
  open: boolean;
  event: TimelineEvent | null;
  isAdd?: boolean;
  groups: Group[];
  onClose: () => void;
  onSave: (data: {
    name: string;
    start: EventDate;
    end: EventDate;
    groupId: string | null;
  }) => void;
  onSaveAndAddAnother?: (data: {
    name: string;
    start: EventDate;
    end: EventDate;
    groupId: string | null;
  }) => void;
}

export function EventDetailsModal({
  open,
  event,
  isAdd = false,
  groups,
  onClose,
  onSave,
  onSaveAndAddAnother,
}: EventDetailsModalProps) {
  const [name, setName] = useState("");
  const [start, setStart] = useState<EventDate>({ year: 0 });
  const [end, setEnd] = useState<EventDate>({ year: 0 });
  const [groupId, setGroupId] = useState<string | null>(null);

  // Sync state when open state, event or mode changes
  useEffect(() => {
    if (open) {
      if (event && !isAdd) {
        setName(event.name || "");
        setStart(event.start || { year: 0 });
        setEnd(event.end || { year: 0 });
        setGroupId(event.groupId || null);
      } else {
        setName("");
        setStart({ year: 0 });
        setEnd({ year: 0 });
        setGroupId(null);
      }
    }
  }, [open, event, isAdd]);

  const isValid = name.trim().length > 0 && start.year !== 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      name: name.trim(),
      start,
      end: end.year ? end : start,
      groupId,
    });
    onClose();
  };

  const handleSaveAndAddAnother = () => {
    if (!isValid || !onSaveAndAddAnother) return;
    onSaveAndAddAnother({
      name: name.trim(),
      start,
      end: end.year ? end : start,
      groupId,
    });
    toast.success(`Added event "${name.trim()}"`);

    // Reset fields for a clean form, preserving group and era
    setName("");
    const startEra = start.year < 0 || Object.is(start.year, -0) ? "BC" : "AD";
    const endEra = end.year < 0 || Object.is(end.year, -0) ? "BC" : "AD";
    setStart({ year: startEra === "BC" ? -0 : 0 });
    setEnd({ year: endEra === "BC" ? -0 : 0 });
    // groupId is intentionally not reset
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAdd
              ? "Add New Event"
              : event
                ? `Edit Event Details: ${event.name}`
                : "Edit Event Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="det-name">Event Name *</Label>
            <Input
              id="det-name"
              placeholder="e.g. Declaration of Independence"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="det-group">Group</Label>
            <Select
              value={groupId ?? "__none"}
              onValueChange={(v) => setGroupId(v === "__none" ? null : v)}
            >
              <SelectTrigger id="det-group" className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
                      {g.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DateFields
            label={
              <>
                <span>Start Date *</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  (Year is required, Month/Day optional)
                </span>
              </>
            }
            value={start}
            onChange={setStart}
          />

          <DateFields
            label={
              <>
                <span>End Date (Optional)</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  (Year is required, Month/Day optional)
                </span>
              </>
            }
            value={end}
            onChange={setEnd}
          />
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isAdd && onSaveAndAddAnother && (
            <Button variant="secondary" onClick={handleSaveAndAddAnother} disabled={!isValid}>
              <Plus className="mr-2 h-4 w-4" /> Save & Add Another
            </Button>
          )}
          <Button onClick={handleSave} disabled={!isValid}>
            {isAdd ? "Add Event" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DateFields({
  label,
  value,
  onChange,
}: {
  label: React.ReactNode;
  value: EventDate;
  onChange: (d: EventDate) => void;
}) {
  const isNegativeZero = Object.is(value.year, -0);
  const era: Era = value.year < 0 || isNegativeZero ? "BC" : "AD";
  const yearAbs = Math.abs(value.year || 0) || "";

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium flex flex-wrap items-center gap-1.5">{label}</Label>
      <div className="flex items-center gap-1.5">
        <Input
          className="flex-1 min-w-[70px] text-sm h-9"
          type="text"
          inputMode="numeric"
          value={yearAbs}
          placeholder="Year"
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            const n = val ? Number(val) : 0;
            onChange({ ...value, year: era === "BC" ? -n : n });
          }}
        />
        <Input
          className="w-16 text-sm text-center h-9"
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={value.month ?? ""}
          placeholder="MM"
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            onChange({ ...value, month: val ? Math.min(12, Math.max(1, Number(val))) : undefined });
          }}
        />
        <Input
          className="w-16 text-sm text-center h-9"
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={value.day ?? ""}
          placeholder="DD"
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            onChange({ ...value, day: val ? Math.min(31, Math.max(1, Number(val))) : undefined });
          }}
        />
        <Select
          value={era}
          onValueChange={(v) => {
            const n = Math.abs(value.year || 0);
            onChange({ ...value, year: v === "BC" ? -n : n });
          }}
        >
          <SelectTrigger className="w-20 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BC">BC</SelectItem>
            <SelectItem value="AD">AD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
