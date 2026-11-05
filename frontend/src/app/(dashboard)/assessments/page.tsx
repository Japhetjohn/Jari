"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ClipboardList, HeartPulse, Wallet } from "lucide-react";
import { getKycApplication } from "@/lib/simulated-data";
import type { KycApplication } from "@/lib/simulated-data";

const areas = [
  { title: "Your farm details", detail: "Farm name, location and the way your farm is set up.", icon: ClipboardList, href: "/farm" },
  { title: "Your birds and their care", detail: "Bird numbers, vaccinations and health records.", icon: HeartPulse, href: "/health" },
  { title: "Farm activity", detail: "Production, sales and the money spent on the farm.", icon: Wallet, href: "/production" },
];

export default function AssessmentsPage() {
  const [application, setApplication] = useState<KycApplication | null>(null);
  useEffect(() => setApplication(getKycApplication()), []);
  const verified = application?.status === "approved";

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farm risk profile</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">A clear picture of the things that can affect your farm helps JARI understand what support may fit.</p></div>
      <section className={`rounded-[1.5rem] p-5 sm:p-7 ${verified ? "bg-[#e9efe3]" : "bg-[#244b35] text-white"}`}>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="max-w-xl"><p className={`text-[10px] font-bold uppercase tracking-[.15em] ${verified ? "text-[#627a5d]" : "text-[#cbd9c3]"}`}>JARI farm review</p><h3 className={`mt-2 font-serif text-2xl font-medium sm:text-3xl ${verified ? "text-[#293a2b]" : "text-white"}`}>{verified ? "Your farm details are verified" : "Your farm has not been reviewed yet"}</h3><p className={`mt-2 text-sm leading-6 ${verified ? "text-[#687664]" : "text-white/75"}`}>{verified ? "JARI has checked your farm details. Keep your records up to date so your profile stays useful." : "There is no risk rating yet. JARI reviews your farm information and records before preparing a profile, so we will not guess at your farm's risks."}</p></div><Link href="/kyc" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold ${verified ? "bg-white text-[#294430] hover:bg-[#f7f8f3]" : "bg-[#edf2e8] text-[#294430] hover:bg-white"}`}>{verified ? "View review details" : "Request a farm review"}<ArrowRight size={14} /></Link></div>
      </section>
      <section className="rounded-[1.4rem] bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bird size={18} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">What goes into it</p><h3 className="mt-0.5 font-serif text-xl font-medium text-[#29352a]">Records that help us understand your farm</h3></div></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{areas.map(({ title, detail, icon: Icon, href }) => <Link key={title} href={href} className="group rounded-xl bg-[#f7f8f4] p-4 transition-colors hover:bg-[#eef2e9]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#55734f]"><Icon size={15} /></span><h4 className="mt-3 text-sm font-semibold text-[#354237]">{title}</h4><p className="mt-1 text-xs leading-5 text-[#788174]">{detail}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Open records <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}</div>
      </section>
      <p className="text-center text-[10px] leading-5 text-[#92998e]">JARI does not issue an automated risk score on this page. A farm review is needed before we can describe a farm's risk profile.</p>
    </div>
  );
}
