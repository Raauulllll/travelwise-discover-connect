import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Sparkles } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JOURNEYS } from "@/lib/travelwise/data";
import { formatINR } from "@/lib/travelwise/scoring";
import { useTravelWise } from "@/lib/travelwise/store";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student mode & verification | TravelWise" },
      {
        name: "description",
        content:
          "Run the demo student ID check to unlock student fares on trains, buses and selected flights across India.",
      },
      { property: "og:title", content: "Student mode & verification | TravelWise" },
      {
        property: "og:description",
        content: "Verify once, then see discounted student fares ranked alongside everything else.",
      },
    ],
  }),
  component: StudentPage,
});

function StudentPage() {
  const { studentVerified, setStudentVerified, setTravellerType } = useTravelWise();
  const [name, setName] = React.useState("Mahek Jethva");
  const [college, setCollege] = React.useState("");
  const [idNumber, setIdNumber] = React.useState("");
  const discounted = JOURNEYS.filter((j) => j.studentPrice);

  function verify() {
    if (!college.trim() || idNumber.trim().length < 4) {
      toast.error("Add your institute and an ID number of at least 4 characters.");
      return;
    }
    setStudentVerified(true);
    setTravellerType("student");
    toast.success("Demo verification complete — student fares unlocked.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Student mode"
        title="Verify once, save on every journey"
        description="This is a demo check — nothing is uploaded or stored. Verifying switches your traveller type to Student and reveals discounted fares across results."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-4 text-primary" /> Student ID check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">College or university</Label>
              <Input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Mumbai University"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Student ID number</Label>
              <Input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. MU2026-4471"
              />
            </div>
            <div className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
              Upload of an ID photo is skipped in this demo.
            </div>
            {studentVerified ? (
              <div className="space-y-3">
                <Badge className="gap-1 bg-accent text-accent-foreground">
                  <Sparkles className="size-3" /> Student verified
                </Badge>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link to="/">See student fares</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStudentVerified(false)}>
                    Reset demo
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={verify} className="w-full">
                Verify student status
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Student fares on Mumbai → Delhi</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {studentVerified ? "Unlocked — these prices now show in search." : "Locked until verified."}
            </p>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {discounted.map((j) => (
              <div key={j.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">{j.serviceName}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {j.mode} · {j.seatClass}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-through">{formatINR(j.price)}</p>
                  <p className="font-display text-sm font-bold">
                    {studentVerified ? formatINR(j.studentPrice!) : "•••••"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
