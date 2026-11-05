"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpenseRecord } from "@/services";

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
    const router = useRouter();
    const [error, setError] = useState("");

    const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Expenses</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Add operating expense</h2>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); try { addExpenseRecord({ date: form.expenseDate, category: form.category, amount: Number(form.amount) || 0, amountPaid: Number(form.amountPaid) || 0, flock: form.flock }); router.push("/expenses"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save this expense."); } }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
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

                    <p className="self-end text-sm text-slate-600">Balance remaining: ₦{Math.max(0, Number(form.amount || 0) - Number(form.amountPaid || 0)).toLocaleString()}</p>
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
