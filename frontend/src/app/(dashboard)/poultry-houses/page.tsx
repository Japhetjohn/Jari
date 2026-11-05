"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Droplets, Warehouse, X } from "lucide-react";
import { getPoultryHouses } from "@/lib/simulated-data";

export default function PoultryHousesPage() {
    const [houses, setHouses] = useState<any[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<any | null>(null);

    useEffect(() => {
        setHouses(getPoultryHouses());
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Your farm</p>
                    <h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farm houses</h2>
                </div>
                <Link
                    href="/poultry-houses/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193d2b]"
                >
                    Add house
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {houses.map((house) => (
                    <button type="button" key={house.name} onClick={() => setSelectedHouse(house)} className="group rounded-[1.25rem] bg-white p-5 text-left transition-colors hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a]">
                        <div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Warehouse size={17} /></span><ArrowUpRight size={16} className="text-[#879182] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
                        <h3 className="mt-4 font-serif text-xl font-medium text-[#29352a]">{house.name}</h3>
                        <p className="mt-1 text-xs text-[#788174]">{house.system} - holds up to {house.capacity} birds</p>
                        <span className="mt-4 inline-flex text-[10px] font-semibold text-[#547253]">View house details</span>
                    </button>
                ))}
            </div>

            {selectedHouse && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedHouse(null); }}><section role="dialog" aria-modal="true" aria-labelledby="house-detail-title" className="w-full max-w-lg rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Farm house details</p><h3 id="house-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{selectedHouse.name}</h3></div><button type="button" onClick={() => setSelectedHouse(null)} aria-label="Close house details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div><dl className="mt-5 grid gap-2 sm:grid-cols-2">{[{ label: "Housing type", value: selectedHouse.system }, { label: "Birds it can hold", value: `${selectedHouse.capacity} birds` }, { label: "Water source", value: selectedHouse.water }, { label: "Feed storage", value: selectedHouse.feedStorage ? "Available" : "Not available" }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 text-sm font-medium text-[#354237]">{item.value}</dd></div>)}</dl><p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#788174]"><Droplets size={14} className="mt-0.5 shrink-0 text-[#688363]" />Use these details to plan which birds are kept in each house.</p></section></div>}
        </div>
    );
}
