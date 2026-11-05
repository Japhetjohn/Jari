"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateVisibility = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const nextVisible = window.scrollY > 440;
        setVisible((current) => current === nextVisible ? current : nextVisible);
        frame = 0;
      });
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const goToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={goToTop}
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#244b35] text-white shadow-[0_10px_28px_-14px_rgba(22,48,32,.7)] transition-[opacity,transform,background-color] duration-300 hover:bg-[#193d2b] sm:bottom-7 sm:right-7 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUp size={19} strokeWidth={1.8} />
    </button>
  );
}
