import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Chronicle — Historical Timeline Builder" },
      {
        name: "description",
        content:
          "About Chronicle: an open historical timeline builder for researchers, educators, and history enthusiasts.",
      },
      { property: "og:title", content: "About Chronicle" },
      { property: "og:description", content: "Open historical timeline builder for researchers and educators." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">About Chronicle</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Chronicle is an interactive historical timeline builder designed for history learners,
        researchers, educators, writers, and content creators. It runs entirely in your browser,
        stores your timelines locally, and connects to a public library of community-contributed
        timelines.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-foreground">What you can do</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Create timelines spanning thousands of years with BC and AD dates.</li>
        <li>Group events into dynasties, eras, movements, or custom categories.</li>
        <li>Attach notes, websites, images, and YouTube videos to each event.</li>
        <li>Zoom, pan, and explore timelines interactively.</li>
        <li>Import and export timeline JSON for backup and sharing.</li>
        <li>Install Chronicle as a Progressive Web App on your device.</li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-foreground">Built with</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        React, TypeScript, TanStack Start, Tailwind CSS, shadcn/ui, Tiptap, and SVG.
      </p>

      <h2 id="privacy" className="mt-10 text-xl font-semibold text-foreground">Privacy Policy</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Chronicle does not require an account for normal use. Timelines you create are stored
        only in your browser's local storage on your device. We do not collect, transmit, or
        sell any personal data. Prebuilt timelines are fetched from a public GitHub repository.
      </p>
    </div>
  );
}
