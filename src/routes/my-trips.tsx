import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, Plane, Train } from "lucide-react";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/travelwise/scoring";
import type { Mode } from "@/lib/travelwise/types";

const MODE_ICON: Record<Mode, typeof Plane> = { flight: Plane, train: Train, bus: Bus };

const TRIPS = [
  {
    id: "t1",
    route: "Mumbai → Delhi",
    service: "Mumbai Rajdhani Express · 12951",
    mode: "train" as Mode,
    date: "17 Sep 2026 · 17:00",
    price: 2755,
    status: "Upcoming",
    co2: 24,
  },
  {
    id: "t2",
    route: "Delhi → Manali",
    service: "Volvo AC Sleeper · HRTC 8802",
    mode: "bus" as Mode,
    date: "18 Sep 2026 · 21:30",
    price: 1490,
    status: "Upcoming",
    co2: 18,
  },
  {
    id: "t3",
    route: "Mumbai → Goa",
    service: "IndiGo · 6E 5233",
    mode: "flight" as Mode,
    date: "2 Aug 2026 · 07:10",
    price: 3860,
    status: "Completed",
    co2: 61,
  },
];

export const Route = createFileRoute("/my-trips")({
  head: () => ({
    meta: [
      { title: "My trips | TravelWise" },
      {
        name: "description",
        content: "Your upcoming and past TravelWise journeys, with fares and carbon per trip.",
      },
      { property: "og:title", content: "My trips | TravelWise" },
      { property: "og:description", content: "Upcoming and past journeys in one place." },
    ],
  }),
  component: MyTripsPage,
});

function MyTripsPage() {
  return (
    <>
      <PageHeader
        eyebrow="My trips"
        title="Everything you've booked"
        description="Sample bookings for this demo. Upcoming journeys show live tracking and group links where available."
      />

      <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 py-10 sm:px-6">
        {TRIPS.map((trip) => {
          const Icon = MODE_ICON[trip.mode];
          return (
            <Card key={trip.id} className="border-border/60">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="size-4 text-primary" /> {trip.route}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {trip.service} · {trip.date}
                    </p>
                  </div>
                  <Badge variant={trip.status === "Upcoming" ? "default" : "secondary"}>
                    {trip.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {formatINR(trip.price)} · {trip.co2} kg CO₂
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link to="/groups">Split costs</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
