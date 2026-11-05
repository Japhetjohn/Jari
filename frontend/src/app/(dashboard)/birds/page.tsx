"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFlockRecords } from "@/lib/simulated-data";

export default function BirdsPage() {
    const [flocks, setFlocks] = useState<any[]>([]);

    useEffect(() => {
        setFlocks(getFlockRecords());
    }, []);

    const totalBirds = flocks.reduce((sum, flock) => sum + Number(flock.birds || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Birds</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Flock management</h2>
                </div>
                <Link
                    href="/birds/new"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                    Add flock
                </Link>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Total active birds</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{totalBirds.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Production cycles</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{flocks.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Mortality rate</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">3.2%</p>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Current flocks</h3>
                <div className="mt-4 space-y-3">
                    {flocks.map((flock) => (
                        <div key={flock.name} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-base font-semibold text-slate-900">{flock.name}</p>
                                <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                                    <span>{flock.type}</span>
                                    <span>•</span>
                                    <span>{flock.house}</span>
                                    <span>•</span>
                                    <span>{flock.birds} birds</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${flock.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                                    {flock.status}
                                </span>
                                <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
