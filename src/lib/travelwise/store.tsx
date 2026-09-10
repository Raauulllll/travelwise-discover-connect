import * as React from "react";
import type { Lang } from "./i18n";
import { DICT, type DictKey } from "./i18n";
import type { Mode, Preference, TravellerType, TripType } from "./types";

export interface AccessibilityFilters {
  stepFree: boolean;
  wheelchair: boolean;
  accessibleToilet: boolean;
}

interface TravelWiseState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;

  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  swap: () => void;

  tripType: TripType;
  setTripType: (v: TripType) => void;
  modeFilter: Mode | "all";
  setModeFilter: (v: Mode | "all") => void;
  travellers: number;
  setTravellers: (n: number) => void;
  dateOffset: number;
  setDateOffset: (n: number) => void;

  travellerType: TravellerType;
  setTravellerType: (v: TravellerType) => void;
  preference: Preference;
  setPreference: (v: Preference) => void;
  access: AccessibilityFilters;
  toggleAccess: (key: keyof AccessibilityFilters) => void;

  studentVerified: boolean;
  setStudentVerified: (v: boolean) => void;
  kycVerified: boolean;
  setKycVerified: (v: boolean) => void;

  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  ecoPoints: number;
  addEcoPoints: (n: number) => void;
}

const Ctx = React.createContext<TravelWiseState | null>(null);

export function TravelWiseProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("en");
  const [from, setFrom] = React.useState("Mumbai");
  const [to, setTo] = React.useState("Delhi");
  const [tripType, setTripType] = React.useState<TripType>("one-way");
  const [modeFilter, setModeFilter] = React.useState<Mode | "all">("all");
  const [travellers, setTravellersRaw] = React.useState(1);
  const [dateOffset, setDateOffset] = React.useState(0);
  const [travellerType, setTravellerTypeRaw] = React.useState<TravellerType>("solo");
  const [preference, setPreference] = React.useState<Preference>("best");
  const [access, setAccess] = React.useState<AccessibilityFilters>({
    stepFree: false,
    wheelchair: false,
    accessibleToilet: false,
  });
  const [studentVerified, setStudentVerified] = React.useState(false);
  const [kycVerified, setKycVerified] = React.useState(true);
  const [compareIds, setCompareIds] = React.useState<string[]>([]);
  const [ecoPoints, setEcoPoints] = React.useState(7420);

  const setTravellerType = React.useCallback((v: TravellerType) => {
    setTravellerTypeRaw(v);
    if (v === "solo-woman") setPreference("women");
    else if (v === "accessibility") setPreference("accessible");
    else if (v === "student") setPreference("student");
    else setPreference("best");
  }, []);

  const value: TravelWiseState = {
    lang,
    setLang,
    t: React.useCallback((key: DictKey) => DICT[key][lang], [lang]),
    from,
    to,
    setFrom,
    setTo,
    swap: () => {
      setFrom(to);
      setTo(from);
    },
    tripType,
    setTripType,
    modeFilter,
    setModeFilter,
    travellers,
    setTravellers: (n) => setTravellersRaw(Math.max(1, Math.min(9, n))),
    dateOffset,
    setDateOffset,
    travellerType,
    setTravellerType,
    preference,
    setPreference,
    access,
    toggleAccess: (key) => setAccess((prev) => ({ ...prev, [key]: !prev[key] })),
    studentVerified,
    setStudentVerified,
    kycVerified,
    setKycVerified,
    compareIds,
    toggleCompare: (id) =>
      setCompareIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id],
      ),
    clearCompare: () => setCompareIds([]),
    ecoPoints,
    addEcoPoints: (n) => setEcoPoints((p) => p + n),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTravelWise() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTravelWise must be used inside TravelWiseProvider");
  return ctx;
}
