const incidents = [
    { date: "07 Oct 2026", flock: "Broiler Batch 02", symptoms: "Lethargy and reduced feed intake", outcome: "Monitoring" },
    { date: "15 Oct 2026", flock: "Layer Batch 05", symptoms: "Reduced egg output", outcome: "Resolved" },
];

export default function HealthIncidentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Health</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Health incidents</h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex justify-end">
                    <button className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Add incident
                    </button>
                </div>

                <div className="space-y-3">
                    {incidents.map((incident) => (
                        <div key={`${incident.date}-${incident.flock}`} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4 md:items-center">
                            <div>
                                <p className="text-sm text-slate-500">Date</p>
                                <p className="mt-1 font-medium text-slate-900">{incident.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Flock</p>
                                <p className="mt-1 font-medium text-slate-900">{incident.flock}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Symptoms</p>
                                <p className="mt-1 font-medium text-slate-900">{incident.symptoms}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Outcome</p>
                                <p className="mt-1 font-medium text-slate-900">{incident.outcome}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
