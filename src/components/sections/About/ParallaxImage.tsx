"use client";

import { useRef } from "react";

interface ParallaxImageProps {
  skills: string[];
}

export function ParallaxImage({ skills }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      {/* Morphing blob background */}
      <div
        className="profile-blob"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Rotating gradient border */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "3px",
          borderRadius: "var(--radius-2xl)",
          background:
            "conic-gradient(from var(--angle, 0deg), var(--accent-1), var(--accent-2), #ec4899, var(--accent-1))",
          animation: "rotate-gradient 3s linear infinite",
        }}
      >
        <style>{`
          @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes rotate-gradient {
            to { --angle: 360deg; }
          }
        `}</style>

        {/* Profile photo container */}
        <div
          style={{
            borderRadius: "calc(var(--radius-2xl) - 2px)",
            overflow: "hidden",
            background: "var(--bg-card)",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Gradient avatar placeholder */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #0a0614 0%, #1a1030 40%, #0f0f2a 60%, #080818 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Stylized avatar silhouette */}
            <svg
              width="60%"
              height="60%"
              viewBox="0 0 200 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Profile avatar"
            >
              {/* Head */}
              <circle cx="100" cy="70" r="45" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
              <circle cx="100" cy="70" r="35" fill="rgba(99,102,241,0.15)" />
              {/* Body */}
              <path
                d="M30 200 Q30 140 100 130 Q170 140 170 200"
                fill="rgba(99,102,241,0.15)"
                stroke="rgba(99,102,241,0.3)"
                strokeWidth="1.5"
              />
              {/* Glow */}
              <circle cx="100" cy="70" r="45" fill="url(#avatarGlow)" opacity="0.5" />
              <defs>
                <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Floating code snippet decoration */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--accent-glow)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>const </span>
              <span style={{ color: "#ec4899" }}>dev</span>
              <span style={{ color: "var(--text-muted)" }}> = </span>
              <span style={{ color: "#a855f7" }}>"legendary"</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating skill badges */}
      {skills.slice(0, 4).map((skill, i) => {
        const positions = [
          { top: "5%", right: "-15%" },
          { top: "35%", right: "-20%" },
          { bottom: "25%", left: "-18%" },
          { bottom: "8%", right: "-10%" },
        ];
        const pos = positions[i] ?? {};
        return (
          <div
            key={skill}
            aria-hidden="true"
            style={{
              position: "absolute",
              ...pos,
              zIndex: 2,
              padding: "6px 14px",
              background: "rgba(20, 20, 20, 0.9)",
              border: "1px solid var(--border-hover)",
              borderRadius: "var(--radius-full)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--accent-glow)",
              backdropFilter: "blur(12px)",
              animation: `float-badge ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {skill}
          </div>
        );
      })}

      <style>{`
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
