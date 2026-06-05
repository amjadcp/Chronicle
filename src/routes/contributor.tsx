import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail } from "lucide-react";

export const Route = createFileRoute("/contributor")({
  head: () => ({
    meta: [
      { title: "Contribute to Chronicle — Submit Historical Timelines" },
      {
        name: "description",
        content:
          "Become a Chronicle contributor and submit historical timelines to the public community library.",
      },
      { property: "og:title", content: "Contribute to Chronicle" },
      { property: "og:description", content: "Submit historical timelines to the Chronicle community library." },
      { property: "og:url", content: "/contributor" },
    ],
    links: [{ rel: "canonical", href: "/contributor" }],
  }),
  component: ContributorPage,
});

function ContributorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Contribute Historical Timelines
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Chronicle maintains a growing public collection of community-contributed timelines stored
        in an open GitHub repository. Contributors help expand coverage across world history,
        ancient civilizations, scientific discoveries, biographies, and more.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        If you are interested in contributing timelines, connect with us through LinkedIn or
        email to request contributor access. We will review your background and grant access to
        submit timelines.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            <Linkedin className="mr-2 h-4 w-4" />
            Contact via LinkedIn
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="mailto:hello@chronicle.app">
            <Mail className="mr-2 h-4 w-4" />
            Contact via Email
          </a>
        </Button>
      </div>

      <div className="mt-12 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Contributor workflow</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Build your timeline in Chronicle.</li>
          <li>Export it as JSON.</li>
          <li>Send it to us, or open a pull request against the GitHub repository.</li>
          <li>Once merged, your timeline appears in the Prebuilt Timelines tab.</li>
        </ol>
      </div>
    </div>
  );
}
