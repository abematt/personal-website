"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Group } from "three";
import { ItemMesh } from "./items";
import { ITEM_LABEL, type DoorConfig, type ItemKind } from "./config";

// Where items drop into the main scene after the inspect modal closes.
// Forward of the doors so they don't clip into the swinging door.
export const DROP_POS: [number, number, number] = [0, 1.0, 2.8];

const INSPECT_SCALE: Record<ItemKind, number> = {
  ukulele: 1.0,
  cake: 2.0,
  gift: 2.2,
  watch: 2.4,
  tickets: 1.3,
};

function InspectedItem({ kind }: { kind: ItemKind }) {
  const ref = useRef<Group>(null);
  const targetScale = INSPECT_SCALE[kind];

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    // Scale-in entry animation
    const k = 1 - Math.pow(0.05, delta);
    const current = g.scale.x;
    const next = current + (targetScale - current) * k;
    g.scale.setScalar(next);
  });

  return (
    <group ref={ref} scale={0.01}>
      <ItemMesh kind={kind} />
    </group>
  );
}

export function InspectModal({
  doorConfig,
  onDone,
}: {
  doorConfig: DoorConfig;
  onDone: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const itemName = ITEM_LABEL[doorConfig.item];
  const hideItem = doorConfig.hideItem;
  const skipFlip = doorConfig.skipFlip;

  return (
    <div
      className="fixed inset-0 z-30"
      style={{
        animation: "fadeIn 0.5s ease-out",
        background:
          "radial-gradient(ellipse at 50% 20%, #fff4ea 0%, #ffe4e1 45%, #ffd6e0 75%, #fbcfe8 100%)",
      }}
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes floatConfetti {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(15deg); }
        }
      `}</style>

      {/* Soft confetti dots scattered in the backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          ["#f9a8d4", "8%", "18%", "0s"],
          ["#fcd34d", "82%", "22%", "0.6s"],
          ["#c4b5fd", "16%", "72%", "1.2s"],
          ["#fda4af", "88%", "68%", "0.9s"],
          ["#86efac", "50%", "12%", "0.3s"],
          ["#93c5fd", "12%", "48%", "1.5s"],
          ["#fdba74", "90%", "40%", "0.2s"],
          ["#f0abfc", "30%", "88%", "1.1s"],
        ].map(([color, left, top, delay], i) => (
          <span
            key={i}
            className="absolute block h-2.5 w-2.5 rounded-full"
            style={{
              left,
              top,
              background: color,
              animation: `floatConfetti 4s ease-in-out infinite`,
              animationDelay: delay,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {!hideItem && (
        <>
          {/* 3D inspect canvas — user drags to rotate, scrolls to zoom */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 2.5], fov: 42 }} dpr={[1, 2]} gl={{ alpha: true }}>
              <ambientLight intensity={1.1} />
              {/* Warm key light */}
              <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff8ea" />
              {/* Pink rim */}
              <spotLight
                position={[-4, 2, 3]}
                intensity={1.2}
                angle={0.8}
                penumbra={0.8}
                color="#f9a8d4"
              />
              {/* Amber accent */}
              <pointLight position={[3, -2, 2]} intensity={0.8} color="#fbbf24" />
              {/* Soft top fill */}
              <directionalLight position={[0, 10, 2]} intensity={0.5} color="#ffffff" />

              <InspectedItem kind={doorConfig.item} />

              <OrbitControls
                enablePan={false}
                enableZoom
                enableRotate
                minDistance={1.2}
                maxDistance={5}
                rotateSpeed={0.9}
                zoomSpeed={0.6}
              />
            </Canvas>
          </div>

          {/* Top label */}
          <div className="pointer-events-none absolute inset-x-0 top-10 z-10 flex flex-col items-center px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-rose-500">you get</p>
            <h2 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text font-serif text-4xl italic text-transparent md:text-6xl">
              A {itemName}
            </h2>
            <p className="mt-4 text-xs italic text-stone-500">drag to rotate · scroll to zoom</p>
          </div>
        </>
      )}

      {hideItem && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex flex-col items-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-rose-500">a little clue</p>
          <h2 className="mt-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text font-serif text-4xl italic text-transparent md:text-5xl">
            Something is waiting for you
          </h2>
          <p className="mt-3 text-sm italic text-stone-500">Flip the card below for your hint.</p>
        </div>
      )}

      {/* Card area — flip card for hint-type doors, static reveal for skipFlip doors */}
      <div
        className={
          hideItem
            ? "pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
            : "pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center px-6"
        }
      >
        {skipFlip ? (
          <div className="pointer-events-auto flex min-h-[220px] w-[360px] flex-col items-center justify-center gap-3 rounded-2xl border border-amber-100/40 bg-amber-50/95 p-6 shadow-2xl">
            <p className="whitespace-pre-line text-center font-serif italic leading-snug text-stone-700">
              {doorConfig.instructions}
            </p>
            <button
              onClick={onDone}
              className="mt-2 rounded-full border border-amber-200 bg-white px-5 py-2 text-sm italic leading-tight text-amber-700 transition hover:bg-amber-100"
            >
              Close
            </button>
          </div>
        ) : (
          <div
            className="pointer-events-auto relative h-[220px] w-[360px]"
            style={{ perspective: "1200px" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-rose-100/40 bg-white/95 p-6 shadow-2xl"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <p className="text-center font-serif text-xl italic text-stone-700">
                  Want to know where it is?
                </p>
                <p className="text-center text-xs italic text-stone-500">Flip this card</p>
                <button
                  onClick={() => setFlipped(true)}
                  className="mt-3 rounded-full border border-rose-200 bg-rose-50 px-8 py-2 text-sm italic text-rose-600 transition hover:bg-rose-100"
                >
                  Flip
                </button>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-amber-100/40 bg-amber-50/95 p-6 shadow-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500">hint</p>
                <p className="whitespace-pre-line text-center font-serif italic text-stone-700">
                  {doorConfig.instructions}
                </p>
                <button
                  onClick={onDone}
                  className="mt-2 rounded-full border border-amber-200 bg-white px-5 py-2 text-sm italic leading-tight text-amber-700 transition hover:bg-amber-100"
                >
                  Click here to drop everything and go find it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
