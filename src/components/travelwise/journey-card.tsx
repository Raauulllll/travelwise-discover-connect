import { Accessibility, Bus, Leaf, Plane, ShieldCheck, Train, Clock, ChevronDown } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { effectivePrice, formatDuration, formatINR } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";
import type { Mode, ScoredJourney } from "@/lib/travelwise/types";

const MODE_ICON: Record<Mode, typeof Plane> = { flight: Plane, train: Train, bus: Bus };
const MODE_TEXT: Record<Mode, string> = {
  flight: "text-flight",
  train: "text-train",
  bus: "text-bus",
};
const MODE_BG: Record<Mode, string> = {
  flight: "bg-flight/10",
  train: "bg-train/10",
  bus: "bg-bus/10",
};

const BADGE_STYLE: Record<string, string> = {
  "Best Overall": "bg-primary text-primary-foreground",
  Greenest: "bg-eco text-eco-foreground",
  "Safest Match": "bg-safe text-safe-foreground",
  Safest: "bg-safe/15 text-foreground",
  "Student Offer": "bg-accent text-accent-foreground",
  "Fully Accessible": "bg-flight/15 text-foreground",
  Fastest: "bg-secondary text-secondary-foreground",
  Cheapest: "bg-secondary text-secondary-foreground",
};

function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export function JourneyCard({ scored }: { scored: ScoredJourney }) {
  const { journey, total, factors, badges } = scored;
  const { studentVerified, compareIds, toggleCompare, travellers } = useTravelWise();
  const [openDetails, setOpenDetails] = React.useState(false);
  const Icon = MODE_ICON[journey.mode];
  const price = effectivePrice(journey, studentVerified);
  const selected = compareIds.includes(journey.id);
  const discounted = studentVerified && journey.studentPrice;

  return (
    <Card className="card-elevated gap-0 overflow-hidden border-border/70 p-0">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
              MODE_BG[journey.mode],
              MODE_TEXT[journey.mode],
            )}
          >
            <Icon className="size-3.5" /> {journey.mode}
          </span>
          {badges.map((b) => (
            <Badge key={b} className={cn("rounded-full text-[11px]", BADGE_STYLE[b] ?? "bg-secondary")}>
              {b}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-bold">{journey.serviceName}</h3>
            <p className="text-xs text-muted-foreground">
              {journey.operator} · {journey.code} · {journey.seatClass}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div>
                <p className="font-display text-xl font-bold leading-none">{journey.departure}</p>
                <p className="mt-1 text-xs text-muted-foreground">{journey.fromCode}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Clock className="size-3" /> {formatDuration(journey.durationMin)}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <p className="mt-1 text-center text-[11px] text-muted-foreground">
                  {journey.stops === 0 ? "Direct" : `${journey.stops} stops`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold leading-none">
                  {journey.arrival}
                  {journey.arrivalDayOffset > 0 && (
                    <span className="align-super text-[10px] font-semibold text-accent-foreground">
                      +{journey.arrivalDayOffset}d
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{journey.toCode}</p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:w-44 sm:items-end">
            <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
              {discounted && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatINR(journey.price)}
                </span>
              )}
              <span className="font-display text-2xl font-extrabold">{formatINR(price)}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              per traveller · {formatINR(price * travellers)} total
            </span>
            <div className="flex w-full gap-2 sm:justify-end">
              <Button size="sm" className="flex-1 sm:flex-none">
                Select
              </Button>
              <Button
                size="sm"
                variant={selected ? "secondary" : "outline"}
                className="flex-1 sm:flex-none"
                onClick={() => toggleCompare(journey.id)}
              >
                {selected ? "Added" : "Compare"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <span className="grid size-6 place-items-center rounded-md bg-primary/10 text-[11px] text-primary">
              {total}
            </span>
            match score
          </span>
          <span className="flex items-center gap-1">
            <Leaf className="size-3.5 text-eco" /> {journey.co2Kg} kg CO₂
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-safe" /> Safety {factors.safety}
          </span>
          <span className="flex items-center gap-1">
            <Accessibility className="size-3.5 text-flight" /> Access {factors.accessibility}
          </span>
          <span>{journey.onTimePct}% on time</span>
          <span>{journey.refundable ? "Refundable" : "Non-refundable"}</span>
        </div>

        <Collapsible open={openDetails} onOpenChange={setOpenDetails}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 self-start px-2 text-xs">
              Score & facilities
              <ChevronDown className={cn("size-3.5 transition-transform", openDetails && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="grid gap-5 rounded-xl bg-surface p-4 md:grid-cols-3">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Score breakdown
                </p>
                <FactorBar label="Price" value={factors.price} />
                <FactorBar label="Duration" value={factors.duration} />
                <FactorBar label="Reliability" value={factors.reliability} />
                <FactorBar label="Low carbon" value={factors.co2} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Safety suitability · {factors.safety}
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li>Operator reliability · {journey.safety.operatorReliability}</li>
                  <li>Transfer rating · {journey.safety.transferRating}</li>
                  <li>{journey.safety.daytimeArrival ? "Daytime arrival" : "Late-night arrival"}</li>
                  <li>{journey.safety.womenOnlyOption ? "Women-only option" : "No women-only option"}</li>
                  <li>{journey.safety.cctv ? "CCTV monitored" : "No CCTV"}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Accessibility · {factors.accessibility}
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li>{journey.accessibility.stepFreeBoarding ? "✓" : "✕"} Step-free boarding</li>
                  <li>{journey.accessibility.wheelchairAssistance ? "✓" : "✕"} Wheelchair assistance</li>
                  <li>{journey.accessibility.accessibleToilet ? "✓" : "✕"} Accessible toilet</li>
                  <li>{journey.accessibility.attendantSeat ? "✓" : "✕"} Attendant seat</li>
                </ul>
                <p className="pt-1 text-xs text-muted-foreground">
                  Onboard: {journey.amenities.join(", ")}
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}
