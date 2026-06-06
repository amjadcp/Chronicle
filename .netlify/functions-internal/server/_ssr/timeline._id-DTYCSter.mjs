import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as storage } from "./storage-D99ZjwgK.mjs";
import { n as newId, G as GROUP_COLORS, d as durationYears, f as formatEventDate } from "./types-CWdzg89e.mjs";
import { s as sortEvents, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as Switch, T as TimelineGraph, E as EventModal, f as EventDetailsModal } from "./EventModal-BF65JCuR.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { L as Label, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, e as DialogFooter } from "./dialog-BpPGN8RI.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$1 } from "./router-UcaPU2uq.mjs";
import "../_libs/tiptap__starter-kit.mjs";
import "../_libs/tiptap__extension-underline.mjs";
import "../_libs/tiptap__extension-link.mjs";
import "../_libs/marked.mjs";
import "../_libs/turndown.mjs";
import { o as ArrowLeft, I as Info, p as FolderPlus, q as Ungroup, P as Plus, r as Group, g as Check, m as FileText, s as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "./tabs-c5KQ8wMi.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/tiptap__react.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/tiptap__core.mjs";
import "../_libs/prosemirror-transform.mjs";
import "../_libs/prosemirror-model.mjs";
import "../_libs/orderedmap.mjs";
import "../_libs/prosemirror-commands.mjs";
import "../_libs/prosemirror-state.mjs";
import "../_libs/prosemirror-schema-list.mjs";
import "../_libs/prosemirror-view.mjs";
import "../_libs/prosemirror-keymap.mjs";
import "../_libs/w3c-keyname.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/react-markdown.mjs";
import "../_libs/devlop.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tiptap__extension-blockquote.mjs";
import "../_libs/tiptap__extension-bold.mjs";
import "../_libs/tiptap__extension-code.mjs";
import "../_libs/tiptap__extension-code-block.mjs";
import "../_libs/tiptap__extension-document.mjs";
import "../_libs/tiptap__extension-hard-break.mjs";
import "../_libs/tiptap__extension-heading.mjs";
import "../_libs/@tiptap/extension-horizontal-rule+[...].mjs";
import "../_libs/tiptap__extension-italic.mjs";
import "../_libs/tiptap__extension-list.mjs";
import "../_libs/tiptap__extension-paragraph.mjs";
import "../_libs/tiptap__extension-strike.mjs";
import "../_libs/tiptap__extension-text.mjs";
import "../_libs/tiptap__extensions.mjs";
import "../_libs/prosemirror-dropcursor.mjs";
import "../_libs/prosemirror-gapcursor.mjs";
import "../_libs/prosemirror-history.mjs";
import "../_libs/rope-sequence.mjs";
import "../_libs/linkifyjs.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function EventTable(props) {
  const { events, groups, selected, onToggleSelected, onToggleSelectAll, onDelete, onEditDetails, onOpenNotes } = props;
  const allSelected = events.length > 0 && events.every((e) => selected.has(e.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-3 py-2 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Checkbox,
        {
          "aria-label": "Select all",
          checked: allSelected,
          onCheckedChange: (v) => onToggleSelectAll(Boolean(v))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Start" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "End" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Duration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Group" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-32 px-3 py-2 text-right font-medium", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-3 py-8 text-center text-muted-foreground", children: 'No events found. Click "Add Event" to create one.' }) }) : events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      EventRow,
      {
        event: e,
        groups,
        selected: selected.has(e.id),
        onToggleSelected: () => onToggleSelected(e.id),
        onDelete: () => onDelete(e.id),
        onEditDetails: () => onEditDetails(e.id),
        onOpenNotes: () => onOpenNotes(e.id)
      },
      e.id
    )) })
  ] }) });
}
function EventRow({
  event,
  groups,
  selected,
  onToggleSelected,
  onDelete,
  onEditDetails,
  onOpenNotes
}) {
  const dur = durationYears(event.start, event.end);
  const group = groups.find((g) => g.id === event.groupId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border align-middle hover:bg-surface/20 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected, onCheckedChange: onToggleSelected, "aria-label": "Select row" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "min-w-[12rem] px-3 py-3 font-medium text-foreground", children: event.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-foreground whitespace-nowrap", children: formatEventDate(event.start) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-foreground whitespace-nowrap", children: formatEventDate(event.end) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 text-muted-foreground whitespace-nowrap", children: [
      dur.toFixed(dur < 10 ? 1 : 0),
      " yr"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: group ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: { background: group.color } }),
      group.name
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", "aria-label": "Open notes & resources", onClick: onOpenNotes, title: "Notes & Resources", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", "aria-label": "Edit event details", onClick: onEditDetails, title: "Edit Details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", "aria-label": "Delete event", onClick: onDelete, title: "Delete Event", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
    ] }) })
  ] });
}
function TimelineDetail() {
  const {
    id
  } = Route$1.useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = reactExports.useState(null);
  const [sort, setSort] = reactExports.useState("start-asc");
  const [singleRowPerGroup, setSingleRow] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [groupDialogOpen, setGroupDialogOpen] = reactExports.useState(false);
  const [groupName, setGroupName] = reactExports.useState("");
  const [openEventId, setOpenEventId] = reactExports.useState(null);
  const [editEventId, setEditEventId] = reactExports.useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = reactExports.useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = reactExports.useState(false);
  const [viewMode, setViewMode] = reactExports.useState("graph");
  reactExports.useEffect(() => {
    const t = storage.get(id);
    if (!t) {
      toast.error("Timeline not found");
      navigate({
        to: "/timelines"
      });
      return;
    }
    setTimeline(t);
  }, [id, navigate]);
  const sorted = reactExports.useMemo(() => timeline ? sortEvents(timeline.events, timeline.groups, sort) : [], [timeline, sort]);
  if (!timeline) return null;
  const persist = (next) => {
    setTimeline(next);
    storage.save(next);
  };
  const toggleSel = (eid) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(eid) ? n.delete(eid) : n.add(eid);
      return n;
    });
  };
  const updateEvent = (eid, patch) => persist({
    ...timeline,
    events: timeline.events.map((e) => e.id === eid ? {
      ...e,
      ...patch
    } : e)
  });
  const addEvent = (e) => persist({
    ...timeline,
    events: [...timeline.events, e]
  });
  const deleteEvent = (eid) => persist({
    ...timeline,
    events: timeline.events.filter((e) => e.id !== eid)
  });
  const doGroup = () => {
    if (!groupName.trim() || selected.size === 0) return;
    const usedColors = new Set(timeline.groups.map((g) => g.color));
    const color = GROUP_COLORS.find((c) => !usedColors.has(c)) ?? GROUP_COLORS[timeline.groups.length % GROUP_COLORS.length];
    const group = {
      id: newId(),
      name: groupName.trim(),
      color
    };
    persist({
      ...timeline,
      groups: [...timeline.groups, group],
      events: timeline.events.map((e) => selected.has(e.id) ? {
        ...e,
        groupId: group.id
      } : e)
    });
    setSelected(/* @__PURE__ */ new Set());
    setGroupName("");
    setGroupDialogOpen(false);
    toast.success(`Grouped ${selected.size} event(s) as "${group.name}"`);
  };
  const doUngroup = () => {
    if (selected.size === 0) return;
    persist({
      ...timeline,
      events: timeline.events.map((e) => selected.has(e.id) ? {
        ...e,
        groupId: null
      } : e)
    });
    setSelected(/* @__PURE__ */ new Set());
  };
  const openEvent = timeline.events.find((e) => e.id === openEventId) ?? null;
  const editEvent = timeline.events.find((e) => e.id === editEventId) ?? null;
  const handleSaveNewEvent = (data) => {
    const newEvt = {
      id: newId(),
      name: data.name,
      start: data.start,
      end: data.end,
      groupId: data.groupId,
      notesMarkdown: "",
      resources: [],
      iconResourceId: null
    };
    addEvent(newEvt);
    toast.success("Event added successfully");
  };
  const handleSaveAndAddAnotherNewEvent = (data) => {
    const newEvt = {
      id: newId(),
      name: data.name,
      start: data.start,
      end: data.end,
      groupId: data.groupId,
      notesMarkdown: "",
      resources: [],
      iconResourceId: null
    };
    addEvent(newEvt);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "text-muted-foreground font-semibold text-lg hover:bg-transparent -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/timelines", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }),
        " ",
        timeline.name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setInfoDialogOpen(true), title: "Timeline Info", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4.5 w-4.5 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sort, onValueChange: (v) => setSort(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "start-asc", children: "Start ↑" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "start-desc", children: "Start ↓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duration-asc", children: "Duration ↑" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duration-desc", children: "Duration ↓" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: selected.size === 0, onClick: () => setGroupDialogOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "mr-2 h-4 w-4" }),
        " Group (",
        selected.size,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: selected.size === 0, onClick: doUngroup, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ungroup, { className: "mr-2 h-4 w-4" }),
        " Ungroup"
      ] }),
      viewMode === "graph" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "single-row", checked: singleRowPerGroup, onCheckedChange: setSingleRow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "single-row", className: "text-xs text-muted-foreground", children: "Show group on single row" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-md border border-border bg-background p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setViewMode("graph"), className: `px-3 py-1 text-xs font-semibold rounded-sm transition-all ${viewMode === "graph" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "Graph" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setViewMode("table"), className: `px-3 py-1 text-xs font-semibold rounded-sm transition-all ${viewMode === "table" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`, children: "Table" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setIsAddModalOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
          " Add Event"
        ] })
      ] })
    ] }),
    viewMode === "graph" && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300", "aria-label": "Timeline graph", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineGraph, { events: timeline.events, groups: timeline.groups, singleRowPerGroup, onEventClick: (eid) => setOpenEventId(eid) }) }),
    viewMode === "table" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300", "aria-label": "Events table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-foreground", children: [
        "Events (",
        sorted.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EventTable, { events: sorted, groups: timeline.groups, selected, onToggleSelected: toggleSel, onToggleSelectAll: (all) => setSelected(all ? new Set(timeline.events.map((e) => e.id)) : /* @__PURE__ */ new Set()), onDelete: deleteEvent, onEditDetails: (eid) => setEditEventId(eid), onOpenNotes: (eid) => setOpenEventId(eid) }),
      timeline.groups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Groups:" }),
        timeline.groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
            background: g.color
          } }),
          g.name
        ] }, g.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventModal, { open: !!openEvent, event: openEvent, onClose: () => setOpenEventId(null), onSave: (patch) => openEvent && updateEvent(openEvent.id, patch) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailsModal, { open: !!editEvent && !isAddModalOpen, event: editEvent, isAdd: false, groups: timeline.groups, onClose: () => setEditEventId(null), onSave: (data) => {
      if (editEventId) {
        updateEvent(editEventId, data);
        toast.success("Event details updated successfully");
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailsModal, { open: isAddModalOpen, event: null, isAdd: true, groups: timeline.groups, onClose: () => setIsAddModalOpen(false), onSave: handleSaveNewEvent, onSaveAndAddAnother: handleSaveAndAddAnotherNewEvent }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: infoDialogOpen, onOpenChange: setInfoDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Timeline Settings" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tl-name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "tl-name", value: timeline.name, onChange: (e) => persist({
            ...timeline,
            name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tl-desc", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "tl-desc", className: "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", value: timeline.description, placeholder: "Add a description…", onChange: (e) => persist({
            ...timeline,
            description: e.target.value
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setInfoDialogOpen(false), children: "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: groupDialogOpen, onOpenChange: setGroupDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create group" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "grpname", className: "text-sm", children: "Group name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "grpname", value: groupName, onChange: (e) => setGroupName(e.target.value), placeholder: "e.g. Mauryan Empire", onKeyDown: (e) => {
        if (e.key === "Enter") doGroup();
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setGroupDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: doGroup, disabled: !groupName.trim(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { className: "mr-2 h-4 w-4" }),
          " Create"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  TimelineDetail as component
};
