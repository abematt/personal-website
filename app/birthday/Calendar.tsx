"use client";

import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  MeshPortalMaterial,
  OrbitControls,
  PointerLockControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  type Group,
  type InstancedMesh,
  type Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import { impactBodies } from "./impacts";
import {
  BIRTHDAY_CONFIG,
  BYPASS_LOCKS,
  BYPASS_PAST,
  type DoorConfig,
  type ItemKind,
} from "./config";
import { FallingCard, FallingItem, ItemMesh } from "./items";
import { DROP_POS, InspectModal } from "./Presentation";

function isUnlocked(dateStr: string) {
  if (BYPASS_LOCKS) return true;
  const target = new Date(`${dateStr}T00:00:00`);
  return new Date() >= target;
}

// A day is "past" once the next calendar day has arrived. Used to lock the
// door open and render a showcase of the item next to it. BYPASS_PAST forces
// the past state for testing — accepts true (all past) or a day threshold.
function isDayPast(day: number, dateStr: string): boolean {
  if (BYPASS_PAST === true) return true;
  if (typeof BYPASS_PAST === "number" && day < BYPASS_PAST) return true;
  const target = new Date(`${dateStr}T00:00:00`);
  const nextDay = new Date(target);
  nextDay.setDate(nextDay.getDate() + 1);
  return new Date() >= nextDay;
}

const DOOR_WIDTH = 1.6;
const DOOR_HEIGHT = 2.2;
const DOOR_DEPTH = 0.12;
const SPACING = 2.6;
const GROUND_Y = -DOOR_HEIGHT / 2;

function Padlock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.11, 0.13, 0.045]} />
        <meshStandardMaterial color="#d4a63a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Polished front face */}
      <mesh position={[0, 0, 0.023]}>
        <planeGeometry args={[0.095, 0.11]} />
        <meshStandardMaterial color="#e5bb48" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Shackle — half torus that loops over the lever handle */}
      <mesh position={[0, 0.065, 0]}>
        <torusGeometry args={[0.05, 0.011, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#f0cd62" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Keyhole disc */}
      <mesh position={[0, -0.005, 0.024]}>
        <circleGeometry args={[0.014, 20]} />
        <meshStandardMaterial color="#1a1410" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Keyhole slot */}
      <mesh position={[0, -0.026, 0.024]}>
        <planeGeometry args={[0.005, 0.022]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  );
}

