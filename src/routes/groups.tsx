import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Wallet } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/travelwise/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GROUP_MEMBERS, INITIAL_EXPENSES } from "@/lib/travelwise/data";
import { formatINR } from "@/lib/travelwise/scoring";
import { netBalances, simplifySettlements } from "@/lib/travelwise/settle";
import type { Expense, ExpenseCategory, GroupMember } from "@/lib/travelwise/types";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Group travel & expense splitter | TravelWise" },
      {
        name: "description",
        content:
          "Plan a group trip with a member roster, equal or custom expense splits, net balances and simplified settlements you can mark as paid.",
      },
      { property: "og:title", content: "Group travel & expense splitter | TravelWise" },
      {
        property: "og:description",
        content: "Split travel, stay, food and activity costs and settle up in the fewest transfers.",
      },
    ],
  }),
  component: GroupsPage,
});

const CATEGORIES: ExpenseCategory[] = ["Travel", "Stay", "Food", "Activities", "Other"];

function GroupsPage() {
  const [members, setMembers] = React.useState<GroupMember[]>(GROUP_MEMBERS);
  const [expenses, setExpenses] = React.useState<Expense[]>(INITIAL_EXPENSES);
  const [paid, setPaid] = React.useState<string[]>([]);
  const [newMember, setNewMember] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState<ExpenseCategory>("Food");
  const [paidBy, setPaidBy] = React.useState(members[0].id);
  const [splitMode, setSplitMode] = React.useState<"equal" | "custom">("equal");
  const [shares, setShares] = React.useState<Record<string, string>>({});

  const balances = React.useMemo(() => netBalances(members, expenses), [members, expenses]);
  const settlements = React.useMemo(() => simplifySettlements(balances), [balances]);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "—";

  function addMember() {
    const name = newMember.trim();
    if (!name) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        name,
        avatarInitials: name.slice(0, 2).toUpperCase(),
      },
    ]);
    setNewMember("");
  }

  function addExpense() {
    const value = Number(amount);
    if (!title.trim() || !value || value <= 0) {
      toast.error("Add a description and an amount above zero.");
      return;
    }
    const customShares: Record<string, number> = {};
    if (splitMode === "custom") {
      members.forEach((m) => {
        const v = Number(shares[m.id] ?? 0);
        if (v > 0) customShares[m.id] = v;
      });
      if (Object.keys(customShares).length === 0) {
        toast.error("Enter at least one custom share.");
        return;
      }
    }
    setExpenses((prev) => [
      ...prev,
      {
        id: `e${Date.now()}`,
        title: title.trim(),
        category,
        amount: value,
        paidBy,
        splitMode,
        shares: customShares,
      },
    ]);
    setTitle("");
    setAmount("");
    setShares({});
    setPaid([]);
    toast.success("Expense added and balances updated.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Groups"
        title="Plan together, settle up cleanly"
        description="Add everyone travelling, log what each person paid, split equally or by custom amounts, and let TravelWise reduce the payback to the fewest possible transfers."
      />

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Delhi Diwali Trip · 4 nights</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  {members.length} members · {formatINR(total)} logged ·{" "}
                  {formatINR(Math.round(total / members.length))} per head
                </p>
              </div>
              <Badge variant="secondary">Demo trip</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <span
                    key={m.id}
                    className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-xs font-medium"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {m.avatarInitials}
                    </span>
                    {m.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Add a traveller"
                  className="max-w-56"
                />
                <Button variant="outline" onClick={addMember} className="gap-1.5">
                  <Plus className="size-4" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Add an expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">What was it for</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cab to the station"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Amount (₹)</Label>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                    placeholder="1200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Paid by</Label>
                  <Select value={paidBy} onValueChange={setPaidBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs value={splitMode} onValueChange={(v) => setSplitMode(v as "equal" | "custom")}>
                <TabsList>
                  <TabsTrigger value="equal">Split equally</TabsTrigger>
                  <TabsTrigger value="custom">Custom split</TabsTrigger>
                </TabsList>
              </Tabs>

              {splitMode === "custom" && (
                <div className="grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-2">
                  {members.map((m) => (
                    <div key={m.id} className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{m.name}'s share (₹)</Label>
                      <Input
                        value={shares[m.id] ?? ""}
                        onChange={(e) => setShares((prev) => ({ ...prev, [m.id]: e.target.value }))}
                        inputMode="numeric"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={addExpense} className="gap-1.5">
                <Plus className="size-4" /> Add expense
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Expenses</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.category} · paid by {nameOf(e.paidBy)} ·{" "}
                      {e.splitMode === "equal" ? "split equally" : "custom split"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold">{formatINR(e.amount)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Remove expense"
                      onClick={() => {
                        setExpenses((prev) => prev.filter((x) => x.id !== e.id));
                        setPaid([]);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Net balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {members.map((m) => {
                const value = balances[m.id] ?? 0;
                return (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span>{m.name}</span>
                    <span
                      className={
                        value > 0.5
                          ? "font-semibold text-eco"
                          : value < -0.5
                            ? "font-semibold text-destructive"
                            : "text-muted-foreground"
                      }
                    >
                      {value > 0.5
                        ? `gets ${formatINR(Math.round(value))}`
                        : value < -0.5
                          ? `owes ${formatINR(Math.round(-value))}`
                          : "settled"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="size-4 text-primary" /> Simplified settlement
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {settlements.length === 0
                  ? "Everyone is square."
                  : `${settlements.length} transfer${settlements.length > 1 ? "s" : ""} clears every balance.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {settlements.map((s) => {
                const key = `${s.from}-${s.to}`;
                const isPaid = paid.includes(key);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3"
                  >
                    <div className="text-sm">
                      <p className="font-medium">
                        {nameOf(s.from)} → {nameOf(s.to)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatINR(s.amount)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isPaid ? "secondary" : "default"}
                      onClick={() =>
                        setPaid((prev) => (isPaid ? prev.filter((p) => p !== key) : [...prev, key]))
                      }
                    >
                      {isPaid ? "Paid" : "Mark as paid"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-surface">
            <CardHeader>
              <CardTitle className="text-sm">By category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs text-muted-foreground">
              {CATEGORIES.map((c) => {
                const sum = expenses.filter((e) => e.category === c).reduce((a, e) => a + e.amount, 0);
                if (sum === 0) return null;
                return (
                  <div key={c} className="flex justify-between">
                    <span>{c}</span>
                    <span className="font-semibold text-foreground">{formatINR(sum)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
