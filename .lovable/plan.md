# TravelWise — Indian travel discovery & comparison platform

A polished, mobile-first demo app for comparing flights, trains and buses across India, with rich mock data (no backend needed for this stage).

## Pages

| Page | What's on it |
| --- | --- |
| Home (`/`) | Sticky header, hero search (Mumbai → Delhi default), trip types, mode filter, flexible-date fare strip, traveller count, traveller-type chips, preference filters, ranked journey cards |
| Explore | Destination cards (Goa, Manali, Jaipur, Rishikesh, Udaipur…) with best-time-to-travel hints |
| Compare | Side-by-side comparison of selected journeys, factor-by-factor |
| Price Trends | "Travel when prices are low" monthly calendar, destination price index with a "travel now or later" gauge, 7-day/30-day trend charts, smart multimodal combos |
| Travel Safe | Solo women hub: safety scores, women-only groups, verified co-ed groups, stay-solo planning |
| Groups | Trip planner with member roster, expense entry, equal/custom splits, simplified settlements and "Mark as paid" |
| Rewards | Eco-points, tiers Explorer → Pro, demo KYC badges, CO2 saved tracker |
| Eco Travel | Emissions per mode, greenest routes, eco tips |
| Student verification | Demo student ID flow that unlocks student fares app-wide |

## Key behaviours

- **Scoring engine**: each journey gets sub-scores for price, duration, reliability, CO2, safety suitability and accessibility; the preference filter (Cheapest, Fastest, Eco-friendly, Safest, Women-friendly, Accessible, Student, Best Overall) reweights the ranking live.
- **Badges** on cards: Best Overall, Greenest, Safest Match, Student Offer, Fastest.
- **Traveller types** (Solo, Solo Woman, Group, Family, Accessibility Needs, Student) adjust which factors matter and which filters appear.
- **Accessibility filters**: step-free boarding, wheelchair assistance, accessible toilet — with a score breakdown per journey.
- **Student mode**: after the demo verification, discounted fares and a Student Offer badge appear.
- **Groups**: settlement simplification reduces who-pays-whom to the fewest transfers; balances update as expenses and payments change.
- **Language selector** EN / हिंदी switches header and key labels.
- All state is in-app for the demo (no accounts, nothing saved between visits).

## Design direction

Modern Indian travel: deep indigo base with a warm saffron/marigold accent and a teal for eco signals. Confident geometric display type for headings, clean sans for body. Rounded cards, soft depth, generous spacing, mode-coloured accents (flight / train / bus). Mobile-first with a bottom-safe sticky search on small screens.

## Technical notes

- TanStack Start file routes, one route file per page, each with its own head metadata.
- Mock data + scoring in `src/lib/travelwise/` (journeys, destinations, price history, groups, rewards); pure functions so ranking and settlement are testable.
- Shared UI in `src/components/travelwise/` (header, search panel, journey card, compare modal, gauges, calendar heatmap).
- Semantic design tokens in `src/styles.css`; no hardcoded colour utilities.
- Charts via Recharts; icons via Lucide.

## Not included in this stage

Real fares or live APIs, real KYC/student verification, real payments, accounts or persistence — all clearly demo data.
