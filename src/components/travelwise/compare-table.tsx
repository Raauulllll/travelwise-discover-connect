import type { ReactNode } from "react";
import { Bus, Plane, Train, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { effectivePrice, formatDuration, formatINR } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";
import type { Mode, ScoredJourney } from "@/lib/travelwise/types";

const MODE_ICON: Record<Mode, typeof Plane> = { flight: Plane, train: Train, bus: Bus };

export function CompareTable({ items }: { items: ScoredJourney[] }) {
  const { studentVerified, toggleCompare, travellers } = useTravelWise();

  const rows: { label: string; render: (s: ScoredJourney) => ReactNode }[] = [
    {
      label: "Price / traveller",
      render: (s) => (
        <span className="font-display text-lg font-bold">
          {formatINR(effectivePrice(s.journey, studentVerified))}
        </span>
      ),
    },
    {
      label: `Total for ${travellers}`,
      render: (s) => formatINR(effectivePrice(s.journey, studentVerified) * travellers),
    },
    { label: "Departure → arrival", render: (s) => `${s.journey.departure} → ${s.journey.arrival}` },
    { label: "Duration", render: (s) => formatDuration(s.journey.durationMin) },
    { label: "Stops", render: (s) => (s.journey.stops === 0 ? "Direct" : `${s.journey.stops} stops`) },
    { label: "On-time record", render: (s) => `${s.journey.onTimePct}%` },
    { label: "CO₂ per traveller", render: (s) => `${s.journey.co2Kg} kg` },
    {
      label: "Safety suitability",
      render: (s) => (
        <div className="space-y-1">
          <Progress value={s.factors.safety} className="h-1.5" />
          <span className="text-xs text-muted-foreground">{s.factors.safety}/100</span>
        </div>
      ),
    },
    {
      label: "Accessibility",
      render: (s) => (
        <div className="space-y-1">
          <Progress value={s.factors.accessibility} className="h-1.5" />
          <span className="text-xs text-muted-foreground">{s.factors.accessibility}/100</span>
        </div>
      ),
    },
    { label: "Refundable", render: (s) => (s.journey.refundable ? "Yes" : "No") },
    { label: "Class", render: (s) => s.journey.seatClass },
    { label: "Onboard", render: (s) => s.journey.amenities.join(", ") },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-border p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Factor
            </th>
            {items.map((s) => {
              const Icon = MODE_ICON[s.journey.mode];
              return (
                <th key={s.journey.id} className="border-b border-border p-3 text-left align-bottom">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                        <Icon className="size-3.5" /> {s.journey.mode}
                      </span>
                      <span className="block font-display text-sm font-bold">
                        {s.journey.serviceName}
                      </span>
                      <span className="block text-xs text-muted-foreground">{s.journey.code}</span>
                      <Badge className="mt-1 bg-primary text-primary-foreground text-[11px]">
                        Match {s.total}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => toggleCompare(s.journey.id)}
                      aria-label="Remove from comparison"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="even:bg-surface/60">
              <td className="border-b border-border/60 p-3 text-xs font-medium text-muted-foreground">
                {row.label}
              </td>
              {items.map((s) => (
                <td key={s.journey.id} className="border-b border-border/60 p-3 align-top">
                  {row.render(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
