"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProductionRecords, type ProductionRecord } from "@/services";

export default function ProductionPage() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  useEffect(() => { const sync = () => setRecords(getProductionRecords()); sync(); window.addEventListener("jari:mock-data-changed", sync); return () => window.removeEventListener("jari:mock-data-changed", sync); }, []);
  const eggs = records.reduce((sum, row) => sum + row.eggsCollected, 0);
  const ready = records.reduce((sum, row) => sum + row.birdsReady, 0);
  const averageWeight = records.filter((row) => row.averageWeight > 0).reduce((sum, row, _, list) => sum + row.averageWeight / list.length, 0);
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-700">Production</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Production records</h2></div><Link href="/production/new" className="rounded-full bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Log production</Link></div><section className="grid grid-cols-2 gap-4 sm:grid-cols-3">{[{ label: "Eggs collected", value: eggs.toLocaleString() }, { label: "Birds ready for sale", value: ready.toLocaleString() }, { label: "Average bird weight", value: averageWeight ? `${averageWeight.toFixed(2)} kg` : "Not recorded" }].map((item) => <div key={item.label} className="rounded-2xl bg-white p-5"><p className="text-sm text-slate-500">{item.label}</p><p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p></div>)}</section><section className="rounded-2xl bg-white p-5"><h3 className="text-lg font-semibold text-slate-900">Recent production</h3><div className="mt-4 space-y-3">{records.slice().reverse().map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-medium text-slate-900">{entry.flock}</p><p className="text-sm text-slate-500">{entry.type} · {entry.date}</p></div><span className="text-sm font-semibold text-emerald-700">{entry.eggsCollected ? `${entry.eggsCollected.toLocaleString()} eggs` : `${entry.birdsReady.toLocaleString()} birds ready`}</span></div>)}{!records.length && <p className="py-8 text-center text-sm text-slate-500">No production recorded yet.</p>}</div></section></div>;
}