function LockerVent({ position }: { position: [number, number, number] }) {
  const slits = 5;
  const slitW = 0.42;
  const slitH = 0.014;
  const totalSpan = 0.18;
  const slitSpacing = totalSpan / (slits - 1);
  return (
    <group position={position}>
      {Array.from({ length: slits }, (_, i) => (
        <mesh key={i} position={[0, -totalSpan / 2 + i * slitSpacing, 0]}>
          <planeGeometry args={[slitW, slitH]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function StoragePortal() {
  const W = DOOR_WIDTH;
  const H = DOOR_HEIGHT;
  const D = 3.0;
  const MID = -D / 2;
  const BACK = -D;

  return (
    <mesh position={[0, 0, -DOOR_DEPTH - 0.01]}>
      <planeGeometry args={[W, H]} />
      <MeshPortalMaterial blend={0}>
        <color attach="background" args={["#2a1f14"]} />

        {/* Self-contained lighting — MeshPortalMaterial renders its own scene */}
        <ambientLight intensity={0.4} color="#ffe0b0" />
        <pointLight
          position={[0, 0.55, MID]}
          intensity={1.4}
          color="#ffbe7a"
          distance={4.5}
          decay={1.2}
        />
        <pointLight
          position={[0, -0.4, -0.3]}
          intensity={0.35}
          color="#ffa060"
          distance={2}
          decay={1.5}
        />

        {/* Back wall */}
        <mesh position={[0, 0, BACK]}>
          <planeGeometry args={[W * 1.2, H * 1.1]} />
          <meshStandardMaterial color="#7e7266" roughness={0.95} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-W / 2, 0, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#9c9082" roughness={0.95} />
        </mesh>
        {/* Right wall */}
        <mesh position={[W / 2, 0, MID]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#a89c8c" roughness={0.95} />
        </mesh>
        {/* Floor */}
        <mesh position={[0, -H / 2, MID]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#4c4235" roughness={1} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, H / 2, MID]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#b8ac98" roughness={0.95} />
        </mesh>

        {/* Hanging bare bulb */}
        <group position={[0, 0.55, MID + 0.2]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.55, 6]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshStandardMaterial
              color="#ffdea3"
              emissive="#ffa94a"
              emissiveIntensity={1.8}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* Cardboard boxes clustered at the back */}
        <group position={[0, -H / 2, BACK + 0.55]}>
          <mesh position={[-0.38, 0.25, -0.05]}>
            <boxGeometry args={[0.5, 0.5, 0.4]} />
            <meshStandardMaterial color="#b88250" roughness={0.95} />
          </mesh>
          {/* Tape stripe on big box */}
          <mesh position={[-0.38, 0.25, 0.155]}>
            <planeGeometry args={[0.5, 0.05]} />
            <meshStandardMaterial color="#d9b280" roughness={0.85} />
          </mesh>
          <mesh position={[-0.42, 0.67, -0.02]} rotation={[0, 0.12, 0]}>
            <boxGeometry args={[0.34, 0.32, 0.3]} />
            <meshStandardMaterial color="#c89258" roughness={0.95} />
          </mesh>
          <mesh position={[0.3, 0.22, 0.1]} rotation={[0, -0.22, 0]}>
            <boxGeometry args={[0.45, 0.44, 0.4]} />
            <meshStandardMaterial color="#a87246" roughness={0.95} />
          </mesh>
          <mesh position={[0.32, 0.58, 0.03]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.3, 0.24, 0.32]} />
            <meshStandardMaterial color="#9a6838" roughness={0.95} />
          </mesh>
          <mesh position={[0.05, 0.14, 0.55]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.26, 0.28, 0.24]} />
            <meshStandardMaterial color="#b8885a" roughness={0.95} />
          </mesh>
        </group>

        {/* Narrow shelf on the right wall with a couple of jars */}
        <group position={[W / 2 - 0.04, 0.22, MID + 0.25]}>
          <mesh>
            <boxGeometry args={[0.06, 0.025, 0.7]} />
            <meshStandardMaterial color="#6a5a48" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.085, -0.18]}>
            <cylinderGeometry args={[0.045, 0.045, 0.14, 16]} />
            <meshStandardMaterial color="#7a8a6c" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.07, 0.15]}>
            <cylinderGeometry args={[0.04, 0.04, 0.11, 16]} />
            <meshStandardMaterial color="#a88860" roughness={0.6} metalness={0.1} />
          </mesh>
        </group>
      </MeshPortalMaterial>
    </mesh>
  );
}

function HotelPortal() {
  const W = DOOR_WIDTH;
  const H = DOOR_HEIGHT;
  const D = 3.2;
  const MID = -D / 2;
  const BACK = -D;

  return (
    <mesh position={[0, 0, -DOOR_DEPTH - 0.01]}>
      <planeGeometry args={[W, H]} />
      <MeshPortalMaterial blend={0}>
        <color attach="background" args={["#2a2218"]} />

        {/* Warm hotel lighting */}
        <ambientLight intensity={0.5} color="#ffe5c0" />
        <pointLight
          position={[0.2, 0.35, MID]}
          intensity={1.1}
          color="#ffd8a6"
          distance={4.5}
          decay={1.2}
        />
        {/* Bright daylight spilling through the window */}
        <pointLight
          position={[-W / 2 + 0.15, 0.1, MID - 0.2]}
          intensity={1.4}
          color="#fff2d0"
          distance={3}
          decay={1.4}
        />
        <pointLight
          position={[0, -0.2, BACK + 0.6]}
          intensity={0.6}
          color="#ffe0a8"
          distance={2.5}
          decay={1.5}
        />

        {/* Back wall (cream) */}
        <mesh position={[0, 0, BACK]}>
          <planeGeometry args={[W * 1.3, H * 1.15]} />
          <meshStandardMaterial color="#ede0c8" roughness={0.95} />
        </mesh>
        {/* Left wall (with window) */}
        <mesh position={[-W / 2, 0, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#dccfb4" roughness={0.95} />
        </mesh>
        {/* Right wall */}
        <mesh position={[W / 2, 0, MID]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#e4d7bc" roughness={0.95} />
        </mesh>
        {/* Dark hardwood floor */}
        <mesh position={[0, -H / 2, MID]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#4a3524" roughness={0.85} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, H / 2, MID]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#f2e8d2" roughness={0.95} />
        </mesh>

        {/* Window pane — bright painted daylight on left wall */}
        <mesh position={[-W / 2 + 0.005, 0.15, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 1.05]} />
          <meshBasicMaterial color="#f4e4bc" toneMapped={false} />
        </mesh>
        {/* Faint painted building silhouettes inside the window */}
        <mesh position={[-W / 2 + 0.006, 0.05, MID + 0.05]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.2, 0.35]} />
          <meshBasicMaterial color="#d7bf92" toneMapped={false} />
        </mesh>
        <mesh position={[-W / 2 + 0.006, 0.08, MID - 0.18]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.22, 0.45]} />
          <meshBasicMaterial color="#c9b084" toneMapped={false} />
        </mesh>

        {/* Window frame — top, bottom, mullion */}
        <mesh position={[-W / 2 + 0.008, 0.67, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.92, 0.04]} />
          <meshStandardMaterial color="#4a3424" />
        </mesh>
        <mesh position={[-W / 2 + 0.008, -0.38, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.92, 0.04]} />
          <meshStandardMaterial color="#4a3424" />
        </mesh>
        <mesh position={[-W / 2 + 0.01, 0.15, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.018, 1.05]} />
          <meshStandardMaterial color="#4a3424" />
        </mesh>
        {/* Windowsill */}
        <mesh position={[-W / 2 + 0.04, -0.4, MID]}>
          <boxGeometry args={[0.08, 0.04, 0.92]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
        </mesh>

        {/* Brown drapes flanking window */}
        <mesh position={[-W / 2 + 0.025, 0.15, MID - 0.52]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.22, 1.55]} />
          <meshStandardMaterial color="#6a4a38" roughness={0.95} />
        </mesh>
        <mesh position={[-W / 2 + 0.025, 0.15, MID + 0.52]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.22, 1.55]} />
          <meshStandardMaterial color="#6a4a38" roughness={0.95} />
        </mesh>

        {/* Bed — headboard against back wall, bed runs forward (toward viewer) */}
        <group position={[0.15, -H / 2, BACK + 0.95]}>
          {/* Headboard (tall, dark wood) */}
          <mesh position={[0, 0.5, -0.7]}>
            <boxGeometry args={[0.95, 1.0, 0.06]} />
            <meshStandardMaterial color="#5a3a24" roughness={0.75} />
          </mesh>
          {/* Bed base / frame */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[0.9, 0.28, 1.3]} />
            <meshStandardMaterial color="#8b6a4a" roughness={0.8} />
          </mesh>
          {/* Mattress with bedding */}
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[0.92, 0.12, 1.32]} />
            <meshStandardMaterial color="#faf5ea" roughness={0.85} />
          </mesh>
          {/* Duvet (slight raise) */}
          <mesh position={[0, 0.41, 0.05]}>
            <boxGeometry args={[0.88, 0.06, 1.0]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Pillows — two side by side near headboard */}
          <mesh position={[-0.22, 0.45, -0.48]}>
            <boxGeometry args={[0.32, 0.1, 0.22]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          <mesh position={[0.22, 0.45, -0.48]}>
            <boxGeometry args={[0.32, 0.1, 0.22]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Folded towel roll on the bed */}
          <mesh position={[0, 0.45, 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </group>

        {/* Small wall sconce on right wall */}
        <mesh position={[W / 2 - 0.03, 0.25, BACK + 0.5]}>
          <sphereGeometry args={[0.05, 14, 10]} />
          <meshStandardMaterial
            color="#f6e4b8"
            emissive="#ffc488"
            emissiveIntensity={1.4}
            roughness={0.4}
          />
        </mesh>

        {/* Nightstand — small cube next to the bed */}
        <mesh position={[0.82, -H / 2 + 0.2, BACK + 0.55]}>
          <boxGeometry args={[0.2, 0.4, 0.22]} />
          <meshStandardMaterial color="#5a3a24" roughness={0.8} />
        </mesh>
      </MeshPortalMaterial>
    </mesh>
  );
}

function TheatrePortal() {
  const W = DOOR_WIDTH;
  const H = DOOR_HEIGHT;
  const D = 4.2;
  const MID = -D / 2;
  const BACK = -D;

  // Rows of seats marching into the distance — narrower as they go back so the
  // perspective reads as a long aisle. Each row has a curved bank of seats
  // either side of a center aisle.
  const rows = 8;

  return (
    <mesh position={[0, 0, -DOOR_DEPTH - 0.01]}>
      <planeGeometry args={[W, H]} />
      <MeshPortalMaterial blend={0}>
        <color attach="background" args={["#0a0612"]} />

        {/* Dim house lighting + cool wash from the screen */}
        <ambientLight intensity={0.18} color="#4a6fa8" />
        <pointLight
          position={[0, 0.15, BACK + 0.3]}
          intensity={2.5}
          color="#bfe0ff"
          distance={5.5}
          decay={1.4}
        />
        {/* Warm aisle floor lights */}
        <pointLight
          position={[0, -H / 2 + 0.1, MID]}
          intensity={0.35}
          color="#ffb070"
          distance={2.5}
          decay={1.8}
        />

        {/* Back wall */}
        <mesh position={[0, 0, BACK]}>
          <planeGeometry args={[W * 1.4, H * 1.2]} />
          <meshStandardMaterial color="#14101c" roughness={0.95} />
        </mesh>
        {/* Left side wall */}
        <mesh position={[-W / 2, 0, MID]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#1a1424" roughness={0.95} />
        </mesh>
        {/* Right side wall */}
        <mesh position={[W / 2, 0, MID]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#1a1424" roughness={0.95} />
        </mesh>
        {/* Floor — dark red carpet */}
        <mesh position={[0, -H / 2, MID]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#3a0d14" roughness={1} />
        </mesh>
        {/* Aisle runner — slightly lighter strip down the center */}
        <mesh
          position={[0, -H / 2 + 0.002, MID]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.22, D]} />
          <meshStandardMaterial color="#5c1820" roughness={1} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, H / 2, MID]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <meshStandardMaterial color="#14101c" roughness={0.95} />
        </mesh>

        {/* Big bright screen on the back wall */}
        <mesh position={[0, 0.1, BACK + 0.01]}>
          <planeGeometry args={[W * 0.95, H * 0.55]} />
          <meshBasicMaterial color="#eaf3ff" toneMapped={false} />
        </mesh>
        {/* Dark screen frame */}
        <mesh position={[0, 0.1, BACK + 0.008]}>
          <planeGeometry args={[W * 1.02, H * 0.62]} />
          <meshStandardMaterial color="#050309" roughness={0.9} />
        </mesh>
        {/* Tinted silhouette on the screen — reads as a stage scene */}
        <mesh position={[-0.15, 0.02, BACK + 0.013]}>
          <planeGeometry args={[0.18, 0.42]} />
          <meshBasicMaterial color="#b9d9f5" toneMapped={false} />
        </mesh>
        <mesh position={[0.18, 0.0, BACK + 0.013]}>
          <planeGeometry args={[0.18, 0.42]} />
          <meshBasicMaterial color="#b9d9f5" toneMapped={false} />
        </mesh>
        {/* A warm spotlight glow on the screen */}
        <mesh position={[0.02, 0.18, BACK + 0.014]}>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial color="#ffe4a0" toneMapped={false} />
        </mesh>

        {/* Rows of seats — each row is 3 seats per side of aisle */}
        {Array.from({ length: rows }, (_, r) => {
          // Rows closer to the viewer (larger zPos) are wider/taller.
          const t = r / (rows - 1);
          const zPos = BACK + 0.7 + t * (D - 1.2);
          const rowScale = 0.5 + t * 0.7;
          const seatY = -H / 2 + 0.11 * rowScale;
          const seatBackY = -H / 2 + 0.22 * rowScale;
          const seatW = 0.11 * rowScale;
          const seatH = 0.22 * rowScale;
          const seatD = 0.1 * rowScale;
          const spacing = 0.13 * rowScale;
          const aisleOffset = 0.12;
          // 3 seats each side
          return (
            <group key={`row-${r}`} position={[0, 0, zPos]}>
              {[-2, -1, 0, 1, 2].map((i) => {
                if (i === 0) return null; // aisle gap
                const side = i > 0 ? 1 : -1;
                const idx = Math.abs(i);
                const x = side * (aisleOffset + (idx - 1) * spacing);
                return (
                  <group key={`seat-${r}-${i}`} position={[x, 0, 0]}>
                    {/* Seat cushion */}
                    <mesh position={[0, seatY, 0]}>
                      <boxGeometry args={[seatW, 0.04 * rowScale, seatD]} />
                      <meshStandardMaterial
                        color="#8b1e2c"
                        roughness={0.95}
                      />
                    </mesh>
                    {/* Seat back */}
                    <mesh position={[0, seatBackY, -seatD / 2 + 0.005]}>
                      <boxGeometry
                        args={[seatW, seatH, 0.015 * rowScale]}
                      />
                      <meshStandardMaterial
                        color="#6b141e"
                        roughness={0.95}
                      />
                    </mesh>
                  </group>
                );
              })}
            </group>
          );
        })}

        {/* Soft aisle floor lights — dots along both sides of the runner */}
        {Array.from({ length: 5 }, (_, i) => {
          const zPos = BACK + 0.6 + i * (D - 1.2) / 4;
          return (
            <group key={`aisle-${i}`}>
              <mesh position={[-0.14, -H / 2 + 0.015, zPos]}>
                <sphereGeometry args={[0.014, 10, 8]} />
                <meshStandardMaterial
                  color="#ffcc88"
                  emissive="#ff9c4a"
                  emissiveIntensity={2}
                />
              </mesh>
              <mesh position={[0.14, -H / 2 + 0.015, zPos]}>
                <sphereGeometry args={[0.014, 10, 8]} />
                <meshStandardMaterial
                  color="#ffcc88"
                  emissive="#ff9c4a"
                  emissiveIntensity={2}
                />
              </mesh>
            </group>
          );
        })}
      </MeshPortalMaterial>
    </mesh>
  );
}

type DoorProps = {
  config: DoorConfig;
  index: number;
  total: number;
  onOpen: (door: DoorConfig, x: number) => void;
  onClose: (door: DoorConfig) => void;
  disabled: boolean;
  isPast: boolean;
};

function Door({ config, index, total, onOpen, onClose, disabled }: DoorProps) {
  const hingeRef = useRef<Group>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [shake, setShake] = useState(0);

  const unlocked = useMemo(() => isUnlocked(config.unlockDate), [config.unlockDate]);
  const x = (index - (total - 1) / 2) * SPACING;
  const isLocker = true;
  const portalKind: "storage" | "hotel" | "theatre" | null =
    config.day === 1
      ? "storage"
      : config.day === 2
        ? "theatre"
        : config.day === 3
          ? "hotel"
          : null;
  const unlockedBodyColor = "#fbfaf4";
  const numberColor = isLocker ? "#2a2a2a" : "#fff8ef";

  useFrame((_, delta) => {
    if (!hingeRef.current) return;
    const target = open ? -Math.PI * 0.5 : 0;
    hingeRef.current.rotation.y +=
      (target - hingeRef.current.rotation.y) * Math.min(1, delta * 6);
    if (shake > 0) {
      hingeRef.current.rotation.y += Math.sin(shake * 40) * 0.05;
      setShake((s) => Math.max(0, s - delta));
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (disabled) return;
    if (!unlocked) {
      setShake(0.4);
      return;
    }
    if (open) {
      setOpen(false);
      onClose(config);
      return;
    }
    setOpen(true);
    onOpen(config, x);
  };

  return (
    <group
      position={[x, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (!disabled) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {portalKind === "storage" ? (
        <StoragePortal />
      ) : portalKind === "hotel" ? (
        <HotelPortal />
      ) : portalKind === "theatre" ? (
        <TheatrePortal />
      ) : (
        <mesh position={[0, 0, -DOOR_DEPTH - 0.02]}>
          <planeGeometry args={[DOOR_WIDTH, DOOR_HEIGHT]} />
          <meshStandardMaterial color="#fff6ec" />
        </mesh>
      )}

      <pointLight
        position={[0, 0, 0.2]}
        intensity={open ? 1.2 : 0}
        distance={3}
        color={config.accent}
      />

      <group ref={hingeRef} position={[-DOOR_WIDTH / 2, 0, 0]}>
        <RoundedBox
          args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH]}
          radius={isLocker ? 0.02 : 0.05}
          smoothness={4}
          position={[DOOR_WIDTH / 2, 0, 0]}
          onClick={handleClick}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={unlocked ? unlockedBodyColor : "#d4d4d8"}
            roughness={isLocker ? 0.75 : 0.6}
            metalness={isLocker ? 0.15 : 0}
            emissive={unlocked && hovered && !disabled ? config.accent : "#000000"}
            emissiveIntensity={unlocked && hovered && !disabled ? 0.2 : 0}
          />
        </RoundedBox>

        {isLocker ? (
          <>
            {/* Top vents */}
            <LockerVent
              position={[DOOR_WIDTH / 2 - 0.32, 0.75, DOOR_DEPTH / 2 + 0.002]}
            />
            <LockerVent
              position={[DOOR_WIDTH / 2 + 0.32, 0.75, DOOR_DEPTH / 2 + 0.002]}
            />
            {/* Bottom vents */}
            <LockerVent
              position={[DOOR_WIDTH / 2 - 0.32, -0.75, DOOR_DEPTH / 2 + 0.002]}
            />
            <LockerVent
              position={[DOOR_WIDTH / 2 + 0.32, -0.75, DOOR_DEPTH / 2 + 0.002]}
            />

            {/* Handle backing plate */}
            <mesh
              position={[DOOR_WIDTH - 0.26, 0.05, DOOR_DEPTH / 2 + 0.003]}
            >
              <planeGeometry args={[0.13, 0.34]} />
              <meshStandardMaterial
                color="#8e8e8e"
                metalness={0.7}
                roughness={0.35}
              />
            </mesh>
            {/* Horizontal lever handle */}
            <mesh
              position={[DOOR_WIDTH - 0.38, 0.12, DOOR_DEPTH / 2 + 0.03]}
            >
              <boxGeometry args={[0.3, 0.038, 0.045]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            {/* Keyhole plate */}
            <mesh
              position={[DOOR_WIDTH - 0.26, -0.06, DOOR_DEPTH / 2 + 0.004]}
            >
              <planeGeometry args={[0.05, 0.07]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.6} />
            </mesh>
          </>
        ) : (
          <mesh position={[DOOR_WIDTH - 0.2, 0, DOOR_DEPTH / 2 + 0.02]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#f3e7d3" metalness={0.6} roughness={0.3} />
          </mesh>
        )}

        <Text
          position={
            isLocker
              ? [DOOR_WIDTH / 2 - 0.35, 0.2, DOOR_DEPTH / 2 + 0.005]
              : [DOOR_WIDTH / 2 - 0.15, 0.2, DOOR_DEPTH / 2 + 0.005]
          }
          fontSize={isLocker ? 0.42 : 0.7}
          color={numberColor}
          anchorX="center"
          anchorY="middle"
        >
          {config.day.toString()}
        </Text>

        {!unlocked && (
          <Padlock position={[DOOR_WIDTH - 0.38, 0.03, DOOR_DEPTH / 2 + 0.075]} />
        )}
      </group>
    </group>
  );
}

// Height of the rolling terrain at a given world XZ, measured above GROUND_Y.
// Stays near-zero inside the interaction zone (dist < ~4) so items never sink
// into hillside, then smoothly rises into rolling hills that hide the horizon.
function terrainHeight(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z);
  const t = Math.max(0, Math.min(1, (dist - 4) / 14));
  const falloff = t * t * (3 - 2 * t);
  const n =
    Math.sin(x * 0.12) * 0.9 +
    Math.cos(z * 0.15) * 0.8 +
    Math.sin(x * 0.28 + z * 0.22) * 0.45 +
    Math.cos(x * 0.06 - z * 0.09) * 1.1;
  const hills = Math.max(0, (n + 1.5) * 0.35) * falloff * 2.4;
  return hills;
}

function Ground() {
  // Flat physics collider only — the visible surface is Terrain below.
  return (
    <RigidBody type="fixed" colliders="cuboid" friction={0.9}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, GROUND_Y, 0]}
        visible={false}
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}

const BARK_COLOR = "#4a2f1c";

type BranchSpec = {
  azimuth: number;
  bend: number;
  length: number;
  thickness: number;
  foliage: number;
  tint: string;
};

// Computes the tip position of a branch in tree-local coordinates, given
// the trunk-top origin and the branch spec. Matches the rotation order
// applied by the nested groups in <Branch>: azimuth around Y, then bend
// around Z, then extrude +length along +Y.
function branchTip(
  trunkTop: [number, number, number],
  spec: BranchSpec,
): [number, number, number] {
  const { azimuth, bend, length } = spec;
  const sb = Math.sin(bend);
  const cb = Math.cos(bend);
  const sa = Math.sin(azimuth);
  const ca = Math.cos(azimuth);
  return [
    trunkTop[0] - length * sb * ca,
    trunkTop[1] + length * cb,
    trunkTop[2] + length * sb * sa,
  ];
}

// Unit vector along which a branch extends (branch-tip minus base).
function branchDirection(spec: BranchSpec): [number, number, number] {
  const { azimuth, bend } = spec;
  return [
    -Math.sin(bend) * Math.cos(azimuth),
    Math.cos(bend),
    Math.sin(bend) * Math.sin(azimuth),
  ];
}

function Branch({ spec }: { spec: BranchSpec }) {
  const { azimuth, bend, length, thickness } = spec;
  return (
    <group rotation={[0, azimuth, 0]}>
      <group rotation={[0, 0, bend]}>
        <mesh position={[0, length / 2, 0]} castShadow>
          <cylinderGeometry
            args={[thickness * 0.55, thickness, length, 8]}
          />
          <meshStandardMaterial
            color={BARK_COLOR}
            roughness={0.95}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

type LeafInstance = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  tint: string;
};

// Canvas-drawn leaf silhouette — used as alphaMap so each sprite is actually
// leaf-shaped, not a rectangle. Pointed oval with a faint midvein.
function makeLeafTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);

  ctx.clearRect(0, 0, size, size);

  // Leaf silhouette — two mirrored bezier curves meeting at a point.
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.04);
  ctx.bezierCurveTo(
    size * 0.95, size * 0.28,
    size * 0.85, size * 0.82,
    size / 2, size * 0.96,
  );
  ctx.bezierCurveTo(
    size * 0.15, size * 0.82,
    size * 0.05, size * 0.28,
    size / 2, size * 0.04,
  );
  ctx.fill();

  // Faint midvein — darker stripe down the middle, still alpha=1.
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.08);
  ctx.lineTo(size / 2, size * 0.92);
  ctx.stroke();

  const tex = new CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function Leaves({ instances }: { instances: LeafInstance[] }) {
  const meshRef = useRef<InstancedMesh>(null);

  // Cross-plane geometry so leaf-shaped sprites have visible area from any
  // angle. Each plane will receive the leaf alpha texture.
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const w = 0.13;
    const h = 0.18;
    const positions = new Float32Array([
      // Plane 1 (XY)
      -w / 2, -h / 2, 0, w / 2, -h / 2, 0, w / 2, h / 2, 0, -w / 2, h / 2, 0,
      // Plane 2 (ZY)
      0, -h / 2, -w / 2, 0, -h / 2, w / 2, 0, h / 2, w / 2, 0, h / 2, -w / 2,
    ]);
    const uvs = new Float32Array([
      0, 0, 1, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 1, 1, 0, 1,
    ]);
    const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7];
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("uv", new BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const leafTexture = useMemo(() => makeLeafTexture(), []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      side: DoubleSide,
      roughness: 0.85,
      vertexColors: false,
      alphaMap: leafTexture,
      transparent: true,
      alphaTest: 0.4,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;`,
        )
        .replace(
          "#include <begin_vertex>",
          `
          vec3 transformed = vec3(position);
          // Per-leaf phase derived from its world origin so each leaf flutters
          // independently — not a uniform sheet shift.
          vec3 leafPos = instanceMatrix[3].xyz;
          float phase = leafPos.x * 0.6 + leafPos.z * 0.6 + leafPos.y * 0.45;
          float swayX = sin(uTime * 2.1 + phase) * 0.025;
          float swayZ = cos(uTime * 1.7 + phase * 1.3) * 0.02;
          transformed.x += swayX;
          transformed.z += swayZ;
          `,
        );
    };
    return mat;
  }, [uniforms, leafTexture]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const tint = new Color();
    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      dummy.position.set(...inst.pos);
      dummy.rotation.set(...inst.rot);
      dummy.scale.setScalar(inst.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.set(inst.tint);
      mesh.setColorAt(i, tint);
    }
    mesh.count = instances.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [instances]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, instances.length]}
      castShadow
    />
  );
}

function Silk({
  anchor,
  length,
  width,
  color,
}: {
  anchor: [number, number, number];
  length: number;
  width: number;
  color: string;
}) {
  const ROWS = 22;
  const COLS = 4;

  // Build simulation state: point positions + previous positions for verlet,
  // plus an edge list with structural + shear constraints for cloth rigidity.
  const sim = useMemo(() => {
    const pts: Vector3[] = [];
    const prev: Vector3[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = anchor[0] + (c / (COLS - 1) - 0.5) * width;
        const y = anchor[1] - (r / (ROWS - 1)) * length;
        const z = anchor[2];
        pts.push(new Vector3(x, y, z));
        prev.push(new Vector3(x, y, z));
      }
    }
    const restH = width / (COLS - 1);
    const restV = length / (ROWS - 1);
    const restD = Math.sqrt(restH * restH + restV * restV);
    const edges: [number, number, number][] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (c < COLS - 1) edges.push([i, i + 1, restH]);
        if (r < ROWS - 1) edges.push([i, i + COLS, restV]);
        if (r < ROWS - 1 && c < COLS - 1)
          edges.push([i, i + COLS + 1, restD]);
        if (r < ROWS - 1 && c > 0) edges.push([i, i + COLS - 1, restD]);
      }
    }
    return { pts, prev, edges };
  }, [anchor, length, width]);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(ROWS * COLS * 3);
    const uvs = new Float32Array(ROWS * COLS * 2);
    const indices: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        uvs[i * 2] = c / (COLS - 1);
        uvs[i * 2 + 1] = r / (ROWS - 1);
      }
    }
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const i = r * COLS + c;
        indices.push(i, i + COLS, i + 1);
        indices.push(i + 1, i + COLS, i + COLS + 1);
      }
    }
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("uv", new BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }, []);

  // Initialize vertex positions once so the first frame doesn't render a
  // degenerate triangle fan at the origin.
  useEffect(() => {
    const posAttr = geometry.attributes.position as BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < sim.pts.length; i++) {
      arr[i * 3] = sim.pts[i].x;
      arr[i * 3 + 1] = sim.pts[i].y;
      arr[i * 3 + 2] = sim.pts[i].z;
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [geometry, sim]);

  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 60);
    const t = state.clock.elapsedTime;
    const { pts, prev, edges } = sim;

    const damping = 0.985;
    const gravity = -9.5;
    // Low-frequency swaying wind with a faster flutter on top.
    const windX =
      Math.sin(t * 0.6) * 3.2 +
      Math.sin(t * 1.9 + 1.2) * 1.1 +
      Math.sin(t * 4.3) * 0.3;
    const windZ =
      Math.cos(t * 0.5) * 1.8 + Math.sin(t * 2.3) * 0.5;

    // Verlet integration — top row stays pinned to the anchor.
    for (let i = 0; i < pts.length; i++) {
      if (i < COLS) {
        const c = i;
        pts[i].set(
          anchor[0] + (c / (COLS - 1) - 0.5) * width,
          anchor[1],
          anchor[2],
        );
        prev[i].copy(pts[i]);
        continue;
      }
      const p = pts[i];
      const pv = prev[i];
      const vx = (p.x - pv.x) * damping;
      const vy = (p.y - pv.y) * damping;
      const vz = (p.z - pv.z) * damping;
      pv.copy(p);
      // Wind intensity scales down with depth — upper rows barely move, the
      // bottom trails most, which matches how real silk flutters.
      const row = Math.floor(i / COLS);
      const windScale = row / (ROWS - 1);
      p.x += vx + windX * dt * dt * windScale;
      p.y += vy + gravity * dt * dt;
      p.z += vz + windZ * dt * dt * windScale;

      // Player push: if the cloth point is within the player's body cylinder,
      // shove it horizontally outward. Only acts on lower rows (waist-down)
      // so the top of the silk doesn't peel away at head-height.
      if (PLAYER_POS.y > -100 && row > 1) {
        const pdy = p.y - PLAYER_POS.y;
        if (pdy < 0.4 && pdy > -1.7) {
          const ddx = p.x - PLAYER_POS.x;
          const ddz = p.z - PLAYER_POS.z;
          const pushR = PLAYER_RADIUS + 0.15;
          const d2 = ddx * ddx + ddz * ddz;
          if (d2 < pushR * pushR && d2 > 1e-6) {
            const d = Math.sqrt(d2);
            const k = (pushR - d) / d;
            p.x += ddx * k;
            p.z += ddz * k;
          }
        }
      }
    }

    // Constraint relaxation — more iterations = stiffer cloth.
    const ITER = 14;
    for (let k = 0; k < ITER; k++) {
      for (let e = 0; e < edges.length; e++) {
        const [a, b, rest] = edges[e];
        const pa = pts[a];
        const pb = pts[b];
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const dz = pb.z - pa.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 1e-5) continue;
        const corr = ((d - rest) / d) * 0.5;
        const cx = dx * corr;
        const cy = dy * corr;
        const cz = dz * corr;
        const aPinned = a < COLS;
        const bPinned = b < COLS;
        if (!aPinned) {
          pa.x += cx;
          pa.y += cy;
          pa.z += cz;
        }
        if (!bPinned) {
          pb.x -= cx;
          pb.y -= cy;
          pb.z -= cz;
        }
      }
    }

    const posAttr = geometry.attributes.position as BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < pts.length; i++) {
      arr[i * 3] = pts[i].x;
      arr[i * 3 + 1] = pts[i].y;
      arr[i * 3 + 2] = pts[i].z;
    }
    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow frustumCulled={false}>
      <meshStandardMaterial
        color={color}
        side={DoubleSide}
        roughness={0.6}
        metalness={0}
      />
    </mesh>
  );
}

const TREE_TRUNK_HEIGHT = 2.4;
const TREE_TRUNK_TOP: [number, number, number] = [0, TREE_TRUNK_HEIGHT, 0];

function Tree({ position }: { position: [number, number, number] }) {
  const trunkHeight = TREE_TRUNK_HEIGHT;
  const trunkTop = TREE_TRUNK_TOP;

  const branches: BranchSpec[] = useMemo(
    () => [
      { azimuth: 0.2, bend: 0.95, length: 3.0, thickness: 0.18, foliage: 1.1, tint: "#4d7e38" },
      { azimuth: 1.1, bend: 1.05, length: 2.5, thickness: 0.15, foliage: 0.95, tint: "#568a42" },
      { azimuth: 2.3, bend: 0.85, length: 3.2, thickness: 0.17, foliage: 1.15, tint: "#4a7a35" },
      { azimuth: 3.4, bend: 1.0, length: 2.7, thickness: 0.15, foliage: 1.0, tint: "#528340" },
      { azimuth: 4.5, bend: 0.9, length: 2.9, thickness: 0.16, foliage: 1.05, tint: "#4e7e3a" },
      { azimuth: 5.5, bend: 1.1, length: 2.3, thickness: 0.14, foliage: 0.9, tint: "#5a8d44" },
      { azimuth: 0.8, bend: 0.35, length: 1.8, thickness: 0.12, foliage: 0.85, tint: "#5e9145" },
      { azimuth: 3.0, bend: 0.3, length: 2.0, thickness: 0.12, foliage: 0.9, tint: "#578a40" },
    ],
    [],
  );

  // Per-branch foliage clusters — several overlapping icosahedra at random
  // offsets inside each branch's foliage radius, giving a fuller silhouette
  // than a single core blob.
  const foliageBlobs = useMemo(() => {
    const out: {
      pos: [number, number, number];
      radius: number;
      color: string;
    }[] = [];
    const tintBuf = new Color();
    for (const b of branches) {
      const tip = branchTip(trunkTop, b);
      const blobCount = 5;
      // Primary blob exactly at the tip, slightly darker
      tintBuf.set(b.tint).multiplyScalar(0.9);
      out.push({
        pos: tip,
        radius: b.foliage * 0.85,
        color: `#${tintBuf.getHexString()}`,
      });
      // Satellite blobs scattered around the tip
      for (let i = 0; i < blobCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(1 - 2 * Math.random());
        const r = (0.3 + Math.random() * 0.5) * b.foliage;
        const bright = 0.85 + Math.random() * 0.35;
        tintBuf.set(b.tint).multiplyScalar(bright);
        out.push({
          pos: [
            tip[0] + r * Math.sin(phi) * Math.cos(theta),
            tip[1] + r * Math.sin(phi) * Math.sin(theta),
            tip[2] + r * Math.cos(phi),
          ],
          radius: b.foliage * (0.55 + Math.random() * 0.3),
          color: `#${tintBuf.getHexString()}`,
        });
      }
    }
    // Central upper-crown cluster so the trunk top reads as foliage-filled.
    for (let i = 0; i < 6; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const r = Math.random() * 0.7;
      const bright = 0.85 + Math.random() * 0.3;
      tintBuf.set("#558840").multiplyScalar(bright);
      out.push({
        pos: [
          trunkTop[0] + r * Math.sin(phi) * Math.cos(theta),
          trunkTop[1] + 0.5 + r * Math.sin(phi) * Math.sin(theta),
          trunkTop[2] + r * Math.cos(phi),
        ],
        radius: 0.75 + Math.random() * 0.25,
        color: `#${tintBuf.getHexString()}`,
      });
    }
    return out;
  }, [branches, trunkTop]);

  // Silk rigging: wrap + knot sit at a branch mid-point; silk hangs below.
  const silkBranch = branches[0];
  const silkRig = useMemo(() => {
    const tip = branchTip(trunkTop, silkBranch);
    // Anchor 80% of the way out from trunk top to branch tip so it reads as
    // hanging from the branch itself, inside the leaf cluster.
    const wrap: [number, number, number] = [
      trunkTop[0] + (tip[0] - trunkTop[0]) * 0.8,
      trunkTop[1] + (tip[1] - trunkTop[1]) * 0.8,
      trunkTop[2] + (tip[2] - trunkTop[2]) * 0.8,
    ];
    const dir = branchDirection(silkBranch);
    const quat = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      new Vector3(dir[0], dir[1], dir[2]).normalize(),
    );
    // Silk hangs from just below the knot bundle.
    const silkAnchor: [number, number, number] = [wrap[0], wrap[1] - 0.22, wrap[2]];
    return { wrap, quat, silkAnchor };
  }, [silkBranch, trunkTop]);

  const silkColor = "#e35787";

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, trunkHeight, 14]} />
        <meshStandardMaterial
          color={BARK_COLOR}
          roughness={0.95}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.75, 0.3, 14]} />
        <meshStandardMaterial color="#3a2314" roughness={0.95} flatShading />
      </mesh>

      <group position={trunkTop}>
        {branches.map((b, i) => (
          <Branch key={i} spec={b} />
        ))}
      </group>

      {foliageBlobs.map((blob, i) => (
        <mesh key={`blob-${i}`} position={blob.pos} castShadow>
          <icosahedronGeometry args={[blob.radius, 1]} />
          <meshStandardMaterial
            color={blob.color}
            roughness={0.95}
            flatShading
          />
        </mesh>
      ))}

      {/* Silk wrap — a short cylinder aligned to the branch axis at the
          anchor point, colored like the silk, reading as fabric wound around
          the branch. */}
      <mesh position={silkRig.wrap} quaternion={silkRig.quat} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.45, 12]} />
        <meshStandardMaterial color={silkColor} roughness={0.8} />
      </mesh>
      {/* Dark rope wrap on top of the fabric for extra visual clarity */}
      <mesh position={silkRig.wrap} quaternion={silkRig.quat}>
        <cylinderGeometry args={[0.11, 0.11, 0.1, 12]} />
        <meshStandardMaterial color="#5c3a20" roughness={0.95} />
      </mesh>
      {/* Knot bundle — silk bunched up where it's tied off */}
      <mesh
        position={[
          silkRig.wrap[0],
          silkRig.wrap[1] - 0.14,
          silkRig.wrap[2],
        ]}
        castShadow
      >
        <sphereGeometry args={[0.09, 14, 12]} />
        <meshStandardMaterial color={silkColor} roughness={0.85} />
      </mesh>

      <Silk
        anchor={silkRig.silkAnchor}
        length={3.8}
        width={0.45}
        color={silkColor}
      />
    </group>
  );
}

