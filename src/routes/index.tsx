import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HistoryTimeline — Interactive Historical Timeline Builder" },
      {
        name: "description",
        content:
          "Build interactive historical timelines. Create, organize, and visualize historical events across centuries with a clean, fast, offline-capable timeline editor.",
      },
      { property: "og:title", content: "HistoryTimeline — Interactive Historical Timeline Builder" },
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

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              History Timeline Creator for Students & Educators
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              A simple, intuitive timeline builder to visualize historical events. Ideal for class projects, or self-study.
            </p>
              {/* A simple, intuitive timeline builder to visualize historical events. Ideal for class projects, self-study, or creating history content for social media and portfolios. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/timelines?tab=prebuilt">
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
            About HistoryTimeline
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              HistoryTimeline is an educational timeline tool designed specifically for learners and educators of history. Whether you are studying for a history class, preparing a presentation, or exploring your own historical interests, this tool helps you organize events chronologically with ease.
            </p>
            <p>
              You can create timelines covering any historical period, group events by eras, and export your work to share with others. It's a completely free history timeline maker that runs directly in your browser without requiring an account.
            </p>
            <p>
              Use this tool to map out ancient civilizations, track major world events, or create study guides. Dive into history, visualize the timeline of events, and enhance your historical learning journey today.
            </p>
          </div>
        </div>
      </section>

      {/* Contributor */}
      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Learn Together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Explore a growing collection of prebuilt timelines created by fellow history learners and educators. If you would like to share your timelines with the community, you can apply to become a contributor.
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
