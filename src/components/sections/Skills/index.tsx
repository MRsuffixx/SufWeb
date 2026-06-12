"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { categoryColors } from "~/data/skills";

const WordCloud3D = dynamic(
  () => import("./WordCloud3D").then((m) => m.WordCloud3D),
  { ssr: false },
);

export function Skills() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <section
      id="skills"
      className="section"
      aria-label="Skills and Experience"
      onMouseMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <div className="container-portfolio">
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--accent-1)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            02 / Skills & Experience
          </span>
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right, var(--border-hover), transparent)",
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          The tools I reach for{" "}
          <span className="text-gradient-accent">first.</span>
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            marginBottom: "4rem",
            maxWidth: "600px",
          }}
        >
          Hover over the word cloud to see skills react. Color indicates category — move your cursor through to explore.
        </p>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
          aria-label="Skill category legend"
        >
          {(
            Object.entries(categoryColors) as [
              keyof typeof categoryColors,
              string,
            ][]
          ).map(([cat, color]) => (
            <div
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                textTransform: "capitalize",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
              {cat}
            </div>
          ))}
        </div>

        {/* Two-column: Word cloud + Timeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="skills-grid"
        >
          {/* Word Cloud */}
          <div>
            <WordCloud3D mouseRef={mouseRef} />
          </div>

          {/* Timeline */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-xl)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              Work History
            </h3>
            <ExperienceTimeline />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
