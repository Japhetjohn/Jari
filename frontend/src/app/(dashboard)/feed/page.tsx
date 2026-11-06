"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Wheat } from "lucide-react";
import { getFeedInventory, getFeedPurchases, getFeedUseRecords } from "@/services";

export default function FeedPage() {
  const [inventory, setInventory] = useState(getFeedInventory());
  const [purchases, setPurchases] = useState(getFeedPurchases());
  const [useRecords, setUseRecords] = useState(getFeedUseRecords());
  useEffect(() => { setInventory(getFeedInventory()); setPurchases(getFeedPurchases()); setUseRecords(getFeedUseRecords()); }, []);
  const spent = purchases.reduce((sum, item) => sum + item.amount, 0);
  const remaining = inventory.reduce((sum, item) => sum + item.availableKg, 0);
  const latest = [
    ...purchases.map((item) => ({ id: item.id, date: item.date, text: `${item.feedType} feed purchase`, amount: `${item.quantity} ${item.unit}`, kind: "Bought" })),
    ...useRecords.map((item) => ({ id: item.id, date: item.date, text: `${item.feedType} feed used`, amount: `${item.quantityKg} kg`, kind: "Used" })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

  return <div className="space-y-5 sm:space-y-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Feed and supplies</p><h2 className="mt-1 font-serif text-2xl font-medium text-[#20291f] sm:text-3xl">Feed on your farm</h2><p className="mt-2 text-sm text-[#737d70]">See what you have bought and what has been used.</p></div><div className="flex flex-wrap gap-2"><Link href="/feed/purchases" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e9efe3] px-4 text-xs font-semibold text-[#35543b]">View purchases</Link><Link href="/feed/consumption" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Record feed use</Link></div></div>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3"><article className="rounded-[1.2rem] bg-white p-4"><p className="text-xs text-[#788174]">Feed available</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{Math.round(remaining).toLocaleString()} kg</p></article><article className="rounded-[1.2rem] bg-white p-4"><p className="text-xs text-[#788174]">Feed bought</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{purchases.reduce((sum, item) => sum + item.quantity * (item.unit === "bags" ? item.bagWeightKg : 1), 0).toLocaleString()} kg</p></article><article className="rounded-[1.2rem] bg-white p-4"><p className="text-xs text-[#788174]">Money spent on feed</p><p className="mt-2 font-serif text-2xl text-[#29352a]">{money.format(spent)}</p></article></section>
    <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><h3 className="font-serif text-xl font-medium text-[#29352a]">Feed available by type</h3>{inventory.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{inventory.map((item) => <div key={item.feedType} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f8f4] p-4"><span className="flex items-center gap-2 text-sm font-semibold text-[#354237]"><Wheat size={15} className="text-[#688363]" />{item.feedType}</span><span className="text-sm font-semibold text-[#547253]">{Math.round(item.availableKg).toLocaleString()} kg left</span></div>)}</div> : <p className="mt-3 rounded-xl bg-[#f7f8f4] p-4 text-sm text-[#788174]">Add a feed purchase to begin tracking supplies.</p>}</section>
    <section className="rounded-[1.35rem] bg-white p-4 sm:p-6"><div className="flex items-center justify-between"><h3 className="font-serif text-xl font-medium text-[#29352a]">Recent feed records</h3><Link href="/feed/purchases" className="inline-flex items-center gap-1 text-xs font-semibold text-[#547253]">All purchases <ArrowRight size={13} /></Link></div><div className="mt-3 space-y-2">{latest.map((item) => <div key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7f8f4] p-3"><div><p className="text-xs font-semibold text-[#354237]">{item.text}</p><p className="mt-1 text-[10px] text-[#788174]">{item.date}</p></div><span className="text-xs font-medium text-[#59645a]">{item.kind} - {item.amount}</span></div>)}</div></section>
  </div>;
}
