"use client";

import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Project } from "~/data/projects";
import { MagneticButton } from "~/components/ui/MagneticButton";
import { useAppStore } from "~/store/useAppStore";

interface ProjectCardProps {
  project: Project;
  style?: React.CSSProperties;
}

export function ProjectCard({ project, style }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    // Specular highlight
    if (glowRef.current) {
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setCursorVariant("view");
    if (videoRef.current) {
      videoRef.current.style.opacity = "1";
      videoRef.current.style.transform = "scale(1.05)";
      void videoRef.current.play().catch(() => {/* video not loaded */});
    }
  }, [setCursorVariant]);

  const handleMouseLeave = useCallback(() => {
    setCursorVariant("default");
    const card = cardRef.current;
    if (card) {
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      setTimeout(() => {
        if (card) card.style.transition = "";
      }, 500);
    }

    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }

    if (videoRef.current) {
      videoRef.current.style.opacity = "0";
      videoRef.current.style.transform = "scale(1)";
      videoRef.current.pause();
    }
  }, [setCursorVariant]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        cursor: "none",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Specular glow overlay */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          transition: "background 0.1s ease",
        }}
      />

      {/* Thumbnail / Video */}
      <div
        style={{
          position: "relative",
          height: "220px",
          overflow: "hidden",
          background:
            `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
        }}
      >
        {/* Placeholder background */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, ${project.color}30 0%, transparent 60%)`,
          }}
        />

        {/* Year badge */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 3,
            padding: "4px 10px",
            background: "rgba(8, 8, 8, 0.7)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-muted)",
            backdropFilter: "blur(8px)",
          }}
        >
          {project.year}
        </div>

        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 3,
            padding: "4px 10px",
            background: `${project.color}20`,
            border: `1px solid ${project.color}40`,
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: project.color,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {project.category}
        </div>

        {/* Hover video */}
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0,
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          />
        )}

        {/* Project title large watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "1rem",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            color: `${project.color}15`,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {project.title}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "var(--text-xl)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--accent-glow)",
            marginBottom: "0.75rem",
            fontStyle: "italic",
          }}
        >
          {project.tagline}
        </p>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            marginBottom: "1.25rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "1.5rem",
          }}
        >
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span
              style={{
                padding: "3px 10px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <MagneticButton
            href={`/projects/${project.slug}`}
            aria-label={`View ${project.title} project details`}
            id={`view-project-${project.slug}`}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                color: project.color,
                textDecoration: "none",
              }}
            >
              View Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </MagneticButton>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.title}`}
                style={{
                  color: "var(--text-muted)",
                  transition: "color 0.2s ease",
                  cursor: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  setCursorVariant("hovering");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  setCursorVariant("default");
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${project.title}`}
                style={{
                  color: "var(--text-muted)",
                  transition: "color 0.2s ease",
                  cursor: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  setCursorVariant("hovering");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  setCursorVariant("default");
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
