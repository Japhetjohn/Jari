"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { addFeedPurchase, getFlockRecords } from "@/services";
import type { FlockRecord } from "@/services";

export default function NewFeedPurchasePage() {
  const router = useRouter();
  const [flocks, setFlocks] = useState<FlockRecord[]>([]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), feedType: "Starter", brand: "", supplier: "", quantity: "", unit: "bags" as "bags" | "kg", bagWeightKg: "25", amount: "", amountPaid: "", flock: "" });
  const [error, setError] = useState("");
  useEffect(() => setFlocks(getFlockRecords()), []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      addFeedPurchase({ date: form.date, feedType: form.feedType, brand: form.brand.trim(), supplier: form.supplier.trim(), quantity: Number(form.quantity), unit: form.unit, bagWeightKg: form.unit === "bags" ? Number(form.bagWeightKg) : 1, amount: Number(form.amount), amountPaid: Number(form.amountPaid) || 0, flock: form.flock || undefined });
      router.push("/feed/purchases");
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "We could not save this purchase."); }
  };

  return <div className="mx-auto max-w-3xl space-y-5"><div><Link href="/feed/purchases" className="text-xs font-semibold text-[#547253]">Back to purchases</Link><h2 className="mt-2 font-serif text-2xl font-medium text-[#20291f] sm:text-3xl">Add a feed purchase</h2><p className="mt-2 text-sm text-[#737d70]">This will add feed to your stock and record the cost.</p></div><form onSubmit={submit} className="rounded-2xl"><div className="grid gap-4 sm:grid-cols-2"><label className="label-text">Purchase date<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label className="label-text">Feed type<select value={form.feedType} onChange={(event) => setForm({ ...form, feedType: event.target.value })}>{["Starter", "Grower", "Finisher", "Layer", "Breeder", "Other"].map((type) => <option key={type}>{type}</option>)}</select></label><label className="label-text">Brand<input required value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} placeholder="Feed brand" /></label><label className="label-text">Supplier<input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} placeholder="Shop or supplier name" /></label><label className="label-text">Quantity<input required type="number" min="0.01" step="0.01" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></label><label className="label-text">Unit<select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value as "bags" | "kg" })}><option value="bags">Bags</option><option value="kg">Kilograms</option></select></label>{form.unit === "bags" && <label className="label-text">Weight per bag (kg)<input required type="number" min="1" value={form.bagWeightKg} onChange={(event) => setForm({ ...form, bagWeightKg: event.target.value })} /></label>}<label className="label-text">Total cost (naira)<input required type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label><label className="label-text">Amount paid (naira)<input type="number" min="0" max={form.amount || undefined} step="0.01" value={form.amountPaid} onChange={(event) => setForm({ ...form, amountPaid: event.target.value })} /></label><label className="label-text">Bird group (optional)<select value={form.flock} onChange={(event) => setForm({ ...form, flock: event.target.value })}><option value="">Not linked to a group</option>{flocks.map((flock) => <option key={flock.name}>{flock.name}</option>)}</select></label></div>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fbefeb] p-3 text-sm text-[#9a493c]">{error}</p>}<div className="mt-6 flex justify-end"><button type="submit" className="min-h-11 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white">Save purchase</button></div></form></div>;
}
