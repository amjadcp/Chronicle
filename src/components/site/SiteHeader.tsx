import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

export function SiteHeader() {
  const linkBase =
    "text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md";
  const active = "text-foreground font-medium";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground"
          >
            <Clock className="h-4 w-4" />
          </span>
          HistoryTimeline
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <Link
            to="/timelines"
            className={linkBase}
            activeProps={{ className: `${linkBase} ${active}` }}
          >
            Timelines
          </Link>
          <Link
            to="/contributor"
            className={linkBase}
            activeProps={{ className: `${linkBase} ${active}` }}
          >
            Contribute
          </Link>
          <Link
            to="/about"
            className={linkBase}
            activeProps={{ className: `${linkBase} ${active}` }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
