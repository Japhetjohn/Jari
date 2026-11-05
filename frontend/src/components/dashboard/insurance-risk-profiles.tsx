"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowLeft, Bird, CalendarDays, Check, ClipboardList, MapPin, Search, ShieldCheck, Stethoscope, Wheat } from "lucide-react";

type SignalStatus = "On record" | "Follow up" | "Not recorded";
type ProfileSignal = { area: string; status: SignalStatus; detail: string };
type InsuranceDemoProfile = {
  id: string; farmer: string; farm: string; location: string; lga: string; state: string; production: string; birds: number; houses: number;
  cycle: string; updated: string; feedRecords: number; healthRecords: number; vaccinationRecords: number; productionRecords: number;
  financialRecords: number; assets: string[]; signals: ProfileSignal[];
};

// Fictional, consented sample records for demonstrating the institution UI.
// They are not connected to real farmers and carry no underwriting decision.
const profiles: InsuranceDemoProfile[] = [
  {
    id: "demo-kuru-01", farmer: "Demo Farmer 01", farm: "Kuru Layers Demo Farm", location: "Kuru, Jos South", lga: "Jos South", state: "Plateau", production: "Layers", birds: 3200, houses: 4,
    cycle: "Active layer cycle", updated: "4 November 2026", feedRecords: 8, healthRecords: 3, vaccinationRecords: 6, productionRecords: 12, financialRecords: 9,
    assets: ["Generator", "Water tank", "Egg trays", "Feed store"], signals: [
      { area: "Vaccination history", status: "On record", detail: "6 vaccination entries saved for active groups." },
      { area: "Bird health", status: "Follow up", detail: "3 health entries are recorded; review the latest incident notes with the farmer." },
      { area: "Flock movements", status: "On record", detail: "Opening counts and bird movements are available." },
      { area: "Farm operations", status: "On record", detail: "Feed and production records are available for the current cycle." },
      { area: "Financial records", status: "On record", detail: "Sales and expenses have been recorded in the demo profile." },
    ],
  },
  {
    id: "demo-barkin-02", farmer: "Demo Farmer 02", farm: "Barkin Ridge Poultry Demo", location: "Heipang, Barkin Ladi", lga: "Barkin Ladi", state: "Plateau", production: "Broilers", birds: 1850, houses: 3,
    cycle: "Broiler cycle · week 5", updated: "2 November 2026", feedRecords: 5, healthRecords: 2, vaccinationRecords: 4, productionRecords: 5, financialRecords: 4,
    assets: ["Brooder", "Water tank", "Feed store"], signals: [
      { area: "Vaccination history", status: "On record", detail: "4 vaccination entries saved for the current cycle." },
      { area: "Bird health", status: "Follow up", detail: "2 health entries are available for review." },
      { area: "Flock movements", status: "On record", detail: "Flock opening count and subsequent movement entries are saved." },
      { area: "Farm operations", status: "Follow up", detail: "Feed and production records are present, with gaps between some dates." },
      { area: "Financial records", status: "On record", detail: "Sales and expense entries are available." },
    ],
  },
  {
    id: "demo-riyom-03", farmer: "Demo Farmer 03", farm: "Riyom Sunrise Demo Poultry", location: "Riyom, Riyom", lga: "Riyom", state: "Plateau", production: "Layers", birds: 2460, houses: 4,
    cycle: "Active layer cycle", updated: "30 October 2026", feedRecords: 6, healthRecords: 0, vaccinationRecords: 3, productionRecords: 8, financialRecords: 2,
    assets: ["Borehole", "Water tank", "Battery cages"], signals: [
      { area: "Vaccination history", status: "Follow up", detail: "3 vaccination entries are saved. Confirm whether the record is complete with the farmer." },
      { area: "Bird health", status: "Not recorded", detail: "No health or mortality entries are saved in this sample profile." },
      { area: "Flock movements", status: "On record", detail: "The active flock and opening count are recorded." },
      { area: "Farm operations", status: "Follow up", detail: "Feed and egg production records are present but not continuous." },
      { area: "Financial records", status: "Follow up", detail: "Some sales and expense entries are saved; this is not a complete financial statement." },
    ],
  },
  {
    id: "demo-josnorth-04", farmer: "Demo Farmer 04", farm: "Lamingo Broiler Demo Unit", location: "Lamingo, Jos North", lga: "Jos North", state: "Plateau", production: "Broilers", birds: 5200, houses: 6,
    cycle: "Broiler cycle · week 3", updated: "3 November 2026", feedRecords: 7, healthRecords: 1, vaccinationRecords: 5, productionRecords: 4, financialRecords: 0,
    assets: ["Generator", "Water tank", "Feed store", "Chick brooder"], signals: [
      { area: "Vaccination history", status: "On record", detail: "5 vaccination entries saved for the active flock." },
      { area: "Bird health", status: "On record", detail: "1 health entry is saved." },
      { area: "Flock movements", status: "On record", detail: "Flock counts and movement entries are available." },
      { area: "Farm operations", status: "On record", detail: "Feed use and production entries are recorded for this cycle." },
      { area: "Financial records", status: "Not recorded", detail: "No sales or expense entries are saved in this sample profile." },
    ],
  },
];

