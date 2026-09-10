import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Moon, ShieldCheck, Star, Sun, Users, Venus } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JOURNEYS, STAY_SOLO_TIPS, TRAVEL_GROUPS } from "@/lib/travelwise/data";
import { formatDuration, formatINR, safetyScore } from "@/lib/travelwise/scoring";
import { toast } from "sonner";

export const Route = createFileRoute("/travel-safe")({
  head: () => ({
    meta: [
      { title: "Travel Safe — solo women traveller hub | TravelWise" },
      {
        name: "description",
        content:
          "Safety suitability scores for Indian flights, trains and buses, plus women-only travel groups, verified co-ed groups and solo planning tips.",
      },
      { property: "og:title", content: "Travel Safe — solo women traveller hub | TravelWise" },
      {
        property: "og:description",
        content:
          "Operator reliability, daytime arrivals and transfer ratings, scored for solo women travellers.",
      },
    ],
  }),
  component: TravelSafePage,
});

function TravelSafePage() {
  const ranked = React.useMemo(
    () =>
      [...JOURNEYS]
        .map((j) => ({ journey: j, score: safetyScore(j, "solo-woman") }))
        .sort((a, b) => b.score - a.score),
    [],
  );

  const womenGroups = TRAVEL_GROUPS.filter((g) => g.type === "women-only");
  const coedGroups = TRAVEL_GROUPS.filter((g) => g.type === "co-ed");

  return (
    <>
      <PageHeader
        eyebrow="Travel Safe"
        title="Solo women traveller hub"
        description="Every journey on this route re-scored for solo travel: who runs it, when it lands, how the transfers rate, and whether a women-only option exists."
      />

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Safety suitability · Mumbai → Delhi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ranked.map(({ journey, score }) => (
              <Card key={journey.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm">{journey.serviceName}</CardTitle>
                      <p className="text-xs capitalize text-muted-foreground">
                        {journey.mode} · {journey.code} · {formatDuration(journey.durationMin)}
                      </p>
                    </div>
                    <Badge className="bg-safe text-safe-foreground">Safety {score}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Operator reliability</span>
                      <span>{journey.safety.operatorReliability}</span>
                    </div>
                    <Progress value={journey.safety.operatorReliability} className="h-1.5" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Transfer & station rating</span>
                      <span>{journey.safety.transferRating}</span>
                    </div>
                    <Progress value={journey.safety.transferRating} className="h-1.5" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary" className="gap-1">
                      {journey.safety.daytimeArrival ? (
                        <Sun className="size-3" />
                      ) : (
                        <Moon className="size-3" />
                      )}
                      {journey.safety.daytimeArrival ? "Daytime arrival" : "Night arrival"}
                    </Badge>
                    {journey.safety.womenOnlyOption && (
                      <Badge variant="secondary" className="gap-1">
                        <Venus className="size-3" /> Women-only option
                      </Badge>
                    )}
                    {journey.safety.cctv && (
                      <Badge variant="secondary" className="gap-1">
                        <ShieldCheck className="size-3" /> CCTV
                      </Badge>
                    )}
                    <Badge variant="outline">{formatINR(journey.price)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Travel groups</h2>
          <Tabs defaultValue="women">
            <TabsList>
              <TabsTrigger value="women">Women-only</TabsTrigger>
              <TabsTrigger value="coed">Verified co-ed</TabsTrigger>
            </TabsList>
            <TabsContent value="women" className="mt-4">
              <GroupGrid groups={womenGroups} />
            </TabsContent>
            <TabsContent value="coed" className="mt-4">
              <GroupGrid groups={coedGroups} />
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Stay Solo planning</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAY_SOLO_TIPS.map((tip) => (
              <Card key={tip.title} className="border-border/60 bg-surface">
                <CardHeader>
                  <CardTitle className="text-sm">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">{tip.body}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function GroupGrid({ groups }: { groups: typeof TRAVEL_GROUPS }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <Card key={g.id} className="card-elevated border-border/60">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{g.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {g.route} · {g.dates}
                </p>
              </div>
              {g.verified ? (
                <Badge className="gap-1 bg-eco text-eco-foreground">
                  <BadgeCheck className="size-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="secondary">KYC pending</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {g.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Safety score</span>
                <span>{g.safetyScore}/100</span>
              </div>
              <Progress value={g.safetyScore} className="h-1.5" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {g.filled}/{g.spots} joined
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-accent" /> {g.hostRating} · {g.hostName}
              </span>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={() => toast.success(`Request sent to ${g.name} (demo)`)}
            >
              Request to join
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
