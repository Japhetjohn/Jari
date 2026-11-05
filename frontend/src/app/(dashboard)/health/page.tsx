import Link from "next/link";

const cards = [
    { label: "Vaccinations due", value: "3" },
    { label: "Health incidents", value: "2" },
    { label: "Mortality this month", value: "42 birds" },
    { label: "Treatment coverage", value: "94%" },
];

const items = [
    { title: "Newcastle vaccine", status: "Scheduled" },
    { title: "Gumboro review", status: "Pending" },
    { title: "Mortality check", status: "Resolved" },
];

export default function HealthPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Health</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Poultry health</h2>
                </div>
                <div className="flex gap-3">
                    <Link href="/health/vaccinations" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                        Vaccinations
                    </Link>
                    <Link href="/health/incidents" className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Record incident
                    </Link>
                </div>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
                    </div>
                ))}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Recent health activity</h3>
                <div className="mt-4 space-y-3">
                    {items.map((item) => (
                        <div key={item.title} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
