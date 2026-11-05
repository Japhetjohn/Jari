"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3 } from "lucide-react";
import { getSavedSession } from "@/lib/auth";
import { getInstitutionRegistration } from "@/services";
import type { InstitutionRegistrationRecord } from "@/services";

export function InstitutionApplicationStatus() {
  const [application, setApplication] = useState<InstitutionRegistrationRecord | null>(null);
  useEffect(() => {
    const refresh = () => { const session = getSavedSession(); setApplication(session?.role === "institutional_user" ? getInstitutionRegistration(session.id) : null); };
    refresh();
    window.addEventListener("jari:mock-data-changed", refresh);
    return () => window.removeEventListener("jari:mock-data-changed", refresh);
  }, []);
  if (!application) return null;
  return <section className="mx-auto mb-5 flex max-w-5xl flex-col gap-3 rounded-2xl bg-[#edf2e9] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex items-start gap-3"><span className="mt-0.5 text-[#577753]"><Clock3 size={18} /></span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-[#304032]">{application.organisationName}</h2><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#547253]">{application.status}</span></div><p className="mt-1 text-xs leading-5 text-[#697668]">Your institution details were submitted in this browser demo on {new Date(application.submittedAt).toLocaleDateString("en-NG")}.</p></div></div>
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">{application.categories.map((category) => <span key={category} className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] text-[#53674f]">{category}</span>)}<span className="flex items-center gap-1 text-[10px] text-[#798375]"><CheckCircle2 size={12} /> Application saved locally</span></div>
  </section>;
}
