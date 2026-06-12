"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { HeroText } from "./HeroText";

const ParticleField = dynamic(
  () => import("./ParticleField").then((m) => m.ParticleField),
  { ssr: false },
);

export function Hero() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <section
      id="hero"
      aria-label="Hero section"
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Particle Background */}
      <ParticleField mouseRef={mouseRef} />

      {/* Radial gradient vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, var(--bg-primary) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Left accent line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          bottom: "10%",
          left: "1.5rem",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent, var(--border-hover), transparent)",
        }}
      />

      {/* Main content */}
      <div
        className="container-portfolio"
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "10rem",
          paddingBottom: "6rem",
        }}
      >
        <HeroText />
      </div>

      {/* Scroll indicator */}
      <div
        aria-label="Scroll to explore"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          animation: "fadeSlideUp 1s ease 1.5s both",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          scroll to explore
        </span>
        <div
          aria-hidden="true"
          style={{
            width: "1px",
            height: "60px",
            background:
              "linear-gradient(to bottom, var(--accent-1), transparent)",
            animation: "scrollLine 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scrollLine {
            0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0; }
            50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          }
        `}</style>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "linear-gradient(to bottom, transparent, var(--bg-primary))",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
