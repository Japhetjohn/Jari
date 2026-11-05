const cards = [
    { label: "Feed efficiency", value: "1.48" },
    { label: "Revenue growth", value: "+18%" },
    { label: "Mortality trend", value: "-2.1%" },
    { label: "Data confidence", value: "82%" },
];

const revenue = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 140 },
    { month: "Mar", value: 135 },
    { month: "Apr", value: 170 },
    { month: "May", value: 210 },
    { month: "Jun", value: 240 },
];

const feed = [
    { month: "Jan", value: 70 },
    { month: "Feb", value: 82 },
    { month: "Mar", value: 79 },
    { month: "Apr", value: 88 },
    { month: "May", value: 95 },
    { month: "Jun", value: 102 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Analytics</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Farm performance dashboard</h2>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Revenue trend</h3>
                    <div className="mt-4 flex h-48 items-end gap-3">
                        {revenue.map((item) => (
                            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-t-xl bg-emerald-500"
                                    style={{ height: `${item.value}%` }}
                                />
                                <span className="text-xs text-slate-500">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Feed cost trend</h3>
                    <div className="mt-4 flex h-48 items-end gap-3">
                        {feed.map((item) => (
                            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-t-xl bg-amber-400"
                                    style={{ height: `${item.value}%` }}
                                />
                                <span className="text-xs text-slate-500">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
