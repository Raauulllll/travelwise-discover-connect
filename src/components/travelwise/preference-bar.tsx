import { Accessibility, Baby, GraduationCap, User, Users, Venus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PREFERENCE_LABELS, TRAVELLER_LABELS } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";
import type { Preference, TravellerType } from "@/lib/travelwise/types";

const TRAVELLER_ICON: Record<TravellerType, typeof User> = {
  solo: User,
  "solo-woman": Venus,
  group: Users,
  family: Baby,
  accessibility: Accessibility,
  student: GraduationCap,
};

const TRAVELLER_ORDER: TravellerType[] = [
  "solo",
  "solo-woman",
  "group",
  "family",
  "accessibility",
  "student",
];

const PREF_ORDER: Preference[] = [
  "best",
  "cheapest",
  "fastest",
  "eco",
  "safest",
  "women",
  "accessible",
  "student",
];

export function PreferenceBar() {
  const { travellerType, setTravellerType, preference, setPreference, access, toggleAccess } =
    useTravelWise();

  return (
    <Card className="gap-5 border-border/60 p-4 sm:p-5">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Who is travelling
        </Label>
        <div className="flex flex-wrap gap-2">
          {TRAVELLER_ORDER.map((tt) => {
            const Icon = TRAVELLER_ICON[tt];
            const active = travellerType === tt;
            return (
              <button
                key={tt}
                onClick={() => setTravellerType(tt)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {TRAVELLER_LABELS[tt]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Rank results by
        </Label>
        <div className="flex flex-wrap gap-2">
          {PREF_ORDER.map((p) => {
            const active = preference === p;
            return (
              <button
                key={p}
                onClick={() => setPreference(p)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground",
                )}
              >
                {PREFERENCE_LABELS[p]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-surface p-4">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Accessibility must-haves
        </Label>
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Step-free boarding</span>
            <Switch checked={access.stepFree} onCheckedChange={() => toggleAccess("stepFree")} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Wheelchair assistance</span>
            <Switch checked={access.wheelchair} onCheckedChange={() => toggleAccess("wheelchair")} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Accessible toilet</span>
            <Switch
              checked={access.accessibleToilet}
              onCheckedChange={() => toggleAccess("accessibleToilet")}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StudentBanner() {
  const { studentVerified, travellerType } = useTravelWise();
  if (travellerType !== "student" || studentVerified) return null;
  return (
    <Card className="flex-row items-center justify-between gap-4 border-accent/50 bg-accent/10 p-4">
      <div>
        <p className="text-sm font-semibold">Student fares are locked</p>
        <p className="text-xs text-muted-foreground">
          Complete the demo student ID check to unlock up to 20% off trains and buses.
        </p>
      </div>
      <Button asChild size="sm">
        <a href="/student">Verify</a>
      </Button>
    </Card>
  );
}
