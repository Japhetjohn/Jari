"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPoultryHouses, savePoultryHouses } from "@/lib/simulated-data";

const initialForm = {
    houseName: "",
    housingSystem: "Deep litter",
    maximumCapacity: "",
    waterSource: "Borehole",
    ventilation: "Natural ventilation",
    feedStorage: true,
};

export default function NewPoultryHousePage() {
    const router = useRouter();
    const [form, setForm] = useState(initialForm);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const houses = getPoultryHouses();
        const nextHouse = {
            name: form.houseName || `House ${houses.length + 1}`,
            system: form.housingSystem,
            capacity: Number(form.maximumCapacity) || 0,
            water: form.waterSource,
            feedStorage: form.feedStorage,
        };
        savePoultryHouses([...houses, nextHouse]);
        router.push("/poultry-houses");
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Infrastructure</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Add poultry house</h2>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-text">House name or reference</label>
                        <input
                            className="input-shell"
                            value={form.houseName}
                            onChange={(event) => handleChange("houseName", event.target.value)}
                            placeholder="House A"
                        />
                    </div>

                    <div>
                        <label className="label-text">Housing system</label>
                        <select
                            className="input-shell"
                            value={form.housingSystem}
                            onChange={(event) => handleChange("housingSystem", event.target.value)}
                        >
                            <option>Deep litter</option>
                            <option>Battery cage</option>
                            <option>Free range</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Maximum bird capacity</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.maximumCapacity}
                            onChange={(event) => handleChange("maximumCapacity", event.target.value)}
                            placeholder="1500"
                        />
                    </div>

                    <div>
                        <label className="label-text">Water source</label>
                        <select
                            className="input-shell"
                            value={form.waterSource}
                            onChange={(event) => handleChange("waterSource", event.target.value)}
                        >
                            <option>Borehole</option>
                            <option>Well</option>
                            <option>Municipal supply</option>
                            <option>Surface water</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Ventilation type</label>
                        <select
                            className="input-shell"
                            value={form.ventilation}
                            onChange={(event) => handleChange("ventilation", event.target.value)}
                        >
                            <option>Natural ventilation</option>
                            <option>Mechanical ventilation</option>
                            <option>Hybrid system</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <label className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700">
                            Feed storage availability
                            <input
                                type="checkbox"
                                checked={form.feedStorage}
                                onChange={(event) => handleChange("feedStorage", event.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        Save poultry house
                    </button>
                </div>
            </form>
        </div>
    );
}
