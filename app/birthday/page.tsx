import dynamic from "next/dynamic";
import { BIRTHDAY_CONFIG } from "./config";

import LoadingScreen from "./LoadingScreen";

const Calendar = dynamic(() => import("./Calendar"), { ssr: false });

export const metadata = {
  title: "A little something",
  robots: { index: false, follow: false },
};

export default function BirthdayPage() {
  return (
    <>
      <Calendar />
      <LoadingScreen />

      {/* Soft radial scrim behind the header so all type stays legible against
          both sky-blue (top) and the green tree/grass. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(30,18,44,0.55) 0%, rgba(30,18,44,0.35) 35%, rgba(30,18,44,0) 75%)",
        }}
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-8 text-center">
        {/* "for Fefi" ribbon — warm accent pill, pops against both sky and green */}
        <span
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-rose-500/95 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white shadow-lg ring-1 ring-white/40 backdrop-blur"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
        >
          <span aria-hidden className="text-amber-200">✦</span>
          for {BIRTHDAY_CONFIG.recipientName}
          <span aria-hidden className="text-amber-200">✦</span>
        </span>

        {/* Place name — loudest element on the page */}
        <h1
          className="mt-5 bg-gradient-to-b from-amber-100 via-rose-200 to-rose-300 bg-clip-text font-serif text-6xl italic leading-[0.95] tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] md:text-8xl"
          style={{
            WebkitTextStroke: "0.5px rgba(60,20,40,0.35)",
          }}
        >
          {BIRTHDAY_CONFIG.placeName}
        </h1>

        {/* Headline — second tier, warm cream on darkened scrim */}
        <p
          className="mt-3 font-serif text-xl italic text-amber-50 md:text-2xl"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.55)" }}
        >
          {BIRTHDAY_CONFIG.headline}
        </p>

        {/* Subhead — third tier, softer */}
        <p
          className="mt-1 max-w-md font-serif text-sm italic text-rose-100/90"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          {BIRTHDAY_CONFIG.subhead}
        </p>

        {/* Controls hint — smallest tier, muted */}
        <p
          className="mt-5 text-[11px] uppercase tracking-[0.25em] text-white/70"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          drag to look · scroll to zoom · tap a door
        </p>
      </div>
    </>
  );
}
