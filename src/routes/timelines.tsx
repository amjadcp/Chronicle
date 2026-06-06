import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storage, subscribeTimelines } from "@/lib/chronicle/storage";
import { fetchPrebuiltIndex, PREBUILT_BASE } from "@/lib/chronicle/prebuilt";

import { exportTimelineHtml } from "@/lib/chronicle/exportHtml";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Copy,
  Download,
  ExternalLink,
  FilePlus2,
  FileUp,
  Trash2,
  Users,
  Calendar as CalIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/timelines")({
  head: () => ({
    meta: [
      { title: "Timelines — HistoryTimeline" },
      {
        name: "description",
        content:
          "Browse prebuilt historical timelines from the community library or create your own interactive timeline.",
      },
      { property: "og:title", content: "Timelines — HistoryTimeline" },
      { property: "og:description", content: "Browse community timelines or create your own." },
      { property: "og:url", content: "/timelines" },
    ],
    links: [{ rel: "canonical", href: "/timelines" }],
  }),
  component: TimelinesPage,
});

function TimelinesPage() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [myTimelines, setMyTimelines] = useState<Timeline[]>([]);

  useEffect(() => {
    setMyTimelines(storage.list());
    return subscribeTimelines(() => setMyTimelines(storage.list()));
  }, []);

  const prebuilt = useQuery({
    queryKey: ["prebuilt-index"],
    queryFn: fetchPrebuiltIndex,
    staleTime: 5 * 60_000,
  });

  function handleCreate() {
    const t = storage.create("Untitled Timeline");
    navigate({ to: "/timeline/$id", params: { id: t.id } });
  }

  function handleExportJSONAndHTML(t: Timeline) {
    // 1. Export JSON
    try {
      const jsonBlob = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `${t.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export JSON file");
      return;
    }

    // 2. Export HTML
    try {
      const htmlContent = exportTimelineHtml(t);
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      const htmlLink = document.createElement("a");
      htmlLink.href = htmlUrl;
      htmlLink.download = `${t.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.html`;
      htmlLink.click();
      URL.revokeObjectURL(htmlUrl);

      toast.success(`Exported JSON & HTML for "${t.name}"`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export HTML file");
    }
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const t = storage.importJSON(String(reader.result));
        toast.success(`Imported "${t.name}"`);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Invalid file");
      }
    };
    reader.readAsText(file);
  }



  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Timelines</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse community timelines or build your own.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            <FileUp className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
          <Button onClick={handleCreate}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Timeline
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mine" className="mt-8">
        <TabsList>
          <TabsTrigger value="mine">My Timelines</TabsTrigger>
          <TabsTrigger value="prebuilt">Prebuilt Timelines</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="mt-6">
          {myTimelines.length === 0 ? (
            <EmptyState
              title="No timelines yet"
              body="Create your first timeline to start charting historical events."
              actionLabel="Create Timeline"
              onAction={handleCreate}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myTimelines.map((t) => (
                <Card key={t.id} className="flex flex-col gap-3 p-4">
                  <div className="min-w-0">
                    <Link
                      to="/timeline/$id"
                      params={{ id: t.id }}
                      className="block truncate text-base font-semibold text-foreground hover:underline"
                    >
                      {t.name}
                    </Link>
                    {t.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalIcon className="h-3.5 w-3.5" />
                        {t.events.length} events
                      </span>
                      <span>Updated {new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button asChild size="sm" variant="default">
                      <Link to="/timeline/$id" params={{ id: t.id }}>Open</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        storage.duplicate(t.id);
                        toast.success("Duplicated");
                      }}
                      aria-label={`Duplicate ${t.name}`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportJSONAndHTML(t)}
                      aria-label={`Export ${t.name} as JSON & HTML`}
                      title="Export as JSON & HTML"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" aria-label={`Delete ${t.name}`}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{t.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This timeline will be removed from your browser. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              storage.remove(t.id);
                              toast.success("Deleted");
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prebuilt" className="mt-6">
          {prebuilt.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading community library…</p>
          ) : !prebuilt.data || prebuilt.data.length === 0 ? (
            <EmptyState
              title="Community library is empty"
              body={
                <>
                  No timelines were found in the public repository yet. Configure the source repo
                  in <code className="rounded bg-muted px-1">src/lib/chronicle/prebuilt.ts</code>{" "}
                  or visit the{" "}
                  <a className="text-primary underline" href={PREBUILT_BASE} target="_blank" rel="noreferrer">
                    repository
                  </a>{" "}
                  to add one.
                </>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {prebuilt.data.map((p) => (
                <Card key={p.file} className="flex flex-col gap-3 p-4">
                  <div>
                    <div className="truncate text-base font-semibold text-foreground">{p.name}</div>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {p.contributor || "Community"}
                      </span>
                      <span>{p.eventCount} events</span>
                      {p.updatedAt && <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button asChild size="sm">
                      <Link to="/prebuilt/$file" params={{ file: p.file }}>
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Open
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
