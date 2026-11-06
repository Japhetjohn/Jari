"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ClipboardList, Warehouse } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDemoDatabaseSnapshot, getInstitutionDemoAccess } from "@/services";
import { getJariProfileScore } from "@/lib/opportunity-readiness";

const number = (value: number) => new Intl.NumberFormat("en-NG").format(value);

type PortfolioFarmer = { id: string; name: string; farm: string; production: string; birds: number; houses: number; records: number; score: number; followUp: string; isDemo?: boolean; vaccinationRecords: number; healthRecords: number; feedRecords: number; productionRecords: number; financialRecords: number };
const sampleFarmers: PortfolioFarmer[] = [
  { id: "portfolio-001", name: "Musa Tanko", farm: "Kuru Layers Demo Farm", production: "Layers", birds: 3200, houses: 4, records: 38, score: 82, followUp: "Vaccination history is recorded; health notes need a recent update.", isDemo: true, vaccinationRecords: 6, healthRecords: 3, feedRecords: 8, productionRecords: 12, financialRecords: 9 },
  { id: "portfolio-002", name: "Ruth Pam", farm: "Barkin Ridge Poultry Demo", production: "Broilers", birds: 1850, houses: 3, records: 20, score: 68, followUp: "Some production dates are missing from the current cycle.", isDemo: true, vaccinationRecords: 4, healthRecords: 2, feedRecords: 5, productionRecords: 5, financialRecords: 4 },
];
const farmerProfiles = [
  { id: "portfolio-001", name: "Musa Tanko", production: "Layers", birds: 3200, houses: 4, records: 38, score: 82, followUp: "Vaccination history is recorded; health notes need a recent update." },
  { id: "portfolio-002", name: "Ruth Pam", production: "Broilers", birds: 1850, houses: 3, records: 20, score: 68, followUp: "Some production dates are missing from the current cycle." },
];

