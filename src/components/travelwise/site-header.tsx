import { Link } from "@tanstack/react-router";
import { Bell, Compass, Globe, Leaf, Menu, ShieldCheck, Sparkles, User } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTravelWise } from "@/lib/travelwise/store";
import type { DictKey } from "@/lib/travelwise/i18n";

const NAV: { to: string; key: DictKey }[] = [
  { to: "/", key: "planTrip" },
  { to: "/explore", key: "explore" },
  { to: "/compare", key: "compare" },
  { to: "/travel-safe", key: "travelSafe" },
  { to: "/groups", key: "groups" },
  { to: "/rewards", key: "rewards" },
  { to: "/price-trends", key: "priceTrends" },
  { to: "/eco-travel", key: "ecoTravel" },
];

export function SiteHeader() {
  const { lang, setLang, t, ecoPoints, studentVerified, kycVerified, compareIds } = useTravelWise();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">TRAVELWISE</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground xl:px-3"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            aria-label="Switch language"
          >
            <Globe className="size-4" />
            <span className="text-xs font-semibold">{lang === "en" ? "EN" : "हिंदी"}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label={t("notifications")}>
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">Mumbai → Goa fell 18%</span>
                <span className="text-xs text-muted-foreground">Trains from ₹1,290 for late Sep</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">Himachal Her-Trails has 2 spots left</span>
                <span className="text-xs text-muted-foreground">Women-only group · 18–24 Sep</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start gap-0.5">
                <span className="text-sm font-medium">You saved 214 kg CO₂ this year</span>
                <span className="text-xs text-muted-foreground">+320 eco-points added</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full" aria-label="Profile">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span>Mahek Jethva</span>
                <span className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    <Leaf className="size-3" /> {ecoPoints.toLocaleString("en-IN")} pts
                  </Badge>
                  {kycVerified && (
                    <Badge className="gap-1 bg-eco text-eco-foreground text-[10px]">
                      <ShieldCheck className="size-3" /> KYC
                    </Badge>
                  )}
                  {studentVerified && (
                    <Badge className="gap-1 bg-accent text-accent-foreground text-[10px]">
                      <Sparkles className="size-3" /> Student
                    </Badge>
                  )}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/my-trips">{t("myTrips")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/groups">{t("groups")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/kyc">{t("kyc")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/student">{t("studentVerification")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/rewards">{t("rewards")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <SheetTitle className="font-display text-base">TRAVELWISE</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  to="/student"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {t("studentVerification")}
                </Link>
                <Link
                  to="/kyc"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {t("kyc")}
                </Link>
                <Link
                  to="/my-trips"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {t("myTrips")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {compareIds.length > 0 && (
        <div className="border-t border-border/60 bg-secondary/60">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <span className="text-xs font-medium text-secondary-foreground">
              {compareIds.length} journey{compareIds.length > 1 ? "s" : ""} selected for comparison
            </span>
            <Button asChild size="sm" variant="default" className="h-7 text-xs">
              <Link to="/compare">Open compare</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
