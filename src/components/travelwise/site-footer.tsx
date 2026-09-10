import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-ink text-ink-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm space-y-2">
          <span className="flex items-center gap-2 font-display text-base font-extrabold">
            <Compass className="size-4" /> TRAVELWISE
          </span>
          <p className="text-sm text-ink-foreground/70">
            A demo travel comparison experience. All fares, groups, verifications and rewards shown here
            are sample data, not live bookings.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-foreground/80">
          <Link to="/explore" className="hover:text-ink-foreground">
            Explore
          </Link>
          <Link to="/price-trends" className="hover:text-ink-foreground">
            Price Trends
          </Link>
          <Link to="/travel-safe" className="hover:text-ink-foreground">
            Travel Safe
          </Link>
          <Link to="/eco-travel" className="hover:text-ink-foreground">
            Eco Travel
          </Link>
          <Link to="/rewards" className="hover:text-ink-foreground">
            Rewards
          </Link>
        </nav>
      </div>
    </footer>
  );
}
