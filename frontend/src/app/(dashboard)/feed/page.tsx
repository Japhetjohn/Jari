import Link from "next/link";

const summary = [
    { label: "Feed purchases", value: "₦540,000" },
    { label: "Feed consumed", value: "1,240 kg" },
    { label: "Average daily feed", value: "42 kg" },
    { label: "Cost per bird", value: "₦155" },
];

const records = [
    { type: "Purchase", item: "Starter feed", qty: "120 bags", date: "12 Oct 2026" },
    { type: "Consumption", item: "Grower feed", qty: "210 kg", date: "14 Oct 2026" },
    { type: "Purchase", item: "Finisher feed", qty: "90 bags", date: "18 Oct 2026" },
];

export default function FeedPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Feed</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Feed records</h2>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/feed/purchases"
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                        Purchases
                    </Link>
                    <Link
                        href="/feed/consumption"
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                        Log consumption
                    </Link>
                </div>
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
                <h3 className="text-lg font-semibold text-slate-900">Latest feed activity</h3>
                <div className="mt-4 space-y-3">
                    {records.map((record) => (
                        <div key={`${record.type}-${record.date}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-900">{record.item}</p>
                                <p className="text-sm text-slate-500">{record.type} • {record.date}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {record.qty}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
