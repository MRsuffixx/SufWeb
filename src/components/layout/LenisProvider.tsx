"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "~/lib/gsap-init";
import { initGsap } from "~/lib/gsap-init";
import { useAppStore } from "~/store/useAppStore";

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const setLenis = useAppStore((s) => s.setLenis);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    initGsap();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenis(lenis);

    // Sync Lenis RAF with GSAP ticker for ScrollTrigger compatibility
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    // Track scroll progress
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    return () => {
      gsap.ticker.remove((time: number) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis, setScrollProgress]);

  return <>{children}</>;
}
