"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { getFeedPurchases } from "@/services";
import type { FeedPurchaseRecord } from "@/services";

const money = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

export default function FeedPurchasesPage() {
  const [purchases, setPurchases] = useState<FeedPurchaseRecord[]>([]);
  useEffect(() => { setPurchases(getFeedPurchases()); }, []);
  return <div className="space-y-5 sm:space-y-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/feed" className="inline-flex items-center gap-1 text-xs font-semibold text-[#547253]"><ArrowLeft size={13} /> Feed</Link><h2 className="mt-2 font-serif text-2xl font-medium text-[#20291f] sm:text-3xl">Feed purchases</h2></div><Link href="/feed/purchases/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={14} />Add purchase</Link></div>
    <section className="space-y-2">{purchases.map((item) => <article key={item.id} className="rounded-[1.2rem] bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#354237]">{item.feedType} feed - {item.brand}</h3><p className="mt-1 text-xs text-[#788174]">{item.date}{item.supplier ? ` - ${item.supplier}` : ""}</p></div><span className="text-sm font-semibold text-[#354237]">{money(item.amount)}</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#687466]"><span>{item.quantity} {item.unit}{item.unit === "bags" ? ` at ${item.bagWeightKg} kg each` : ""}</span><span>Paid {money(item.amountPaid)}</span><span>Owing {money(Math.max(0, item.amount - item.amountPaid))}</span>{item.flock && <span>For {item.flock}</span>}</div></article>)}{!purchases.length && <p className="rounded-xl bg-white p-5 text-sm text-[#788174]">No feed purchases yet. Add a purchase to start tracking feed supplies.</p>}</section>
  </div>;
}
