import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "~/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: "8rem",
        paddingBottom: "6rem",
      }}
    >
      {/* Hero band */}
      <div
        style={{
          background: `linear-gradient(135deg, ${project.color}15, transparent)`,
          borderBottom: "1px solid var(--border)",
          marginBottom: "5rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="container-portfolio">
          {/* Back link */}
          <Link
            href="/#portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "2.5rem",
              transition: "color 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7H2.5M2.5 7L6 3.5M2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to work
          </Link>

          {/* Category + year */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: `${project.color}20`,
                border: `1px solid ${project.color}40`,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: project.color,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {project.category}
            </span>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
              }}
            >
              {project.year}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(3rem, 6vw, 6rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            {project.title}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xl)",
              color: "var(--text-secondary)",
              marginBottom: "2.5rem",
              maxWidth: "700px",
            }}
          >
            {project.tagline}
          </p>

          {/* Action links */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: project.color,
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Live Demo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  border: "1px solid var(--border-hover)",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                GitHub
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Case study body */}
      <div className="container-portfolio">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            marginBottom: "5rem",
          }}
          className="case-study-grid"
        >
          {/* Challenge */}
          <div className="glass-card" style={{ padding: "2.5rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: project.color,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              The Challenge
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              {project.challenge}
            </p>
          </div>

          {/* Solution */}
          <div className="glass-card" style={{ padding: "2.5rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: project.color,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              The Solution
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              {project.solution}
            </p>
          </div>
        </div>

        {/* Full description */}
        <div
          style={{
            maxWidth: "800px",
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-3xl)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Overview
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-lg)",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: "5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-2xl)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Tech Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "8px 16px",
                  background: `${project.color}10`,
                  border: `1px solid ${project.color}30`,
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  color: project.color,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation: prev / next */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            paddingTop: "3rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            href="/#portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7H2.5M2.5 7L6 3.5M2.5 7L6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Projects
          </Link>
          <Link
            href="/#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: `linear-gradient(135deg, var(--accent-1), var(--accent-2))`,
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Work with me
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .case-study-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
