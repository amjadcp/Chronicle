import { Group, TimelineEvent, durationYears, formatEventDate } from "@/lib/chronicle/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, FileText } from "lucide-react";

interface Props {
  events: TimelineEvent[];
  groups: Group[];
  selected: Set<string>;
  onToggleSelected: (id: string) => void;
  onToggleSelectAll: (all: boolean) => void;
  onDelete: (id: string) => void;
  onEditDetails: (id: string) => void;
  onOpenNotes: (id: string) => void;
}

export function EventTable(props: Props) {
  const {
    events,
    groups,
    selected,
    onToggleSelected,
    onToggleSelectAll,
    onDelete,
    onEditDetails,
    onOpenNotes,
  } = props;

  const allSelected = events.length > 0 && events.every((e) => selected.has(e.id));

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-surface text-xs uppercase text-muted-foreground">
          <tr>
            <th className="w-10 px-3 py-2 text-left">
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                onCheckedChange={(v) => onToggleSelectAll(Boolean(v))}
              />
            </th>
            <th className="px-3 py-2 text-left font-medium">Event</th>
            <th className="px-3 py-2 text-left font-medium">Start</th>
            <th className="px-3 py-2 text-left font-medium">End</th>
            <th className="px-3 py-2 text-left font-medium">Duration</th>
            <th className="px-3 py-2 text-left font-medium">Group</th>
            <th className="w-32 px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                No events found. Click "Add Event" to create one.
              </td>
            </tr>
          ) : (
            events.map((e) => (
              <EventRow
                key={e.id}
                event={e}
                groups={groups}
                selected={selected.has(e.id)}
                onToggleSelected={() => onToggleSelected(e.id)}
                onDelete={() => onDelete(e.id)}
                onEditDetails={() => onEditDetails(e.id)}
                onOpenNotes={() => onOpenNotes(e.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function EventRow({
  event,
  groups,
  selected,
  onToggleSelected,
  onDelete,
  onEditDetails,
  onOpenNotes,
}: {
  event: TimelineEvent;
  groups: Group[];
  selected: boolean;
  onToggleSelected: () => void;
  onDelete: () => void;
  onEditDetails: () => void;
  onOpenNotes: () => void;
}) {
  const dur = durationYears(event.start, event.end);
  const group = groups.find((g) => g.id === event.groupId);

  return (
    <tr className="border-t border-border align-middle hover:bg-surface/20 transition-colors">
      <td className="px-3 py-2">
        <Checkbox checked={selected} onCheckedChange={onToggleSelected} aria-label="Select row" />
      </td>
      <td className="min-w-[12rem] px-3 py-3 font-medium text-foreground">{event.name}</td>
      <td className="px-3 py-3 text-foreground whitespace-nowrap">
        {formatEventDate(event.start)}
      </td>
      <td className="px-3 py-3 text-foreground whitespace-nowrap">{formatEventDate(event.end)}</td>
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
            onClick={onOpenNotes}
            title="Notes & Resources"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Edit event details"
            onClick={onEditDetails}
            title="Edit Details"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete event"
            onClick={onDelete}
            title="Delete Event"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
