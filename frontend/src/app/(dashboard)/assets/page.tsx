import Link from "next/link";

const assets = [
    { name: "Feed mixer", quantity: 1, status: "Functional", value: "₦320,000" },
    { name: "Water tank", quantity: 3, status: "Functional", value: "₦180,000" },
    { name: "Generator", quantity: 1, status: "Needs repair", value: "₦410,000" },
];

export default function AssetsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Assets</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">Farm assets</h2>
                </div>
                <Link href="/assets/new" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    Add asset
                </Link>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
                {assets.map((asset) => (
                    <div key={asset.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">{asset.name}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${asset.status === "Functional" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {asset.status}
                            </span>
                        </div>

                        <dl className="mt-4 space-y-3 text-sm text-slate-600">
                            <div className="flex justify-between gap-3">
                                <dt>Quantity</dt>
                                <dd className="font-medium text-slate-900">{asset.quantity}</dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt>Estimated value</dt>
                                <dd className="font-medium text-slate-900">{asset.value}</dd>
                            </div>
                        </dl>
                    </div>
                ))}
            </section>
        </div>
    );
}
