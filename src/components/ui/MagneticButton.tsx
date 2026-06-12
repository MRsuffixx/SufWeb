"use client";

import { useRef, useCallback } from "react";
import { useAppStore } from "~/store/useAppStore";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  onClick,
  href,
  id,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const animFrame = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      cancelAnimationFrame(animFrame.current);
      animFrame.current = requestAnimationFrame(() => {
        if (el) {
          el.style.transform = `translate(${distX * strength}px, ${distY * strength}px)`;
        }
      });
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    cancelAnimationFrame(animFrame.current);
    el.style.transition =
      "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "translate(0, 0)";

    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 500);

    setCursorVariant("default");
  }, [setCursorVariant]);

  const handleMouseEnter = useCallback(() => {
    setCursorVariant("hovering");
  }, [setCursorVariant]);

  const commonProps = {
    ref: ref as React.RefObject<HTMLAnchorElement & HTMLButtonElement>,
    id,
    className: `magnetic-btn ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a {...commonProps} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
