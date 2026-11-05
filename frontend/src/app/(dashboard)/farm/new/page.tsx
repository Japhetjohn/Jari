"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultFarmProfile, getFarmProfile, saveFarmProfile } from "@/services";

const initialForm = {
    farmName: "",
    ownerName: "",
    phone: "",
    community: "",
    lga: "",
    state: "Plateau",
    establishmentDate: "",
    operationType: "Broiler",
    productionSystem: "Deep litter",
    numberOfHouses: "",
    waterSource: "Borehole",
    numberOfWorkers: "",
    biosecurity: [] as string[],
};

export default function NewFarmPage() {
    const router = useRouter();
    const [form, setForm] = useState(initialForm);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const existing = getFarmProfile();
        setForm({ ...initialForm, ...existing, biosecurity: existing.biosecurity ?? [] });
    }, []);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const toggleBiosecurity = (value: string) => {
        const updated = form.biosecurity.includes(value)
            ? form.biosecurity.filter((item) => item !== value)
            : [...form.biosecurity, value];

        setForm((previous) => ({ ...previous, biosecurity: updated }));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        saveFarmProfile({ ...form, biosecurity: form.biosecurity });
        setIsSaved(true);
        window.setTimeout(() => {
            router.push("/farm");
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Farm onboarding</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Register a new farm</h2>
            </div>

            <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-text">Farm name</label>
                        <input
                            className="input-shell"
                            value={form.farmName}
                            onChange={(event) => handleChange("farmName", event.target.value)}
                            placeholder="Golden Feathers Poultry"
                        />
                    </div>

                    <div>
                        <label className="label-text">Farm owner</label>
                        <input
                            className="input-shell"
                            value={form.ownerName}
                            onChange={(event) => handleChange("ownerName", event.target.value)}
                            placeholder="Amina Daniel"
                        />
                    </div>

                    <div>
                        <label className="label-text">Phone number</label>
                        <input
                            type="tel"
                            className="input-shell"
                            value={form.phone}
                            onChange={(event) => handleChange("phone", event.target.value)}
                            placeholder="0803 000 0000"
                        />
                    </div>

                    <div>
                        <label className="label-text">State</label>
                        <input
                            className="input-shell"
                            value={form.state}
                            onChange={(event) => handleChange("state", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Community</label>
                        <input
                            className="input-shell"
                            value={form.community}
                            onChange={(event) => handleChange("community", event.target.value)}
                            placeholder="Kuru"
                        />
                    </div>

                    <div>
                        <label className="label-text">LGA</label>
                        <input
                            className="input-shell"
                            value={form.lga}
                            onChange={(event) => handleChange("lga", event.target.value)}
                            placeholder="Jos South"
                        />
                    </div>

                    <div>
                        <label className="label-text">Establishment date</label>
                        <input
                            type="date"
                            className="input-shell"
                            value={form.establishmentDate}
                            onChange={(event) => handleChange("establishmentDate", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Poultry operation type</label>
                        <select
                            className="input-shell"
                            value={form.operationType}
                            onChange={(event) => handleChange("operationType", event.target.value)}
                        >
                            <option>Broiler</option>
                            <option>Layer</option>
                            <option>Breeder</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Production system</label>
                        <select
                            className="input-shell"
                            value={form.productionSystem}
                            onChange={(event) => handleChange("productionSystem", event.target.value)}
                        >
                            <option>Deep litter</option>
                            <option>Battery cage</option>
                            <option>Free range</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Number of poultry houses</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.numberOfHouses}
                            onChange={(event) => handleChange("numberOfHouses", event.target.value)}
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

                    <div className="md:col-span-2">
                        <label className="label-text">Number of farm workers</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.numberOfWorkers}
                            onChange={(event) => handleChange("numberOfWorkers", event.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <p className="label-text">Biosecurity measures</p>
                    <div className="flex flex-wrap gap-3">
                        {[
                            "Restricted farm access",
                            "Footbath",
                            "Disinfection",
                            "Visitor control",
                            "Protective clothing",
                        ].map((measure) => {
                            const active = form.biosecurity.includes(measure);
                            return (
                                <button
                                    type="button"
                                    key={measure}
                                    onClick={() => toggleBiosecurity(measure)}
                                    className={`rounded-full border px-3 py-2 text-sm font-medium transition ${active
                                            ? "border-emerald-600 bg-emerald-600 text-white"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                        }`}
                                >
                                    {measure}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/farm")}
                        className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        {isSaved ? "Saved" : "Save farm profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
