import Link from "next/link";

const summary = [
    { label: "Total sales", value: "₦2.4M" },
    { label: "Live birds sold", value: "1,150" },
    { label: "Egg revenue", value: "₦920k" },
    { label: "Outstanding sales", value: "₦260k" },
];

const entries = [
    { date: "08 Oct 2026", item: "Live broilers", amount: "₦360,000" },
    { date: "16 Oct 2026", item: "Eggs", amount: "₦200,000" },
    { date: "24 Oct 2026", item: "Manure", amount: "₦70,000" },
];

export default function SalesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Sales</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Sales and revenue</h2>
                </div>
                <Link href="/sales/new" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    Add sale
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
                <h3 className="text-lg font-semibold text-slate-900">Recent sales</h3>
                <div className="mt-4 space-y-3">
                    {entries.map((entry) => (
                        <div key={`${entry.date}-${entry.item}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-900">{entry.item}</p>
                                <p className="text-sm text-slate-500">{entry.date}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {entry.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
