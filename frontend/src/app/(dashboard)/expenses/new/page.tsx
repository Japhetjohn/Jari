"use client";

import { useState } from "react";

const initialForm = {
    flock: "Broiler Batch 02",
    expenseDate: "",
    category: "Feed",
    amount: "",
    amountPaid: "",
    outstanding: "",
};

export default function NewExpensePage() {
    const [form, setForm] = useState(initialForm);

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Expenses</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Add operating expense</h2>
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
                        <label className="label-text">Expense date</label>
                        <input
                            type="date"
                            className="input-shell"
                            value={form.expenseDate}
                            onChange={(event) => handleChange("expenseDate", event.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label-text">Expense category</label>
                        <select
                            className="input-shell"
                            value={form.category}
                            onChange={(event) => handleChange("category", event.target.value)}
                        >
                            <option>Feed</option>
                            <option>Vaccination</option>
                            <option>Veterinary services</option>
                            <option>Labour</option>
                            <option>Electricity and fuel</option>
                            <option>Water</option>
                            <option>Maintenance and repairs</option>
                            <option>Other operating expenses</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Expense amount</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.amount}
                            onChange={(event) => handleChange("amount", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="label-text">Amount paid</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.amountPaid}
                            onChange={(event) => handleChange("amountPaid", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="label-text">Outstanding balance</label>
                        <input
                            type="number"
                            min={0}
                            className="input-shell"
                            value={form.outstanding}
                            onChange={(event) => handleChange("outstanding", event.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Save expense
                    </button>
                </div>
            </form>
        </div>
    );
}
