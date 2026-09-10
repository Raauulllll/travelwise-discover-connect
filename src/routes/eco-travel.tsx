import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMBOS, JOURNEYS } from "@/lib/travelwise/data";
import { formatINR } from "@/lib/travelwise/scoring";

export const Route = createFileRoute("/eco-travel")({
  head: () => ({
    meta: [
      { title: "Eco Travel — lower-carbon journeys in India | TravelWise" },
      {
        name: "description",
        content:
          "Compare CO2 per traveller across flights, trains and buses, find the greenest options on your route, and pick up practical low-carbon travel tips.",
      },
      { property: "og:title", content: "Eco Travel — lower-carbon journeys in India | TravelWise" },
      {
        property: "og:description",
        content: "Trains on Mumbai → Delhi emit around a sixth of a direct flight's carbon.",
      },
    ],
  }),
  component: EcoPage,
});

const TIPS = [
  "Sleeper trains replace both a flight and a hotel night, cutting your trip's footprint twice.",
  "Direct beats connecting: take-off and landing dominate a flight's emissions.",
  "AC seater buses carry more people per litre than sleeper coaches on the same route.",
  "Booking a train 30+ days out lands lower fares and locks in the greener option.",
];

function EcoPage() {
  const chartData = JOURNEYS.map((j) => ({
    name: j.code,
    co2: j.co2Kg,
    mode: j.mode,
  }));
  const greenest = [...JOURNEYS].sort((a, b) => a.co2Kg - b.co2Kg).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Eco Travel"
        title="See the carbon before you book"
        description="Carbon per traveller sits on every journey card. Here's how the modes stack up on Mumbai → Delhi, and which combinations cut emissions the most."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">CO₂ per traveller · Mumbai → Delhi</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={44} tickFormatter={(v) => `${v}kg`} />
                <Tooltip
                  formatter={(v: number) => `${v} kg CO₂`}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="co2" radius={[8, 8, 0, 0]} fill="var(--color-eco)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Greenest on this route</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {greenest.map((j) => (
                <div key={j.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{j.serviceName}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {j.mode} · {formatINR(j.price)}
                    </p>
                  </div>
                  <Badge className="gap-1 bg-eco text-eco-foreground">
                    <Leaf className="size-3" /> {j.co2Kg} kg
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Low-carbon combos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                {COMBOS.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3">
                    <span>{c.label}</span>
                    <span className="font-semibold text-foreground">
                      {c.co2Kg} kg · {formatINR(c.price)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-surface">
              <CardHeader>
                <CardTitle className="text-base">Cut your footprint</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {TIPS.map((tip) => (
                    <li key={tip}>· {tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
