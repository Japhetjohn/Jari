"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Check, Sprout, X } from "lucide-react";

const tourStorageKey = "jari-farmer-dashboard-tour-v1";
const tourSteps = [
  { title: "Welcome to your farm space", body: "Keep your poultry farm details and day-to-day records together here." },
  { title: "Start with your farm", body: "Add or update your farm information so JARI has the right details." },
  { title: "Find things in the menu", body: "Use the menu to record birds, care, sales and expenses, or ask JARI to review your farm." },
];

export function DashboardTour({ enabled, userId }: { enabled: boolean; userId: string }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const storageKey = `${tourStorageKey}:${userId}`;

  const finish = useCallback(() => {
    window.localStorage.setItem(`${tourStorageKey}:${userId}`, "done");
    setOpen(false);
  }, [userId]);

  useEffect(() => {
    if (!enabled || window.localStorage.getItem(storageKey)) return;
    setOpen(true);
  }, [enabled, storageKey]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [finish, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#152219]/55 p-3 backdrop-blur-[3px] sm:items-center sm:p-6" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="dashboard-tour-title" className="w-full max-w-lg rounded-[1.6rem] bg-[#fbfcf8] p-5 shadow-[0_24px_100px_-30px_rgba(0,0,0,.5)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9efe3] text-[#496b50]"><Sprout size={20} /></span>
          <button type="button" onClick={finish} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2ec] text-[#687466]" aria-label="Skip tour"><X size={17} /></button>
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.16em] text-[#6b8066]">A quick guide - {step + 1} of {tourSteps.length}</p>
        <h2 id="dashboard-tour-title" className="mt-2 font-serif text-2xl font-medium tracking-tight text-[#263329] sm:text-3xl">{tourSteps[step].title}</h2>
        <p className="mt-3 max-w-prose text-sm leading-6 text-[#697568]">{tourSteps[step].body}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" onClick={finish} className="min-h-11 px-3 text-xs font-semibold text-[#768071] hover:text-[#304732]">Skip tour</button>
          <button type="button" onClick={() => step === tourSteps.length - 1 ? finish() : setStep((current) => current + 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#193d2b]">
            {step === tourSteps.length - 1 ? "Done" : "Next"}{step === tourSteps.length - 1 ? <Check size={15} /> : <ArrowRight size={15} />}
          </button>
        </div>
      </section>
    </div>
  );
}
