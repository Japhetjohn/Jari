"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ClipboardList, HeartPulse, Wallet, Warehouse, Wheat } from "lucide-react";
import { getDemoDatabaseSnapshot, getKycApplication } from "@/services";
import type { KycApplication } from "@/services";

export default function AssessmentsPage() {
  const [application, setApplication] = useState<KycApplication | null>(null);
  const [snapshot, setSnapshot] = useState<ReturnType<typeof getDemoDatabaseSnapshot> | null>(null);
  useEffect(() => {
    const sync = () => { setApplication(getKycApplication()); setSnapshot(getDemoDatabaseSnapshot()); };
    sync(); window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, []);
  if (!snapshot) return null;
  const verified = application?.status === "approved";
  const farm = snapshot.farmProfile;
  const recordAreas = [
    { title: "Farm setup", detail: "Farm name, location and housing", icon: ClipboardList, count: farm.farmName && farm.community ? 1 : 0, href: "/farm" },
    { title: "Birds and care", detail: "Bird groups, vaccinations and health", icon: HeartPulse, count: snapshot.flocks.length + snapshot.vaccinations.length + snapshot.healthIncidents.length + snapshot.treatments.length, href: "/health" },
    { title: "Farm activity", detail: "Feed use and production", icon: Wheat, count: snapshot.feedPurchases.length + snapshot.feedUse.length + snapshot.production.length, href: "/production" },
    { title: "Money records", detail: "Sales and farm spending", icon: Wallet, count: snapshot.sales.length + snapshot.expenses.length, href: "/sales" },
  ];
  const areasWithRecords = recordAreas.filter((area) => area.count > 0).length;

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farm risk profile</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">A clear picture of the things that can affect your farm helps JARI understand what support may fit.</p><p className="mt-2 text-xs font-medium text-[#596b57]">{farm.farmName || "Farm name not added"} · {[farm.community, farm.lga, farm.state].filter(Boolean).join(", ") || "Farm location not added"}</p></div>
      <section className={`rounded-[1.5rem] p-5 sm:p-7 ${verified ? "bg-[#e9efe3]" : "bg-[#244b35] text-white"}`}>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="max-w-xl"><p className={`text-[10px] font-bold uppercase tracking-[.15em] ${verified ? "text-[#627a5d]" : "text-[#cbd9c3]"}`}>Your farm risk profile</p><h3 className={`mt-2 font-serif text-2xl font-medium sm:text-3xl ${verified ? "text-[#293a2b]" : "text-white"}`}>{verified ? "Your farm review is complete" : application?.status === "pending" ? "Your farm is waiting for review" : application?.status === "needs_changes" ? "Your farm needs a few updates" : "Build a clear picture of your farm"}</h3><p className={`mt-2 text-sm leading-6 ${verified ? "text-[#687664]" : "text-white/75"}`}>{verified ? "See the records that make up your profile and keep them up to date." : "Your profile grows as you keep farm records. JARI does not guess at your farm's risk or make an automatic finance decision."}</p></div><Link href="/kyc" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold ${verified ? "bg-white text-[#294430] hover:bg-[#f7f8f3]" : "bg-[#edf2e8] text-[#294430] hover:bg-white"}`}>{verified ? "View review details" : "Request a farm review"}<ArrowRight size={14} /></Link></div>
      </section>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><ProfileMetric label="Birds in active groups" value={snapshot.flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0).toLocaleString()} icon={Bird} /><ProfileMetric label="Farm houses" value={String(snapshot.poultryHouses.filter((house) => !house.archived).length)} icon={Warehouse} /><ProfileMetric label="Record areas started" value={`${areasWithRecords} of ${recordAreas.length}`} icon={ClipboardList} /><ProfileMetric label="Review status" value={application?.status === "approved" ? "Reviewed" : application?.status === "pending" ? "Waiting" : application?.status === "needs_changes" ? "Update needed" : "Not reviewed"} icon={HeartPulse} /></section>
      <section className="rounded-[1.4rem] bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bird size={18} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Your information</p><h3 className="mt-0.5 font-serif text-xl font-medium text-[#29352a]">Farm profile details</h3></div></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">{recordAreas.map(({ title, detail, icon: Icon, count, href }) => <Link key={title} href={href} className="group rounded-xl bg-[#f7f8f4] p-4 transition-colors hover:bg-[#eef2e9]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#55734f]"><Icon size={15} /></span><div className="mt-3 flex items-center justify-between gap-2"><h4 className="text-sm font-semibold text-[#354237]">{title}</h4><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#547253]">{count ? `${count} records` : "Not started"}</span></div><p className="mt-1 text-xs leading-5 text-[#788174]">{detail}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Open records <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}</div>
      </section>
      <p className="text-center text-[10px] leading-5 text-[#92998e]">This profile reflects records saved by you. It is not an automated risk score, credit decision or insurance approval.</p>
    </div>
  );
}

function ProfileMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Bird }) {
  return <article className="rounded-[1.15rem] bg-white p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Icon size={15} /></span><p className="mt-3 text-[10px] font-medium text-[#788174]">{label}</p><p className="mt-1 break-words font-serif text-lg font-medium text-[#29352a] sm:text-xl">{value}</p></article>;
}
