export type ItemKind = "ukulele" | "cake" | "gift" | "watch" | "tickets";

// Flip to true to bypass every date lock and open all doors immediately.
export const BYPASS_LOCKS: boolean = false;

// Force every door into its "day is past" state — door stays open and the
// glass showcase appears next to it. Useful for previewing the end state.
// Accepts:
//   false  — never force past
//   true   — force ALL days past
//   number — force days strictly less than this day number past (e.g. 2
//            treats day 1 as past, days 2 & 3 as normal)
export const BYPASS_PAST: boolean | number = false;

export const BIRTHDAY_CONFIG = {
  recipientName: "Fefi",
  placeName: "Fefi Land",
  headline: "Happy Birthday Weekend!",
  subhead: "Three little doors. One opens each day.",
  doors: [
    {
      day: 1,
      unlockDate: "2026-04-23",
      title: "Day One",
      message: "This is the first little surprise.",
      instructions:
        "A box once held a bed of air,\nin the storage room—your gift is there.",
      accent: "#f472b6",
      item: "ukulele" as ItemKind,
      hideItem: true,
      skipFlip: false,
    },
    {
      day: 2,
      unlockDate: "2026-04-25",
      title: "Day Two",
      message: "Not a thing — a night.",
      instructions:
        "Take my hand, take a breath\nPull me close and take one step\nKeep your eyes locked on mine\nAnd let the music be your guide\n\n✦ June 26 · 9:00 PM ✦",
      accent: "#a78bfa",
      item: "tickets" as ItemKind,
      hideItem: false,
      skipFlip: true,
    },
    {
      day: 3,
      unlockDate: "2026-04-26",
      title: "Day Three",
      message: "Something quiet, something yours.",
      instructions:
        "Slung on your back for the journey ahead,\npeek in a pocket—a little gift hid.",
      accent: "#facc15",
      item: "watch" as ItemKind,
      hideItem: true,
      skipFlip: false,
    },
  ],
} as const;

export type DoorConfig = (typeof BIRTHDAY_CONFIG.doors)[number];

export const ITEM_LABEL: Record<ItemKind, string> = {
  ukulele: "UKULELE",
  cake: "CAKE",
  gift: "GIFT",
  watch: "ROSEFIELD WATCH",
  tickets: "PAIR OF TICKETS",
};
