const settings = [
    { label: "Personal profile", value: "Update account information" },
    { label: "Notification preferences", value: "Manage reminders and alerts" },
    { label: "Security", value: "Password and account security" },
    { label: "Privacy", value: "Consent and data-sharing controls" },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Settings</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Account settings</h2>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                    {settings.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-medium text-slate-900">{item.label}</p>
                                <p className="text-sm text-slate-500">{item.value}</p>
                            </div>
                            <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
