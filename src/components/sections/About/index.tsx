"use client";

import { useEffect, useRef } from "react";
import { initGsap, gsap, ScrollTrigger } from "~/lib/gsap-init";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import { ParallaxImage } from "./ParallaxImage";
import { stats } from "~/data/experience";

const SKILL_BADGES = ["TypeScript", "Next.js", "Three.js", "Figma"];

const PARAGRAPHS = [
  "I'm a full-stack engineer with 6+ years of obsessing over the intersection of engineering rigor and design craft. I build things that are not just functional — they're felt.",
  "My work spans from sub-millisecond WebSocket latency on enterprise dashboards to cinematic 3D landing pages that break GPU heat records. The common thread: if the user experience isn't exceptional, the code isn't done.",
  "When I'm not deep in a codebase, I'm contributing to open-source, writing about performance engineering, or redesigning the UI of something that definitely didn't ask to be redesigned.",
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    initGsap();

    const ctx = gsap.context(() => {
      // Scroll-triggered background color shift
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onUpdate: (self) => {
          const progress = self.progress;
          document.body.style.backgroundColor = `hsl(${252 + progress * 8}, ${progress * 15}%, ${3 + progress * 2}%)`;
        },
        onLeave: () => {
          document.body.style.backgroundColor = "";
        },
        onLeaveBack: () => {
          document.body.style.backgroundColor = "";
        },
      });

      // Columns slide in from opposite sides
      gsap.from(textColRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textColRef.current,
          start: "top 80%",
        },
      });

      gsap.from(imageColRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imageColRef.current,
          start: "top 80%",
        },
      });

      // Paragraph blur-fade in
      const paras = textColRef.current?.querySelectorAll(".about-para");
      if (paras?.length) {
        gsap.from(paras, {
          opacity: 0,
          y: 30,
          filter: "blur(8px)",
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textColRef.current,
            start: "top 70%",
          },
        });
      }

      // Count-up stats
      const statEls = statsRef.current?.querySelectorAll(".stat-value");
      statEls?.forEach((el, i) => {
        const target = stats[i];
        if (!target) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target.value,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toLocaleString() + target.suffix;
          },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });

        // Underline draw
        const underline = el.parentElement?.querySelector(".stat-underline") as HTMLElement | null;
        if (underline) {
          gsap.from(underline, {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section"
      aria-label="About me"
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
            01 / About
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

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Text column */}
          <div ref={textColRef}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "2rem",
              }}
            >
              Building at the edge of{" "}
              <span className="text-gradient-accent">craft & code.</span>
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  className="about-para"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div ref={imageColRef}>
            <ParallaxImage skills={SKILL_BADGES} />
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid var(--border)",
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <div style={{ position: "relative", paddingBottom: "0.75rem" }}>
                <span
                  className="stat-value"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 3rem)",
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                  }}
                >
                  {reducedMotion ? `${stat.value.toLocaleString()}${stat.suffix}` : "0"}
                </span>
                <div
                  className="stat-underline"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    background:
                      "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
                    borderRadius: "1px",
                    boxShadow: "0 0 8px var(--accent-1)",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
