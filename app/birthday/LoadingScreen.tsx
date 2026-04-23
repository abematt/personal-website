"use client";

import { useEffect, useState } from "react";
import { BIRTHDAY_CONFIG } from "./config";

// Full-screen intro overlay shown while the 3D Calendar hydrates and the
// r3f/rapier/drei bundles load. Prevents the header from flashing against a
// bare background during the gap between server HTML and client mount.
export default function LoadingScreen() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    let fadeTimer: number | undefined;
    let goneTimer: number | undefined;
    let fallbackTimer: number | undefined;

    const startFade = () => {
      if (fadeTimer !== undefined) return;
      // Tiny hold so the scene has a frame to settle before the fade starts.
      fadeTimer = window.setTimeout(() => setPhase("fading"), 150);
      goneTimer = window.setTimeout(() => setPhase("gone"), 150 + 650);
    };

    window.addEventListener("birthday:calendar-ready", startFade, { once: true });
    // Safety net: if the ready event never fires (error, unsupported WebGL),
    // don't trap the user behind the overlay.
    fallbackTimer = window.setTimeout(startFade, 8000);

    return () => {
      window.removeEventListener("birthday:calendar-ready", startFade);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (goneTimer !== undefined) window.clearTimeout(goneTimer);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-[600ms] ease-out"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        background:
          "linear-gradient(180deg, #2a1a4a 0%, #4a2d6b 35%, #8a5a8f 70%, #d89a8a 100%)",
      }}
    >
      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-500/95 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white shadow-lg ring-1 ring-white/40 backdrop-blur">
        <span className="text-amber-200">✦</span>
        for {BIRTHDAY_CONFIG.recipientName}
        <span className="text-amber-200">✦</span>
      </span>
      <h1
        className="bg-gradient-to-b from-amber-100 via-rose-200 to-rose-300 bg-clip-text font-serif text-5xl italic leading-[0.95] tracking-tight text-transparent md:text-7xl"
      >
        {BIRTHDAY_CONFIG.placeName}
      </h1>
      <div className="mt-10 flex items-center gap-2">
        <Dot delay="0ms" />
        <Dot delay="180ms" />
        <Dot delay="360ms" />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="block h-2 w-2 animate-bounce rounded-full bg-amber-100/90"
      style={{ animationDelay: delay }}
    />
  );
}
