const reports = [
    { name: "Farm business profile", updated: "29 Oct 2026", status: "Ready" },
    { name: "Production summary", updated: "28 Oct 2026", status: "Ready" },
    { name: "Financial snapshot", updated: "25 Oct 2026", status: "Draft" },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Reports</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Business reports</h2>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex justify-end">
                    <button className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Generate report
                    </button>
                </div>

                <div className="space-y-3">
                    {reports.map((report) => (
                        <div key={report.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div>
                                <p className="font-medium text-slate-900">{report.name}</p>
                                <p className="text-sm text-slate-500">Updated {report.updated}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${report.status === "Ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {report.status}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
