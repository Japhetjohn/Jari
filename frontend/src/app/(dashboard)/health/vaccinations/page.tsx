const records = [
    { vaccine: "Newcastle disease vaccine", date: "12 Oct 2026", coverage: "1,200 birds", status: "Administered" },
    { vaccine: "Infectious bronchitis", date: "21 Oct 2026", coverage: "1,450 birds", status: "Scheduled" },
    { vaccine: "Gumboro vaccine", date: "03 Nov 2026", coverage: "1,360 birds", status: "Due" },
];

export default function VaccinationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Health</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Vaccination records</h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex justify-end">
                    <button className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Add vaccination
                    </button>
                </div>

                <div className="space-y-3">
                    {records.map((record) => (
                        <div key={`${record.vaccine}-${record.date}`} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4 md:items-center">
                            <div>
                                <p className="text-sm text-slate-500">Vaccine</p>
                                <p className="mt-1 font-medium text-slate-900">{record.vaccine}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Date</p>
                                <p className="mt-1 font-medium text-slate-900">{record.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Coverage</p>
                                <p className="mt-1 font-medium text-slate-900">{record.coverage}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Status</p>
                                <p className="mt-1 font-medium text-slate-900">{record.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
