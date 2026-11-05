"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, Pencil, Tractor, X } from "lucide-react";
import { getFarmAssets, saveFarmAssets } from "@/services";
import type { FarmAssetRecord } from "@/services";

const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(value) || 0);

export default function AssetsPage() {
  const [assets, setAssets] = useState<FarmAssetRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FarmAssetRecord | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setAssets(getFarmAssets()); }, []);
  const selected = selectedIndex === null ? null : assets[selectedIndex] ?? null;
  const openAsset = (index: number) => { setSelectedIndex(index); setDraft(assets[index]); setEditing(false); setSaved(false); };
  const update = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIndex === null || !draft) return;
    const next = assets.map((asset, index) => index === selectedIndex ? { ...draft, quantity: Math.max(0, Number(draft.quantity)), value: Math.max(0, Number(draft.value)) } : asset);
    setAssets(next);
    saveFarmAssets(next);
    setEditing(false);
    setSaved(true);
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farm equipment</h2><p className="mt-2 text-sm text-[#737d70]">Select a piece of equipment to view or update its details.</p></div><Link href="/assets/new" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white hover:bg-[#193d2b]">Add equipment</Link></div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Farm equipment">
        {assets.map((asset, index) => <button type="button" key={`${asset.name}-${index}`} onClick={() => openAsset(index)} className="group rounded-[1.25rem] bg-white p-5 text-left transition-colors hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a]"><span className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Tractor size={17} /></span><ArrowUpRight size={16} className="text-[#879182] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><span className="mt-4 block font-serif text-xl font-medium text-[#29352a]">{asset.name}</span><span className="mt-1 block text-xs text-[#788174]">{asset.quantity} {asset.quantity === 1 ? "item" : "items"} - {money(asset.value)}</span><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${asset.status === "Working" ? "bg-[#e5eee0] text-[#4c7048]" : "bg-[#f4eddd] text-[#8a7141]"}`}>{asset.status}</span><span className="mt-4 block text-[10px] font-semibold text-[#547253]">View or edit details</span></button>)}
      </section>

      {selected && draft && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedIndex(null); setEditing(false); } }}><section role="dialog" aria-modal="true" aria-labelledby="asset-detail-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Equipment details</p><h3 id="asset-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{editing ? "Update equipment" : selected.name}</h3></div><button type="button" onClick={() => { setSelectedIndex(null); setEditing(false); }} aria-label="Close equipment details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div>
        {editing ? <form onSubmit={update} className="mt-5 space-y-3"><label className="label-text block">Equipment name<input required maxLength={80} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><div className="grid grid-cols-2 gap-3"><label className="label-text block">Number of items<input required type="number" min="0" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })} /></label><label className="label-text block">Value in naira<input required type="number" min="0" value={draft.value} onChange={(event) => setDraft({ ...draft, value: Number(event.target.value) })} /></label></div><label className="label-text block">Condition<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as FarmAssetRecord["status"] })}><option>Working</option><option>Needs repair</option></select></label><label className="label-text block">Notes<textarea maxLength={300} value={draft.notes ?? ""} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Add a note about this equipment" /></label><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => { setDraft(selected); setEditing(false); }} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Check size={14} />Save details</button></div></form> : <><dl className="mt-5 grid gap-2 sm:grid-cols-2">{[{ label: "Number of items", value: `${selected.quantity}` }, { label: "Estimated value", value: money(selected.value) }, { label: "Condition", value: selected.status }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 text-sm font-medium text-[#354237]">{item.value}</dd></div>)}</dl><p className="mt-3 rounded-xl bg-[#f1f4ed] p-4 text-sm leading-6 text-[#59645a]">{selected.notes || "No notes have been added."}</p>{saved && <p role="status" className="mt-3 text-xs font-semibold text-[#4c7048]">Equipment details saved.</p>}<button type="button" onClick={() => { setDraft(selected); setEditing(true); setSaved(false); }} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#244b35] text-xs font-semibold text-white hover:bg-[#193d2b]"><Pencil size={14} />Edit equipment details</button></>}
      </section></div>}
    </div>
  );
}
