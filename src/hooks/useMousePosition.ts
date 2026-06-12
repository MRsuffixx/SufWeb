"use client";

import { useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1 relative to viewport center
  normalizedY: number; // -1 to 1 relative to viewport center
}

export function useMousePosition(): React.MutableRefObject<MousePosition> {
  const positionRef = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = {
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return positionRef;
}
