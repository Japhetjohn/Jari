"use client";

import { FormEvent, useState } from "react";
import { addFlockMovement } from "@/services";
import type { FlockRecord, FarmFlockMovement } from "@/services";
import { notifyToast } from "@/lib/toast";

const movementTypes: FarmFlockMovement["type"][] = ["Bird acquisition", "Additional stocking", "Mortality", "Sale", "Adjustment"];

export function FlockMovementDialog({ flocks, onClose, onSaved }: { flocks: FlockRecord[]; onClose: () => void; onSaved: () => void }) {
  const [flock, setFlock] = useState(flocks[0]?.name ?? "");
  const [type, setType] = useState<FarmFlockMovement["type"]>("Additional stocking");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await addFlockMovement({ flock, type, date, quantity: Number(quantity), reason: reason.trim(), notes: notes.trim() || undefined });
      onSaved();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "We could not save this bird record.";
      setError(message); notifyToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="movement-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Bird group record</p><h3 id="movement-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">Record a bird count change</h3><p className="mt-1 text-xs leading-5 text-[#788174]">The group's current number will update when you save.</p></div><form onSubmit={submit} className="mt-5 space-y-3"><label className="label-text block">Bird group<select required value={flock} onChange={(event) => setFlock(event.target.value)}>{flocks.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label className="label-text block">What changed?<select value={type} onChange={(event) => setType(event.target.value as FarmFlockMovement["type"])}>{movementTypes.map((item) => <option key={item}>{item}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="label-text block">Number of birds<input required type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label className="label-text block">Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div><label className="label-text block">Reason<input required maxLength={120} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="For example, birds sold to a customer" /></label><label className="label-text block">Extra notes<textarea maxLength={300} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-xs text-[#9a493c]">{error}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button type="submit" disabled={isSubmitting} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white disabled:opacity-60">{isSubmitting ? "Saving..." : "Save bird record"}</button></div></form></section></div>;
}
