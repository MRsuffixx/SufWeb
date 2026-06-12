import { create } from "zustand";
import type Lenis from "lenis";

export type CursorVariant = "default" | "hovering" | "view" | "clicking" | "input";

interface AppState {
  // Cursor state
  cursorVariant: CursorVariant;
  cursorX: number;
  cursorY: number;
  setCursorVariant: (variant: CursorVariant) => void;
  setCursorPosition: (x: number, y: number) => void;

  // Lenis scroll instance
  lenis: Lenis | null;
  setLenis: (lenis: Lenis | null) => void;

  // Scroll progress 0-1
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  cursorVariant: "default",
  cursorX: 0,
  cursorY: 0,
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setCursorPosition: (x, y) => set({ cursorX: x, cursorY: y }),

  lenis: null,
  setLenis: (lenis) => set({ lenis }),

  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}));
