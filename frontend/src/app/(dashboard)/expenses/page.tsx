import Link from "next/link";

const summary = [
    { label: "Operating expenses", value: "₦860k" },
    { label: "Outstanding bills", value: "₦210k" },
    { label: "Feed expenses", value: "₦540k" },
    { label: "Labour & utilities", value: "₦320k" },
];

const entries = [
    { date: "06 Oct 2026", category: "Labour", amount: "₦120,000" },
    { date: "14 Oct 2026", category: "Utilities", amount: "₦58,000" },
    { date: "20 Oct 2026", category: "Veterinary", amount: "₦76,500" },
];

export default function ExpensesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Expenses</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Operating expenses</h2>
                </div>
                <Link href="/expenses/new" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    Add expense
                </Link>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summary.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
                    </div>
                ))}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Recent expenses</h3>
                <div className="mt-4 space-y-3">
                    {entries.map((entry) => (
                        <div key={`${entry.date}-${entry.category}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-900">{entry.category}</p>
                                <p className="text-sm text-slate-500">{entry.date}</p>
                            </div>
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                {entry.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
