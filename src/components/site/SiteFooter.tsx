import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-sm font-semibold text-foreground">HistoryTimeline</div>
          <p className="mt-2 text-sm text-muted-foreground">
            A modern interactive historical timeline builder.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Product</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/timelines" className="hover:text-foreground">Timelines</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Community</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/contributor" className="hover:text-foreground">Contributor Guide</Link></li>
            <li>
              <a
                href="https://github.com/PLACEHOLDER_OWNER/chronicle-timelines"
                className="hover:text-foreground"
                target="_blank" rel="noreferrer"
              >GitHub Repository</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Legal</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/about" hash="privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/contributor" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HistoryTimeline
      </div>
    </footer>
  );
}
