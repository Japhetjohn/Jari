const notifications = [
    { title: "Vaccination reminder", detail: "Newcastle vaccine is due in 3 days.", time: "2 hours ago" },
    { title: "Feed stock update", detail: "Starter feed inventory is running low.", time: "Today" },
    { title: "Opportunity match", detail: "A poultry expansion grant matches your farm profile.", time: "Yesterday" },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Notifications</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Farm updates</h2>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div key={notification.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{notification.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{notification.detail}</p>
                                </div>
                                <span className="text-xs text-slate-500">{notification.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
