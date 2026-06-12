"use client";

import { useState, useRef, useCallback } from "react";
import { api } from "~/trpc/react";
import { PaperPlane } from "./PaperPlane";
import { useAppStore } from "~/store/useAppStore";

export type AnimationPhase = "idle" | "flying" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const active = focused || value.length > 0;

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--text-primary)",
    padding: "1.5rem 0 0.5rem",
    resize: "none",
    cursor: "none",
    lineHeight: 1.6,
  };

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "1.5rem",
      }}
    >
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          top: focused || active ? "0.3rem" : "1.5rem",
          left: 0,
          fontFamily: "var(--font-body)",
          fontSize: focused || active ? "var(--text-xs)" : "var(--text-base)",
          color:
            error
              ? "#ef4444"
              : focused
                ? "var(--accent-1)"
                : "var(--text-muted)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          letterSpacing: focused || active ? "0.08em" : "0",
          textTransform: focused || active ? "uppercase" : "none",
        }}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); setCursorVariant("input"); }}
          onBlur={() => { setFocused(false); setCursorVariant("default"); }}
          rows={5}
          style={sharedStyle}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); setCursorVariant("input"); }}
          onBlur={() => { setFocused(false); setCursorVariant("default"); }}
          style={sharedStyle}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        />
      )}

      {/* Animated underline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: 0,
          right: 0,
          height: "1px",
          background: "var(--border-hover)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: error ? "#ef4444" : "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
            transform: focused ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: focused ? "0 0 8px var(--accent-1)" : "none",
          }}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "#ef4444",
            animation: "shake 0.4s ease",
          }}
        >
          {error}
        </p>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com",
    hoverColor: "#ffffff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    hoverColor: "#0077b5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    hoverColor: "#1DA1F2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const sectionRef = useRef<HTMLElement>(null);

  const sendMutation = api.contact.send.useMutation({
    onSuccess: () => {
      setPhase("flying");
    },
    onError: () => {
      setPhase("error");
      setTimeout(() => setPhase("idle"), 3000);
    },
  });

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    else if (form.message.trim().length < 10) newErrors.message = "Message too short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      sendMutation.mutate(form);
    },
    [form, validate, sendMutation],
  );

  const handlePlaneComplete = useCallback(() => {
    setPhase("success");
    setForm({ name: "", email: "", message: "" });
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section"
      aria-label="Contact section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Animated mesh gradient bg */}
      <div
        aria-hidden="true"
        className="contact-bg-mesh"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Paper plane */}
      <PaperPlane phase={phase} onComplete={handlePlaneComplete} />

      <div className="container-portfolio" style={{ position: "relative", zIndex: 1 }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--accent-1)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            04 / Contact
          </span>
          <div aria-hidden="true" style={{ flex: 1, height: "1px", background: "linear-gradient(to right, var(--border-hover), transparent)" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left column */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              Let's build something{" "}
              <span className="text-gradient-accent">legendary.</span>
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "3rem",
              }}
            >
              I'm currently available for freelance projects and full-time roles. If you have a project that needs exceptional engineering and design taste — let's talk.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="social-link"
                  data-hover-color={social.hoverColor}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = social.hoverColor;
                    el.style.borderColor = `${social.hoverColor}60`;
                    el.style.transform = "translateY(-4px) scale(1.05)";
                    el.style.boxShadow = `0 8px 24px ${social.hoverColor}20`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--text-muted)";
                    el.style.borderColor = "var(--border)";
                    el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right column — Form */}
          <div>
            {phase === "success" ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "400px",
                  gap: "1.5rem",
                  textAlign: "center",
                  animation: "fadeSlideUp 0.6s ease",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                  }}
                  aria-hidden="true"
                >
                  ✦
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "var(--text-2xl)",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Message sent!
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    color: "var(--text-secondary)",
                  }}
                >
                  I'll get back to you soon ✦
                </p>
                <button
                  onClick={() => setPhase("idle")}
                  style={{
                    marginTop: "1rem",
                    padding: "0.6rem 1.5rem",
                    background: "transparent",
                    border: "1px solid var(--border-hover)",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                    cursor: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  opacity: phase === "flying" ? 0 : 1,
                  transition: "opacity 0.4s ease",
                }}
                aria-label="Contact form"
              >
                <FloatingField
                  id="contact-name"
                  label="Your Name"
                  value={form.name}
                  onChange={(v) => { setForm((f) => ({ ...f, name: v })); setErrors((e) => ({ ...e, name: undefined })); }}
                  error={errors.name}
                />
                <FloatingField
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => { setForm((f) => ({ ...f, email: v })); setErrors((e) => ({ ...e, email: undefined })); }}
                  error={errors.email}
                />
                <FloatingField
                  id="contact-message"
                  label="Your Message"
                  value={form.message}
                  onChange={(v) => { setForm((f) => ({ ...f, message: v })); setErrors((e) => ({ ...e, message: undefined })); }}
                  error={errors.message}
                  multiline
                />

                {/* Error display */}
                {phase === "error" && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-sm)",
                      color: "#ef4444",
                      padding: "0.75rem 1rem",
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "var(--radius-md)",
                      animation: "shake 0.4s ease",
                    }}
                  >
                    Failed to send. Please try again or email me directly.
                  </p>
                )}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={sendMutation.isPending || phase === "flying"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 2rem",
                    background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                    border: "none",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "var(--text-base)",
                    color: "#fff",
                    cursor: "none",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                    opacity: sendMutation.isPending ? 0.7 : 1,
                    boxShadow: "var(--glow-accent)",
                    alignSelf: "flex-start",
                  }}
                >
                  {sendMutation.isPending ? (
                    <>
                      <span
                        aria-hidden="true"
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8L14 2L10 14L7.5 9.5L2 8Z" fill="currentColor" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "6rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
            }}
          >
            © {new Date().getFullYear()} — Built with Next.js, GSAP & Three.js
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            Available for opportunities
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
