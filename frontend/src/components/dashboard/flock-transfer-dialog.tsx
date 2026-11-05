"use client";
import { FormEvent, useState } from "react";
import { addFlockTransfer } from "@/services";
import type { FlockRecord } from "@/services";

export function FlockTransferDialog({ flocks, onClose, onSaved }: { flocks: FlockRecord[]; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState("");
  const [source, setSource] = useState(flocks[0]?.name || "");
  const [destination, setDestination] = useState(flocks.find((flock) => flock.name !== source)?.name || "");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      addFlockTransfer({ source, destination, date: String(form.get("date")), quantity: Number(form.get("quantity")), reason: String(form.get("reason") || "").trim(), notes: String(form.get("notes") || "").trim() || undefined });
      onSaved();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not transfer these birds."); }
  };
  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="transfer-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird group record</p><h3 id="transfer-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">Transfer birds between groups</h3><p className="mt-2 text-xs leading-5 text-[#788174]">Both bird counts and their history will update together.</p><form onSubmit={submit} className="mt-5 space-y-3"><label className="label-text block">Move birds from<select required value={source} onChange={(event) => { setSource(event.target.value); if (destination === event.target.value) setDestination(flocks.find((flock) => flock.name !== event.target.value)?.name || ""); }}>{flocks.map((flock) => <option key={flock.name}>{flock.name}</option>)}</select></label><label className="label-text block">Move birds to<select required value={destination} onChange={(event) => setDestination(event.target.value)}>{flocks.filter((flock) => flock.name !== source).map((flock) => <option key={flock.name}>{flock.name}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="label-text block">Number of birds<input required name="quantity" type="number" min="1" step="1" /></label><label className="label-text block">Date<input required name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label></div><label className="label-text block">Reason<input required name="reason" maxLength={120} placeholder="For example, balancing group sizes" /></label><label className="label-text block">Extra notes<textarea name="notes" maxLength={300} /></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-xs text-[#9a493c]">{error}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button type="submit" disabled={flocks.length < 2} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-50">Transfer birds</button></div></form></section></div>;
}
