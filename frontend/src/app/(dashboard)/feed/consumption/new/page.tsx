"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addFeedUse, getFeedInventory, getFlockRecords } from "@/services";
import type { FlockRecord } from "@/services";

export default function NewFeedUsePage() {
  const router = useRouter();
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [inventory, setInventory] = useState(getFeedInventory());
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), feedType: "Starter", flock: "", quantityKg: "", notes: "" });
  const [error, setError] = useState("");
  useEffect(() => { const active = getFlockRecords().filter((item) => item.status === "Active"); setFlocks(active); setForm((old) => ({ ...old, flock: active[0]?.name ?? "" })); setInventory(getFeedInventory()); }, []);
  const available = inventory.find((item) => item.feedType === form.feedType)?.availableKg ?? 0;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { addFeedUse({ date: form.date, feedType: form.feedType, flock: form.flock, quantityKg: Number(form.quantityKg), notes: form.notes.trim() || undefined }); router.push("/feed/consumption"); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : "We could not save this feed record."); }
  };
  return <div className="mx-auto max-w-3xl space-y-5"><div><Link href="/feed/consumption" className="text-xs font-semibold text-[#547253]">Back to feed use</Link><h2 className="mt-2 font-serif text-2xl font-medium text-[#20291f] sm:text-3xl">Record feed use</h2><p className="mt-2 text-sm text-[#737d70]">Available {form.feedType.toLowerCase()} feed: {available.toLocaleString()} kg.</p></div><form onSubmit={submit} className="rounded-2xl"><div className="grid gap-4 sm:grid-cols-2"><label className="label-text">Date<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label className="label-text">Bird group<select required value={form.flock} onChange={(event) => setForm({ ...form, flock: event.target.value })}>{flocks.map((flock) => <option key={flock.name}>{flock.name}</option>)}</select></label><label className="label-text">Feed type<select value={form.feedType} onChange={(event) => setForm({ ...form, feedType: event.target.value })}>{inventory.map((item) => <option key={item.feedType}>{item.feedType}</option>)}</select></label><label className="label-text">Quantity used (kg)<input required type="number" min="0.01" max={available || undefined} step="0.01" value={form.quantityKg} onChange={(event) => setForm({ ...form, quantityKg: event.target.value })} /></label><label className="label-text sm:col-span-2">Notes<textarea maxLength={300} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label></div>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}<div className="mt-6 flex justify-end"><button type="submit" disabled={available <= 0 || flocks.length === 0} className="min-h-11 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white disabled:opacity-50">Save feed use</button></div></form></div>;
}
