"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Droplets, Warehouse, X } from "lucide-react";
import { archivePoultryHouse, getFlockRecords, getPoultryHouses, updatePoultryHouse } from "@/services";
import type { FarmHouseRecord } from "@/services";

export default function PoultryHousesPage() {
    const [houses, setHouses] = useState<FarmHouseRecord[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<FarmHouseRecord | null>(null);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<FarmHouseRecord | null>(null);
    const [error, setError] = useState("");
    const [birdCounts, setBirdCounts] = useState<Record<string, number>>({});

    const refresh = () => {
        setHouses(getPoultryHouses().filter((house) => !house.archived));
        const counts = getFlockRecords().reduce<Record<string, number>>((values, flock) => {
            if (flock.status === "Active") values[flock.house] = (values[flock.house] || 0) + flock.birds;
            return values;
        }, {});
        setBirdCounts(counts);
    };
    useEffect(refresh, []);

    const saveEdit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedHouse || !draft) return;
        try {
            updatePoultryHouse(selectedHouse.name, draft);
            setSelectedHouse(draft);
            setEditing(false);
            setError("");
            refresh();
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "We could not update this farm house.");
        }
    };

    const archiveSelected = () => {
        if (!selectedHouse || !window.confirm(`Archive ${selectedHouse.name}?`)) return;
        try {
            archivePoultryHouse(selectedHouse.name);
            setSelectedHouse(null);
            refresh();
        } catch (archiveError) {
            setError(archiveError instanceof Error ? archiveError.message : "This farm house could not be archived.");
        }
    };

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
                    <button type="button" key={house.name} onClick={() => { setSelectedHouse(house); setDraft(house); setEditing(false); setError(""); }} className="group rounded-[1.25rem] bg-white p-5 text-left transition-colors hover:bg-[#f0f3ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#76916a]">
                        <div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><Warehouse size={17} /></span><ArrowUpRight size={16} className="text-[#879182] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
                        <h3 className="mt-4 font-serif text-xl font-medium text-[#29352a]">{house.name}</h3>
                        <p className="mt-1 text-xs text-[#788174]">{house.system} - {birdCounts[house.name] || 0} birds of {house.capacity}</p>
                        <span className="mt-4 inline-flex text-[10px] font-semibold text-[#547253]">View house details</span>
                    </button>
                ))}
            </div>

            {selectedHouse && draft && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17231a]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedHouse(null); }}><section role="dialog" aria-modal="true" aria-labelledby="house-detail-title" className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-[#fbfcf8] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Farm house details</p><h3 id="house-detail-title" className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{editing ? "Update farm house" : selectedHouse.name}</h3></div><button type="button" onClick={() => { setSelectedHouse(null); setEditing(false); }} aria-label="Close house details" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><X size={17} /></button></div>{editing ? <form onSubmit={saveEdit} className="mt-5 space-y-3"><label className="label-text block">House name<input required maxLength={80} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label className="label-text block">Housing type<input required value={draft.system} onChange={(event) => setDraft({ ...draft, system: event.target.value })} /></label><div className="grid grid-cols-2 gap-3"><label className="label-text block">Capacity in birds<input required min="1" type="number" value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: Number(event.target.value) })} /></label><label className="label-text block">Water source<input value={draft.water} onChange={(event) => setDraft({ ...draft, water: event.target.value })} /></label></div><label className="label-text block">Ventilation<input value={draft.ventilation ?? ""} onChange={(event) => setDraft({ ...draft, ventilation: event.target.value })} /></label><label className="label-text flex items-center gap-2">Feed storage<input type="checkbox" checked={draft.feedStorage} onChange={(event) => setDraft({ ...draft, feedStorage: event.target.checked })} /></label><label className="label-text block">Notes<textarea value={draft.notes ?? ""} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>{error && <p role="alert" className="rounded-xl bg-[#fbefeb] p-3 text-xs text-[#9a493c]">{error}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={() => { setDraft(selectedHouse); setEditing(false); }} className="min-h-10 rounded-full px-4 text-xs font-semibold text-[#657061]">Cancel</button><button className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Save changes</button></div></form> : <><dl className="mt-5 grid gap-2 sm:grid-cols-2">{[{ label: "Housing type", value: selectedHouse.system }, { label: "Birds in this house", value: `${birdCounts[selectedHouse.name] || 0} of ${selectedHouse.capacity}` }, { label: "Water source", value: selectedHouse.water }, { label: "Feed storage", value: selectedHouse.feedStorage ? "Available" : "Not available" }, { label: "Ventilation", value: selectedHouse.ventilation || "Not recorded" }, { label: "Notes", value: selectedHouse.notes || "No notes added" }].map((item) => <div key={item.label} className="rounded-xl bg-[#f1f4ed] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 text-sm font-medium text-[#354237]">{item.value}</dd></div>)}</dl><p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#788174]"><Droplets size={14} className="mt-0.5 shrink-0 text-[#688363]" />Use these details to plan which birds are kept in each house.</p>{error && <p role="alert" className="mt-3 text-xs text-[#9a493c]">{error}</p>}<div className="mt-5 flex gap-2"><button type="button" onClick={() => { setDraft(selectedHouse); setEditing(true); }} className="min-h-10 flex-1 rounded-full bg-[#244b35] text-xs font-semibold text-white">Edit house details</button><button type="button" onClick={archiveSelected} className="min-h-10 rounded-full bg-[#f4eddd] px-4 text-xs font-semibold text-[#8a7141]">Archive</button></div></>}</section></div>}
        </div>
    );
}
