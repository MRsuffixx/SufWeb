"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MagneticButton } from "~/components/ui/MagneticButton";
import { useAppStore } from "~/store/useAppStore";
import { useReducedMotion } from "~/hooks/useReducedMotion";

const NAV_LINKS = [
  { label: "Work", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function ScrambleLink({ label, href }: { label: string; href: string }) {
  const [display, setDisplay] = useState(label);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const lenis = useAppStore((s) => s.lenis);

  const scramble = useCallback(() => {
    let iter = 0;
    const total = label.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplay(() =>
        label
          .split("")
          .map((char, i) => {
            if (i < Math.floor(iter / 3)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)] ?? char;
          })
          .join(""),
      );
      iter++;
      if (iter >= total) {
        clearInterval(intervalRef.current!);
        setDisplay(label);
      }
    }, 30);
  }, [label]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target && lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.5 });
      }
    },
    [href, lenis],
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <a
      href={href}
      onClick={handleClick}
      className="nav-link"
      onMouseEnter={() => {
        scramble();
        setCursorVariant("hovering");
      }}
      onMouseLeave={() => {
        setDisplay(label);
        setCursorVariant("default");
      }}
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "var(--text-sm)",
        letterSpacing: "0.05em",
        color: "var(--text-secondary)",
        textDecoration: "none",
        textTransform: "uppercase",
        cursor: "none",
        transition: "color 0.2s ease",
      }}
    >
      {display}
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const mobileMenuOpen = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), reducedMotion ? 0 : 600);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.4s ease",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          background: scrolled
            ? "rgba(8, 8, 8, 0.85)"
            : "transparent",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          aria-label="Home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            cursor: "none",
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={() => setCursorVariant("hovering")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="var(--accent-1)" opacity="0.15" />
            <path
              d="M8 16L16 8L24 16L16 24L8 16Z"
              stroke="var(--accent-1)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray="64"
              strokeDashoffset={logoVisible ? 0 : 64}
              style={{
                transition: reducedMotion
                  ? "none"
                  : "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            />
            <circle
              cx="16"
              cy="16"
              r="3"
              fill="var(--accent-1)"
              opacity={logoVisible ? 1 : 0}
              style={{
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.3s ease 1s",
              }}
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-lg)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            dev.
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div
          role="menubar"
          aria-label="Navigation links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <ScrambleLink key={link.href} label={link.label} href={link.href} />
          ))}
        </div>

        {/* Hire Me CTA */}
        <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <MagneticButton
            href="#contact"
            id="navbar-hire-me"
            aria-label="Hire me — go to contact section"
            className="hire-me-btn"
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.5rem",
                background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                color: "#fff",
                letterSpacing: "0.02em",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
              }}
            >
              Hire Me
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </MagneticButton>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            zIndex: 1010,
          }}
          className="show-mobile"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "24px",
                height: "1.5px",
                background: "var(--text-primary)",
                borderRadius: "2px",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                transform:
                  mobileMenuOpen
                    ? i === 0
                      ? "translateY(6.5px) rotate(45deg)"
                      : i === 1
                        ? "scaleX(0)"
                        : "translateY(-6.5px) rotate(-45deg)"
                    : "none",
                opacity: mobileMenuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(8, 8, 8, 0.98)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
          clipPath: mobileMenuOpen
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 0, 0 0)",
          transition: "clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: mobileMenuOpen ? "all" : "none",
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 8vw, 4rem)",
              color: "var(--text-primary)",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.4s ease ${0.1 + i * 0.08}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            marginTop: "1rem",
            padding: "0.8rem 2rem",
            background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            borderRadius: "var(--radius-full)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "var(--text-base)",
            color: "#fff",
            textDecoration: "none",
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 0.4s ease 0.42s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.42s`,
          }}
        >
          Hire Me
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
