import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let initialized = false;

export function initGsap(): void {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Smooth scrub globally
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
  });

  // Prevent lag smoothing conflicts with Lenis
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, SplitText };
