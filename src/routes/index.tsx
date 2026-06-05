import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Database,
  Download,
  FileText,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chronicle — Interactive Historical Timeline Builder" },
      {
        name: "description",
        content:
          "Build interactive historical timelines. Create, organize, and visualize historical events across centuries with a clean, fast, offline-capable timeline editor.",
      },
      { property: "og:title", content: "Chronicle — Interactive Historical Timeline Builder" },
      {
        property: "og:description",
        content:
          "Create, organize, and visualize historical events through interactive timelines.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const FEATURES = [
  { icon: Calendar, title: "Interactive Historical Timelines", body: "Create timelines spanning thousands of years with support for BC and AD dates." },
  { icon: Layers, title: "Timeline Grouping", body: "Organize events into dynasties, kingdoms, empires, movements, eras, or custom categories." },
  { icon: FileText, title: "Historical Research Workspace", body: "Attach notes, references, images, videos, and external sources to every event." },
  { icon: Database, title: "Offline-First Timeline Builder", body: "Create and manage timelines without requiring an account." },
  { icon: Download, title: "Interactive Timeline Export", body: "Export complete timeline data as portable JSON files." },
  { icon: Users, title: "Open Community Timeline Library", body: "Browse community-created historical timelines from researchers and history enthusiasts." },
];

const USE_CASES = [
  "World History Timelines",
  "Ancient Civilization Timelines",
  "Political History Timelines",
  "Scientific Discovery Timelines",
  "Historical Biography Timelines",
  "Cultural History Timelines",
  "War and Conflict Timelines",
  "Historical Research Projects",
  "Educational Timeline Creation",
  "Historical Event Visualization",
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Modern timeline builder for historians and educators
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Build Interactive Historical Timelines
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Create, organize, and visualize historical events through interactive timelines.
              Explore centuries of history, compare events across eras, and build timelines that
              make complex historical narratives easier to understand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/timelines">
                  Explore Timelines <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/timelines">Create Your Timeline</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO intro */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            A Modern Historical Timeline Builder
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Chronicle is an interactive timeline creator designed for historians, educators,
              students, researchers, writers, and lifelong learners.
            </p>
            <p>
              Create detailed timelines with historical events, visualize timelines across
              centuries, organize events into meaningful groups, attach research notes and
              resources, and export timelines as portable interactive files.
            </p>
            <p>
              Whether you are studying ancient civilizations, world history, political movements,
              scientific discoveries, cultural evolution, military campaigns, or historical
              biographies, Chronicle helps transform historical information into visual knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What Makes Chronicle Different
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-border">
                <CardHeader className="pb-3">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Use Cases
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((u) => (
              <li
                key={u}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
              >
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contributor */}
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Contribute Historical Timelines
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Chronicle maintains a growing collection of community-contributed timelines. If you
            are interested in contributing, connect with us to request contributor access.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link to="/contributor">Become a contributor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
