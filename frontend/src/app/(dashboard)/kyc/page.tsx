"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, ClipboardCheck, MapPin } from "lucide-react";
import { defaultFarmProfile, getFarmProfile, getKycApplication, saveKycApplication } from "@/lib/simulated-data";
import type { KycApplication } from "@/lib/simulated-data";

export default function KycPage() {
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [application, setApplication] = useState<KycApplication | null>(null);
  const [notice, setNotice] = useState("");
  const [submittedNow, setSubmittedNow] = useState(false);

  useEffect(() => {
    const profile = getFarmProfile() || defaultFarmProfile;
    const saved = getKycApplication();
    setFarmName(saved?.farmName ?? profile.farmName ?? "");
    setLocation(saved?.location ?? [profile.community, profile.lga, profile.state].filter(Boolean).join(", "));
    setPhone(saved?.phone ?? profile.phone ?? "");
    setApplication(saved);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: KycApplication = { farmName: farmName.trim(), location: location.trim(), phone: phone.trim(), status: "pending", submittedAt: new Date().toISOString() };
    saveKycApplication(next);
    setApplication(next);
    setNotice("Your farm review request has been sent.");
    setSubmittedNow(true);
  };

  const statusText = application?.status === "approved" ? "Farm verified" : application?.status === "needs_changes" ? "More details needed" : application?.status === "pending" ? "Waiting for JARI review" : "Not sent yet";
  const statusIcon = application?.status === "approved" ? CheckCircle2 : Clock3;
  const StatusIcon = statusIcon;

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-7">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm review</p><h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Ask JARI to verify your farm</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">Send us your farm details. Our team will arrange a review and update you here.</p></div>

      <section className="flex items-start gap-4 rounded-[1.4rem] bg-[#e9efe3] p-4 sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#53724c]"><ClipboardCheck size={18} /></span>
        <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#344a36]">{statusText}</p><p className="mt-1 text-xs leading-5 text-[#687664]">{application?.status === "approved" ? "Your farm has been marked as verified." : application?.status === "needs_changes" ? (application.reviewNote || "Please check your details and send them again.") : application?.status === "pending" ? "Your request is saved. The JARI team will review it." : "You can save a review request in a few simple steps."}</p></div>
        <StatusIcon size={18} className="mt-1 shrink-0 text-[#55734f]" />
      </section>

      {submittedNow ? <section role="status" className="rounded-[1.5rem] bg-white px-5 py-9 text-center sm:px-10 sm:py-12"><span className="review-success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f0e2] text-[#4d7648]"><CheckCircle2 size={38} strokeWidth={1.8} className="review-success-check" /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#62805d]">Request sent</p><h3 className="mt-2 font-serif text-2xl font-medium text-[#29352a]">Your farm review is in line</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737d70]">Thanks, {application?.farmName}. The JARI team will review your details and get in touch using the phone number you provided.</p><p className="mt-3 text-xs text-[#899184]">{notice}</p><Link href="/dashboard" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white hover:bg-[#193d2b]">Back to your farm</Link></section> : application?.status === "pending" || application?.status === "approved" ? <section className="rounded-[1.5rem] bg-white p-5 sm:p-7"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9efe3] text-[#55734f]"><StatusIcon size={20} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">Review status</p><h3 className="mt-1 font-serif text-xl font-medium text-[#29352a]">{statusText}</h3><p className="mt-1 text-sm leading-6 text-[#737d70]">{application.status === "approved" ? "JARI has checked your farm details." : "Your request has been sent. The JARI team will contact you after reviewing it."}</p></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-3">{[{ label: "Farm", value: application.farmName }, { label: "Location", value: application.location }, { label: "Phone", value: application.phone }].map((item) => <div key={item.label} className="rounded-xl bg-[#f5f6f2] p-4"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#82907c]">{item.label}</dt><dd className="mt-1 break-words text-sm font-medium text-[#354237]">{item.value}</dd></div>)}</dl><Link href="/dashboard" className="mt-5 inline-flex min-h-10 items-center text-xs font-semibold text-[#547253]">Back to your farm</Link></section> : <>
      {application?.status === "needs_changes" && <p role="status" className="rounded-xl bg-[#f4eddd] px-4 py-3 text-sm text-[#715f3b]">{application.reviewNote || "Please update your details and send the request again."}</p>}
      <form onSubmit={submit} className="rounded-2xl">
        <div className="mb-5"><h3 className="font-serif text-xl font-medium text-[#29352a]">Farm details</h3><p className="mt-1 text-xs text-[#788174]">Please check these details before sending your request.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label-text sm:col-span-2">Name of farm<input required minLength={2} maxLength={120} autoComplete="organization" value={farmName} onChange={(event) => setFarmName(event.target.value)} placeholder="For example, Kuru Poultry Farm" /></label>
          <label className="label-text sm:col-span-2">Farm location<input required minLength={3} maxLength={180} autoComplete="street-address" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Community, local government, state" /></label>
          <label className="label-text sm:col-span-2">Phone number<input required type="tel" inputMode="tel" autoComplete="tel" minLength={7} maxLength={24} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="A number we can reach you on" /></label>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-[#f5f6f2] p-4 sm:flex-row sm:items-center"><p className="flex items-start gap-2 text-xs leading-5 text-[#717b6e]"><MapPin size={15} className="mt-0.5 shrink-0 text-[#688363]" />A JARI team member may contact you to arrange a farm visit.</p><button type="submit" disabled={application?.status === "pending" || application?.status === "approved"} className="min-h-11 shrink-0 rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:opacity-50">{application?.status === "pending" ? "Request sent" : application?.status === "approved" ? "Farm verified" : "Send review request"}</button></div>
      </form></>}
      <p className="text-center text-[10px] leading-5 text-[#92998e]">This request is for a JARI farm review. It does not guarantee insurance or financing.</p>
    </div>
  );
}
