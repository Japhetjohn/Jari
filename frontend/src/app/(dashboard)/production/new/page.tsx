"use client";

import { useState } from "react";

const initialForm = {
    flock: "Broiler Batch 02",
    recordDate: "",
    productionType: "Broiler",
    liveBirds: "",
    eggsCollected: "",
    goodEggs: "",
    damagedEggs: "",
    birdsWeighed: "",
    averageWeight: "",
    birdsReady: "",
};

export default function NewProductionPage() {
    const [form, setForm] = useState(initialForm);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Production</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Add production record</h2>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-text">Flock</label>
                        <select
                            className="input-shell"
                            value={form.flock}
                            onChange={(event) => handleChange("flock", event.target.value)}
                        >
                            <option>Broiler Batch 02</option>
                            <option>Layer Batch 05</option>
                            <option>Breeder Batch 01</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Production type</label>
                        <select
                            className="input-shell"
                            value={form.productionType}
                            onChange={(event) => handleChange("productionType", event.target.value)}
                        >
                            <option>Broiler</option>
                            <option>Layer</option>
                            <option>Breeder</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Recording date</label>
                        <input
                            type="date"
                            className="input-shell"
                            value={form.recordDate}
                            onChange={(event) => handleChange("recordDate", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Current live birds</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.liveBirds}
                            onChange={(event) => handleChange("liveBirds", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Total eggs collected</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.eggsCollected}
                            onChange={(event) => handleChange("eggsCollected", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Good eggs</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.goodEggs}
                            onChange={(event) => handleChange("goodEggs", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Damaged or rejected eggs</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.damagedEggs}
                            onChange={(event) => handleChange("damagedEggs", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Birds weighed</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.birdsWeighed}
                            onChange={(event) => handleChange("birdsWeighed", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Average bird weight (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            min={0}
                            className="input-shell"
                            value={form.averageWeight}
                            onChange={(event) => handleChange("averageWeight", event.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="label-text">Birds ready for sale</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.birdsReady}
                            onChange={(event) => handleChange("birdsReady", event.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        Save production
                    </button>
                </div>
            </form>
        </div>
    );
}
