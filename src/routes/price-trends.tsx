import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/travelwise/page-header";
import { PriceGauge } from "@/components/travelwise/price-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { COMBOS, DESTINATIONS, MONTHS, priceHistory } from "@/lib/travelwise/data";
import { formatDuration, formatINR } from "@/lib/travelwise/scoring";

export const Route = createFileRoute("/price-trends")({
  head: () => ({
    meta: [
      { title: "Price Trends — travel when fares are low | TravelWise" },
      {
        name: "description",
        content:
          "Monthly fare calendars, a destination price index with a travel-now-or-later gauge, 7-day and 30-day trends, and money-saving multimodal combos.",
      },
      { property: "og:title", content: "Price Trends — travel when fares are low | TravelWise" },
      {
        property: "og:description",
        content: "See when Indian routes get cheap, and whether to book today or wait.",
      },
    ],
  }),
  component: PriceTrendsPage,
});

function heatClass(value: number) {
  if (value < 40) return "bg-eco/85 text-eco-foreground";
  if (value < 55) return "bg-eco/45";
  if (value < 70) return "bg-marigold/40";
  if (value < 85) return "bg-marigold/70 text-marigold-foreground";
  return "bg-destructive/70 text-destructive-foreground";
}

function PriceTrendsPage() {
  const [destId, setDestId] = React.useState(DESTINATIONS[0].id);
  const [range, setRange] = React.useState<"7" | "30">("7");
  const dest = DESTINATIONS.find((d) => d.id === destId)!;
  const history = React.useMemo(
    () => priceHistory(range === "7" ? 7 : 30, dest.fromMumbai),
    [range, dest.fromMumbai],
  );
  const change = Math.round(
    ((history[history.length - 1].price - history[0].price) / history[0].price) * 100,
  );

  return (
    <>
      <PageHeader
        eyebrow="Price intelligence"
        title="Travel when prices are low"
        description="Pick a destination to see its cheapest months, how today's fares compare with the yearly average, and where mixing modes saves the most."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDestId(d.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                d.id === destId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {d.emoji} {d.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Monthly fare calendar · Mumbai → {dest.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Greener months are cheaper than the yearly average; red months carry a premium.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {MONTHS.map((m, i) => {
                  const value = dest.monthlyIndex[i];
                  const price = Math.round((dest.fromMumbai * value) / 55 / 10) * 10;
                  return (
                    <div
                      key={m}
                      className={cn("rounded-xl p-3 text-center", heatClass(value))}
                      title={`${m} · index ${value}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide">{m}</p>
                      <p className="mt-1 font-display text-sm font-bold">{formatINR(price)}</p>
                      <p className="text-[10px] opacity-80">index {value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Destination price index</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PriceGauge value={dest.priceIndex} verdict={dest.verdict} />
              <div className="space-y-2 rounded-xl bg-surface p-4 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Cheapest months:</span>{" "}
                  {dest.bestMonths.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Avoid:</span>{" "}
                  {dest.avoidMonths.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Cheapest mode:</span>{" "}
                  {dest.cheapestMode}
                </p>
              </div>
              <Button className="w-full">Create a fare alert</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Fare trend · Mumbai → {dest.name}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {change <= 0 ? "Down" : "Up"} {Math.abs(change)}% over the last {range} days
              </p>
            </div>
            <Tabs value={range} onValueChange={(v) => setRange(v as "7" | "30")}>
              <TabsList>
                <TabsTrigger value="7">7 days</TabsTrigger>
                <TabsTrigger value="30">30 days</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="fare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} width={56} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(v: number) => formatINR(v)}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#fare)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div>
          <h2 className="font-display text-lg font-bold">Smart multimodal combos</h2>
          <p className="text-sm text-muted-foreground">
            Splitting a journey across two modes is often the cheapest or greenest way to travel.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {COMBOS.map((c) => (
              <Card key={c.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{c.label}</CardTitle>
                    {c.saving > 0 && (
                      <Badge className="bg-eco text-eco-foreground">Save {formatINR(c.saving)}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-display text-xl font-bold text-foreground">{formatINR(c.price)}</p>
                  <p>
                    {formatDuration(c.durationMin)} · {c.co2Kg} kg CO₂
                  </p>
                  <ul className="space-y-1">
                    {c.legs.map((l) => (
                      <li key={l}>· {l}</li>
                    ))}
                  </ul>
                  <p className="text-foreground/80">{c.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
