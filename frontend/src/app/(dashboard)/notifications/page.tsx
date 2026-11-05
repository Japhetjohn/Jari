"use client";

import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { farmNotifications } from "@/lib/notifications";

export default function NotificationsPage() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm updates</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Notifications</h2><p className="mt-2 text-sm text-[#737d70]">Select an update to read the full details.</p></div>
      <section className="space-y-2" aria-label="All notifications">
        {farmNotifications.map((notification) => {
          const isOpen = opened === notification.id;
          return <article key={notification.id} className="rounded-[1.2rem] bg-white p-1">
            <button type="button" aria-expanded={isOpen} onClick={() => setOpened((current) => current === notification.id ? null : notification.id)} className="flex min-h-16 w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#f5f7f2] sm:p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bell size={15} /></span>
              <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><span className="text-sm font-semibold text-[#354237]">{notification.title}</span><span className="text-[10px] text-[#899184]">{notification.time}</span></span><span className="mt-1 block text-xs text-[#788174]">{notification.detail}</span></span>
              <ChevronDown size={16} className={`shrink-0 text-[#788174] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="ml-12 border-t border-[#edf0e9] px-3 py-3 text-sm leading-6 text-[#59645a] sm:ml-16">{notification.fullText}</p>}
          </article>;
        })}
      </section>
    </div>
  );
}