function Terrain() {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(120, 120, 140, 140);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const dark = new Color("#2a441a");
    const lite = new Color("#6b8e38");
    const tmp = new Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainHeight(x, z);
      pos.setY(i, h);
      // Slight color shift with height — hilltops read lighter/warmer.
      const t = Math.min(1, h / 2.5);
      tmp.copy(dark).lerp(lite, 0.2 + t * 0.6);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh position={[0, GROUND_Y, 0]} geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}

const GRASS_COUNT = 160000;
const GRASS_RADIUS = 55;
const GRASS_NEAR_RADIUS = 18;
// Fraction of blades concentrated in the near ring — keeps the foreground
// packed while still covering the distant hills.
const GRASS_NEAR_FRACTION = 0.55;
const BLADE_HEIGHT = 0.3;
const MAX_IMPACTS = 8;
const IMPACT_RADIUS = 0.75;

function GrassField() {
  const meshRef = useRef<InstancedMesh>(null);

  // Curved multi-segment blade: 4 quads stacked, each narrower than the last,
  // with a forward Z-curl so the blade leans naturally toward the viewer.
  // Top row collapses to a single tip vertex.
  const bladeGeometry = useMemo(() => {
    const geo = new BufferGeometry();
    const h = BLADE_HEIGHT;
    const w = 0.055;
    const rows = [
      { y: 0,        wx: w,        z: 0,     shade: 0.0 },
      { y: h * 0.28, wx: w * 0.85, z: 0.015, shade: 0.25 },
      { y: h * 0.55, wx: w * 0.6,  z: 0.045, shade: 0.55 },
      { y: h * 0.8,  wx: w * 0.32, z: 0.085, shade: 0.8 },
    ];
    const tip = { y: h, z: 0.135, shade: 1.0 };

    const dark = [0.14, 0.28, 0.07];
    const lite = [0.66, 0.84, 0.36];
    const mix = (t: number) => dark.map((d, i) => d + (lite[i] - d) * t);

    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    rows.forEach((r) => {
      positions.push(-r.wx / 2, r.y, r.z, r.wx / 2, r.y, r.z);
      const c = mix(r.shade);
      colors.push(...c, ...c);
    });
    positions.push(0, tip.y, tip.z);
    colors.push(...mix(tip.shade));
    const tipIdx = rows.length * 2;

    for (let i = 0; i < rows.length - 1; i++) {
      const bl = i * 2,
        br = i * 2 + 1,
        tl = (i + 1) * 2,
        tr = (i + 1) * 2 + 1;
      indices.push(bl, br, tr, bl, tr, tl);
    }
    const last = (rows.length - 1) * 2;
    indices.push(last, last + 1, tipIdx);

    geo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions), 3),
    );
    geo.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(colors), 3),
    );
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Uniforms shared between the compiled shader and per-frame updates.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uImpacts: {
        value: Array.from(
          { length: MAX_IMPACTS },
          () => new Vector4(0, -999, 0, 0),
        ),
      },
      uImpactCount: { value: 0 },
    }),
    [],
  );

  // Custom material with shader injection: wind sway + impact bending.
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      vertexColors: true,
      side: DoubleSide,
      roughness: 1,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uImpacts = uniforms.uImpacts;
      shader.uniforms.uImpactCount = uniforms.uImpactCount;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          #define MAX_IMPACTS ${MAX_IMPACTS}
          uniform float uTime;
          uniform vec4 uImpacts[MAX_IMPACTS];
          uniform int uImpactCount;`,
        )
        .replace(
          "#include <begin_vertex>",
          `
          vec3 transformed = vec3(position);

          // 0 at base, 1 at tip — squared so bending concentrates near the tip.
          float bend = clamp(transformed.y / ${BLADE_HEIGHT.toFixed(4)}, 0.0, 1.0);
          bend = bend * bend;

          // Per-blade wind phase from its world origin (translation column).
          vec3 bladePos = instanceMatrix[3].xyz;
          float phase = bladePos.x * 0.35 + bladePos.z * 0.35;
          float windX = sin(uTime * 1.8 + phase) * 0.06;
          float windZ = cos(uTime * 1.3 + phase * 1.2) * 0.04;
          transformed.x += windX * bend;
          transformed.z += windZ * bend;

          // Impact bending in world XZ, then transformed back into local space.
          vec4 worldPos4 = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
          vec2 worldXZ = worldPos4.xz;
          vec2 totalPush = vec2(0.0);
          for (int i = 0; i < MAX_IMPACTS; i++) {
            if (i >= uImpactCount) break;
            vec4 imp = uImpacts[i];
            vec2 delta = worldXZ - imp.xz;
            float dist = length(delta);
            if (dist < imp.w && dist > 0.0001) {
              float strength = 1.0 - dist / imp.w;
              totalPush += (delta / dist) * strength * 0.4;
            }
          }
          // Invert the instance rotation+uniform-scale to bring push into local.
          float s = length(instanceMatrix[0].xyz);
          mat3 invRot = transpose(mat3(instanceMatrix)) / s;
          vec3 localPush = invRot * vec3(totalPush.x, 0.0, totalPush.y);
          transformed.x += localPush.x * bend;
          transformed.z += localPush.z * bend;
          transformed.y -= length(totalPush) * bend * 0.35;
          `,
        );
    };
    return mat;
  }, [uniforms]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const tint = new Color();
    let idx = 0;
    for (let i = 0; i < GRASS_COUNT; i++) {
      // Two-ring distribution: GRASS_NEAR_FRACTION of blades pack the near
      // ring densely; the rest spread uniformly across the far ring to cover
      // the hills.
      const near = Math.random() < GRASS_NEAR_FRACTION;
      const r = near
        ? Math.sqrt(Math.random()) * GRASS_NEAR_RADIUS
        : GRASS_NEAR_RADIUS +
          Math.sqrt(Math.random()) * (GRASS_RADIUS - GRASS_NEAR_RADIUS);
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      // Clear the area under the yoga mat so grass doesn't poke through it.
      if (insideYogaZone(x, z)) continue;

      dummy.position.set(x, GROUND_Y + terrainHeight(x, z), z);
      // Uniform scale is important — the shader's inverse-rotation math
      // assumes the instance matrix has a single scale factor.
      const s = 0.7 + Math.random() * 0.7;
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);

      // Per-blade tint drift
      const hueShift = (Math.random() - 0.5) * 0.08;
      const light = 0.85 + Math.random() * 0.3;
      tint.setRGB(light + hueShift, light, light - hueShift);
      mesh.setColorAt(idx, tint);
      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [bladeGeometry]);

  // Drive time + impact uniforms every frame from the shared impacts registry.
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const impacts = uniforms.uImpacts.value;
    let count = 0;
    impactBodies.forEach((body) => {
      if (count >= MAX_IMPACTS) return;
      const t = body.translation();
      // Fade radius as the item rises off the ground so airborne items don't
      // pre-flatten grass from above.
      const heightAbove = Math.max(0, t.y - GROUND_Y);
      const proximity = Math.max(0, 1 - heightAbove * 1.4);
      const r = IMPACT_RADIUS * proximity;
      if (r < 0.05) return;
      impacts[count].set(t.x, t.y, t.z, r);
      count++;
    });
    uniforms.uImpactCount.value = count;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[bladeGeometry, material, GRASS_COUNT]}
      castShadow
      receiveShadow
      frustumCulled={false}
    />
  );
}


const BOOK_COLORS = [
  "#8b3a3a", "#2e4a3a", "#1e3a5c", "#c9a449", "#f0e5d0",
  "#6b1e2a", "#4a6670", "#654875", "#2f6068", "#7a8a5a",
  "#3d2e4a", "#a85c3a", "#d4a574", "#1f2e3d", "#5c4a3a",
  "#b86b4a", "#3a5a4a", "#8a6a8a", "#d4b896", "#4a3a2a",
];

// Deterministic pseudo-random so book colors/sizes don't shuffle on every
// re-render. Seed is the book's own index.
function seeded(i: number, salt = 0): number {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function ShelfBook({
  position,
  rotation = [0, 0, 0],
  width,
  height,
  depth,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* pages — cream slab peeking from the spine's opposite edge */}
      <mesh position={[0, 0, depth / 2 - 0.003]}>
        <boxGeometry args={[width * 0.9, height * 0.94, 0.002]} />
        <meshStandardMaterial color="#f4ead8" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Bookshelf({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const W = 1.5;
  const H = 2.4;
  const D = 0.38;
  const WALL = 0.04;
  const SHELF_T = 0.035;
  const FRAME_COLOR = "#5a3a22";
  const BACK_COLOR = "#3a2414";

  // 5 horizontal planks -> 4 compartments. Y positions relative to shelf base.
  const shelfYs = useMemo(() => {
    const ys: number[] = [];
    const top = H - SHELF_T / 2;
    const bottom = SHELF_T / 2;
    const count = 5;
    for (let i = 0; i < count; i++) {
      ys.push(bottom + (i / (count - 1)) * (top - bottom));
    }
    return ys;
  }, []);

  // Books on each shelf. For each compartment, fill left-to-right with
  // varied-width upright books, plus a tilt on the last book and a small
  // horizontal stack at the right end.
  const shelfBooks = useMemo(() => {
    const out: Array<{
      pos: [number, number, number];
      rot: [number, number, number];
      w: number;
      h: number;
      d: number;
      color: string;
    }> = [];
    const innerW = W - WALL * 2 - 0.04;
    const innerLeft = -innerW / 2;
    let seedIdx = 0;
    for (let s = 0; s < shelfYs.length - 1; s++) {
      const compY = shelfYs[s] + SHELF_T / 2;
      const compH = shelfYs[s + 1] - shelfYs[s] - SHELF_T;
      let cursor = innerLeft;
      // Upright books
      while (cursor < innerLeft + innerW - 0.2) {
        const bw = 0.065 + seeded(seedIdx, 1) * 0.06;
        const bh = Math.min(compH - 0.02, 0.34 + seeded(seedIdx, 2) * 0.1);
        const bd = 0.2 + seeded(seedIdx, 3) * 0.08;
        const color = BOOK_COLORS[seedIdx % BOOK_COLORS.length];
        // Light lean on ~1/5 of books
        const lean = seeded(seedIdx, 4) < 0.18 ? (seeded(seedIdx, 5) - 0.5) * 0.25 : 0;
        out.push({
          pos: [cursor + bw / 2, compY + bh / 2, -0.02],
          rot: [0, 0, lean],
          w: bw,
          h: bh,
          d: bd,
          color,
        });
        cursor += bw + 0.002;
        seedIdx++;
        if (cursor > innerLeft + innerW - 0.25) break;
      }
      // Stack of 2-3 horizontal books at the right end of some shelves
      if (seeded(s, 10) > 0.35) {
        const stackCount = 2 + Math.floor(seeded(s, 11) * 2);
        const stackW = 0.26 + seeded(s, 12) * 0.05;
        const stackD = 0.2 + seeded(s, 13) * 0.06;
        const stackX = innerLeft + innerW - stackW / 2 - 0.03;
        for (let k = 0; k < stackCount; k++) {
          const th = 0.055 + seeded(seedIdx, 14) * 0.02;
          out.push({
            pos: [stackX, compY + th / 2 + k * 0.058, -0.02],
            rot: [0, 0, 0],
            w: stackW,
            h: th,
            d: stackD,
            color: BOOK_COLORS[(seedIdx + 7) % BOOK_COLORS.length],
          });
          seedIdx++;
        }
      }
    }
    return out;
  }, [shelfYs]);

  // A framed photo propped on one of the upper shelves — personal touch.
  return (
    <group position={position} rotation={rotation}>
      {/* Back panel */}
      <mesh position={[0, H / 2, -D / 2 + WALL / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, H, WALL]} />
        <meshStandardMaterial color={BACK_COLOR} roughness={0.9} />
      </mesh>
      {/* Left side */}
      <mesh position={[-W / 2 + WALL / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL, H, D]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.85} />
      </mesh>
      {/* Right side */}
      <mesh position={[W / 2 - WALL / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL, H, D]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.85} />
      </mesh>
      {/* Horizontal planks */}
      {shelfYs.map((y, i) => (
        <mesh key={`shelf-${i}`} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[W - WALL * 2, SHELF_T, D]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.85} />
        </mesh>
      ))}
      {/* Books on shelves */}
      {shelfBooks.map((b, i) => (
        <ShelfBook
          key={`sb-${i}`}
          position={b.pos}
          rotation={b.rot}
          width={b.w}
          height={b.h}
          depth={b.d}
          color={b.color}
        />
      ))}
      {/* A small framed picture leaning on the second-from-top shelf */}
      <group
        position={[W / 2 - 0.28, shelfYs[shelfYs.length - 2] + SHELF_T / 2 + 0.14, 0]}
        rotation={[0, 0, 0.04]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.28, 0.02]} />
          <meshStandardMaterial color="#d4b486" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <boxGeometry args={[0.17, 0.23, 0.003]} />
          <meshStandardMaterial color="#e8c9a4" roughness={0.9} />
        </mesh>
      </group>
      {/* A small potted plant on the top */}
      <group position={[-W / 2 + 0.28, H + 0.01, 0]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.065, 0.14, 14]} />
          <meshStandardMaterial color="#7a4a30" roughness={0.9} />
        </mesh>
        {/* Leafy clump */}
        {[
          [0, 0.18, 0],
          [0.06, 0.22, 0.03],
          [-0.05, 0.2, 0.04],
          [0.02, 0.24, -0.04],
          [-0.04, 0.17, -0.05],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[0.07 + (i % 2) * 0.01, 0]} />
            <meshStandardMaterial color={i % 2 ? "#5a8a44" : "#6b9a4a"} flatShading roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const BOOKSHELF_POSITION: [number, number, number] = [5, GROUND_Y, -3];
const BOOKSHELF_YAW = -0.3;

function Chair({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const SEAT_H = 0.42;
  const SEAT_W = 0.4;
  const SEAT_D = 0.4;
  const SEAT_T = 0.04;
  const LEG = 0.04;
  const BACK_H = 0.5;
  const WOOD = "#8b5a3c";
  const DARK = "#6a4028";
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, SEAT_H, 0]} castShadow receiveShadow>
        <boxGeometry args={[SEAT_W, SEAT_T, SEAT_D]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {/* Legs at each corner */}
      {[
        [-1, -1], [1, -1], [-1, 1], [1, 1],
      ].map(([sx, sz], i) => (
        <mesh
          key={i}
          position={[
            sx * (SEAT_W / 2 - LEG / 2),
            SEAT_H / 2,
            sz * (SEAT_D / 2 - LEG / 2),
          ]}
          castShadow
        >
          <boxGeometry args={[LEG, SEAT_H, LEG]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
      ))}
      {/* Backrest — solid panel rising from the back edge */}
      <mesh
        position={[0, SEAT_H + BACK_H / 2, -SEAT_D / 2 + LEG / 2]}
        castShadow
      >
        <boxGeometry args={[SEAT_W, BACK_H, LEG]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Pizza({ position }: { position: [number, number, number] }) {
  const R = 0.17;
  const pepPositions: [number, number][] = [
    [0, 0.055], [0.075, -0.05], [-0.08, -0.02],
    [0.02, 0.09], [-0.09, 0.065], [0.085, 0.02], [0, -0.1],
    [-0.05, -0.075],
  ];
  return (
    <group position={position}>
      {/* Crust */}
      <mesh castShadow>
        <cylinderGeometry args={[R, R, 0.028, 32]} />
        <meshStandardMaterial color="#d9a76e" roughness={0.9} />
      </mesh>
      {/* Cheese/sauce layer */}
      <mesh position={[0, 0.016, 0]}>
        <cylinderGeometry args={[R * 0.88, R * 0.88, 0.004, 32]} />
        <meshStandardMaterial color="#e6b46a" roughness={0.85} />
      </mesh>
      {/* Pepperoni */}
      {pepPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.021, z]}>
          <cylinderGeometry args={[0.022, 0.022, 0.004, 16]} />
          <meshStandardMaterial color="#9c2a1c" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function PizzaBox({
  position,
  rotation = [0, 0, 0],
  open = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  open?: boolean;
}) {
  const W = 0.42;
  const H = 0.05;
  const D = 0.42;
  const CARD = "#c49a6c";
  const DARK_CARD = "#a37a4e";
  return (
    <group position={position} rotation={rotation}>
      {/* Box base */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color={CARD} roughness={0.98} />
      </mesh>
      {/* Dark seam line around the side */}
      <mesh position={[0, H - 0.008, 0]}>
        <boxGeometry args={[W + 0.002, 0.004, D + 0.002]} />
        <meshStandardMaterial color={DARK_CARD} roughness={0.98} />
      </mesh>
      {open ? (
        <>
          {/* Tilted lid hinged at the back edge */}
          <group
            position={[0, H, -D / 2]}
            rotation={[-Math.PI * 0.42, 0, 0]}
          >
            <mesh position={[0, 0.01, D / 2]} castShadow>
              <boxGeometry args={[W, 0.018, D]} />
              <meshStandardMaterial color={CARD} roughness={0.98} />
            </mesh>
          </group>
          <Pizza position={[0, H + 0.002, 0]} />
        </>
      ) : (
        /* Closed lid — flat top with a faint logo stripe */
        <mesh position={[0, H + 0.005, 0]}>
          <boxGeometry args={[W * 0.5, 0.002, D * 0.18]} />
          <meshStandardMaterial color="#8e3a2a" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

function PicnicSetup({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const TOP_W = 1.3;
  const TOP_D = 0.75;
  const TOP_T = 0.04;
  const TOP_Y = 0.72;
  const LEG = 0.06;
  const WOOD = "#8b5a3c";
  const DARK = "#6a4028";
  return (
    <group position={position} rotation={rotation}>
      {/* Table top */}
      <mesh position={[0, TOP_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[TOP_W, TOP_T, TOP_D]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {/* Legs */}
      {[
        [-1, -1], [1, -1], [-1, 1], [1, 1],
      ].map(([sx, sz], i) => (
        <mesh
          key={i}
          position={[
            sx * (TOP_W / 2 - LEG / 2 - 0.02),
            TOP_Y / 2,
            sz * (TOP_D / 2 - LEG / 2 - 0.02),
          ]}
          castShadow
        >
          <boxGeometry args={[LEG, TOP_Y, LEG]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
      ))}
      {/* Chairs on the long sides, facing the table */}
      <Chair position={[0, 0, 0.9]} rotation={[0, Math.PI, 0]} />
      <Chair position={[0, 0, -0.9]} rotation={[0, 0, 0]} />

      {/* Two closed pizza boxes stacked on one side */}
      <PizzaBox position={[-0.32, TOP_Y + TOP_T / 2, -0.04]} rotation={[0, 0.05, 0]} />
      <PizzaBox position={[-0.3, TOP_Y + TOP_T / 2 + 0.055, 0]} rotation={[0, -0.08, 0]} />
      {/* One open pizza box on the other side showing a pizza */}
      <PizzaBox
        position={[0.32, TOP_Y + TOP_T / 2, 0.04]}
        rotation={[0, -0.12, 0]}
        open
      />
    </group>
  );
}

const PICNIC_POSITION: [number, number, number] = [
  -6,
  GROUND_Y + terrainHeight(-6, 2),
  2,
];
const PICNIC_YAW = 0.35;

// Yoga mat zone — foreground right. Grass blades whose world XZ land inside
// this rotated rectangle are skipped so the mat sits on cleared ground.
const YOGA_CENTER: [number, number] = [3.8, 4.5];
const YOGA_YAW = 0.45;
const YOGA_ZONE_W = 2.2;
const YOGA_ZONE_D = 1.1;

function insideYogaZone(x: number, z: number): boolean {
  const dx = x - YOGA_CENTER[0];
  const dz = z - YOGA_CENTER[1];
  const c = Math.cos(-YOGA_YAW);
  const s = Math.sin(-YOGA_YAW);
  const lx = dx * c + dz * s;
  const lz = -dx * s + dz * c;
  return Math.abs(lx) <= YOGA_ZONE_W / 2 && Math.abs(lz) <= YOGA_ZONE_D / 2;
}

function YogaMat({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  // Long axis runs along local X. Mat is unrolled along -X and has a tidy
  // roll at the +X end so the silhouette reads unambiguously as a yoga mat.
  const W = 1.8;
  const D = 0.6;
  const T = 0.016;
  const ROLL_R = 0.075;
  const FLAT_LEN = W - ROLL_R * 2;
  const COLOR = "#8a4fa6";
  const DARK = "#5e2f7a";
  const FLAT_CX = -W / 2 + FLAT_LEN / 2;
  return (
    <group position={position} rotation={rotation}>
      {/* Flat unrolled portion */}
      <mesh position={[FLAT_CX, T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[FLAT_LEN, T, D]} />
        <meshStandardMaterial color={COLOR} roughness={0.9} />
      </mesh>
      {/* Darker contrasting stripe down the middle — reads as mat grip */}
      <mesh position={[FLAT_CX, T + 0.0006, 0]}>
        <boxGeometry args={[FLAT_LEN * 0.94, 0.0005, D * 0.04]} />
        <meshStandardMaterial color={DARK} roughness={0.9} />
      </mesh>
      {/* Rolled end — cylinder on its side at the +X end of the mat */}
      <mesh
        position={[W / 2 - ROLL_R, ROLL_R, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[ROLL_R, ROLL_R, D, 28]} />
        <meshStandardMaterial color={COLOR} roughness={0.9} />
      </mesh>
      {/* Spiral end-cap ring so the roll reads as wound fabric */}
      <mesh
        position={[W / 2 - ROLL_R, ROLL_R, D / 2 + 0.001]}
        rotation={[0, 0, 0]}
      >
        <ringGeometry args={[ROLL_R * 0.45, ROLL_R * 0.7, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.9} side={DoubleSide} />
      </mesh>
      <mesh
        position={[W / 2 - ROLL_R, ROLL_R, -D / 2 - 0.001]}
        rotation={[0, Math.PI, 0]}
      >
        <ringGeometry args={[ROLL_R * 0.45, ROLL_R * 0.7, 24]} />
        <meshStandardMaterial color={DARK} roughness={0.9} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function YogaBlock({
  position,
  rotation = [0, 0, 0],
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}) {
  const W = 0.23;
  const H = 0.1;
  const D = 0.15;
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[W, H, D]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

function ShowcaseItem({
  kind,
  position,
}: {
  kind: ItemKind;
  position: [number, number, number];
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.45;
  });
  const scale =
    kind === "ukulele"
      ? 0.42
      : kind === "watch"
        ? 0.5
        : kind === "cake"
          ? 0.9
          : kind === "tickets"
            ? 0.4
            : 0.8;
  // Some items aren't centered around y=0 in their local space, so nudge them
  // vertically to sit nicely inside the glass case.
  const yOffset =
    kind === "ukulele" ? 0.06 : kind === "watch" ? 0.08 : 0;
  return (
    <group
      ref={ref}
      position={[position[0], position[1] + yOffset, position[2]]}
      scale={scale}
    >
      <ItemMesh kind={kind} />
    </group>
  );
}

function GlassShowcase({
  position,
  kind,
}: {
  position: [number, number, number];
  kind: ItemKind;
}) {
  const PED_W = 0.6;
  const PED_D = 0.6;
  const PED_H = 0.92;
  const GLASS_W = 0.5;
  const GLASS_D = 0.5;
  const GLASS_H = 0.62;
  const TOP_CAP_T = 0.04;
  const glassY = PED_H + GLASS_H / 2;
  const itemY = PED_H + GLASS_H / 2 - 0.1;
  return (
    <group position={position}>
      {/* Wide base plinth */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[PED_W + 0.1, 0.08, PED_D + 0.1]} />
        <meshStandardMaterial color="#2e1d12" roughness={0.85} />
      </mesh>
      {/* Column */}
      <mesh position={[0, (PED_H - TOP_CAP_T) / 2 + 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[PED_W, PED_H - TOP_CAP_T - 0.08, PED_D]} />
        <meshStandardMaterial color="#6a4a32" roughness={0.75} />
      </mesh>
      {/* Top cap beneath the glass */}
      <mesh position={[0, PED_H - TOP_CAP_T / 2, 0]} castShadow>
        <boxGeometry args={[PED_W + 0.06, TOP_CAP_T, PED_D + 0.06]} />
        <meshStandardMaterial color="#2e1d12" roughness={0.85} />
      </mesh>
      {/* Velvet display pad on top */}
      <mesh position={[0, PED_H + 0.003, 0]}>
        <boxGeometry args={[GLASS_W - 0.05, 0.006, GLASS_D - 0.05]} />
        <meshStandardMaterial color="#7a1f3a" roughness={0.95} />
      </mesh>
      {/* Glass case — single translucent box */}
      <mesh position={[0, glassY, 0]}>
        <boxGeometry args={[GLASS_W, GLASS_H, GLASS_D]} />
        <meshStandardMaterial
          color="#e6eef6"
          transparent
          opacity={0.18}
          roughness={0.1}
          metalness={0.05}
        />
      </mesh>
      {/* Subtle darker edging along the top of the glass */}
      <mesh position={[0, PED_H + GLASS_H + 0.006, 0]}>
        <boxGeometry args={[GLASS_W + 0.01, 0.012, GLASS_D + 0.01]} />
        <meshStandardMaterial color="#2a1e14" roughness={0.9} />
      </mesh>
      {/* Item, slowly rotating */}
      <ShowcaseItem kind={kind} position={[0, itemY, 0]} />
      {/* Small warm accent light above the case */}
      <pointLight
        position={[0, PED_H + GLASS_H + 0.45, 0.35]}
        intensity={0.7}
        distance={2.5}
        color="#fff1d8"
      />
    </group>
  );
}

function YogaSetup() {
  const y = GROUND_Y + terrainHeight(YOGA_CENTER[0], YOGA_CENTER[1]);
  const DECK_W = 2.3;
  const DECK_D = 1.2;
  const DECK_T = 0.05;
  const DECK_H = 0.3;
  const LEG = 0.08;
  const WOOD = "#8b5a3c";
  const DARK = "#6a4028";
  // Top-of-deck Y relative to the group origin — mat and blocks sit on top.
  const TOP = DECK_H;
  return (
    <group
      position={[YOGA_CENTER[0], y, YOGA_CENTER[1]]}
      rotation={[0, YOGA_YAW, 0]}
    >
      {/* Coffee-table platform */}
      <mesh position={[0, DECK_H - DECK_T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[DECK_W, DECK_T, DECK_D]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {[
        [-1, -1], [1, -1], [-1, 1], [1, 1],
      ].map(([sx, sz], i) => (
        <mesh
          key={i}
          position={[
            sx * (DECK_W / 2 - LEG / 2 - 0.04),
            (DECK_H - DECK_T) / 2,
            sz * (DECK_D / 2 - LEG / 2 - 0.04),
          ]}
          castShadow
        >
          <boxGeometry args={[LEG, DECK_H - DECK_T, LEG]} />
          <meshStandardMaterial color={DARK} roughness={0.85} />
        </mesh>
      ))}
      {/* Mat centered on the deck */}
      <YogaMat position={[0, TOP, 0]} />
      {/* Blocks on the deck next to the rolled end */}
      <YogaBlock position={[0.55, TOP + 0.115, 0.38]} color="#3fa3a8" />
      <YogaBlock
        position={[0.35, TOP + 0.05, 0.5]}
        rotation={[0, 0.4, 0]}
        color="#e4738a"
      />
    </group>
  );
}

type DroppedItem = {
  id: number;
  kind: ItemKind;
  itemPos: [number, number, number];
  cardPos: [number, number, number];
  hideItem: boolean;
};

type Presenting = {
  id: number;
  kind: ItemKind;
  doorX: number;
  doorConfig: DoorConfig;
};

// First-person walk mode: PointerLockControls for mouse look, WASD for
// movement on the XZ plane, clamped to a radius around the origin so the
// player can wander as far as the tree (and a touch past it).
const WALK_RADIUS = 10;
const WALK_EYE_HEIGHT = 1.6;
const WALK_SPEED = 3.2;
const PLAYER_RADIUS = 0.3;
// Doors stand along z=0 facing +Z; this is the closest the player can get
// before an invisible wall stops them from walking through into the portals.
const DOOR_WALL_Z = 0.6;

// Shared player world-position used for cloth + future scene reactions.
// y is set far below ground when not in walk mode so distance checks miss.
const PLAYER_POS = new Vector3(0, -999, 0);

// While pointer is locked, the browser freezes clientX/clientY, so the
// Canvas event compute below falls back to screen-center for raycasting
// (i.e. you click whatever is under the crosshair, not under the stale cursor).
const WALK_POINTER_LOCKED = { current: false };

// Circle obstacles for first-person collision (xz, radius). The radii are
// generous bubbles around each prop — the player slides around them rather
// than wedging into corners, which is the right feel for a casual walk-around.
const SCENE_OBSTACLES: { x: number; z: number; r: number }[] = [
  { x: -4.5, z: -6, r: 0.7 }, // tree trunk + close foliage
  { x: BOOKSHELF_POSITION[0], z: BOOKSHELF_POSITION[2], r: 0.95 },
  { x: PICNIC_POSITION[0], z: PICNIC_POSITION[2], r: 1.4 },
  { x: YOGA_CENTER[0], z: YOGA_CENTER[1], r: 1.3 },
];

function FirstPersonControls({ onExit }: { onExit: () => void }) {
  const { camera, gl, scene, raycaster } = useThree();
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const move = useRef(new Vector3());
  // Door X-positions — walls live only where doors actually stand, so the
  // player can slip between/around them to reach the area behind.
  const doorXs = useMemo(() => {
    const total = BIRTHDAY_CONFIG.doors.length;
    return BIRTHDAY_CONFIG.doors.map(
      (_, i) => (i - (total - 1) / 2) * SPACING,
    );
  }, []);
  // Head-bob phase advances with footstep cadence while moving and decays
  // back to neutral when stopped, so the camera settles instead of jerking.
  const bobPhase = useRef(0);
  const bobAmount = useRef(0);

  useEffect(() => {
    // Snap camera into the walkable area at eye height.
    const startX = 0;
    const startZ = Math.min(camera.position.z, WALK_RADIUS - 1);
    camera.position.set(
      startX,
      GROUND_Y + terrainHeight(startX, startZ) + WALK_EYE_HEIGHT,
      startZ,
    );

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = true;
      else if (k === "s" || k === "arrowdown") keys.current.s = true;
      else if (k === "a" || k === "arrowleft") keys.current.a = true;
      else if (k === "d" || k === "arrowright") keys.current.d = true;
      else if (k === "escape") onExit();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = false;
      else if (k === "s" || k === "arrowdown") keys.current.s = false;
      else if (k === "a" || k === "arrowleft") keys.current.a = false;
      else if (k === "d" || k === "arrowright") keys.current.d = false;
    };
    // Pointer-locked clicks need a manual raycast from screen-center —
    // the browser freezes clientX/Y while locked, so r3f's normal pointer
    // event would otherwise hit whatever was under the (stale) cursor.
    const center = new Vector2(0, 0);
    const onClick = () => {
      if (!WALK_POINTER_LOCKED.current) return;
      raycaster.setFromCamera(center, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        let obj: typeof hit.object | null = hit.object;
        while (obj) {
          // r3f stores prop-derived event handlers on the object's __r3f slot.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const handlers = (obj as any).__r3f?.handlers;
          if (handlers?.onClick) {
            handlers.onClick({
              ...hit,
              eventObject: obj,
              stopPropagation: () => {},
              nativeEvent: undefined,
            });
            return;
          }
          obj = obj.parent;
        }
      }
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      // Park player far below so cloth/silk distance checks miss it again.
      PLAYER_POS.set(0, -999, 0);
      WALK_POINTER_LOCKED.current = false;
    };
  }, [camera, gl, scene, raycaster, onExit]);

  useFrame((_, delta) => {
    const k = keys.current;
    const fwd = (k.w ? 1 : 0) - (k.s ? 1 : 0);
    const strafe = (k.d ? 1 : 0) - (k.a ? 1 : 0);
    const moving = fwd !== 0 || strafe !== 0;

    let nx = camera.position.x;
    let nz = camera.position.z;

    if (moving) {
      camera.getWorldDirection(forward.current);
      forward.current.y = 0;
      forward.current.normalize();
      // right = forward × worldUp(0,1,0)
      right.current.set(-forward.current.z, 0, forward.current.x);

      move.current
        .set(0, 0, 0)
        .addScaledVector(forward.current, fwd)
        .addScaledVector(right.current, strafe)
        .normalize()
        .multiplyScalar(WALK_SPEED * delta);

      nx += move.current.x;
      nz += move.current.z;
      // Invisible wall but only where doors stand — gaps between/around them
      // remain walkable so the player can reach the area behind the row.
      // Two-sided: the side the player was already on is the side they stay
      // on, so circling around a door from behind doesn't teleport them.
      const halfDoor = DOOR_WIDTH / 2 + 0.1;
      const blockedByDoor = doorXs.some((dx) => Math.abs(nx - dx) < halfDoor);
      if (blockedByDoor) {
        const wasInFront = camera.position.z >= 0;
        if (wasInFront && nz < DOOR_WALL_Z) nz = DOOR_WALL_Z;
        else if (!wasInFront && nz > -DOOR_WALL_Z) nz = -DOOR_WALL_Z;
      }
      // Circle collision: push the player out of any prop bubble. Looped
      // twice so a push that lands inside a neighboring obstacle still
      // resolves cleanly.
      for (let pass = 0; pass < 2; pass++) {
        for (const o of SCENE_OBSTACLES) {
          const dx = nx - o.x;
          const dz = nz - o.z;
          const minD = o.r + PLAYER_RADIUS;
          const d2 = dx * dx + dz * dz;
          if (d2 < minD * minD) {
            const d = Math.sqrt(d2) || 1e-5;
            nx = o.x + (dx / d) * minD;
            nz = o.z + (dz / d) * minD;
          }
        }
      }
      const r = Math.hypot(nx, nz);
      if (r > WALK_RADIUS) {
        nx = (nx / r) * WALK_RADIUS;
        nz = (nz / r) * WALK_RADIUS;
      }
      camera.position.x = nx;
      camera.position.z = nz;
    }

    // Publish player world position so other scene parts (e.g. silk cloth)
    // can react. Using a sentinel low Y when stopped is fine; the position
    // is overwritten every frame in walk mode.
    PLAYER_POS.copy(camera.position);

    // Head bob: ramp amplitude up while moving, decay when stopped. Phase
    // advances at a footstep cadence (~2 steps/sec at WALK_SPEED).
    const bobTarget = moving ? 1 : 0;
    bobAmount.current += (bobTarget - bobAmount.current) * Math.min(1, delta * 6);
    if (moving) bobPhase.current += delta * WALK_SPEED * 2.0;
    const bob = Math.sin(bobPhase.current) * 0.05 * bobAmount.current;

    camera.position.y =
      GROUND_Y + terrainHeight(nx, nz) + WALK_EYE_HEIGHT + bob;
  });

  return (
    <PointerLockControls
      onLock={() => {
        WALK_POINTER_LOCKED.current = true;
      }}
      onUnlock={() => {
        WALK_POINTER_LOCKED.current = false;
        onExit();
      }}
    />
  );
}

function Scene({
  onOpen,
  onClose,
  dropped,
  presenting,
  walkMode,
  onExitWalk,
}: {
  onOpen: (door: DoorConfig, x: number) => void;
  onClose: (door: DoorConfig) => void;
  dropped: DroppedItem[];
  presenting: Presenting | null;
  walkMode: boolean;
  onExitWalk: () => void;
}) {
  return (
    <>
      {/* Outdoor lighting — warm sun + cool sky fill */}
      <ambientLight intensity={0.65} color="#cfe3ff" />
      <directionalLight
        position={[3, 7, 4]}
        intensity={0.75}
        color="#fff8ea"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-bias={-0.0004}
        shadow-radius={10}
      />
      <directionalLight position={[-5, 4, 3]} intensity={0.25} color="#fff4e8" />

      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        <Terrain />
        <Tree position={[-4.5, GROUND_Y + terrainHeight(-4.5, -6), -6]} />
        <Bookshelf position={BOOKSHELF_POSITION} rotation={[0, BOOKSHELF_YAW, 0]} />
        <PicnicSetup position={PICNIC_POSITION} rotation={[0, PICNIC_YAW, 0]} />
        <YogaSetup />
        <GrassField />

        {BIRTHDAY_CONFIG.doors.map((door, i) => {
          const past = isDayPast(door.day, door.unlockDate);
          return (
            <Door
              key={door.day}
              config={door}
              index={i}
              total={BIRTHDAY_CONFIG.doors.length}
              onOpen={onOpen}
              onClose={onClose}
              disabled={!!presenting}
              isPast={past}
            />
          );
        })}

        {BIRTHDAY_CONFIG.doors.map((door, i) => {
          if (!isDayPast(door.day, door.unlockDate)) return null;
          const doorX = (i - (BIRTHDAY_CONFIG.doors.length - 1) / 2) * SPACING;
          return (
            <GlassShowcase
              key={`showcase-${door.day}`}
              position={[doorX + DOOR_WIDTH / 2 + 0.6, GROUND_Y, 0.9]}
              kind={door.item}
            />
          );
        })}

        {dropped.map((d) =>
          d.hideItem ? null : (
            <FallingItem key={`item-${d.id}`} kind={d.kind} position={d.itemPos} />
          ),
        )}
        {dropped.map((d) => (
          <FallingCard key={`card-${d.id}`} position={d.cardPos} />
        ))}
      </Physics>

      {walkMode ? (
        <FirstPersonControls onExit={onExitWalk} />
      ) : (
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4.5}
          maxDistance={14}
          zoomSpeed={0.5}
          minPolarAngle={Math.PI / 2.4}
          maxPolarAngle={Math.PI / 2.05}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
      )}
    </>
  );
}

export default function Calendar() {
  const [dropped, setDropped] = useState<DroppedItem[]>([]);
  const [presenting, setPresenting] = useState<Presenting | null>(null);
  const [walkMode, setWalkMode] = useState(false);

  const handleOpen = useCallback(
    (door: DoorConfig, x: number) => {
      if (presenting) return;
      if (dropped.some((d) => d.id === door.day)) return;
      // Delay the presentation briefly so the door starts swinging first.
      setTimeout(() => {
        setPresenting({ id: door.day, kind: door.item, doorX: x, doorConfig: door });
      }, 400);
    },
    [presenting, dropped],
  );

  const handleClose = useCallback((door: DoorConfig) => {
    setDropped((prev) => prev.filter((d) => d.id !== door.day));
  }, []);

  const handleDone = useCallback(() => {
    if (!presenting) return;
    // Surprise doors: keep the item hidden — drop only the hint card so the
    // scene reflects that the hint has been taken, but the gift itself isn't
    // revealed in the 3D world either.
    const [px, py, pz] = DROP_POS;
    if (presenting.doorConfig.hideItem) {
      setDropped((prev) => [
        ...prev,
        {
          id: presenting.id,
          kind: presenting.kind,
          itemPos: [px, py + 0.4, pz],
          cardPos: [px + 0.15, py, pz - 0.3],
          hideItem: true,
        },
      ]);
    } else {
      setDropped((prev) => [
        ...prev,
        {
          id: presenting.id,
          kind: presenting.kind,
          itemPos: [px, py + 0.4, pz],
          cardPos: [px + 0.15, py, pz - 0.3],
          hideItem: false,
        },
      ]);
    }
    setPresenting(null);
  }, [presenting]);

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #8fbfe8 0%, #b9d7ee 45%, #e4e9d8 78%, #cddbb5 100%)",
        }}
      >
        <Canvas
          camera={{ position: [0.05, 0.96, 13.97], fov: 42 }}
          dpr={[1, 2]}
          shadows="soft"
          gl={{ alpha: true }}
          style={{ background: "transparent" }}
          onCreated={() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                window.dispatchEvent(new Event("birthday:calendar-ready"));
              });
            });
          }}
        >
          <Scene
            onOpen={handleOpen}
            onClose={handleClose}
            dropped={dropped}
            presenting={presenting}
            walkMode={walkMode}
            onExitWalk={() => setWalkMode(false)}
          />
        </Canvas>
      </div>

      <button
        type="button"
        onClick={() => setWalkMode((v) => !v)}
        className="fixed bottom-4 right-4 z-10 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-black/80"
      >
        {walkMode ? "Exit walk (Esc)" : "Walk around"}
      </button>
      {walkMode && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur">
          WASD / arrows to move · mouse to look · Esc to exit
        </div>
      )}

      {presenting && (
        <InspectModal doorConfig={presenting.doorConfig} onDone={handleDone} />
      )}
    </>
  );
}
