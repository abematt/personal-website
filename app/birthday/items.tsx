"use client";

import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { CanvasTexture, RepeatWrapping } from "three";
import type { ItemKind } from "./config";
import { registerImpact } from "./impacts";

function useKickable() {
  const bodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    return registerImpact(body);
  }, []);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const body = bodyRef.current;
    if (!body) return;
    body.wakeUp();
    body.setLinvel(
      {
        x: (Math.random() - 0.5) * 0.6,
        y: 1.4 + Math.random() * 0.4,
        z: (Math.random() - 0.5) * 0.6,
      },
      true,
    );
    body.setAngvel(
      {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.5,
      },
      true,
    );
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return { bodyRef, handleClick, handlePointerOver, handlePointerOut };
}

function UkuleleVisual() {
  return (
    <group>
      {/* body — disc with flat face toward +Z (camera) */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
        <meshStandardMaterial color="#d4944a" roughness={0.45} />
      </mesh>
      {/* soundhole on the front face, upper portion of body */}
      <mesh position={[0, -0.2, 0.041]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.001, 20]} />
        <meshStandardMaterial color="#241812" />
      </mesh>
      {/* bridge — lower portion of body */}
      <mesh position={[0, -0.33, 0.045]}>
        <boxGeometry args={[0.12, 0.02, 0.008]} />
        <meshStandardMaterial color="#4a2f1c" />
      </mesh>
      {/* neck — extends up from body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.055, 0.5, 0.05]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.5} />
      </mesh>
      {/* fretboard on front of neck */}
      <mesh position={[0, 0.15, 0.028]}>
        <boxGeometry args={[0.05, 0.5, 0.006]} />
        <meshStandardMaterial color="#2d1a0d" />
      </mesh>
      {/* headstock at top */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.11, 0.14, 0.05]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.5} />
      </mesh>
    </group>
  );
}

function UkuleleColliders() {
  return (
    <>
      {/* body — cylinder with axis along Z to match the front-facing disc */}
      <CylinderCollider
        args={[0.04, 0.22]}
        position={[0, -0.25, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* neck */}
      <CuboidCollider args={[0.0275, 0.25, 0.025]} position={[0, 0.15, 0]} />
      {/* headstock */}
      <CuboidCollider args={[0.055, 0.07, 0.025]} position={[0, 0.45, 0]} />
    </>
  );
}

function CakeVisual() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.2, 24]} />
        <meshStandardMaterial color="#f5d0c5" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.2, 0.04, 24]} />
        <meshStandardMaterial color="#ffe4e6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 10]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial emissive="#fb923c" emissiveIntensity={1.5} color="#fde68a" />
      </mesh>
    </group>
  );
}

function CakeColliders() {
  return <CylinderCollider args={[0.12, 0.23]} position={[0, 0.02, 0]} />;
}

function GiftVisual() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.3, 0.35]} />
        <meshStandardMaterial color="#fb7185" roughness={0.6} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.36, 0.31, 0.08]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.08, 0.31, 0.36]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>
    </group>
  );
}

function GiftColliders() {
  return <CuboidCollider args={[0.18, 0.15, 0.18]} />;
}

function useMeshBandTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Warm gold base
    ctx.fillStyle = "#d4ae57";
    ctx.fillRect(0, 0, 64, 64);

    // Dark shadow chevrons — the troughs between woven cords
    ctx.strokeStyle = "rgba(60, 38, 8, 0.55)";
    ctx.lineWidth = 0.9;
    for (let y = 0; y <= 64; y += 4) {
      ctx.beginPath();
      for (let x = 0; x < 64; x += 8) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 4, y - 2);
        ctx.lineTo(x + 8, y);
      }
      ctx.stroke();
    }
    // Light highlight chevrons — the crest of each cord
    ctx.strokeStyle = "rgba(255, 240, 180, 0.55)";
    ctx.lineWidth = 0.7;
    for (let y = 2; y <= 66; y += 4) {
      ctx.beginPath();
      for (let x = 4; x < 68; x += 8) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 4, y - 2);
        ctx.lineTo(x + 8, y);
      }
      ctx.stroke();
    }

    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(2, 5);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function WatchVisual() {
  const bandTex = useMeshBandTexture();

  const caseRadius = 0.16;
  const caseScaleX = 0.72;
  // After scale+rotation: ellipse with X half = 0.115, Y half = 0.16 (portrait)

  // 12 hour-marker dots positioned around the bezel edge
  const markerRx = caseRadius * caseScaleX * 0.82;
  const markerRy = caseRadius * 0.82;
  const markers = Array.from({ length: 12 }, (_, i) => {
    const theta = (i / 12) * Math.PI * 2;
    return [Math.sin(theta) * markerRx, Math.cos(theta) * markerRy] as const;
  });

  return (
    <group>
      {/* Top mesh-strap */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.11, 0.36, 0.026]} />
        <meshStandardMaterial
          color="#d4ae57"
          metalness={0.8}
          roughness={0.45}
          map={bandTex ?? undefined}
        />
      </mesh>
      {/* Bottom mesh-strap */}
      <mesh position={[0, -0.32, 0]} castShadow>
        <boxGeometry args={[0.11, 0.36, 0.026]} />
        <meshStandardMaterial
          color="#d4ae57"
          metalness={0.8}
          roughness={0.45}
          map={bandTex ?? undefined}
        />
      </mesh>

      {/* Oval gold case — portrait orientation */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[caseScaleX, 1, 1]} castShadow>
        <cylinderGeometry args={[caseRadius, caseRadius, 0.055, 48]} />
        <meshStandardMaterial color="#d4ae57" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Bezel disc — well in front of case front face */}
      <mesh position={[0, 0, 0.032]} rotation={[Math.PI / 2, 0, 0]} scale={[caseScaleX, 1, 1]}>
        <cylinderGeometry args={[caseRadius, caseRadius, 0.003, 48]} />
        <meshStandardMaterial color="#f0cd62" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Mother-of-pearl dial — sits on top of bezel with a clear z gap */}
      <mesh
        position={[0, 0, 0.036]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[caseScaleX, 1, 1]}
      >
        <cylinderGeometry
          args={[caseRadius - 0.018, caseRadius - 0.018, 0.001, 48]}
        />
        <meshStandardMaterial color="#f6f1e4" metalness={0.2} roughness={0.35} />
      </mesh>

      {/* 12 hour-marker dots */}
      {markers.map(([mx, my], i) => (
        <mesh key={i} position={[mx, my, 0.038]}>
          <sphereGeometry args={[0.0045, 10, 8]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Brand text */}
      <Text
        position={[0, 0.045, 0.039]}
        fontSize={0.016}
        color="#2a1f14"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        ROSEFIELD
      </Text>
      <Text
        position={[0, 0.028, 0.039]}
        fontSize={0.008}
        color="#5a4030"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        AMSINYC
      </Text>

      {/* Hour hand — ~10 o'clock (counter-clockwise from 12) */}
      <group position={[0, 0, 0.04]} rotation={[0, 0, Math.PI / 3]}>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[0.005, 0.055, 0.0015]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
      {/* Minute hand — ~2 o'clock (clockwise from 12) */}
      <group position={[0, 0, 0.0405]} rotation={[0, 0, -Math.PI / 3]}>
        <mesh position={[0, 0.047, 0]}>
          <boxGeometry args={[0.004, 0.095, 0.0015]} />
          <meshStandardMaterial color="#c9a14a" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
      {/* Center pivot */}
      <mesh position={[0, 0, 0.042]}>
        <cylinderGeometry args={[0.006, 0.006, 0.002, 14]} />
        <meshStandardMaterial color="#c9a14a" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Crown — stem + textured knob */}
      <mesh position={[0.12, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 0.022, 16]} />
        <meshStandardMaterial color="#d4ae57" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.135, 0.015, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 14]} />
        <meshStandardMaterial color="#f0cd62" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
}

function WatchColliders() {
  return (
    <>
      <CuboidCollider args={[0.115, 0.16, 0.028]} position={[0, 0, 0]} />
      <CuboidCollider args={[0.055, 0.18, 0.015]} position={[0, 0.32, 0]} />
      <CuboidCollider args={[0.055, 0.18, 0.015]} position={[0, -0.32, 0]} />
    </>
  );
}

