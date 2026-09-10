export type Lang = "en" | "hi";

export const DICT = {
  planTrip: { en: "Plan Trip", hi: "यात्रा योजना" },
  explore: { en: "Explore", hi: "खोजें" },
  compare: { en: "Compare", hi: "तुलना" },
  travelSafe: { en: "Travel Safe", hi: "सुरक्षित यात्रा" },
  groups: { en: "Groups", hi: "ग्रुप" },
  rewards: { en: "Rewards", hi: "रिवॉर्ड" },
  priceTrends: { en: "Price Trends", hi: "कीमत रुझान" },
  ecoTravel: { en: "Eco Travel", hi: "इको यात्रा" },
  myTrips: { en: "My Trips", hi: "मेरी यात्राएँ" },
  kyc: { en: "KYC", hi: "केवाईसी" },
  studentVerification: { en: "Student Verification", hi: "छात्र सत्यापन" },
  notifications: { en: "Notifications", hi: "सूचनाएँ" },
  search: { en: "Search journeys", hi: "यात्राएँ खोजें" },
  from: { en: "From", hi: "कहाँ से" },
  to: { en: "To", hi: "कहाँ तक" },
  travellers: { en: "Travellers", hi: "यात्री" },
  oneWay: { en: "One Way", hi: "एक तरफ़ा" },
  roundTrip: { en: "Round Trip", hi: "आना-जाना" },
  multiCity: { en: "Multi-City", hi: "कई शहर" },
  all: { en: "All", hi: "सभी" },
  flights: { en: "Flights", hi: "फ्लाइट" },
  trains: { en: "Trains", hi: "ट्रेन" },
  buses: { en: "Buses", hi: "बस" },
  heroTitle: {
    en: "Compare flights, trains and buses across India — in one search.",
    hi: "भारत भर की फ्लाइट, ट्रेन और बस की तुलना — एक ही खोज में।",
  },
  heroSub: {
    en: "TravelWise scores every journey on price, time, reliability, carbon, safety and accessibility, so the right option is the first one you see.",
    hi: "TravelWise हर यात्रा को कीमत, समय, भरोसे, कार्बन, सुरक्षा और सुगमता पर आँकता है, ताकि सही विकल्प सबसे पहले दिखे।",
  },
} as const;

export type DictKey = keyof typeof DICT;

export function t(key: DictKey, lang: Lang) {
  return DICT[key][lang];
}
