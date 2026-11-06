"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, CalendarDays, MapPin, Pencil, Sprout, Users, Warehouse } from "lucide-react";
import { defaultFarmProfile, getFarmProfile, getPoultryHouses } from "@/services";

function ProfileValue({ label, value }: { label: string; value?: string | number }) {
  return <div className="min-w-0 py-2"><dt className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#869082]">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-[#354237]">{value || "Not added yet"}</dd></div>;
}

export default function FarmPage() {
  const [farm, setFarm] = useState(defaultFarmProfile);
  const [houseCount, setHouseCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setFarm(getFarmProfile());
      setHouseCount(getPoultryHouses().length);
    };
    sync();
    window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, []);

  const location = [farm.community, farm.lga, farm.state].filter(Boolean).join(", ");

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm information</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-[-.025em] text-[#20291f] sm:text-3xl">Your farm profile</h2><p className="mt-1 text-xs leading-5 text-[#788174] sm:text-sm">Review the details JARI has for your poultry farm.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/assessments" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e9efe3] px-4 py-2.5 text-xs font-semibold text-[#35543b] transition-colors hover:bg-[#dfe8d9]"><Activity size={14} /> View farm risk profile</Link><Link href="/farm/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#193d2b]"><Pencil size={14} /> Edit farm details</Link></div>
      </div>

      <section className="relative overflow-hidden rounded-[1.5rem] bg-[#e8eee1] p-5 sm:p-7">
        <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/45" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#53724c]"><Sprout size={18} /></span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#6b7d63]">Poultry farm</p>
            <h3 className="mt-1 break-words font-serif text-2xl font-medium tracking-[-.025em] text-[#28382b] sm:text-4xl">{farm.farmName || "Name your farm"}</h3>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#687664] sm:text-sm"><MapPin size={14} />{location || "Farm location not added yet"}</p>
          </div>
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/75 px-3 py-2 text-[10px] font-semibold text-[#4e6249]">{farm.operationType || "Operation type not set"}</span><span className="rounded-full bg-white/75 px-3 py-2 text-[10px] font-semibold text-[#4e6249]">{farm.productionSystem || "Production system not set"}</span></div>
        </div>
      </section>

      <section aria-label="Farm summary" className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {[{ label: "Farm houses", value: houseCount, unit: "registered", icon: Warehouse }, { label: "Farm workers", value: farm.numberOfWorkers || "0", unit: "listed on profile", icon: Users }, { label: "Established", value: farm.establishmentDate ? new Date(farm.establishmentDate).getFullYear() : "Not set", unit: "year", icon: CalendarDays }].map(({ label, value, unit, icon: Icon }) => <article key={label} className="rounded-[1.2rem] bg-white p-4 sm:rounded-[1.35rem] sm:p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Icon size={15} /></span><p className="mt-4 text-[10px] font-semibold text-[#788174] sm:text-xs">{label}</p><p className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{value}</p><p className="mt-0.5 text-[9px] text-[#899184]">{unit}</p></article>)}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-[1.35rem] bg-white p-4 sm:p-6">
          <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Farm identity</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">Owner and location</h3></div>
          <dl className="mt-4 grid gap-x-6 divide-y divide-[#eef0eb] sm:grid-cols-2 sm:divide-y-0">
            <ProfileValue label="Farm owner" value={farm.ownerName} />
            <ProfileValue label="Phone number" value={farm.phone} />
            <ProfileValue label="Community" value={farm.community} />
            <ProfileValue label="Local government" value={farm.lga} />
            <ProfileValue label="State" value={farm.state} />
            <ProfileValue label="Establishment date" value={farm.establishmentDate || undefined} />
          </dl>
        </article>

        <article className="rounded-[1.35rem] bg-white p-4 sm:p-6">
          <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Farm management</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">Housing and biosecurity</h3></div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 divide-y divide-[#eef0eb]">
            <ProfileValue label="Production system" value={farm.productionSystem} />
            <ProfileValue label="Water source" value={farm.waterSource} />
          </dl>
          <div className="mt-4"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#869082]">Biosecurity measures</p><div className="mt-2 flex flex-wrap gap-2">{farm.biosecurity?.length ? farm.biosecurity.map((measure) => <span key={measure} className="rounded-full bg-[#edf2e8] px-3 py-1.5 text-[10px] font-medium text-[#4e6849]">{measure}</span>) : <p className="text-xs text-[#788174]">Add the biosecurity measures used on your farm.</p>}</div></div>
        </article>
      </section>

      <div className="flex flex-col gap-3 rounded-[1.2rem] bg-[#f0f2ec] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p className="text-xs leading-5 text-[#697268]">Keep your farm information current to build a more complete profile over time.</p><Link href="/poultry-houses" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#496b50] hover:text-[#244a35]">View poultry houses <ArrowRight size={13} /></Link></div>
    </div>
  );
}
