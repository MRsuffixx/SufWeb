"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "~/store/useAppStore";
import { useReducedMotion } from "~/hooks/useReducedMotion";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const cursorVariant = useAppStore((s) => s.cursorVariant);
  const cursorX = useAppStore((s) => s.cursorX);
  const cursorY = useAppStore((s) => s.cursorY);
  const setCursorPosition = useAppStore((s) => s.setCursorPosition);

  // Ring spring state
  const ringPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setCursorPosition(x, y);
      targetPos.current = { x, y };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      const stiffness = 0.15;
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * stiffness;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * stiffness;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, setCursorPosition]);

  if (reducedMotion) return null;

  const isHovering = cursorVariant === "hovering";
  const isView = cursorVariant === "view";
  const isClicking = cursorVariant === "clicking";

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: cursorVariant === "input" ? 0 : 1,
          transform: `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`,
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={[
          "cursor-ring",
          isHovering ? "hovering" : "",
          isView ? "view-mode" : "",
          isClicking ? "clicking" : "",
          cursorVariant === "input" ? "opacity-0" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {isView && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "var(--accent-1)",
              textTransform: "uppercase",
            }}
          >
            VIEW
          </span>
        )}
      </div>
    </>
  );
}
