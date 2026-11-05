const opportunities = [
    { name: "Poultry Expansion Grant", type: "Grant", match: "High match" },
    { name: "Working Capital Facility", type: "Loan", match: "Medium match" },
    { name: "Broiler Health Insurance", type: "Insurance", match: "Medium match" },
];

export default function OpportunitiesPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Opportunities</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Funding and insurance opportunities</h2>
            </div>

            <section className="space-y-4">
                {opportunities.map((opportunity) => (
                    <div key={opportunity.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-slate-900">{opportunity.name}</p>
                                <p className="mt-1 text-sm text-slate-500">{opportunity.type}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {opportunity.match}
                            </span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
