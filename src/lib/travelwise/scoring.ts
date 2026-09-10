import type { Journey, Preference, ScoredJourney, TravellerType } from "./types";

const WEIGHTS: Record<Preference, ScoredJourney["factors"]> = {
  best: { price: 0.24, duration: 0.2, reliability: 0.18, co2: 0.14, safety: 0.14, accessibility: 0.1 },
  cheapest: { price: 0.62, duration: 0.12, reliability: 0.1, co2: 0.06, safety: 0.06, accessibility: 0.04 },
  fastest: { price: 0.12, duration: 0.6, reliability: 0.14, co2: 0.04, safety: 0.06, accessibility: 0.04 },
  eco: { price: 0.14, duration: 0.1, reliability: 0.12, co2: 0.52, safety: 0.06, accessibility: 0.06 },
  safest: { price: 0.1, duration: 0.1, reliability: 0.22, co2: 0.06, safety: 0.44, accessibility: 0.08 },
  women: { price: 0.12, duration: 0.1, reliability: 0.16, co2: 0.06, safety: 0.48, accessibility: 0.08 },
  accessible: { price: 0.12, duration: 0.1, reliability: 0.14, co2: 0.06, safety: 0.1, accessibility: 0.48 },
  student: { price: 0.5, duration: 0.16, reliability: 0.12, co2: 0.1, safety: 0.08, accessibility: 0.04 },
};

export function effectivePrice(journey: Journey, studentMode: boolean) {
  return studentMode && journey.studentPrice ? journey.studentPrice : journey.price;
}

export function accessibilityScore(journey: Journey) {
  const a = journey.accessibility;
  const parts = [a.stepFreeBoarding, a.wheelchairAssistance, a.accessibleToilet, a.attendantSeat];
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}

export function safetyScore(journey: Journey, travellerType: TravellerType) {
  const s = journey.safety;
  let score = s.operatorReliability * 0.4 + s.transferRating * 0.3;
  score += s.daytimeArrival ? 18 : 4;
  score += s.cctv ? 6 : 0;
  if (travellerType === "solo-woman") {
    score += s.womenOnlyOption ? 8 : -6;
    score += s.daytimeArrival ? 4 : -8;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalise(value: number, min: number, max: number, invert = false) {
  if (max === min) return 100;
  const pct = ((value - min) / (max - min)) * 100;
  return Math.round(invert ? 100 - pct : pct);
}

export interface ScoreOptions {
  preference: Preference;
  travellerType: TravellerType;
  studentMode: boolean;
}

export function scoreJourneys(journeys: Journey[], opts: ScoreOptions): ScoredJourney[] {
  if (journeys.length === 0) return [];
  const prices = journeys.map((j) => effectivePrice(j, opts.studentMode));
  const durations = journeys.map((j) => j.durationMin);
  const co2 = journeys.map((j) => j.co2Kg);

  const weights = WEIGHTS[opts.preference];

  const scored: ScoredJourney[] = journeys.map((journey) => {
    const factors = {
      price: normalise(effectivePrice(journey, opts.studentMode), Math.min(...prices), Math.max(...prices), true),
      duration: normalise(journey.durationMin, Math.min(...durations), Math.max(...durations), true),
      reliability: journey.onTimePct,
      co2: normalise(journey.co2Kg, Math.min(...co2), Math.max(...co2), true),
      safety: safetyScore(journey, opts.travellerType),
      accessibility: accessibilityScore(journey),
    };
    const total = Math.round(
      factors.price * weights.price +
        factors.duration * weights.duration +
        factors.reliability * weights.reliability +
        factors.co2 * weights.co2 +
        factors.safety * weights.safety +
        factors.accessibility * weights.accessibility,
    );
    return { journey, total, factors, badges: [] };
  });

  const byTotal = [...scored].sort((a, b) => b.total - a.total);
  const greenest = [...scored].sort((a, b) => a.journey.co2Kg - b.journey.co2Kg)[0];
  const safest = [...scored].sort((a, b) => b.factors.safety - a.factors.safety)[0];
  const fastest = [...scored].sort((a, b) => a.journey.durationMin - b.journey.durationMin)[0];
  const cheapest = [...scored].sort(
    (a, b) => effectivePrice(a.journey, opts.studentMode) - effectivePrice(b.journey, opts.studentMode),
  )[0];

  byTotal[0]?.badges.push("Best Overall");
  greenest?.badges.push("Greenest");
  fastest?.badges.push("Fastest");
  cheapest?.badges.push("Cheapest");
  if (opts.travellerType === "solo-woman") safest?.badges.push("Safest Match");
  else safest?.badges.push("Safest");
  scored.forEach((s) => {
    if (opts.studentMode && s.journey.studentPrice) s.badges.push("Student Offer");
    if (opts.travellerType === "accessibility" && s.factors.accessibility === 100)
      s.badges.push("Fully Accessible");
  });

  return byTotal;
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export const PREFERENCE_LABELS: Record<Preference, string> = {
  best: "Best Overall",
  cheapest: "Cheapest",
  fastest: "Fastest",
  eco: "Eco-friendly",
  safest: "Safest",
  women: "Women-friendly",
  accessible: "Accessible",
  student: "Student",
};

export const TRAVELLER_LABELS: Record<TravellerType, string> = {
  solo: "Solo",
  "solo-woman": "Solo Woman",
  group: "Group",
  family: "Family",
  accessibility: "Accessibility Needs",
  student: "Student",
};
