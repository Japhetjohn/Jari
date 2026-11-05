const purchases = [
    { date: "12 Oct 2026", feedType: "Starter", brand: "Top Feed", qty: "120 bags", amount: "₦240,000" },
    { date: "18 Oct 2026", feedType: "Finisher", brand: "Unique Feeds", qty: "90 bags", amount: "₦180,000" },
    { date: "29 Oct 2026", feedType: "Grower", brand: "Tropical Feed", qty: "80 bags", amount: "₦120,000" },
];

export default function FeedPurchasesPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Feed</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Feed purchases</h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex justify-end">
                    <button className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                        Add purchase
                    </button>
                </div>

                <div className="space-y-3">
                    {purchases.map((purchase) => (
                        <div key={`${purchase.date}-${purchase.feedType}`} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-5 md:items-center">
                            <div>
                                <p className="text-sm text-slate-500">Date</p>
                                <p className="mt-1 font-medium text-slate-900">{purchase.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Feed type</p>
                                <p className="mt-1 font-medium text-slate-900">{purchase.feedType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Brand</p>
                                <p className="mt-1 font-medium text-slate-900">{purchase.brand}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Quantity</p>
                                <p className="mt-1 font-medium text-slate-900">{purchase.qty}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Amount</p>
                                <p className="mt-1 font-medium text-slate-900">{purchase.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
