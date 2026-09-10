import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

import { CompareTable } from "@/components/travelwise/compare-table";
import { PageHeader } from "@/components/travelwise/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JOURNEYS } from "@/lib/travelwise/data";
import { scoreJourneys } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare journeys side by side | TravelWise" },
      {
        name: "description",
        content:
          "Line up shortlisted flights, trains and buses factor by factor: price, duration, reliability, carbon, safety and accessibility.",
      },
      { property: "og:title", content: "Compare journeys side by side | TravelWise" },
      {
        property: "og:description",
        content: "A factor-by-factor comparison of your shortlisted Indian travel options.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { compareIds, clearCompare, preference, travellerType, studentVerified, toggleCompare } =
    useTravelWise();

  const scored = React.useMemo(
    () => scoreJourneys(JOURNEYS, { preference, travellerType, studentMode: studentVerified }),
    [preference, travellerType, studentVerified],
  );
  const items = scored.filter((s) => compareIds.includes(s.journey.id));

  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title="Your shortlist, factor by factor"
        description="Add up to three journeys from search results, then read across the rows to see exactly where each one wins."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        {items.length === 0 ? (
          <Card className="space-y-4 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing shortlisted yet. Tap “Compare” on any journey card to add it here.
            </p>
            <Button asChild size="sm">
              <Link to="/">Back to search</Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {items.length} of 3 slots used · scored for {travellerType.replace("-", " ")}
              </p>
              <Button variant="outline" size="sm" onClick={clearCompare}>
                Clear shortlist
              </Button>
            </div>
            <Card className="card-elevated border-border/60 p-4 sm:p-6">
              <CompareTable items={items} />
            </Card>
          </>
        )}

        <div>
          <h2 className="font-display text-lg font-bold">Add more from this route</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {scored
              .filter((s) => !compareIds.includes(s.journey.id))
              .map((s) => (
                <Card key={s.journey.id} className="gap-2 border-border/60 p-4">
                  <p className="text-xs capitalize text-muted-foreground">{s.journey.mode}</p>
                  <p className="font-display text-sm font-bold">{s.journey.serviceName}</p>
                  <p className="text-xs text-muted-foreground">Match {s.total}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1"
                    disabled={compareIds.length >= 3}
                    onClick={() => toggleCompare(s.journey.id)}
                  >
                    Add
                  </Button>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
