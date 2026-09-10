import { GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompareTable } from "./compare-table";
import { useTravelWise } from "@/lib/travelwise/store";
import type { ScoredJourney } from "@/lib/travelwise/types";

export function CompareDialog({ items }: { items: ScoredJourney[] }) {
  const { clearCompare } = useTravelWise();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={items.length < 2}>
          <GitCompareArrows className="size-4" />
          Compare {items.length > 0 ? `(${items.length})` : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Side-by-side comparison</DialogTitle>
          <DialogDescription>
            Every factor that feeds the match score, lined up across your shortlist.
          </DialogDescription>
        </DialogHeader>
        <CompareTable items={items} />
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear shortlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
