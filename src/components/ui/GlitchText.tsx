"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean; // if true, plays on mount; pass controlled bool to replay
  speed?: number; // ms per character iteration
  iterations?: number; // how many scramble iterations per character
  tag?: keyof JSX.IntrinsicElements;
}

export function GlitchText({
  text,
  className = "",
  trigger = true,
  speed = 40,
  iterations = 4,
  tag: Tag = "span",
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
    <Tag className={className} aria-label={text}>
      {displayText}
    </Tag>
  );
}
