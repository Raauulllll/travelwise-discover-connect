import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTravelWise } from "@/lib/travelwise/store";

export const Route = createFileRoute("/kyc")({
  head: () => ({
    meta: [
      { title: "KYC badge (demo) | TravelWise" },
      {
        name: "description",
        content:
          "Run the demo KYC step that powers verified group hosting and higher trust scores on TravelWise.",
      },
      { property: "og:title", content: "KYC badge (demo) | TravelWise" },
      {
        property: "og:description",
        content: "A verified badge unlocks group hosting and verified-only travel groups.",
      },
    ],
  }),
  component: KycPage,
});

const BENEFITS = [
  "Join verified-only and women-only travel groups",
  "Host your own group trips",
  "Higher trust weighting in safety scores",
  "Faster settlements in the expense splitter",
];

function KycPage() {
  const { kycVerified, setKycVerified } = useTravelWise();

  return (
    <>
      <PageHeader
        eyebrow="KYC"
        title="Verified travellers, safer groups"
        description="A demo identity check — no documents are collected. The badge is what other travellers see when you join or host a group."
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <Card className="card-elevated border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-eco" /> Identity status
              </CardTitle>
              {kycVerified ? (
                <Badge className="bg-eco text-eco-foreground">Verified</Badge>
              ) : (
                <Badge variant="secondary">Not verified</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {BENEFITS.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
            <Button
              onClick={() => {
                setKycVerified(!kycVerified);
                toast.success(kycVerified ? "Demo KYC reset." : "Demo KYC complete — badge added.");
              }}
            >
              {kycVerified ? "Reset demo KYC" : "Run demo KYC"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
