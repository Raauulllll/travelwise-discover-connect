import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Route as RouteIcon, ShieldCheck, TrendingDown } from "lucide-react";
import * as React from "react";

import { CompareDialog } from "@/components/travelwise/compare-dialog";
import { JourneyCard } from "@/components/travelwise/journey-card";
import { PreferenceBar, StudentBanner } from "@/components/travelwise/preference-bar";
import { SearchPanel } from "@/components/travelwise/search-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMBOS, JOURNEYS } from "@/lib/travelwise/data";
import { formatDuration, formatINR, PREFERENCE_LABELS, scoreJourneys } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TravelWise — Compare flights, trains & buses in India" },
      {
        name: "description",
        content:
          "Search one route and compare Indian flights, trains and buses on price, time, reliability, carbon, safety and accessibility.",
      },
      { property: "og:title", content: "TravelWise — Compare flights, trains & buses in India" },
      {
        property: "og:description",
        content:
          "Multimodal travel search for India with smart scoring, price intelligence, solo-women safety and group expense splitting.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, from, to, modeFilter, access, travellerType, preference, studentVerified, compareIds } =
    useTravelWise();

  const results = React.useMemo(() => {
    const filtered = JOURNEYS.filter((j) => {
      if (modeFilter !== "all" && j.mode !== modeFilter) return false;
      if (access.stepFree && !j.accessibility.stepFreeBoarding) return false;
      if (access.wheelchair && !j.accessibility.wheelchairAssistance) return false;
      if (access.accessibleToilet && !j.accessibility.accessibleToilet) return false;
      return true;
    });
    return scoreJourneys(filtered, { preference, travellerType, studentMode: studentVerified });
  }, [modeFilter, access, preference, travellerType, studentVerified]);

  const shortlist = results.filter((r) => compareIds.includes(r.journey.id));

  return (
    <>
      <section className="hero-gradient text-ink-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-12 sm:px-6 md:pb-32 md:pt-16">
          <Badge className="bg-ink-foreground/15 text-ink-foreground hover:bg-ink-foreground/20">
            Flights · Trains · Buses · Smart combos
          </Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-ink-foreground/80 md:text-base">{t("heroSub")}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-foreground/75 md:text-sm">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="size-4" /> Fare drop alerts on 240+ routes
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4" /> Safety scores built for solo travel
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="size-4" /> Carbon shown on every option
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-24 w-full max-w-7xl px-4 sm:px-6">
        <SearchPanel />
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <PreferenceBar />
          <Card className="border-border/60 bg-surface">
            <CardHeader>
              <CardTitle className="text-sm">How scoring works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>
                Each journey is scored 0–100 on price, duration, reliability, carbon, safety suitability
                and accessibility. Your preference reweights those six factors instantly.
              </p>
              <p className="font-medium text-foreground">
                Currently ranking by: {PREFERENCE_LABELS[preference]}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <StudentBanner />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">
                {from} → {to}
              </h2>
              <p className="text-xs text-muted-foreground">
                {results.length} options · Thu 17 Sep · sample fares
              </p>
            </div>
            <CompareDialog items={shortlist} />
          </div>

          {results.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">
              No journeys match those filters. Try relaxing an accessibility must-have or switching mode
              back to All.
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((s) => (
                <JourneyCard key={s.journey.id} scored={s} />
              ))}
            </div>
          )}

          <Card className="border-border/60">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <RouteIcon className="size-4 text-primary" /> Smart multimodal combos
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mixing modes often beats any single ticket on this route.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link to="/price-trends">
                  All combos <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {COMBOS.map((combo) => (
                <div key={combo.id} className="rounded-xl border border-border/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {combo.label}
                    </span>
                    {combo.saving > 0 && (
                      <Badge className="bg-eco text-eco-foreground text-[11px]">
                        Save {formatINR(combo.saving)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 font-display text-lg font-bold">{formatINR(combo.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(combo.durationMin)} · {combo.co2Kg} kg CO₂
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {combo.legs.map((leg) => (
                      <li key={leg}>· {leg}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-foreground/80">{combo.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
