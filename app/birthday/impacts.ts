import type { RapierRigidBody } from "@react-three/rapier";

// Shared registry of physics bodies whose positions the grass shader should
// react to. Items push themselves in on mount; grass samples live positions
// each frame to bend nearby blades away.
export const impactBodies = new Set<RapierRigidBody>();

export function registerImpact(body: RapierRigidBody): () => void {
  impactBodies.add(body);
  return () => {
    impactBodies.delete(body);
  };
}
