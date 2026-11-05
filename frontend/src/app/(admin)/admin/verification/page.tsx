"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, MapPin, Phone, RotateCcw } from "lucide-react";
import { getKycApplication, saveKycApplication } from "@/services";
import { adminApi, getStoredToken } from "@/lib/api-client";
import type { KycApplication } from "@/services";

type VerificationItem = {
  id: string;
  item_type: string;
  entity_name: string;
  details: string;
  phone: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  review_note?: string;
};

export default function VerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [singleApplication, setSingleApplication] = useState<KycApplication | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    if (getStoredToken()) {
      try {
        const queue = await adminApi.getVerifications();
        if (Array.isArray(queue) && queue.length > 0) {
          setItems(queue);
          setSelectedId(queue[0].id);
          return;
        }
      } catch (e) {
        // Fall back to local simulated kyc application
      }
    }
    const local = getKycApplication();
    setSingleApplication(local);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (status: "approved" | "needs_changes" | "rejected") => {
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      if (selectedId && items.length > 0) {
        await adminApi.reviewVerification(selectedId, {
          status,
          review_note: reviewNote.trim() || undefined,
        });
        setNotice(status === "approved" ? "Record marked as verified." : "More details requested.");
        setReviewNote("");
        await loadData();
      } else if (singleApplication) {
        const next: KycApplication = {
          ...singleApplication,
          status: status === "rejected" ? "needs_changes" : status,
          reviewedAt: new Date().toISOString(),
          reviewNote: reviewNote.trim() || undefined,
        };
        saveKycApplication(next);
        setSingleApplication(next);
        setNotice(status === "approved" ? "Demo farm marked as verified." : "More details requested.");
        setReviewNote("");
      }
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "The review decision could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeItem = items.find((i) => i.id === selectedId) || (singleApplication ? {
    id: "local-app",
    item_type: "farmer_kyc",
    entity_name: singleApplication.farmName,
    details: singleApplication.location,
    phone: singleApplication.phone,
    status: singleApplication.status,
    submitted_at: singleApplication.submittedAt,
    reviewed_at: singleApplication.reviewedAt,
    review_note: singleApplication.reviewNote,
  } : null);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Farm reviews</p>
        <h2 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Verification requests</h2>
        <p className="mt-2 text-sm leading-6 text-[#737d70]">Review details submitted by farmers and institutions and record your decision.</p>
      </div>

      {notice && <p role="status" className="rounded-xl bg-[#e9efe3] px-4 py-3 text-sm font-medium text-[#496b50]">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-[#fbefeb] px-4 py-3 text-sm text-[#9a493c]">{error}</p>}

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setError("");
                setNotice("");
              }}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedId === item.id ? "bg-[#244b35] text-white" : "bg-white text-[#566256] hover:bg-slate-50"
              }`}
            >
              {item.entity_name} ({item.status})
            </button>
          ))}
        </div>
      )}

      {!activeItem ? (
        <section className="rounded-[1.4rem] bg-white p-6 text-center sm:p-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]">
            <ClipboardCheck size={20} />
          </span>
          <h3 className="mt-4 font-serif text-xl font-medium text-[#29352a]">No review request yet</h3>
          <p className="mt-2 text-sm leading-6 text-[#788174]">Submitted requests from farmers and institutions will appear here.</p>
        </section>
      ) : (
        <section className="rounded-[1.4rem] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#82907c]">
                {activeItem.item_type === "institution" ? "Institution submitted for verification" : "Farm submitted for review"}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-medium text-[#29352a]">{activeItem.entity_name}</h3>
            </div>
            <span className="rounded-full bg-[#f0f2ec] px-3 py-1.5 text-xs font-semibold text-[#59645a]">
              {activeItem.status === "pending"
                ? "Waiting for review"
                : activeItem.status === "approved"
                ? "Verified"
                : activeItem.status === "needs_changes"
                ? "More details needed"
                : activeItem.status}
            </span>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f8f4] p-4">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#859080]">Location & Details</dt>
              <dd className="mt-2 flex gap-2 text-sm leading-5 text-[#354237]">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#688363]" />
                {activeItem.details}
              </dd>
            </div>
            <div className="rounded-xl bg-[#f7f8f4] p-4">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#859080]">Phone number</dt>
              <dd className="mt-2 flex gap-2 text-sm text-[#354237]">
                <Phone size={15} className="text-[#688363]" />
                {activeItem.phone}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-[#788174]">Sent {new Date(activeItem.submitted_at).toLocaleString()}</p>
          {activeItem.review_note && (
            <p className="mt-2 text-xs text-[#715f3b] rounded-lg bg-[#fbf6ec] p-3">
              <strong>Previous note:</strong> {activeItem.review_note}
            </p>
          )}

          <label className="label-text mt-5 block">
            Note for applicant (optional)
            <textarea
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
              maxLength={500}
              placeholder="Add a short note if the applicant needs to provide more information or reasons for decision."
            />
          </label>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStatus("needs_changes")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f0f2ec] px-4 text-xs font-semibold text-[#59645a] hover:bg-[#e8ece3] disabled:opacity-50"
            >
              <RotateCcw size={14} /> Request more details
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStatus("approved")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white hover:bg-[#193d2b] disabled:opacity-50"
            >
              <Check size={15} /> Mark verified
            </button>
          </div>
        </section>
      )}

      <p className="text-center text-[10px] leading-5 text-[#92998e]">
        All verification review actions are recorded directly into the platform management database.
      </p>
    </div>
  );
}
