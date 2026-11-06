"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ToastKind } from "@/lib/toast";

type ToastItem = { id: number; kind: ToastKind; message: string };

export function ToastViewport() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ kind?: ToastKind; message?: string }>).detail;
      if (!detail?.message) return;
      const toast = { id: Date.now() + Math.random(), kind: detail.kind || "info", message: detail.message } as ToastItem;
      setToasts((current) => [...current.slice(-2), toast]);
      window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 4200);
    };
    window.addEventListener("jari:toast", onToast);
    return () => window.removeEventListener("jari:toast", onToast);
  }, []);

  return <div className="pointer-events-none fixed inset-x-0 top-3 z-[120] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end" aria-label="Notifications">
    {toasts.map((toast) => {
      const Icon = toast.kind === "success" ? CheckCircle2 : toast.kind === "error" ? AlertCircle : Info;
      const styles = toast.kind === "success" ? "bg-[#244b35] text-white" : toast.kind === "error" ? "bg-[#8f3e32] text-white" : "bg-[#344b38] text-white";
      return <div key={toast.id} role={toast.kind === "error" ? "alert" : "status"} aria-live={toast.kind === "error" ? "assertive" : "polite"} className={`toast-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3.5 shadow-[0_16px_45px_-18px_rgba(19,35,23,.5)] sm:w-[min(390px,calc(100vw-40px))] ${styles}`}>
        <Icon size={18} className="mt-0.5 shrink-0 opacity-90" />
        <p className="min-w-0 flex-1 text-sm leading-5">{toast.message}</p>
        <button type="button" aria-label="Dismiss notification" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"><X size={15} /></button>
      </div>;
    })}
  </div>;
}
