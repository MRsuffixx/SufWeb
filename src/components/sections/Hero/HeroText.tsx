"use client";

import { useEffect, useRef, useState } from "react";
import { initGsap, gsap } from "~/lib/gsap-init";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import { MagneticButton } from "~/components/ui/MagneticButton";

const ROLES = [
  "Full-Stack Developer",
  "UI/UX Enthusiast",
  "Performance Obsessed",
  "Open Source Contributor",
];

function Typewriter() {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(ROLES[0]!);
      return;
    }

    const currentRole = ROLES[roleIndex % ROLES.length]!;
    const speed = isDeleting ? 50 : 80;
    const pauseAtEnd = 2000;

    const tick = () => {
      if (!isDeleting && displayText === currentRole) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseAtEnd);
        return;
      }

      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((i) => i + 1);
        return;
      }

      setDisplayText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentRole.slice(0, prev.length + 1),
      );
    };

    timeoutRef.current = setTimeout(tick, speed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, roleIndex, isDeleting, reducedMotion]);

  return (
    <span
      aria-live="polite"
      aria-label={`Current role: ${ROLES[roleIndex % ROLES.length]}`}
    >
      {displayText}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          background: "var(--accent-1)",
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          animation: "blink 0.8s steps(1) infinite",
        }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </span>
  );
}

interface HeroTextProps {
  onComplete?: () => void;
}

export function HeroText({ onComplete }: HeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete?.();
      return;
    }

    initGsap();
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll(".hero-word");
      const subline = containerRef.current?.querySelector(".hero-subline");
      const ctas = containerRef.current?.querySelector(".hero-ctas");
      const scroll = containerRef.current?.querySelector(".hero-scroll");

      if (!words?.length) return;

      const tl = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      const animatableEls = [subline, ctas, scroll].filter(Boolean);

      tl.set(animatableEls.length ? animatableEls : ".hero-ctas", { opacity: 0, y: 20 })
        .from(words, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        })
        .from(
          ".hero-line-3",
          {
            filter: "blur(20px)",
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        );

      if (subline) tl.to(subline, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
      if (ctas) tl.to(ctas, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
      if (scroll) tl.to(scroll, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: "900px",
      }}
    >
      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(3.5rem, 9vw, 8rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        {/* Line 1 */}
        <span
          style={{ display: "block", overflow: "hidden" }}
          aria-hidden="true"
        >
          {"Crafting Digital".split(" ").map((word) => (
            <span
              key={word}
              className="hero-word"
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </span>
          ))}
        </span>

        {/* Line 2 — gradient */}
        <span
          style={{ display: "block", overflow: "hidden" }}
          aria-hidden="true"
        >
          {"Experiences".split(" ").map((word) => (
            <span
              key={word}
              className="hero-word text-gradient-accent"
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                fontWeight: 800,
              }}
            >
              {word}
            </span>
          ))}
        </span>

        {/* Line 3 — blur reveal */}
        <span
          className="hero-line-3"
          style={{ display: "block", overflow: "hidden" }}
          aria-hidden="true"
        >
          {"That Matter.".split(" ").map((word) => (
            <span
              key={word}
              className="hero-word"
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                color: "var(--text-secondary)",
              }}
            >
              {word}
            </span>
          ))}
        </span>

        {/* Screen reader full text */}
        <span className="sr-only">
          Crafting Digital Experiences That Matter.
        </span>
      </h1>

      {/* Typewriter subline */}
      <p
        className="hero-subline"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
          color: "var(--accent-glow)",
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>
          ~/
        </span>
        <Typewriter />
      </p>

      {/* CTA Buttons */}
      <div
        className="hero-ctas"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        <MagneticButton
          href="#portfolio"
          id="hero-cta-work"
          aria-label="View my work — scroll to portfolio"
          className="btn-shimmer"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2rem",
              background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "var(--text-base)",
              color: "#fff",
              boxShadow: "var(--glow-accent)",
            }}
          >
            View My Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </MagneticButton>

        <MagneticButton
          href="/cv.pdf"
          id="hero-cta-cv"
          aria-label="Download CV"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2rem",
              border: "1px solid var(--border-hover)",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "var(--text-base)",
              color: "var(--text-primary)",
              background: "transparent",
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}
            className="cv-btn"
          >
            Download CV
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 3V11M8 11L5 8M8 11L11 8M3 13H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </MagneticButton>
      </div>
    </div>
  );
}
