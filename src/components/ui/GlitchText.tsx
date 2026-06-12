"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
  speed?: number;
  iterations?: number;
}

export function GlitchText({
  text,
  className = "",
  trigger = true,
  speed = 40,
  iterations = 4,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!trigger || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    let iteration = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < Math.floor(iteration / iterations)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)] ?? char;
          })
          .join(""),
      );

      iteration++;
      if (iteration >= text.length * iterations) {
        clearInterval(intervalRef.current!);
        setDisplayText(text);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, text, speed, iterations]);

  return (
    <span className={className} aria-label={text}>
      {displayText}
    </span>
  );
}
