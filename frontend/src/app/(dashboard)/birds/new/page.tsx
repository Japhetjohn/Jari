"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createFlockRecord, getPoultryHouses } from "@/services";
import type { FarmHouseRecord } from "@/services";

const initialForm = {
    flockName: "",
    poultryType: "Broiler",
    breed: "",
    house: "House A",
    acquisitionDate: "",
    source: "",
    initialBirds: "",
    ageAtAcquisition: "",
    ageUnit: "Days",
    purchaseCost: "",
    cycleStart: "",
};

export default function NewBirdsPage() {
    const router = useRouter();
    const [form, setForm] = useState(initialForm);
    const [houses, setHouses] = useState<FarmHouseRecord[]>([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { setHouses(getPoultryHouses()); }, []);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await createFlockRecord({
                name: form.flockName,
                type: form.poultryType,
                breed: form.breed,
                house: form.house,
                birds: Number(form.initialBirds),
                acquisitionDate: form.acquisitionDate,
                cycleStart: form.cycleStart || form.acquisitionDate,
                source: form.source,
                ageAtAcquisition: Number(form.ageAtAcquisition) || undefined,
                ageUnit: form.ageUnit,
                purchaseCost: Number(form.purchaseCost) || 0,
            });
            router.push("/birds");
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "We could not save this bird group.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Birds</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Register a new flock</h2>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-text">Flock reference/name</label>
                        <input
                            className="input-shell"
                            required
                            value={form.flockName}
                            onChange={(event) => handleChange("flockName", event.target.value)}
                            placeholder="Broiler Batch 03"
                        />
                    </div>

                    <div>
                        <label className="label-text">Poultry type</label>
                        <select
                            className="input-shell"
                            required
                            value={form.poultryType}
                            onChange={(event) => handleChange("poultryType", event.target.value)}
                        >
                            <option>Broiler</option>
                            <option>Layer</option>
                            <option>Breeder</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Breed/strain</label>
                        <input
                            className="input-shell"
                            value={form.breed}
                            onChange={(event) => handleChange("breed", event.target.value)}
                            placeholder="Ross 308"
                        />
                    </div>

                    <div>
                        <label className="label-text">Poultry house</label>
                        <select
                            className="input-shell"
                            value={form.house}
                            onChange={(event) => handleChange("house", event.target.value)}
                        >
                            {houses.map((house) => <option key={house.name}>{house.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Acquisition date</label>
                        <input
                            type="date"
                            className="input-shell"
                            required
                            value={form.acquisitionDate}
                            onChange={(event) => handleChange("acquisitionDate", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Source of birds</label>
                        <input
                            className="input-shell"
                            value={form.source}
                            onChange={(event) => handleChange("source", event.target.value)}
                            placeholder="Local hatchery"
                        />
                    </div>

                    <div>
                        <label className="label-text">Initial number of birds</label>
                        <input
                            type="number"
                            min={1}
                            required
                            className="input-shell"
                            value={form.initialBirds}
                            onChange={(event) => handleChange("initialBirds", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Age at acquisition</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.ageAtAcquisition}
                            onChange={(event) => handleChange("ageAtAcquisition", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Age unit</label>
                        <select
                            className="input-shell"
                            value={form.ageUnit}
                            onChange={(event) => handleChange("ageUnit", event.target.value)}
                        >
                            <option>Days</option>
                            <option>Weeks</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Initial purchase cost</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.purchaseCost}
                            onChange={(event) => handleChange("purchaseCost", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="label-text">Cycle start date</label>
                        <input
                            type="date"
                            className="input-shell"
                            value={form.cycleStart}
                            onChange={(event) => handleChange("cycleStart", event.target.value)}
                        />
                    </div>
                </div>

                {error && <p role="alert" className="mt-4 rounded-xl bg-[#fbefeb] px-4 py-3 text-sm text-[#9a493c]">{error}</p>}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                        Save flock
                    </button>
                </div>
            </form>
        </div>
    );
}
