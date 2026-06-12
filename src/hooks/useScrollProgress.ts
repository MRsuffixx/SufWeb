"use client";

import { useAppStore } from "~/store/useAppStore";

export function useScrollProgress(): number {
  return useAppStore((s) => s.scrollProgress);
}
