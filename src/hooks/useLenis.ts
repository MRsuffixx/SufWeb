"use client";

import { useAppStore } from "~/store/useAppStore";
import type Lenis from "lenis";

export function useLenis(): Lenis | null {
  return useAppStore((s) => s.lenis);
}
