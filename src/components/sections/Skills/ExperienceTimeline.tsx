"use client";

import { useEffect, useRef } from "react";
import { initGsap, gsap, ScrollTrigger } from "~/lib/gsap-init";
import { experiences } from "~/data/experience";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import { GlitchText } from "~/components/ui/GlitchText";

const TYPE_COLORS = {
  "full-time": "var(--accent-1)",
  freelance: "#10b981",
  contract: "var(--accent-2)",
};

export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (lineRef.current) {
        lineRef.current.style.strokeDashoffset = "0";
      }
      return;
    }

    initGsap();

    const ctx = gsap.context(() => {
      // SVG line draws on scroll
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        lineRef.current.style.strokeDasharray = `${length}`;
        lineRef.current.style.strokeDashoffset = `${length}`;

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        });
      }

      // Entry cards slide in from right
      const cards = sectionRef.current?.querySelectorAll(".exp-card");
      cards?.forEach((card, i) => {
        gsap.from(card, {
          x: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
          delay: i * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={sectionRef} style={{ position: "relative", paddingLeft: "2rem" }}>
      {/* SVG self-drawing timeline line */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "2px",
          height: "100%",
          overflow: "visible",
        }}
      >
        <path
          ref={lineRef}
          d={`M 1 0 L 1 2000`}
          stroke="url(#timelineGrad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Experience entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {experiences.map((exp, i) => (
          <div
            key={`${exp.company}-${i}`}
            className="exp-card glass-card"
            style={{
              padding: "2rem",
              position: "relative",
            }}
          >
            {/* Timeline dot */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-2.35rem",
                top: "2rem",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "var(--accent-1)",
                border: "2px solid var(--bg-primary)",
                boxShadow: "0 0 12px var(--accent-1)",
              }}
            />

            {/* Header */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "var(--text-xl)",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.25rem",
                  }}
                >
                  <GlitchText
                    text={exp.role}
                    trigger={!reducedMotion}
                  />
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    color: "var(--accent-glow)",
                    fontWeight: 500,
                  }}
                >
                  {exp.company}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {exp.period}
                </span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid ${TYPE_COLORS[exp.type]}40`,
                    background: `${TYPE_COLORS[exp.type]}10`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: TYPE_COLORS[exp.type],
                    textTransform: "capitalize",
                    letterSpacing: "0.05em",
                  }}
                >
                  {exp.type}
                </span>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              {exp.description}
            </p>

            {/* Location */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7 6 11 6 11C6 11 9.5 7 9.5 4.5C9.5 2.567 7.933 1 6 1ZM6 6C5.172 6 4.5 5.328 4.5 4.5C4.5 3.672 5.172 3 6 3C6.828 3 7.5 3.672 7.5 4.5C7.5 5.328 6.828 6 6 6Z" fill="currentColor" />
              </svg>
              {exp.location}
            </p>

            {/* Tech stack pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {exp.tech.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "4px 10px",
                    background: "rgba(99, 102, 241, 0.08)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--accent-glow)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
