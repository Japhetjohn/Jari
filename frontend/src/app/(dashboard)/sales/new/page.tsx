"use client";

import { useState } from "react";

const initialForm = {
    flock: "Broiler Batch 02",
    salesDate: "",
    product: "Live birds",
    quantity: "",
    unitMeasurement: "Birds",
    unitPrice: "",
    totalAmount: "",
    amountReceived: "",
};

export default function NewSalePage() {
    const [form, setForm] = useState(initialForm);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Sales</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Record a sale</h2>
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
                        <label className="label-text">Sales date</label>
                        <input
                            type="date"
                            className="input-shell"
                            value={form.salesDate}
                            onChange={(event) => handleChange("salesDate", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Product sold</label>
                        <select
                            className="input-shell"
                            value={form.product}
                            onChange={(event) => handleChange("product", event.target.value)}
                        >
                            <option>Live birds</option>
                            <option>Eggs</option>
                            <option>Manure</option>
                            <option>Other poultry products</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Quantity sold</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.quantity}
                            onChange={(event) => handleChange("quantity", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Unit of measurement</label>
                        <select
                            className="input-shell"
                            value={form.unitMeasurement}
                            onChange={(event) => handleChange("unitMeasurement", event.target.value)}
                        >
                            <option>Birds</option>
                            <option>Crates</option>
                            <option>Trays</option>
                            <option>Kg</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Unit selling price</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.unitPrice}
                            onChange={(event) => handleChange("unitPrice", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="label-text">Total sales amount</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.totalAmount}
                            onChange={(event) => handleChange("totalAmount", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="label-text">Amount received</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.amountReceived}
                            onChange={(event) => handleChange("amountReceived", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Save sale
                    </button>
                </div>
            </form>
        </div>
    );
}
