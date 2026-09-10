export type Mode = "flight" | "train" | "bus";

export type TripType = "one-way" | "round-trip" | "multi-city";

export type TravellerType =
  | "solo"
  | "solo-woman"
  | "group"
  | "family"
  | "accessibility"
  | "student";

export type Preference =
  | "best"
  | "cheapest"
  | "fastest"
  | "eco"
  | "safest"
  | "women"
  | "accessible"
  | "student";

export interface Accessibility {
  stepFreeBoarding: boolean;
  wheelchairAssistance: boolean;
  accessibleToilet: boolean;
  attendantSeat: boolean;
}

export interface SafetyDetail {
  operatorReliability: number; // 0-100
  daytimeArrival: boolean;
  transferRating: number; // 0-100
  womenOnlyOption: boolean;
  cctv: boolean;
}

export interface Journey {
  id: string;
  mode: Mode;
  operator: string;
  serviceName: string;
  code: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string; // HH:mm
  arrival: string;
  arrivalDayOffset: number;
  durationMin: number;
  price: number;
  studentPrice?: number;
  seatClass: string;
  stops: number;
  onTimePct: number;
  co2Kg: number;
  refundable: boolean;
  amenities: string[];
  accessibility: Accessibility;
  safety: SafetyDetail;
}

export interface ScoredJourney {
  journey: Journey;
  total: number;
  factors: {
    price: number;
    duration: number;
    reliability: number;
    co2: number;
    safety: number;
    accessibility: number;
  };
  badges: string[];
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  tagline: string;
  bestMonths: string[];
  avoidMonths: string[];
  monthlyIndex: number[]; // 12 values, 0-100 relative price index
  priceIndex: number; // current index 0-100
  verdict: "now" | "wait" | "watch";
  cheapestMode: Mode;
  fromMumbai: number;
  emoji: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatarInitials: string;
}

export type ExpenseCategory = "Travel" | "Stay" | "Food" | "Activities" | "Other";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  paidBy: string;
  splitMode: "equal" | "custom";
  shares: Record<string, number>; // memberId -> amount (for custom) or weight
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface TravelGroup {
  id: string;
  name: string;
  route: string;
  dates: string;
  type: "women-only" | "co-ed";
  verified: boolean;
  spots: number;
  filled: number;
  hostName: string;
  hostRating: number;
  safetyScore: number;
  tags: string[];
}
