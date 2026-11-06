"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ClipboardCheck, MapPin, Sprout, Wallet, Warehouse, Wheat } from "lucide-react";
import { defaultFarmProfile, getActivityRecords, getDashboardTotals, getFarmProfile, getKycApplication } from "@/services";
import type { KycApplication } from "@/services";
import type { ActivityRecord } from "@/services";

const startCards = [
  { title: "Add your birds", detail: "Keep track of the birds you are raising.", href: "/birds", icon: Bird },
  { title: "Record farm spending", detail: "Write down feed, medicine and other costs.", href: "/expenses", icon: Wallet },
  { title: "Get a farm review", detail: "Ask JARI to review your farm details.", href: "/kyc", icon: ClipboardCheck },
];

export default function DashboardPage() {
  const [farm, setFarm] = useState(defaultFarmProfile);
  const [application, setApplication] = useState<KycApplication | null>(null);
  const [totals, setTotals] = useState(getDashboardTotals());
  const [activity, setActivity] = useState<ActivityRecord[]>([]);
  useEffect(() => {
    const sync = () => {
      setFarm(getFarmProfile());
      setApplication(getKycApplication());
      setTotals(getDashboardTotals());
      setActivity(getActivityRecords());
    };
    sync();
    window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, []);
  const farmLocation = [farm.community, farm.lga, farm.state].filter(Boolean).join(", ");
  const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
  const farmStats = [
    { label: "Birds being raised", value: totals.birds.toLocaleString(), icon: Bird },
    { label: "Farm houses", value: String(totals.houses), icon: Warehouse },
    { label: "Feed on hand", value: `${Math.round(totals.stockKg).toLocaleString()} kg`, icon: Wheat },
    { label: "Recorded sales", value: money(totals.salesTotal), icon: Wallet },
  ];

  return (
    <div className="space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Welcome to your farm space</h2><p className="mt-2 text-sm text-[#737d70]">Keep your farm details and records in one place.</p></div>

      <section aria-label="Farm summary" className="overflow-hidden rounded-[1.5rem] bg-[#244b35] p-5 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div className="min-w-0"><p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#cbd9c3]"><MapPin size={12} /> Your farm</p><h3 className="mt-2 break-words font-serif text-2xl font-medium tracking-tight sm:text-3xl">{farm.farmName || "Add your farm details"}</h3><p className="mt-1.5 text-xs text-white/75 sm:text-sm">{farmLocation || "Add your farm location to complete this profile."}</p></div><Link href="/farm" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#edf2e8] px-4 py-2 text-xs font-bold text-[#294430] transition-colors hover:bg-white sm:self-auto">View farm details <ArrowRight size={14} /></Link></div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Farm figures">
        {farmStats.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-[1.2rem] bg-white p-4 sm:p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Icon size={15} /></span><p className="mt-3 text-[10px] font-medium text-[#788174] sm:text-xs">{label}</p><p className="mt-1 break-words font-serif text-xl font-medium text-[#29352a] sm:text-2xl">{value}</p></article>)}
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Get started">
        {startCards.map(({ title, detail, href, icon: Icon }) => <Link key={title} href={href} data-tour={href === "/kyc" ? "dashboard-first-action" : undefined} className="group rounded-[1.3rem] bg-white p-4 transition-colors hover:bg-[#f0f3ed] sm:p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Icon size={17} /></span><h3 className="mt-4 text-sm font-semibold text-[#354237]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#788174]">{detail}</p><span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Open <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></Link>)}
      </section>

      <section className="flex flex-col gap-4 rounded-[1.35rem] bg-[#e9efe3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#55734f]"><Sprout size={17} /></span><div><p className="text-sm font-semibold text-[#344a36]">{application?.status === "approved" ? "Farm details marked verified in demo" : application?.status === "pending" ? "Farm review waiting in this browser" : application?.status === "needs_changes" ? "Admin demo requested more details" : "Your farm risk profile starts with a review"}</p><p className="mt-1 text-xs leading-5 text-[#687664]">{application?.status === "approved" ? "View your farm profile and keep your details up to date." : application?.status === "pending" ? "The admin demo can update the request status here." : application?.status === "needs_changes" ? (application.reviewNote || "Review your farm details and save the request again.") : "Save your farm details for review in this browser demo."}</p></div></div><Link href={application?.status === "approved" ? "/assessments" : "/kyc"} className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-xs font-semibold text-[#496b50] hover:text-[#244b35] sm:self-auto">{application?.status === "approved" ? "View risk profile" : application?.status === "pending" ? "View request" : "Start farm review"}<ArrowRight size={14} /></Link></section>

      <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Recent changes</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">Farm activity</h3></div><div className="mt-3 space-y-2">{activity.length ? activity.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f8f4] p-3"><p className="text-xs font-medium text-[#59645a]">{item.text}</p><time className="shrink-0 text-[10px] text-[#899184]">{new Date(item.createdAt).toLocaleDateString()}</time></div>) : <p className="rounded-xl bg-[#f7f8f4] p-4 text-xs text-[#788174]">Changes you make to farm records will show here.</p>}</div></section>
    </div>
  );
}
