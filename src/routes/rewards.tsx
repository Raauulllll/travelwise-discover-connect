import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Leaf, ShieldCheck, Sparkles, Trophy } from "lucide-react";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { REWARD_TIERS } from "@/lib/travelwise/data";
import { useTravelWise } from "@/lib/travelwise/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards, KYC & eco-points | TravelWise" },
      {
        name: "description",
        content:
          "Track eco-points, reward tiers from Explorer to Pro, demo KYC badges and the CO2 you saved by choosing lower-carbon journeys.",
      },
      { property: "og:title", content: "Rewards, KYC & eco-points | TravelWise" },
      {
        property: "og:description",
        content: "Earn eco-points for greener journeys and climb from Explorer to Pro.",
      },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  const { ecoPoints, kycVerified, setKycVerified, studentVerified } = useTravelWise();
  const tierIndex = REWARD_TIERS.reduce((acc, t, i) => (ecoPoints >= t.points ? i : acc), 0);
  const tier = REWARD_TIERS[tierIndex]!;
  const next = REWARD_TIERS[tierIndex + 1];
  const progress = next
    ? Math.round(((ecoPoints - tier.points) / (next.points - tier.points)) * 100)
    : 100;

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="Points for travelling lighter"
        description="Every low-carbon journey earns eco-points. Points move you up the tiers and unlock flexible-date tools, priority safety scores and free date changes."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <Card className="card-elevated border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-accent" /> {tier.name} tier
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {ecoPoints.toLocaleString("en-IN")} eco-points
              {next ? ` · ${(next.points - ecoPoints).toLocaleString("en-IN")} to ${next.name}` : ""}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {REWARD_TIERS.map((t, i) => (
                <div
                  key={t.name}
                  className={cn(
                    "rounded-xl border p-4",
                    i === tierIndex ? "border-primary bg-primary/5" : "border-border/70",
                  )}
                >
                  <p className="font-display text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.points.toLocaleString("en-IN")} pts
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {t.perks.map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Leaf className="size-4 text-eco" /> CO₂ saved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-display text-3xl font-extrabold">214 kg</p>
              <p className="text-xs text-muted-foreground">
                This year, by choosing trains and buses over flights on 9 journeys — roughly the same as
                10 fully grown trees absorbing for a year.
              </p>
              <div className="space-y-1.5 rounded-xl bg-surface p-3 text-xs text-muted-foreground">
                <p className="flex justify-between">
                  <span>Train journeys</span> <span className="text-foreground">6</span>
                </p>
                <p className="flex justify-between">
                  <span>Bus journeys</span> <span className="text-foreground">3</span>
                </p>
                <p className="flex justify-between">
                  <span>Flights avoided</span> <span className="text-foreground">5</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Verification badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {kycVerified ? (
                  <Badge className="gap-1 bg-eco text-eco-foreground">
                    <ShieldCheck className="size-3" /> KYC verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">KYC pending</Badge>
                )}
                {studentVerified ? (
                  <Badge className="gap-1 bg-accent text-accent-foreground">
                    <Sparkles className="size-3" /> Student verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">Student unverified</Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <BadgeCheck className="size-3" /> Group host ready
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setKycVerified(!kycVerified)}
              >
                {kycVerified ? "Revoke demo KYC" : "Complete demo KYC"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
