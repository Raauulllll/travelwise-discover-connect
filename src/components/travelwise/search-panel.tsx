import { ArrowLeftRight, Bus, Minus, Plane, Plus, Search, Train, Users } from "lucide-react";
import { addDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CITIES } from "@/lib/travelwise/data";
import { formatINR } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";
import type { Mode, TripType } from "@/lib/travelwise/types";

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-city", label: "Multi-City" },
];

const MODES: { value: Mode | "all"; label: string; icon?: typeof Plane }[] = [
  { value: "all", label: "All" },
  { value: "flight", label: "Flights", icon: Plane },
  { value: "train", label: "Trains", icon: Train },
  { value: "bus", label: "Buses", icon: Bus },
];

const FLEX_FARES = [3980, 3410, 2755, 2610, 2890, 3350, 4120];

export function SearchPanel() {
  const {
    from,
    to,
    setFrom,
    setTo,
    swap,
    tripType,
    setTripType,
    modeFilter,
    setModeFilter,
    travellers,
    setTravellers,
    dateOffset,
    setDateOffset,
  } = useTravelWise();

  const today = new Date(2026, 8, 17);
  const cheapest = Math.min(...FLEX_FARES);

  return (
    <Card className="card-elevated gap-0 border-border/60 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-secondary p-1">
          {TRIP_TYPES.map((tt) => (
            <button
              key={tt.value}
              onClick={() => setTripType(tt.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                tripType === tt.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tt.label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl bg-secondary p-1">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setModeFilter(m.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                modeFilter === m.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.icon && <m.icon className="size-3.5" />}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr_1fr]">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="h-12 w-full font-semibold">
              <SelectValue>{from}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-center pb-1">
          <Button variant="outline" size="icon" onClick={swap} aria-label="Swap cities">
            <ArrowLeftRight className="size-4" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="h-12 w-full font-semibold">
              <SelectValue>{to}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Travellers</Label>
          <div className="flex h-12 items-center justify-between rounded-md border border-input px-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setTravellers(travellers - 1)}
              aria-label="Remove traveller"
            >
              <Minus className="size-4" />
            </Button>
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="size-4 text-muted-foreground" /> {travellers}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setTravellers(travellers + 1)}
              aria-label="Add traveller"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Flexible dates · ±3 days</Label>
          <span className="text-xs text-muted-foreground">Lowest fare highlighted</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {FLEX_FARES.map((fare, i) => {
            const offset = i - 3;
            const date = addDays(today, offset);
            const isActive = dateOffset === offset;
            const isCheapest = fare === cheapest;
            return (
              <button
                key={offset}
                onClick={() => setDateOffset(offset)}
                className={cn(
                  "rounded-xl border px-1 py-2 text-center transition-colors",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary",
                )}
              >
                <span className="block text-[10px] uppercase text-muted-foreground">
                  {format(date, "EEE")}
                </span>
                <span className="block text-xs font-semibold">{format(date, "d MMM")}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-[11px] font-bold tabular-nums",
                    isCheapest ? "text-eco" : "text-muted-foreground",
                  )}
                >
                  {formatINR(fare)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button size="lg" className="mt-5 h-12 w-full gap-2 text-base md:w-auto md:self-start md:px-8">
        <Search className="size-4" /> Search journeys
      </Button>
    </Card>
  );
}
