const entries = [
    { date: "10 Oct 2026", feedType: "Starter", quantity: "160 kg" },
    { date: "14 Oct 2026", feedType: "Grower", quantity: "250 kg" },
    { date: "21 Oct 2026", feedType: "Finisher", quantity: "300 kg" },
];

export default function FeedConsumptionPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Feed</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Feed consumption</h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex justify-end">
                    <button className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Log consumption
                    </button>
                </div>

                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div key={`${entry.date}-${entry.feedType}`} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-slate-500">Date</p>
                                <p className="mt-1 font-medium text-slate-900">{entry.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Feed type</p>
                                <p className="mt-1 font-medium text-slate-900">{entry.feedType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Quantity consumed</p>
                                <p className="mt-1 font-medium text-slate-900">{entry.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
