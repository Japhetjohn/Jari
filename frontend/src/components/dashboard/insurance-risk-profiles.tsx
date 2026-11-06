"use client";

import Link from "next/link";
import { ArrowRight, Bird, ClipboardList, Warehouse } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const number = (value: number) => new Intl.NumberFormat("en-NG").format(value);

// Aggregated fictional portfolio figures. No individual farm profile is sent to this view.
const recordRows = [
  { name: "Vaccination", entries: 10 },
  { name: "Health", entries: 5 },
  { name: "Feed", entries: 13 },
  { name: "Production", entries: 17 },
  { name: "Finance", entries: 13 },
];
const flockMix = [{ name: "Layers", birds: 3200 }, { name: "Broilers", birds: 1850 }];
const reviewMix = [
  { name: "Routine follow-up", value: 1, color: "#55734f" },
  { name: "Review recommended", value: 1, color: "#d2a64d" },
];

export function InstitutionPortfolioStatistics() {
  const totalBirds = flockMix.reduce((sum, group) => sum + group.birds, 0);
  const totalRecords = recordRows.reduce((sum, row) => sum + row.entries, 0);
  return <div className="mx-auto max-w-5xl space-y-5">
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Institution workspace · Portfolio view</p>
      <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Poultry portfolio statistics</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">A high-level view of farm activity and record coverage. Individual farm profiles are kept private.</p>
    </header>

    <section aria-label="Portfolio summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={<ClipboardList size={16} />} label="Farms represented" value="2" detail="Illustrative demo group" />
      <StatCard icon={<Bird size={16} />} label="Birds recorded" value={number(totalBirds)} detail="Across the demo group" />
      <StatCard icon={<Warehouse size={16} />} label="Poultry houses" value="7" detail="Across the demo group" />
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

export function InsuranceRiskProfiles() {
  return <InstitutionPortfolioStatistics />;
}
