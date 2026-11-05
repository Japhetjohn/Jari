"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { getFeedUseRecords } from "@/services";
import type { FeedUseRecord } from "@/services";

export default function FeedConsumptionPage() {
  const [records, setRecords] = useState<FeedUseRecord[]>([]);
  useEffect(() => { setRecords(getFeedUseRecords()); }, []);
  return <div className="space-y-5 sm:space-y-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/feed" className="inline-flex items-center gap-1 text-xs font-semibold text-[#547253]"><ArrowLeft size={13} /> Feed</Link><h2 className="mt-2 font-serif text-2xl font-medium text-[#20291f] sm:text-3xl">Feed use</h2><p className="mt-2 text-sm text-[#737d70]">Recording feed use subtracts it from your available stock.</p></div><Link href="/feed/consumption/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white"><Plus size={14} />Record feed use</Link></div><section className="space-y-2">{records.slice().reverse().map((record) => <article key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] bg-white p-4"><div><h3 className="text-sm font-semibold text-[#354237]">{record.feedType} feed - {record.flock}</h3><p className="mt-1 text-xs text-[#788174]">{record.date}{record.notes ? ` - ${record.notes}` : ""}</p></div><span className="text-sm font-semibold text-[#547253]">{record.quantityKg.toLocaleString()} kg</span></article>)}{!records.length && <p className="rounded-xl bg-white p-5 text-sm text-[#788174]">No feed use recorded yet.</p>}</section></div>;
}
