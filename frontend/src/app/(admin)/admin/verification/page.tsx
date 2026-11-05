"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, MapPin, Phone, RotateCcw } from "lucide-react";
import { getKycApplication, saveKycApplication } from "@/services";
import type { KycApplication } from "@/services";

export default function VerificationPage() {
  const [application, setApplication] = useState<KycApplication | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setApplication(getKycApplication()), []);

  const updateStatus = (status: KycApplication["status"]) => {
    if (!application) return;
    const next = { ...application, status, reviewedAt: new Date().toISOString(), reviewNote: reviewNote.trim() || undefined };
    try {
      saveKycApplication(next);
      setApplication(next);
      setNotice(status === "approved" ? "Demo farm marked as verified." : "More details requested in this demo.");
      setError("");
    } catch (issue) { setError(issue instanceof Error && /quota/i.test(issue.name + issue.message) ? "Browser storage is full. Free space or download a backup before trying again." : "The review decision could not be saved. Try again."); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm reviews</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Verification requests</h2><p className="mt-2 text-sm leading-6 text-[#737d70]">Review the farm details submitted by a farmer and record your decision.</p></div>
      {notice && <p role="status" className="rounded-xl bg-[#e9efe3] px-4 py-3 text-sm font-medium text-[#496b50]">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-[#fbefeb] px-4 py-3 text-sm text-[#9a493c]">{error}</p>}
      {!application ? <section className="rounded-[1.4rem] bg-white p-6 text-center sm:p-10"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]"><ClipboardCheck size={20} /></span><h3 className="mt-4 font-serif text-xl font-medium text-[#29352a]">No review request yet</h3><p className="mt-2 text-sm leading-6 text-[#788174]">A farmer's request will appear here when it is submitted on this device.</p></section> : <section className="rounded-[1.4rem] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Farm submitted for review</p><h3 className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{application.farmName}</h3></div><span className="rounded-full bg-[#f0f2ec] px-3 py-1.5 text-xs font-semibold text-[#59645a]">{application.status === "pending" ? "Waiting for review" : application.status === "approved" ? "Verified" : "More details needed"}</span></div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#f7f8f4] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#859080]">Farm location</dt><dd className="mt-2 flex gap-2 text-sm leading-5 text-[#354237]"><MapPin size={15} className="mt-0.5 shrink-0 text-[#688363]" />{application.location}</dd></div><div className="rounded-xl bg-[#f7f8f4] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#859080]">Phone number</dt><dd className="mt-2 flex gap-2 text-sm text-[#354237]"><Phone size={15} className="text-[#688363]" />{application.phone}</dd></div></dl>
        <p className="mt-4 text-xs text-[#788174]">Sent {new Date(application.submittedAt).toLocaleString()}</p>
        <label className="label-text mt-5 block">Note for the farmer (optional)<textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} maxLength={500} placeholder="Add a short note if the farmer needs to provide more information." /></label>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => updateStatus("needs_changes")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f0f2ec] px-4 text-xs font-semibold text-[#59645a] hover:bg-[#e8ece3]"><RotateCcw size={14} /> Request more details</button><button type="button" onClick={() => updateStatus("approved")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white hover:bg-[#193d2b]"><Check size={15} /> Mark farm verified</button></div>
      </section>}
      <p className="text-center text-[10px] leading-5 text-[#92998e]">Demo review data is stored in this browser. Connect the application API before using this workflow across devices or for real farmer records.</p>
    </div>
  );
}
