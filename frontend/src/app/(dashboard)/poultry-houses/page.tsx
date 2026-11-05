"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPoultryHouses } from "@/lib/simulated-data";

export default function PoultryHousesPage() {
    const [houses, setHouses] = useState<any[]>([]);

    useEffect(() => {
        setHouses(getPoultryHouses());
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Infrastructure</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Poultry houses</h2>
                </div>
                <Link
                    href="/poultry-houses/new"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                    Add house
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {houses.map((house) => (
                    <div key={house.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">{house.name}</h3>
                            <span className="pill">{house.system}</span>
                        </div>

                        <dl className="mt-4 space-y-3 text-sm text-slate-600">
                            <div className="flex justify-between gap-3">
                                <dt>Max capacity</dt>
                                <dd className="font-medium text-slate-900">{house.capacity} birds</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt>Water source</dt>
                                <dd className="font-medium text-slate-900">{house.water}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt>Feed storage</dt>
                                <dd className="font-medium text-slate-900">{house.feedStorage ? "Available" : "Not available"}</dd>
                            </div>
                        </dl>
                    </div>
                ))}
            </div>
        </div>
    );
}
