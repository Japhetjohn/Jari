"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, CircleAlert, ClipboardCheck } from "lucide-react";
import { applyToOpportunity, getDemoDatabaseSnapshot, getInstitutionDemoAccess, getOpportunityApplications, updateOpportunityApplication } from "@/services";
import type { OpportunityApplicationRecord } from "@/services";
import { getSavedSession } from "@/lib/auth";
import { getJariProfileScore, getOpportunityRequirementChecks, type OpportunityKind } from "@/lib/opportunity-readiness";

const opportunities: Array<{ id: string; name: string; type: OpportunityKind; summary: string }> = [
  { id: "opportunity-001", name: "Poultry expansion grant", type: "Grant", summary: "Support for farmers improving housing, water systems or farm equipment." },
  { id: "opportunity-002", name: "Working capital facility", type: "Loan", summary: "Financing to help manage feed, labour and other farm running costs." },
  { id: "opportunity-003", name: "Poultry health cover", type: "Insurance", summary: "Explore cover options for poultry operations and common farm risks." },
];

export default function OpportunitiesPage() {
  const [applications, setApplications] = useState<OpportunityApplicationRecord[]>([]);
  const [snapshot, setSnapshot] = useState<ReturnType<typeof getDemoDatabaseSnapshot> | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => { setApplications(getOpportunityApplications()); setSnapshot(getDemoDatabaseSnapshot()); };
    sync(); window.addEventListener("jari:mock-data-changed", sync);
    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, []);

  const saveApplication = (item: typeof opportunities[number]) => {
    if (!snapshot) return;
    if (!getInstitutionDemoAccess().shared) { setError("Turn on profile sharing in Settings before sending an application summary to an institution."); return; }
    const checks = getOpportunityRequirementChecks(snapshot, item.type);
    const met = checks.filter((check) => check.met).map((check) => check.label);
    const missing = checks.filter((check) => !check.met).map((check) => check.label);
    const readiness = Math.round((met.length / checks.length) * 100);
    const birds = snapshot.flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0);
    try {
      applyToOpportunity({
        opportunityId: item.id,
        opportunityName: item.name,
        type: item.type,
        status: missing.length ? "Preparing" : "Submitted",
        farmerName: snapshot.farmProfile.ownerName || getSavedSession()?.fullName || "Farmer",
        farmName: snapshot.farmProfile.farmName || "Farm profile not completed",
        birdCount: birds,
        houseCount: snapshot.poultryHouses.filter((house) => !house.archived).length,
        profileScore: getJariProfileScore(snapshot),
        requirementCheck: { met, missing, readiness },
        note: missing.length ? `Requirements present: ${met.join(", ") || "none yet"}. Still needed: ${missing.join(", ")}.` : "All listed record checks are present. The institution will make its own decision.",
      });
      setError("");
      setMessage(missing.length ? "Application saved. Your missing records are listed below so you can prepare." : "Application sent to the demo institution for review.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this application.");
    }
  };

  const recheckApplication = (application: OpportunityApplicationRecord) => {
    if (!snapshot) return;
    const item = opportunities.find((opportunity) => opportunity.id === application.opportunityId);
    if (!item) return;
    const checks = getOpportunityRequirementChecks(snapshot, item.type);
    const met = checks.filter((check) => check.met).map((check) => check.label);
    const missing = checks.filter((check) => !check.met).map((check) => check.label);
    const readiness = Math.round((met.length / checks.length) * 100);
    try {
      updateOpportunityApplication(application.id, missing.length ? "Preparing" : "Submitted", missing.length ? `Still needed: ${missing.join(", ")}.` : "All listed record checks are present. The institution will make its own decision.", { requirementCheck: { met, missing, readiness }, profileScore: getJariProfileScore(snapshot) });
      setError(""); setMessage(missing.length ? "We refreshed your checklist. These records are still needed." : "Your checklist is complete and ready for the institution to review.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update the application check.");
    }
  };

  if (!snapshot) return null;
  const profileScore = getJariProfileScore(snapshot);
  return <div className="space-y-7">
    <header><p className="text-sm font-semibold uppercase tracking-[.18em] text-emerald-700">Support for your farm</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Funding and insurance</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">See which farm records each demo institution asks for. JARI shows what is present and what you may need to add before applying.</p></header>
    {(error || message) && <p role={error ? "alert" : "status"} className={`rounded-xl p-4 text-sm ${error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{error || message}</p>}
    <section className="rounded-[1.25rem] bg-[#e9efe3] p-4 sm:p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#55734f]"><ClipboardCheck size={17} /></span><div><h3 className="text-sm font-semibold text-[#344236]">Your JARI profile score: {profileScore}/100</h3><p className="mt-1 text-xs leading-5 text-[#687664]">This summarises how complete your farm records are. It is not an institution's approval decision.</p></div></div></section>
    <section className="grid gap-4 lg:grid-cols-3">{opportunities.map((item) => {
      const checks = getOpportunityRequirementChecks(snapshot, item.type);
      const metCount = checks.filter((check) => check.met).length;
      const saved = applications.find((application) => application.opportunityId === item.id);
      return <article key={item.id} className="flex flex-col rounded-[1.35rem] bg-white p-5 sm:p-6">
        <span className="w-fit rounded-full bg-[#edf2e8] px-3 py-1 text-xs font-semibold text-[#4d704c]">{item.type} · Demo programme</span>
        <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
        <div className="mt-4 rounded-xl bg-[#f5f7f2] p-4"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-800">Your record check</p><span className="text-[10px] font-semibold text-[#547253]">{metCount} of {checks.length} ready</span></div><div className="mt-3 space-y-2">{checks.map((check) => <div key={check.label} className="flex items-start gap-2 text-xs leading-5"><span className={`mt-0.5 ${check.met ? "text-[#53734f]" : "text-[#b37c35]"}`}>{check.met ? <Check size={14} /> : <CircleAlert size={14} />}</span><span className={check.met ? "text-[#61705e]" : "text-[#76684f]"}>{check.label}{!check.met && <span className="font-medium"> · add this</span>}</span></div>)}</div></div>
        {saved ? <div className="mt-4 space-y-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-[#3f6544]">{saved.status === "Preparing" ? "Checklist in progress" : saved.status === "Submitted" ? "Sent for institution review" : saved.status}</span><span className="text-[10px] text-[#7c8678]">{saved.requirementCheck?.readiness ?? metCount / checks.length * 100}% record match</span></div>{saved.requirementCheck?.missing.length ? <p className="rounded-lg bg-[#f7f3e9] p-3 text-xs leading-5 text-[#75684c]">Still needed: {saved.requirementCheck.missing.join(", ")}</p> : null}<button type="button" onClick={() => recheckApplication(saved)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#edf2e8] px-4 text-xs font-semibold text-[#35543b]">Recheck my records <ArrowRight size={13} /></button></div> : <button type="button" onClick={() => saveApplication(item)} className="mt-auto pt-5 text-left text-sm font-semibold text-emerald-800 hover:text-emerald-950">{metCount === checks.length ? "Apply with these records" : "Start application checklist"}<ArrowRight size={14} className="ml-1 inline" /></button>}
        <p className="mt-4 text-[10px] leading-4 text-[#899184]">Applying shares your name, farm name, bird and house counts, profile score and checklist with the demo institution. A record match is not a guarantee of funding, cover or selection.</p>
      </article>;
    })}</section>
    {applications.length > 0 && <section className="rounded-2xl bg-[#eaf0e5] p-5"><h3 className="text-lg font-semibold text-slate-900">Your applications</h3><p className="mt-1 text-sm text-slate-600">Track record checks and demo institution review status here.</p><div className="mt-4 space-y-2">{applications.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4"><div><p className="text-sm font-medium">{item.opportunityName}</p><p className="mt-1 text-xs text-slate-500">{item.requirementCheck?.readiness ?? 0}% of listed record checks present</p></div><span className="text-xs font-semibold text-emerald-800">{item.status}</span></div>)}</div></section>}
  </div>;
}
