"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, ChevronDown, Plus, X } from "lucide-react";
import { getFlockMovements, getFlockRecords } from "@/services";
import type { FarmFlockMovement, FlockRecord } from "@/services";
import { FlockMovementDialog } from "@/components/dashboard/flock-movement-dialog";

export default function BirdsPage() {
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [movements, setMovements] = useState<FarmFlockMovement[]>([]);
  const [selectedFlock, setSelectedFlock] = useState<FlockRecord | null>(null);
  const [movementOpen, setMovementOpen] = useState(false);

  const refresh = () => { setFlocks(getFlockRecords()); setMovements(getFlockMovements()); };
  useEffect(refresh, []);
  const activeBirds = flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + Number(flock.birds || 0), 0);

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Birds and care</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Your bird groups</h2><p className="mt-2 text-sm text-[#737d70]">Select a group to see its details.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMovementOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b]"><Plus size={14} />Record bird change</button><Link href="/birds/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193d2b]">Add bird group</Link></div></div>

      <section className="grid gap-3 sm:grid-cols-2"><article className="rounded-[1.25rem] bg-white p-5"><p className="text-xs text-[#788174]">Birds in active groups</p><p className="mt-2 font-serif text-3xl text-[#29352a]">{activeBirds.toLocaleString()}</p></article><article className="rounded-[1.25rem] bg-white p-5"><p className="text-xs text-[#788174]">Groups on your farm</p><p className="mt-2 font-serif text-3xl text-[#29352a]">{flocks.length}</p></article></section>

      <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><h3 className="font-serif text-xl font-medium text-[#29352a]">Bird groups</h3><div className="mt-3 space-y-2">{flocks.map((flock) => <button type="button" key={flock.name} onClick={() => setSelectedFlock(flock)} className="group flex w-full flex-col gap-3 rounded-xl bg-[#f7f8f4] p-4 text-left transition-colors hover:bg-[#eef2e9] sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#354237]">{flock.name}</span><span className="mt-1 block text-xs text-[#788174]">{flock.type} birds - {flock.house} - {Number(flock.birds).toLocaleString()} birds</span></span><span className="flex items-center justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${flock.status === "Active" ? "bg-[#e5eee0] text-[#4c7048]" : "bg-[#eeefe9] text-[#70776b]"}`}>{flock.status === "Active" ? "Being raised" : "Finished"}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#547253]">Details <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span></span></button>)}</div></section>

      <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird count history</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">Recent changes</h3></div><div className="mt-3 space-y-2">{movements.slice(-5).reverse().map((movement) => <div key={movement.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7f8f4] p-3"><div><p className="text-xs font-semibold text-[#354237]">{movement.type} - {movement.flock}</p><p className="mt-1 text-[10px] text-[#788174]">{movement.date} - {movement.reason}</p></div><span className="text-xs font-semibold text-[#547253]">{movement.quantity.toLocaleString()} birds</span></div>)}</div></section>

      {selectedFlock && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedFlock(null); }}><section role="dialog" aria-modal="true" aria-labelledby="flock-detail-title" className="w-full max-w-lg rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird group details</p><h3 id="flock-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{selectedFlock.name}</h3></div><button type="button" onClick={() => setSelectedFlock(null)} aria-label="Close bird group details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div><dl className="mt-5 grid gap-2 sm:grid-cols-2">{[{ label: "Bird type", value: selectedFlock.type }, { label: "Number of birds", value: Number(selectedFlock.birds).toLocaleString() }, { label: "Farm house", value: selectedFlock.house }, { label: "Breed", value: selectedFlock.breed || "Not added" }, { label: "Group status", value: selectedFlock.status === "Active" ? "Being raised" : "Finished" }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 flex items-center gap-2 text-sm font-medium text-[#354237]">{item.label === "Bird type" && <Bird size={14} className="text-[#688363]" />}{item.value}</dd></div>)}</dl><p className="mt-4 flex items-center gap-2 text-xs text-[#788174]"><ChevronDown size={14} className="rotate-[-90deg] text-[#688363]" />Select another group to view its details.</p></section></div>}
      {movementOpen && <FlockMovementDialog flocks={flocks.filter((flock) => flock.status === "Active")} onClose={() => setMovementOpen(false)} onSaved={() => { refresh(); setMovementOpen(false); }} />}
    </div>
  );
}
