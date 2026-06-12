"use client";

import { useState, useEffect, useRef } from "react";
import { projects } from "~/data/projects";
import { ProjectCard } from "./ProjectCard";
import { initGsap, gsap } from "~/lib/gsap-init";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import type { Project } from "~/data/projects";

type Category = "all" | Project["category"];

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Web App", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "Open Source", value: "oss" },
  { label: "Other", value: "other" },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const handleFilter = (cat: Category) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
  };

  useEffect(() => {
    if (reducedMotion) return;
    initGsap();

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".project-card-wrapper");
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Animate filter change
  useEffect(() => {
    if (reducedMotion) return;
    const cards = sectionRef.current?.querySelectorAll(".project-card-wrapper");
    if (!cards?.length) return;

    gsap.from(cards, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
    });
  }, [activeCategory, reducedMotion]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="section"
      aria-label="Portfolio projects"
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
            03 / Work
          </span>
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: "1px",
              background: "linear-gradient(to right, var(--border-hover), transparent)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Selected{" "}
            <span className="text-gradient-accent">Projects.</span>
          </h2>

          {/* Filter bar */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              padding: "4px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={activeCategory === cat.value}
                onClick={() => handleFilter(cat.value)}
                style={{
                  padding: "6px 16px",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "var(--text-sm)",
                  cursor: "none",
                  transition: "all 0.25s ease",
                  background:
                    activeCategory === cat.value
                      ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))"
                      : "transparent",
                  color:
                    activeCategory === cat.value
                      ? "#fff"
                      : "var(--text-muted)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid — asymmetric masonry-like layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
          role="list"
          aria-label="Project list"
        >
          {filtered.map((project, i) => (
            <div
              key={project.slug}
              role="listitem"
              className="project-card-wrapper"
              style={{
                // Featured projects span 2 columns on wide screens
                gridColumn:
                  project.featured && i === 0 ? "span 2" : "span 1",
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
            }}
          >
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
