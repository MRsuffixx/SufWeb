"use client";

import { useEffect, useRef } from "react";
import type { AnimationPhase } from "./index";

interface PaperPlaneProps {
  phase: AnimationPhase;
  onComplete: () => void;
}

export function PaperPlane({ phase, onComplete }: PaperPlaneProps) {
  const planeRef = useRef<SVGSVGElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "flying") return;

    let rafId: number;
    let startTime: number | null = null;
    const duration = 1200;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      if (planeRef.current) {
        // Bezier path: starts at center-bottom, curves to top-right
        const x = progress * window.innerWidth * 0.8;
        const y =
          -Math.sin(progress * Math.PI * 0.5) * window.innerHeight * 0.6;
        const rotate = -15 - progress * 30;
        const scale = 1 - progress * 0.6;

        planeRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
        planeRef.current.style.opacity = progress > 0.8 ? `${1 - (progress - 0.8) * 5}` : "1";
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    // Spawn confetti
    if (confettiRef.current) {
      const colors = ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b"];
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `
          position: absolute;
          width: ${4 + Math.random() * 6}px;
          height: ${4 + Math.random() * 6}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
          left: 50%;
          top: 50%;
          animation: confetti-${i} 1s ease-out forwards;
        `;
        confettiRef.current.appendChild(particle);

        const angle = (i / 30) * Math.PI * 2;
        const distance = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        const styleEl = document.createElement("style");
        styleEl.textContent = `
          @keyframes confetti-${i} {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${tx}px, ${ty}px) scale(0); opacity: 0; }
          }
        `;
        document.head.appendChild(styleEl);
        setTimeout(() => {
          particle.remove();
          styleEl.remove();
        }, 1100);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [phase, onComplete]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div ref={confettiRef} style={{ position: "absolute", inset: 0 }} />
      <svg
        ref={planeRef}
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", filter: "drop-shadow(0 0 12px var(--accent-1))" }}
      >
        <path
          d="M5 30L55 5L40 55L28 35L5 30Z"
          fill="var(--accent-1)"
          stroke="var(--accent-glow)"
          strokeWidth="1"
        />
        <path
          d="M28 35L55 5"
          stroke="var(--accent-glow)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M28 35L32 48"
          stroke="var(--accent-2)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
