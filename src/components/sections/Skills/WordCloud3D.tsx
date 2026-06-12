"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { skills, categoryColors, levelLabels } from "~/data/skills";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import type { Skill } from "~/data/skills";

interface SkillWordProps {
  skill: Skill;
  position: THREE.Vector3;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

function SkillWord({ skill, position, mouseRef }: SkillWordProps) {
  const textRef = useRef<THREE.Mesh>(null);
  const basePosition = useMemo(() => position.clone(), [position]);
  const velocity = useRef(new THREE.Vector3());
  const currentPos = useRef(position.clone());
  const hovered = useRef(false);

  const color = categoryColors[skill.category];
  const scale = skill.level === 3 ? 1.2 : skill.level === 2 ? 1.0 : 0.85;

  useFrame(({ camera, size }) => {
    if (!textRef.current) return;

    // Convert mouse to world space
    const mouseX = ((mouseRef.current?.x ?? 0) / size.width) * 2 - 1;
    const mouseY = -(((mouseRef.current?.y ?? 0) / size.height) * 2 - 1);

    // Unproject to world coords at z=0
    const vec = new THREE.Vector3(mouseX, mouseY, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const mouseWorld = camera.position.clone().add(dir.multiplyScalar(dist));

    const dx = currentPos.current.x - mouseWorld.x;
    const dy = currentPos.current.y - mouseWorld.y;
    const dist2 = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 3;

    if (dist2 < repelRadius) {
      const force = (repelRadius - dist2) / repelRadius;
      velocity.current.x += (dx / dist2) * force * 0.12;
      velocity.current.y += (dy / dist2) * force * 0.12;
      hovered.current = true;
    } else {
      hovered.current = false;
    }

    // Spring return
    velocity.current.x = velocity.current.x * 0.85 + (basePosition.x - currentPos.current.x) * 0.06;
    velocity.current.y = velocity.current.y * 0.85 + (basePosition.y - currentPos.current.y) * 0.06;
    velocity.current.z = velocity.current.z * 0.85 + (basePosition.z - currentPos.current.z) * 0.06;

    currentPos.current.add(velocity.current);

    textRef.current.position.copy(currentPos.current);

    // Scale on hover
    const targetScale = hovered.current ? scale * 1.4 : scale;
    const currentScale = textRef.current.scale.x;
    textRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.5 * scale}
      color={color}
      anchorX="center"
      anchorY="middle"
      font={undefined}
      material-transparent
      material-opacity={0.85}
    >
      {skill.name}
    </Text>
  );
}

function SkillCloud({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    return skills.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / skills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 5.5;

      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  useEffect(() => {
    return () => {
      // Drei Text manages its own disposal
    };
  }, []);

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillWord
          key={skill.name}
          skill={skill}
          position={positions[i]!}
          mouseRef={mouseRef}
        />
      ))}
    </group>
  );
}

interface WordCloud3DProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export function WordCloud3D({ mouseRef }: WordCloud3DProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          padding: "2rem",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        {skills.map((skill) => (
          <span
            key={skill.name}
            style={{
              padding: "6px 14px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-mono)",
              fontSize: `${0.7 + skill.level * 0.1}rem`,
              color: categoryColors[skill.category],
              title: levelLabels[skill.level],
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "500px" }} aria-label="Interactive 3D skill word cloud">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <SkillCloud mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