export function InstitutionPortfolioStatistics() {
  const [profiles, setProfiles] = useState(sampleFarmers);
  useEffect(() => {
    const sync = () => {
      const snapshot = getDemoDatabaseSnapshot();
      const profile = snapshot.farmProfile;
      const hasIdentity = Boolean(profile.ownerName.trim() || profile.farmName.trim());
      if (!getInstitutionDemoAccess().shared || !hasIdentity) { setProfiles(sampleFarmers); return; }
      const birds = snapshot.flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0);
      const score = getJariProfileScore(snapshot);
      const records = snapshot.vaccinations.length + snapshot.healthIncidents.length + snapshot.treatments.length + snapshot.feedPurchases.length + snapshot.feedUse.length + snapshot.production.length + snapshot.sales.length + snapshot.expenses.length;
      const current: PortfolioFarmer = { id: "current-farmer-demo", name: profile.ownerName || "Farmer", farm: profile.farmName || "Poultry farm", production: profile.operationType || "Poultry", birds, houses: snapshot.poultryHouses.filter((house) => !house.archived).length, records, score, followUp: score < 100 ? "Some farm records may need to be added or updated." : "Core farm record areas are up to date.", vaccinationRecords: snapshot.vaccinations.length, healthRecords: snapshot.healthIncidents.length + snapshot.treatments.length, feedRecords: snapshot.feedPurchases.length + snapshot.feedUse.length, productionRecords: snapshot.production.length, financialRecords: snapshot.sales.length + snapshot.expenses.length };
      setProfiles([current, ...sampleFarmers]);
    };
    sync(); window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, []);
  const totalBirds = profiles.reduce((sum, profile) => sum + profile.birds, 0);
  const totalHouses = profiles.reduce((sum, profile) => sum + profile.houses, 0);
  const recordRows = [
    { name: "Vaccination", entries: profiles.reduce((sum, profile) => sum + profile.vaccinationRecords, 0) },
    { name: "Health", entries: profiles.reduce((sum, profile) => sum + profile.healthRecords, 0) },
    { name: "Feed", entries: profiles.reduce((sum, profile) => sum + profile.feedRecords, 0) },
    { name: "Production", entries: profiles.reduce((sum, profile) => sum + profile.productionRecords, 0) },
    { name: "Finance", entries: profiles.reduce((sum, profile) => sum + profile.financialRecords, 0) },
  ];
  const totalRecords = recordRows.reduce((sum, row) => sum + row.entries, 0);
  const flockMix = Object.entries(profiles.reduce<Record<string, number>>((groups, profile) => { groups[profile.production] = (groups[profile.production] || 0) + profile.birds; return groups; }, {})).map(([name, birds]) => ({ name, birds }));
  const reviewMix = [
    { name: "Profile score 70+", value: profiles.filter((profile) => profile.score >= 70).length, color: "#55734f" },
    { name: "Profile score below 70", value: profiles.filter((profile) => profile.score < 70).length, color: "#d2a64d" },
  ].filter((item) => item.value > 0);
  return <div className="mx-auto max-w-5xl space-y-5">
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Institution workspace · Portfolio view</p>
      <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Poultry portfolio statistics</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">A high-level view of farm activity and record coverage. Individual farm profiles are kept private.</p>
    </header>

    <section aria-label="Portfolio summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={<ClipboardList size={16} />} label="Farmers represented" value={number(profiles.length)} detail="Demo portfolio profiles" />
      <StatCard icon={<Bird size={16} />} label="Birds recorded" value={number(totalBirds)} detail="Across the demo group" />
      <StatCard icon={<Warehouse size={16} />} label="Poultry houses" value={number(totalHouses)} detail="Across the demo group" />
      <StatCard icon={<ClipboardList size={16} />} label="Farm records" value={number(totalRecords)} detail="Across five record areas" />
    </section>

    <section aria-label="Portfolio charts" className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <div className="mb-4"><h2 className="text-sm font-semibold text-[#344236]">Record coverage</h2><p className="mt-1 text-xs leading-5 text-[#778173]">Combined entries across the demo portfolio.</p></div>
        <div className="h-64 w-full" role="img" aria-label="Bar chart of aggregate farm record counts">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={recordRows} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
            <CartesianGrid stroke="#edf0e9" vertical={false} /><XAxis dataKey="name" tick={{ fill: "#778173", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#92998e", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#f5f7f2" }} contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} /><Bar dataKey="entries" name="Saved records" fill="#55734f" radius={[6, 6, 0, 0]} maxBarSize={42} />
          </BarChart></ResponsiveContainer>
        </div>
      </article>
      <article className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <div className="mb-4"><h2 className="text-sm font-semibold text-[#344236]">Birds by production type</h2><p className="mt-1 text-xs leading-5 text-[#778173]">Combined bird counts, without farm names or locations.</p></div>
        <div className="h-64 w-full" role="img" aria-label="Bar chart of aggregate bird counts by production type">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={flockMix} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
            <CartesianGrid stroke="#edf0e9" vertical={false} /><XAxis dataKey="name" tick={{ fill: "#778173", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#92998e", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "#f5f7f2" }} contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} /><Bar dataKey="birds" name="Birds" fill="#8aa17d" radius={[6, 6, 0, 0]} maxBarSize={52} />
          </BarChart></ResponsiveContainer>
        </div>
      </article>
    </section>

    <section aria-label="Farmer risk profile cards" className="space-y-3">
      <div><h2 className="font-serif text-xl font-medium text-[#29352a]">Farmer risk profiles</h2><p className="mt-1 text-xs leading-5 text-[#778173]">A short profile preview to guide a conversation. No phone numbers, exact locations or document contents are shown.</p></div>
      <div className="grid gap-3 md:grid-cols-2">{profiles.map((profile) => <article key={profile.id} className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Bird size={18} /></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-[#29352a]">{profile.name}</h3><p className="mt-0.5 truncate text-xs text-[#778173]">{profile.farm} · {profile.production}</p></div></div><span className="shrink-0 rounded-xl bg-[#edf2e8] px-3 py-2 text-center"><strong className="block text-lg leading-5 text-[#35583d]">{profile.score}</strong><span className="text-[9px] font-semibold uppercase tracking-wide text-[#71806d]">JARI score</span></span></div>
        <div className="mt-4 grid grid-cols-3 gap-2"><MiniStat label="Birds" value={number(profile.birds)} /><MiniStat label="Houses" value={String(profile.houses)} /><MiniStat label="Records" value={String(profile.records)} /></div>
        <div className="mt-3 rounded-xl bg-[#f7f8f4] p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">Follow-up</p><p className="mt-1 text-xs leading-5 text-[#697368]">{profile.followUp}</p></div>
        <p className="mt-3 text-[10px] leading-4 text-[#8a9285]">{profile.isDemo ? "Fictional demonstration profile. " : "Farmer-shared summary. "}The JARI score summarises profile records. It is not an approval or underwriting decision.</p>
      </article>)}</div>
    </section>

    <section className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <article className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[#344236]">Portfolio review mix</h2><p className="mt-1 text-xs leading-5 text-[#778173]">High-level follow-up grouping for the demo portfolio.</p>
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <div className="h-40 w-40" role="img" aria-label="Donut chart showing anonymized portfolio follow-up categories"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={reviewMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={67} paddingAngle={4} stroke="none">{reviewMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} /></PieChart></ResponsiveContainer></div>
          <div className="w-full max-w-[220px] space-y-3 text-xs text-[#687465]">{reviewMix.map((item) => <div key={item.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="flex-1">{item.name}</span><strong className="text-[#344236]">{item.value}</strong></div>)}</div>
        </div>
      </article>
      <article className="flex flex-col justify-between rounded-[1.25rem] bg-[#e9efe3] p-5 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#698164]">Continue the conversation</p><h2 className="mt-2 max-w-md font-serif text-2xl font-medium text-[#29352a]">Need more context for a funding or insurance discussion?</h2><p className="mt-2 max-w-lg text-sm leading-6 text-[#687664]">Send a request to ask a farmer for more information. Personal details and full farm records remain private in this workspace.</p></div><Link href="/institution/requests" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white transition hover:bg-[#193d2b]">Request a conversation <ArrowRight size={14} /></Link></article>
    </section>
    <p className="text-[10px] leading-5 text-[#8a9285]">All figures shown here are fictional demonstration statistics. They are not market estimates, individual farm assessments or underwriting decisions.</p>
  </div>;
}

function StatCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className="rounded-[1.15rem] bg-white p-4 sm:p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]">{icon}</span><p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[#84907e]">{label}</p><p className="mt-1 text-xl font-semibold tracking-tight text-[#29352a] sm:text-2xl">{value}</p><p className="mt-1 text-[10px] leading-4 text-[#7b8478]">{detail}</p></article>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#f7f8f4] px-2.5 py-2"><p className="text-[9px] font-medium text-[#84907e]">{label}</p><p className="mt-0.5 text-xs font-semibold text-[#354237]">{value}</p></div>;
}

export function InsuranceRiskProfiles() {
  return <InstitutionPortfolioStatistics />;
}
