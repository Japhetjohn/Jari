"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFarmAsset } from "@/services";

const initialForm = {
    assetName: "",
    quantity: "",
    ownershipStatus: "Owned",
    operationalCondition: "Functional",
    estimatedValue: "",
};

export default function NewAssetPage() {
    const [form, setForm] = useState(initialForm);
    const router = useRouter();
    const [error, setError] = useState("");
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setError("");
        const quantity = Number(form.quantity); const value = Number(form.estimatedValue || 0);
        if (!form.assetName.trim() || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(value) || value < 0) { setError("Enter an equipment name, whole number of items and a valid value."); return; }
        try {
            addFarmAsset({ name: form.assetName.trim(), quantity, status: form.operationalCondition === "Functional" ? "Working" : "Needs repair", value, notes: `${form.ownershipStatus} equipment${form.operationalCondition === "Non-functional" ? "; non-functional" : ""}.` });
            router.push("/assets");
        } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this equipment."); }
    };

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Assets</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Add farm asset</h2>
            </div>

            <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="label-text">Asset name/type</label>
                        <input
                            className="input-shell"
                            required
                            value={form.assetName}
                            onChange={(event) => handleChange("assetName", event.target.value)}
                            placeholder="Feed mixer"
                        />
                    </div>

                    <div>
                        <label className="label-text">Quantity</label>
                        <input
                            type="number"
                            min={0}
                            required
                            step={1}
                            className="input-shell"
                            value={form.quantity}
                            onChange={(event) => handleChange("quantity", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Ownership status</label>
                        <select
                            className="input-shell"
                            value={form.ownershipStatus}
                            onChange={(event) => handleChange("ownershipStatus", event.target.value)}
                        >
                            <option>Owned</option>
                            <option>Leased</option>
                            <option>Rented</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Operational condition</label>
                        <select
                            className="input-shell"
                            value={form.operationalCondition}
                            onChange={(event) => handleChange("operationalCondition", event.target.value)}
                        >
                            <option>Functional</option>
                            <option>Needs repair</option>
                            <option>Non-functional</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="label-text">Estimated value</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            className="input-shell"
                            value={form.estimatedValue}
                            onChange={(event) => handleChange("estimatedValue", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Save asset
                    </button>
                </div>
            </form>
        </div>
    );
}