const number = (value: number) => new Intl.NumberFormat("en-NG").format(value);

export function InsuranceRiskProfiles() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return profiles.filter((profile) => !search || `${profile.farm} ${profile.location} ${profile.production}`.toLocaleLowerCase().includes(search));
  }, [query]);
  const selected = profiles.find((profile) => profile.id === selectedId);

  return <div className="mx-auto max-w-5xl space-y-5">
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Insurance workspace · Demo records</p>
      <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farmer risk profiles</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">Explore farm, flock, health, production and record information that can support an insurance review.</p>
    </header>

    <section className="flex flex-col gap-3 rounded-[1.25rem] bg-[#eaf0e5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#55734f]"><ShieldCheck size={17} /></span><div><h2 className="text-sm font-semibold text-[#344a36]">Sample profiles for the insurance demo</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#687664]">These four fictional Plateau poultry farms demonstrate the profile view. They are not real farmers, verified claims, or underwriting recommendations.</p></div></div>
      <div className="shrink-0 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-[#547253]">{profiles.length} sample farms</div>
    </section>

    <label className="relative block max-w-lg"><span className="sr-only">Search farm or location</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85907f]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by farm or location" className="input-shell pl-10" /></label>

    {selected ? <ProfileDetails profile={selected} onBack={() => setSelectedId(null)} /> : filtered.length ? <section aria-label="Sample farmer profiles" className="grid gap-3 sm:grid-cols-2">
      {filtered.map((profile) => <ProfileCard key={profile.id} profile={profile} onOpen={() => setSelectedId(profile.id)} />)}
    </section> : <div className="rounded-[1.25rem] bg-white p-8 text-center text-sm text-[#697368]">No sample profiles match that search.</div>}

    <p className="text-[10px] leading-5 text-[#8a9285]">JARI record summaries are informational. They do not predict a claim, determine policy eligibility, or replace an insurer’s assessment. Real farmer information remains subject to farmer consent.</p>
  </div>;
}

