"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [revealState, setRevealState] = useState({ ready: false, visible: false });

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    // Enable the visual state only after hydration so content remains visible without JavaScript.
    setRevealState({ ready: true, visible: false });

    const observer = new IntersectionObserver(
      ([entry]) => setRevealState({ ready: true, visible: entry.isIntersecting }),
      { threshold: 0.01, rootMargin: "8% 0px 12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
      data-reveal-ready={revealState.ready}
      data-revealed={revealState.visible}
      style={{ "--reveal-delay": revealState.ready && revealState.visible ? `${delay}ms` : "0ms" } as CSSProperties}
    >
      {children}
    </div>
  );
}
