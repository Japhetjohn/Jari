"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

const tourStorageKey = "jari-farmer-dashboard-tour-v2";
const steps = [
  { targets: ["[data-tour='farm-profile']"], title: "Your farm details", body: "Open this shortcut any time you want to check your farm information." },
  { targets: ["[data-tour='workspace-menu']", "[data-tour='workspace-navigation']"], title: "Find your way around", body: "Open the menu to find your birds, farm houses, spending, and notifications." },
  { targets: ["[data-tour='dashboard-first-action']", "[data-tour='workspace-content'] a", "[data-tour='workspace-content']"], title: "Open a card for more", body: "Select this card or button to open its page and see more details." },
];

type Spotlight = { top: number; left: number; width: number; height: number; cardTop: number; cardLeft: number };

export function DashboardTour({ enabled, userId }: { enabled: boolean; userId: string }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const storageKey = `${tourStorageKey}:${userId}`;

  const finish = useCallback(() => {
    window.localStorage.setItem(storageKey, "done");
    setOpen(false);
  }, [storageKey]);

  useEffect(() => {
    if (!enabled || window.localStorage.getItem(storageKey)) return;
    setOpen(true);
  }, [enabled, storageKey]);

  useEffect(() => {
    if (!open) return;
    const locate = () => {
      const target = steps[step].targets.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector))).find((element) => element.getClientRects().length > 0);
      if (!target) {
        setSpotlight(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      const width = Math.min(400, window.innerWidth - 24);
      const height = 220;
      const left = Math.max(8, rect.left - 7);
      const top = Math.max(8, rect.top - 7);
      const cardLeft = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2));
      const below = rect.bottom + height + 24 < window.innerHeight;
      const cardTop = below ? rect.bottom + 16 : Math.max(12, rect.top - height - 16);
      setSpotlight({ top, left, width: rect.width + 14, height: rect.height + 14, cardTop, cardLeft });
    };
    locate();
    window.addEventListener("resize", locate);
    window.addEventListener("scroll", locate, true);
    return () => {
      window.removeEventListener("resize", locate);
      window.removeEventListener("scroll", locate, true);
    };
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [finish, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      {spotlight ? <><div aria-hidden="true" className="absolute inset-0 z-[1]" /><div aria-hidden="true" className="pointer-events-none fixed z-[2] rounded-2xl border-2 border-[#badb9f] shadow-[0_0_0_9999px_rgba(18,31,22,.68)] transition-all duration-300" style={{ top: spotlight.top, left: spotlight.left, width: spotlight.width, height: spotlight.height }} /></> : <div className="absolute inset-0 bg-[#152219]/65" />}
      <section role="dialog" aria-modal="true" aria-labelledby="dashboard-tour-title" className="fixed z-[3] w-[min(400px,calc(100vw-24px))] rounded-[1.4rem] bg-[#fbfcf8] p-5 shadow-[0_24px_80px_-30px_rgba(0,0,0,.55)] sm:p-6" style={spotlight ? { top: spotlight.cardTop, left: spotlight.cardLeft } : { top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <div className="flex items-start justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#6b8066]">Quick tour - {step + 1} of {steps.length}</p><button type="button" onClick={finish} aria-label="Skip tour" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f2ec] text-[#687466]"><X size={16} /></button></div>
        <h2 id="dashboard-tour-title" className="mt-3 font-serif text-xl font-medium text-[#263329]">{steps[step].title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#697568]">{steps[step].body}</p>
        <div className="mt-5 flex items-center justify-between gap-3"><button type="button" onClick={finish} className="min-h-10 px-2 text-xs font-semibold text-[#768071] hover:text-[#304732]">Skip tour</button><button type="button" onClick={() => step === steps.length - 1 ? finish() : setStep((current) => current + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white hover:bg-[#193d2b]">{step === steps.length - 1 ? "Finish" : "Next"}{step === steps.length - 1 ? <Check size={14} /> : <ArrowRight size={14} />}</button></div>
      </section>
    </div>
  );
}