function ProfileCard({ profile, onOpen }: { profile: InsuranceDemoProfile; onOpen: () => void }) {
  const followUps = profile.signals.filter((signal) => signal.status === "Follow up" || signal.status === "Not recorded").length;
  return <button type="button" onClick={onOpen} className="group w-full rounded-[1.25rem] bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-[#fbfcf9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c67] sm:p-6">
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bird size={18} /></span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[#799071]">{profile.farmer} · {profile.production}</p><h2 className="mt-1 truncate font-serif text-lg font-medium text-[#2f3c30]">{profile.farm}</h2></div></div><span className="rounded-full bg-[#f2f4ef] px-2.5 py-1 text-[10px] font-semibold text-[#75806f]">Demo</span></div>
    <p className="mt-4 flex items-center gap-1.5 text-xs text-[#70796e]"><MapPin size={13} className="text-[#799071]" />{profile.location}, {profile.state}</p>
    <div className="mt-4 grid grid-cols-3 gap-2"><MiniMetric icon={<Bird size={13} />} label="Active birds" value={number(profile.birds)} /><MiniMetric icon={<Activity size={13} />} label="Houses" value={String(profile.houses)} /><MiniMetric icon={<ClipboardList size={13} />} label="Follow-ups" value={String(followUps)} /></div>
    <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-[#85907f]"><span>Updated {profile.updated}</span><span className="font-semibold text-[#47674a] transition group-hover:text-[#244b35]">View profile <span aria-hidden="true">→</span></span></div>
  </button>;
}

function ProfileDetails({ profile, onBack }: { profile: InsuranceDemoProfile; onBack: () => void }) {
  return <article className="space-y-4">
    <button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[#4f694e] transition hover:bg-[#eaf0e5]"><ArrowLeft size={15} />All sample profiles</button>
    <section className="rounded-[1.35rem] bg-white p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bird size={20} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#799071]">Illustrative insurance profile · {profile.farmer}</p><h2 className="mt-1 font-serif text-xl font-medium text-[#2f3c30] sm:text-2xl">{profile.farm}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-[#737d70]"><MapPin size={13} />{profile.location}, {profile.state}</p></div></div><span className="flex w-fit items-center gap-1.5 rounded-full bg-[#edf2e8] px-3 py-1.5 text-[10px] font-semibold text-[#547253]"><Check size={12} />Demo consent included</span></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><DetailMetric label="Production type" value={profile.production} /><DetailMetric label="Active birds" value={number(profile.birds)} /><DetailMetric label="Farm houses" value={String(profile.houses)} /><DetailMetric label="Current cycle" value={profile.cycle} /></div>
    </section>
    <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-[1.25rem] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Stethoscope size={16} className="text-[#607d58]" /><h3 className="text-sm font-semibold text-[#344236]">Farm record signals</h3></div><p className="mt-1 text-xs leading-5 text-[#778173]">Shows what is present in this fictional sample. It is not a JARI risk score or policy decision.</p><div className="mt-4 space-y-2">{profile.signals.map((signal) => <SignalRow key={signal.area} signal={signal} />)}</div></div>
      <div className="space-y-4"><section className="rounded-[1.25rem] bg-white p-5 sm:p-6"><h3 className="text-sm font-semibold text-[#344236]">Records available</h3><div className="mt-3 space-y-1">{[[<ShieldCheck size={14} />, "Vaccination entries", profile.vaccinationRecords], [<Stethoscope size={14} />, "Health entries", profile.healthRecords], [<Wheat size={14} />, "Feed entries", profile.feedRecords], [<Activity size={14} />, "Production entries", profile.productionRecords], [<CalendarDays size={14} />, "Sales and expense entries", profile.financialRecords]].map(([icon, label, value]) => <div key={String(label)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs"><span className="text-[#819378]">{icon}</span><span className="flex-1 text-[#667162]">{label}</span><span className="font-semibold text-[#39483a]">{value}</span></div>)}</div></section>
      <section className="rounded-[1.25rem] bg-[#f0f3ed] p-5 sm:p-6"><h3 className="text-sm font-semibold text-[#344236]">Farm equipment in the sample</h3><div className="mt-3 flex flex-wrap gap-2">{profile.assets.map((asset) => <span key={asset} className="rounded-full bg-white px-3 py-1.5 text-[10px] text-[#667162]">{asset}</span>)}</div><p className="mt-4 text-[10px] leading-5 text-[#7d8778]">Last sample record update: {profile.updated}</p></section></div>
    </section>
    <div className="rounded-xl bg-[#f2f4ef] p-4 text-[10px] leading-5 text-[#768071]">All details on this page are made-up demonstration data. In a live workflow, an insurer should only view an individual farmer’s information after that farmer grants purpose-specific access.</div>
  </article>;
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl bg-[#f6f7f3] p-2.5"><span className="flex items-center gap-1.5 text-[#7c8a75]">{icon}<span className="text-[9px] font-medium text-[#7c8578]">{label}</span></span><span className="mt-1 block text-sm font-semibold text-[#364438]">{value}</span></div>; }
function DetailMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#f5f7f2] p-3.5"><p className="text-[9px] font-bold uppercase tracking-wide text-[#81907a]">{label}</p><p className="mt-1 text-sm font-semibold text-[#354237]">{value}</p></div>; }
function SignalRow({ signal }: { signal: ProfileSignal }) {
  const tone = signal.status === "On record" ? "bg-[#edf3e9] text-[#4f714b]" : signal.status === "Follow up" ? "bg-[#f5f0e4] text-[#806c3d]" : "bg-[#f1f2ef] text-[#72796f]";
  return <div className="rounded-xl bg-[#f8f9f6] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold text-[#3f4b40]">{signal.area}</p><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${tone}`}>{signal.status}</span></div><p className="mt-1.5 text-[11px] leading-5 text-[#707a6d]">{signal.detail}</p></div>;
}
