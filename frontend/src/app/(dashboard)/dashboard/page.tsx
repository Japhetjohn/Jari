"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ClipboardCheck, MapPin, Sprout, Wallet } from "lucide-react";
import { defaultFarmProfile, getFarmProfile, getKycApplication } from "@/lib/simulated-data";
import type { KycApplication } from "@/lib/simulated-data";

const startCards = [
  { title: "Add your birds", detail: "Keep track of the birds you are raising.", href: "/birds", icon: Bird },
  { title: "Record farm spending", detail: "Write down feed, medicine and other costs.", href: "/expenses", icon: Wallet },
  { title: "Get a farm review", detail: "Ask JARI to review your farm details.", href: "/kyc", icon: ClipboardCheck },
];

export default function DashboardPage() {
  const [farm, setFarm] = useState(defaultFarmProfile);
  const [application, setApplication] = useState<KycApplication | null>(null);
  useEffect(() => {
    setFarm(getFarmProfile());
    setApplication(getKycApplication());
  }, []);
  const farmLocation = [farm.community, farm.lga, farm.state].filter(Boolean).join(", ");

  return (
    <div className="space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Welcome to your farm space</h2><p className="mt-2 text-sm text-[#737d70]">Keep your farm details and records in one place.</p></div>

      <section aria-label="Farm summary" className="overflow-hidden rounded-[1.5rem] bg-[#244b35] p-5 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div className="min-w-0"><p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#cbd9c3]"><MapPin size={12} /> Your farm</p><h3 className="mt-2 break-words font-serif text-2xl font-medium tracking-tight sm:text-3xl">{farm.farmName || "Add your farm details"}</h3><p className="mt-1.5 text-xs text-white/75 sm:text-sm">{farmLocation || "Add your farm location to complete this profile."}</p></div><Link href="/farm" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#edf2e8] px-4 py-2 text-xs font-bold text-[#294430] transition-colors hover:bg-white sm:self-auto">View farm details <ArrowRight size={14} /></Link></div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Get started">
        {startCards.map(({ title, detail, href, icon: Icon }) => <Link key={title} href={href} className="group rounded-[1.3rem] bg-white p-4 transition-colors hover:bg-[#f0f3ed] sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Icon size={17} /></span><h3 className="mt-4 text-sm font-semibold text-[#354237]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#788174]">{detail}</p><span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Open <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}
      </section>

      <section className="flex flex-col gap-4 rounded-[1.35rem] bg-[#e9efe3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#55734f]"><Sprout size={17} /></span><div><p className="text-sm font-semibold text-[#344a36]">{application?.status === "approved" ? "Your farm review is complete" : application?.status === "pending" ? "Your farm review request is with JARI" : application?.status === "needs_changes" ? "JARI needs a little more information" : "Your farm risk profile starts with a review"}</p><p className="mt-1 text-xs leading-5 text-[#687664]">{application?.status === "approved" ? "View your farm profile and keep your details up to date." : application?.status === "pending" ? "We’ll update your review status here." : application?.status === "needs_changes" ? (application.reviewNote || "Review your farm details and send the request again.") : "Send your farm details so the JARI team can arrange a review."}</p></div></div><Link href={application?.status === "approved" ? "/assessments" : "/kyc"} className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-xs font-semibold text-[#496b50] hover:text-[#244b35] sm:self-auto">{application?.status === "approved" ? "View risk profile" : application?.status === "pending" ? "View request" : "Start farm review"}<ArrowRight size={14} /></Link></section>
    </div>
  );
}
