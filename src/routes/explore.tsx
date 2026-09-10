import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, Plane, Train } from "lucide-react";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DESTINATIONS } from "@/lib/travelwise/data";
import { formatINR } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";
import type { Mode } from "@/lib/travelwise/types";

const MODE_ICON: Record<Mode, typeof Plane> = { flight: Plane, train: Train, bus: Bus };

const VERDICT: Record<string, { label: string; className: string }> = {
  now: { label: "Book now", className: "bg-eco text-eco-foreground" },
  watch: { label: "Watch prices", className: "bg-accent text-accent-foreground" },
  wait: { label: "Wait if you can", className: "bg-secondary text-secondary-foreground" },
};

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore India — best time to travel | TravelWise" },
      {
        name: "description",
        content:
          "Browse Indian destinations with the cheapest months to visit, current price index and the lowest-cost way to get there.",
      },
      { property: "og:title", content: "Explore India — best time to travel | TravelWise" },
      {
        property: "og:description",
        content: "Goa, Manali, Jaipur, Munnar and more, ranked by when fares are lowest.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { setTo } = useTravelWise();

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Where to go next, priced honestly"
        description="Each destination shows the months when fares dip, the cheapest mode from Mumbai, and whether today is a good day to book."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {DESTINATIONS.map((d) => {
          const Icon = MODE_ICON[d.cheapestMode];
          const verdict = VERDICT[d.verdict]!;
          return (
            <Card key={d.id} className="card-elevated border-border/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span aria-hidden>{d.emoji}</span> {d.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{d.state}</p>
                  </div>
                  <Badge className={verdict.className}>{verdict.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{d.tagline}</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-surface p-3">
                    <p className="text-muted-foreground">Cheapest months</p>
                    <p className="mt-1 font-semibold">{d.bestMonths.join(" · ")}</p>
                  </div>
                  <div className="rounded-lg bg-surface p-3">
                    <p className="text-muted-foreground">Priciest</p>
                    <p className="mt-1 font-semibold">{d.avoidMonths.join(" · ")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="size-3.5" /> cheapest by {d.cheapestMode}
                  </span>
                  <span className="font-display text-base font-bold">
                    from {formatINR(d.fromMumbai)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1" onClick={() => setTo(d.name)}>
                    <Link to="/">Search fares</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/price-trends">Price trend</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