function TicketStub({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const W = 1.1;
  const H = 0.44;
  const D = 0.016;
  const STUB_W = 0.28;
  const RED = "#c53a4a";
  const DARK_RED = "#7e1a24";
  const CREAM = "#f8efd8";
  const GOLD = "#f5c65a";

  // Text box lives on the main (non-stub) portion.
  const mainLeft = -W / 2;
  const mainRight = W / 2 - STUB_W;
  const mainCenterX = (mainLeft + mainRight) / 2;
  const mainWidth = mainRight - mainLeft;
  const stubCenterX = W / 2 - STUB_W / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Paper body */}
      <mesh castShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      {/* Red ink panel covering the main body, leaving a cream border */}
      <mesh position={[mainCenterX, 0, D / 2 + 0.0004]}>
        <boxGeometry args={[mainWidth - 0.05, H - 0.05, 0.0005]} />
        <meshStandardMaterial color={RED} roughness={0.85} />
      </mesh>
      {/* Gold pinstripe above title */}
      <mesh position={[mainCenterX, 0.165, D / 2 + 0.0008]}>
        <boxGeometry args={[mainWidth - 0.1, 0.004, 0.0003]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Gold pinstripe below date */}
      <mesh position={[mainCenterX, -0.17, D / 2 + 0.0008]}>
        <boxGeometry args={[mainWidth - 0.1, 0.004, 0.0003]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Stub side — cream colored with red ink accents */}
      <mesh position={[stubCenterX, 0, D / 2 + 0.0004]}>
        <boxGeometry args={[STUB_W - 0.04, H - 0.05, 0.0005]} />
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </mesh>
      {/* Dashed perforation line between main and stub */}
      {Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        return (
          <mesh
            key={`dash-${i}`}
            position={[
              mainRight,
              -H / 2 + 0.035 + t * (H - 0.07),
              D / 2 + 0.0008,
            ]}
          >
            <boxGeometry args={[0.006, 0.016, 0.0003]} />
            <meshStandardMaterial color={DARK_RED} />
          </mesh>
        );
      })}

      {/* Title */}
      <Text
        position={[mainCenterX, 0.095, D / 2 + 0.0012]}
        fontSize={0.07}
        color={CREAM}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        maxWidth={mainWidth - 0.08}
        textAlign="center"
        outlineWidth={0.002}
        outlineColor={DARK_RED}
      >
        HIGH SCHOOL{"\n"}MUSICAL 3
      </Text>
      {/* Subtitle */}
      <Text
        position={[mainCenterX, -0.01, D / 2 + 0.0012]}
        fontSize={0.024}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
      >
        — THE CONCERT —
      </Text>
      {/* Date */}
      <Text
        position={[mainCenterX, -0.08, D / 2 + 0.0012]}
        fontSize={0.046}
        color={CREAM}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        JUNE 26 · 9:00 PM
      </Text>
      {/* Flavor line */}
      <Text
        position={[mainCenterX, -0.205, D / 2 + 0.0012]}
        fontSize={0.022}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        seat: you + me
      </Text>

      {/* Stub — vertical ADMIT ONE text */}
      <Text
        position={[stubCenterX, 0.05, D / 2 + 0.0012]}
        rotation={[0, 0, -Math.PI / 2]}
        fontSize={0.034}
        color={DARK_RED}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.28}
      >
        ADMIT ONE
      </Text>
      {/* Stub star */}
      <Text
        position={[stubCenterX, -0.12, D / 2 + 0.0012]}
        fontSize={0.08}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
      >
        ★
      </Text>
    </group>
  );
}

function TicketsVisual() {
  return (
    <group>
      {/* Back ticket, offset and tilted slightly */}
      <TicketStub
        position={[0.05, -0.03, -0.012]}
        rotation={[0, 0, -0.09]}
      />
      {/* Front ticket */}
      <TicketStub position={[-0.04, 0.02, 0.005]} rotation={[0, 0, 0.06]} />
    </group>
  );
}

function TicketsColliders() {
  // One flat cuboid covering both stacked tickets.
  return <CuboidCollider args={[0.58, 0.25, 0.028]} />;
}

export function ItemMesh({ kind }: { kind: ItemKind }) {
  if (kind === "ukulele") return <UkuleleVisual />;
  if (kind === "cake") return <CakeVisual />;
  if (kind === "watch") return <WatchVisual />;
  if (kind === "tickets") return <TicketsVisual />;
  return <GiftVisual />;
}

function ItemColliders({ kind }: { kind: ItemKind }) {
  if (kind === "ukulele") return <UkuleleColliders />;
  if (kind === "cake") return <CakeColliders />;
  if (kind === "watch") return <WatchColliders />;
  if (kind === "tickets") return <TicketsColliders />;
  return <GiftColliders />;
}

export function FallingItem({
  kind,
  position,
}: {
  kind: ItemKind;
  position: [number, number, number];
}) {
  const angularVelocity: [number, number, number] = [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
  ];
  const { bodyRef, handleClick, handlePointerOver, handlePointerOut } = useKickable();
  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      angularVelocity={angularVelocity}
      linearVelocity={[0, 0, 1.2]}
      restitution={0.05}
      friction={0.9}
      linearDamping={0.5}
      angularDamping={2.5}
    >
      <ItemColliders kind={kind} />
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <ItemMesh kind={kind} />
      </group>
    </RigidBody>
  );
}

export function FallingCard({
  position,
}: {
  position: [number, number, number];
}) {
  const angularVelocity: [number, number, number] = [
    (Math.random() - 0.5) * 2.5,
    (Math.random() - 0.5) * 2.5,
    (Math.random() - 0.5) * 2.5,
  ];
  const { bodyRef, handleClick, handlePointerOver, handlePointerOut } = useKickable();
  return (
    <RigidBody
      ref={bodyRef}
      colliders="cuboid"
      position={position}
      angularVelocity={angularVelocity}
      restitution={0.1}
      friction={0.9}
      linearDamping={0.8}
      angularDamping={2.0}
    >
      <mesh
        castShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.85, 0.015, 0.55]} />
        <meshStandardMaterial color="#fdf6e3" roughness={0.95} />
      </mesh>
    </RigidBody>
  );
}
