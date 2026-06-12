"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "~/hooks/useReducedMotion";

const PARTICLE_COUNT = 3000;

function Particles({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Points>(null);
  const { size } = useThree();

  const { positions, colors, originalPositions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    const indigo = new THREE.Color("#6366f1");
    const slate = new THREE.Color("#475569");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // 20% indigo accent, 80% slate
      const color = Math.random() < 0.2 ? indigo : slate;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }

    return { positions: pos, colors: col, originalPositions: origPos, velocities: vel };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const posArray = geometry.attributes.position?.array as Float32Array;
    if (!posArray) return;

    // Convert mouse screen coords to world space approx
    const mouseX = ((mouseRef.current?.x ?? 0) / window.innerWidth) * 2 - 1;
    const mouseY = -(((mouseRef.current?.y ?? 0) / window.innerHeight) * 2 - 1);
    const mouseWorldX = mouseX * (size.width / 100);
    const mouseWorldY = mouseY * (size.height / 100);
    const repelRadius = 2.5;
    const repelStrength = 0.08;
    const returnStrength = 0.05;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx]!;
      const oy = originalPositions[idx + 1]!;

      // Sine wave breathe
      const breatheX = Math.sin(time * 0.3 + i * 0.01) * 0.05;
      const breatheY = Math.cos(time * 0.2 + i * 0.013) * 0.05;

      const currentX = posArray[idx]!;
      const currentY = posArray[idx + 1]!;

      // Mouse repulsion
      const dx = currentX - mouseWorldX;
      const dy = currentY - mouseWorldY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        velocities[idx] = (velocities[idx]! + (dx / dist) * force * repelStrength);
        velocities[idx + 1] = (velocities[idx + 1]! + (dy / dist) * force * repelStrength);
      }

      // Spring return to origin
      velocities[idx] = velocities[idx]! * 0.88 + (ox + breatheX - currentX) * returnStrength;
      velocities[idx + 1] = velocities[idx + 1]! * 0.88 + (oy + breatheY - currentY) * returnStrength;

      posArray[idx] = currentX + velocities[idx]!;
      posArray[idx + 1] = currentY + velocities[idx + 1]!;
    }

    geometry.attributes.position!.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface ParticleFieldProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export function ParticleField({ mouseRef }: ParticleFieldProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 60% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
