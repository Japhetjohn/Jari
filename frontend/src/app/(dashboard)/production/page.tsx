import Link from "next/link";

const cards = [
    { label: "Layer egg output", value: "1,340 eggs" },
    { label: "Average bird weight", value: "2.6 kg" },
    { label: "Ready for sale", value: "680 birds" },
    { label: "Production rate", value: "89%" },
];

const entries = [
    { date: "10 Oct", type: "Layer", output: "320 eggs" },
    { date: "12 Oct", type: "Broiler", output: "280 birds ready" },
    { date: "18 Oct", type: "Layer", output: "410 eggs" },
];

export default function ProductionPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Production</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Production records</h2>
                </div>
                <Link
                    href="/production/new"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                    Log production
                </Link>
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
                <h3 className="text-lg font-semibold text-slate-900">Recent production</h3>
                <div className="mt-4 space-y-3">
                    {entries.map((entry) => (
                        <div key={`${entry.date}-${entry.type}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-900">{entry.type}</p>
                                <p className="text-sm text-slate-500">{entry.date}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {entry.output}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
