"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, FileText, UploadCloud } from "lucide-react";
import { registerInstitutionWithBackend } from "@/lib/auth";
import type { InstitutionCategory, InstitutionVerificationDocument } from "@/lib/simulated-data";

type Details = Record<string, string>;
type WizardData = {
  organisationName: string; organisationType: string; cacRegistrationNumber: string; yearEstablished: string;
  officialEmail: string; officialPhone: string; website: string; officeAddress: string; state: string; lga: string;
  categories: InstitutionCategory[]; services: Partial<Record<InstitutionCategory, Details>>;
  representative: { fullName: string; jobTitle: string; email: string; phone: string };
  password: string; confirmPassword: string; agreed: boolean;
};

const categories: InstitutionCategory[] = ["Lending Institution", "Insurance Provider", "Grant Provider"];
const organisationTypes = ["Bank", "Microfinance bank", "Finance company", "Insurance company", "Government agency", "NGO", "Cooperative", "Other"];
const blankData: WizardData = {
  organisationName: "", organisationType: "", cacRegistrationNumber: "", yearEstablished: "", officialEmail: "", officialPhone: "", website: "", officeAddress: "", state: "", lga: "", categories: [], services: {}, representative: { fullName: "", jobTitle: "", email: "", phone: "" }, password: "", confirmPassword: "", agreed: false,
};

type FieldSpec = { key: string; label: string; multiline?: boolean; optional?: boolean; placeholder?: string; type?: string };
type ServiceStep = { id: string; title: string; category: InstitutionCategory; fields: FieldSpec[] };
const serviceSteps: ServiceStep[] = [
  { id: "lending-terms", title: "Loan products and terms", category: "Lending Institution", fields: [
    { key: "loanTypes", label: "Types of agricultural loans offered", multiline: true, placeholder: "For example, poultry housing, working capital" },
    { key: "minimumLoan", label: "Minimum loan amount (₦)", type: "number" }, { key: "maximumLoan", label: "Maximum loan amount (₦)", type: "number" },
    { key: "pricing", label: "Interest rate or pricing structure", multiline: true }, { key: "duration", label: "Loan duration", placeholder: "For example, 12 months" },
    { key: "repayment", label: "Repayment frequency", placeholder: "For example, monthly" }, { key: "collateral", label: "Collateral requirements", multiline: true },
  ] },
  { id: "lending-reach", title: "Loan eligibility and coverage", category: "Lending Institution", fields: [
    { key: "sectors", label: "Agricultural sectors supported", multiline: true, placeholder: "Separate items with commas" },
    { key: "coverage", label: "States and LGAs covered", multiline: true }, { key: "eligibility", label: "Farmer eligibility requirements", multiline: true },
  ] },
  { id: "insurance-policy", title: "Insurance cover and policy", category: "Insurance Provider", fields: [
    { key: "insuranceTypes", label: "Types of agricultural insurance offered", multiline: true }, { key: "risks", label: "Agricultural risks covered", multiline: true },
    { key: "coverageLimit", label: "Coverage amount or limit" }, { key: "premium", label: "Premium pricing method", multiline: true },
    { key: "policyDuration", label: "Policy duration" }, { key: "exclusions", label: "Policy exclusions", multiline: true }, { key: "claims", label: "Claims requirements", multiline: true },
  ] },
  { id: "insurance-reach", title: "Insurance coverage area", category: "Insurance Provider", fields: [
    { key: "sectors", label: "Agricultural sectors supported", multiline: true }, { key: "coverage", label: "States and LGAs covered", multiline: true },
  ] },
  { id: "grant-programme", title: "Grant programmes and eligibility", category: "Grant Provider", fields: [
    { key: "grantCategories", label: "Grant programme categories", multiline: true }, { key: "beneficiaries", label: "Target beneficiaries", multiline: true },
    { key: "minimumFunding", label: "Minimum funding amount (₦)", type: "number", optional: true }, { key: "maximumFunding", label: "Maximum funding amount (₦)", type: "number", optional: true },
    { key: "eligibility", label: "Eligibility requirements", multiline: true },
  ] },
  { id: "grant-reach", title: "Grant coverage and applications", category: "Grant Provider", fields: [
    { key: "sectors", label: "Agricultural sectors supported", multiline: true }, { key: "coverage", label: "States and LGAs covered", multiline: true },
    { key: "requiredDocuments", label: "Documents required from applicants", multiline: true }, { key: "deadline", label: "Application deadline", type: "date", optional: true },
  ] },
];

type WizardStep = { id: string; title: string; eyebrow: string; kind: "organisation" | "location" | "services" | "service" | "representative" | "documents" | "review"; service?: ServiceStep };

export function InstitutionRegistrationWizard() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState<WizardData>(blankData);
  const [stepIndex, setStepIndex] = useState(0);
  const [documents, setDocuments] = useState<InstitutionVerificationDocument[]>([]);
  const [logo, setLogo] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = useMemo<WizardStep[]>(() => {
    const selected = serviceSteps.filter((step) => data.categories.includes(step.category));
    return [
      { id: "organisation", title: "Organisation information", eyebrow: "About your organisation", kind: "organisation" },
      { id: "location", title: "Official contact and location", eyebrow: "Where we can reach you", kind: "location" },
      { id: "services", title: "Institution category and services", eyebrow: "Choose every service you offer", kind: "services" },
      ...selected.map((service) => ({ id: service.id, title: service.title, eyebrow: service.category, kind: "service" as const, service })),
      { id: "representative", title: "Authorised representative", eyebrow: "Who is submitting this profile", kind: "representative" },
      { id: "documents", title: "Verification documents", eyebrow: "Evidence for the services selected", kind: "documents" },
      { id: "review", title: "Review and submit", eyebrow: "Check your information", kind: "review" },
    ];
  }, [data.categories]);
  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];

  const update = (patch: Partial<WizardData>) => setData((current) => ({ ...current, ...patch }));
  const updateRepresentative = (key: keyof WizardData["representative"], value: string) => setData((current) => ({ ...current, representative: { ...current.representative, [key]: value } }));
  const updateService = (category: InstitutionCategory, key: string, value: string) => setData((current) => ({ ...current, services: { ...current.services, [category]: { ...current.services[category], [key]: value } } }));
  const toggleCategory = (category: InstitutionCategory) => setData((current) => ({ ...current, categories: current.categories.includes(category) ? current.categories.filter((item) => item !== category) : [...current.categories, category] }));

  const addFiles = async (files: FileList | null, category: string) => {
    if (!files?.length) return;
    setError("");
    try {
      const converted = await Promise.all(Array.from(files).map(async (file) => ({
        id: `${category}-${file.name}-${file.lastModified}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        category,
        dataUrl: await readAsDataUrl(file),
      })));
      setDocuments((current) => [...current, ...converted.filter((item) => !current.some((existing) => existing.category === category && existing.name === item.name && existing.size === item.size))]);
    } catch {
      setError("We could not read one of those files. Please choose it again.");
    }
  };
  const removeFile = (id: string) => setDocuments((current) => current.filter((item) => item.id !== id));

  const validateCurrentStep = () => {
    if (activeStep.kind === "services" && data.categories.length === 0) {
      setError("Choose at least one service category to continue.");
      return false;
    }
    if (activeStep.kind === "representative" && data.password !== data.confirmPassword) {
      setError("The passwords do not match.");
      return false;
    }
    if (activeStep.kind === "documents") {
      const needed = requiredDocumentCategories(data.categories);
      const missing = needed.filter((category) => !documents.some((document) => document.category === category));
      if (missing.length) {
        setError(`Please add: ${missing.join(", ")}.`);
        return false;
      }
    }
    if (activeStep.kind !== "review" && formRef.current && !formRef.current.reportValidity()) return false;
    setError("");
    return true;
  };

  const next = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };
  const back = () => { setError(""); setStepIndex((current) => Math.max(0, current - 1)); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!data.agreed) { setError("Please confirm that you have permission to submit these organisation details."); return; }
    if (data.password !== data.confirmPassword) { setError("The passwords do not match."); return; }
    setIsSubmitting(true);
    try {
      const session = await registerInstitutionWithBackend(data.representative.phone, data.password, {
        organisationName: data.organisationName.trim(), organisationType: data.organisationType, cacRegistrationNumber: data.cacRegistrationNumber.trim(), yearEstablished: data.yearEstablished,
        officialEmail: data.officialEmail.trim(), officialPhone: data.officialPhone.trim(), website: data.website.trim(), officeAddress: data.officeAddress.trim(), state: data.state.trim(), lga: data.lga.trim(), logo,
        categories: data.categories, services: data.services, representative: { ...data.representative, fullName: data.representative.fullName.trim(), email: data.representative.email.trim(), phone: data.representative.phone.trim() }, documents,
      });
      router.push(session.role === "institutional_user" ? "/institution" : "/dashboard");
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Unable to submit this institution profile.");
    } finally { setIsSubmitting(false); }
  };

  return <div>
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#547253]">Institution registration · Step {stepIndex + 1} of {steps.length}</p>
      <h2 className="mt-2 font-serif text-2xl font-medium tracking-[-.03em] text-[#20291f] sm:text-3xl">{activeStep.title}</h2>
      <p className="mt-1.5 text-sm leading-5 text-[#697268]">{activeStep.eyebrow}</p>
    </div>
    <div aria-label={`Step ${stepIndex + 1} of ${steps.length}`} className="mb-6 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={stepIndex + 1}>
      {steps.map((step, index) => <span key={step.id} title={step.title} className={`h-1.5 flex-1 rounded-full transition-colors ${index <= stepIndex ? "bg-[#547253]" : "bg-[#e7ebe3]"}`} />)}
    </div>

    <form ref={formRef} onSubmit={activeStep.kind === "review" ? submit : next} className="space-y-4" noValidate={false}>
      <div className="min-h-[270px] space-y-4">
        {activeStep.kind === "organisation" && <>
          <Field label="Organisation name"><input required autoComplete="organization" className="input-shell" value={data.organisationName} onChange={(event) => update({ organisationName: event.target.value })} placeholder="Registered organisation name" /></Field>
          <Field label="Organisation type"><select required className="input-shell" value={data.organisationType} onChange={(event) => update({ organisationType: event.target.value })}><option value="">Choose organisation type</option>{organisationTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="CAC registration number" hint="Enter it if your organisation has one; applicable registration evidence is requested later."><input className="input-shell" value={data.cacRegistrationNumber} onChange={(event) => update({ cacRegistrationNumber: event.target.value })} placeholder="Registration number, if applicable" /></Field>
          <Field label="Year established"><input required type="number" inputMode="numeric" min="1800" max={new Date().getFullYear()} className="input-shell" value={data.yearEstablished} onChange={(event) => update({ yearEstablished: event.target.value })} placeholder="e.g. 2015" /></Field>
        </>}
        {activeStep.kind === "location" && <>
          <Field label="Official email"><input required type="email" autoComplete="email" className="input-shell" value={data.officialEmail} onChange={(event) => update({ officialEmail: event.target.value })} placeholder="name@organisation.ng" /></Field>
          <Field label="Official phone number"><input required type="tel" autoComplete="tel" className="input-shell" value={data.officialPhone} onChange={(event) => update({ officialPhone: event.target.value })} placeholder="Office phone number" /></Field>
          <Field label="Website" hint="Optional"><input type="url" autoComplete="url" className="input-shell" value={data.website} onChange={(event) => update({ website: event.target.value })} placeholder="https://" /></Field>
          <Field label="Office address"><textarea required autoComplete="street-address" className="input-shell min-h-20 resize-y" value={data.officeAddress} onChange={(event) => update({ officeAddress: event.target.value })} placeholder="Street address" /></Field>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="State"><input required autoComplete="address-level1" className="input-shell" value={data.state} onChange={(event) => update({ state: event.target.value })} placeholder="State" /></Field><Field label="LGA"><input required autoComplete="address-level2" className="input-shell" value={data.lga} onChange={(event) => update({ lga: event.target.value })} placeholder="Local Government Area" /></Field></div>
          <Field label="Organisation logo" hint="Optional"><input type="file" accept="image/*" className="input-shell file:mr-3 file:rounded-full file:border-0 file:bg-[#edf1e9] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#35543a]" onChange={async (event) => { const file = event.target.files?.[0]; if (file) { try { setLogo(await readAsDataUrl(file)); } catch { setError("We could not read the logo file."); } } }} /></Field>
          {logo && <div className="flex items-center gap-2 text-xs text-[#547253]"><Check size={14} /> Logo selected</div>}
        </>}
        {activeStep.kind === "services" && <fieldset className="space-y-2.5"><legend className="mb-2 text-xs font-semibold text-[#465244]">Select all that apply</legend>{categories.map((category) => <label key={category} className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors ${data.categories.includes(category) ? "bg-[#edf2e9]" : "bg-[#f7f8f5] hover:bg-[#f0f2ec]"}`}><input type="checkbox" checked={data.categories.includes(category)} onChange={() => toggleCategory(category)} className="mt-0.5 h-4 w-4 accent-[#416244]" /><span><span className="block text-sm font-semibold text-[#304032]">{category}</span><span className="mt-0.5 block text-xs leading-5 text-[#727b70]">{categorySummary(category)}</span></span></label>)}</fieldset>}
        {activeStep.kind === "service" && activeStep.service && <div className="space-y-3">{activeStep.service.fields.map((field) => <Field key={field.key} label={field.label} hint={field.optional ? "Optional" : undefined}><ServiceInput field={field} value={data.services[activeStep.service!.category]?.[field.key] || ""} onChange={(value) => updateService(activeStep.service!.category, field.key, value)} /></Field>)}<p className="text-[11px] leading-5 text-[#7b8478]">Enter the information that describes your organisation’s current service offer.</p></div>}
        {activeStep.kind === "representative" && <>
          <Field label="Representative’s full name"><input required autoComplete="name" className="input-shell" value={data.representative.fullName} onChange={(event) => updateRepresentative("fullName", event.target.value)} placeholder="Full name" /></Field>
          <Field label="Job title"><input required autoComplete="organization-title" className="input-shell" value={data.representative.jobTitle} onChange={(event) => updateRepresentative("jobTitle", event.target.value)} placeholder="Role in the organisation" /></Field>
          <Field label="Official email"><input required type="email" autoComplete="email" className="input-shell" value={data.representative.email} onChange={(event) => updateRepresentative("email", event.target.value)} placeholder="Representative’s work email" /></Field>
          <Field label="Phone number"><input required type="tel" autoComplete="tel" className="input-shell" value={data.representative.phone} onChange={(event) => updateRepresentative("phone", event.target.value)} placeholder="Used to sign in to this demo" /></Field>
          <Field label="Create password"><input required type={passwordVisible ? "text" : "password"} autoComplete="new-password" minLength={6} className="input-shell" value={data.password} onChange={(event) => update({ password: event.target.value })} placeholder="At least 6 characters" /></Field>
          <Field label="Confirm password"><input required type={passwordVisible ? "text" : "password"} autoComplete="new-password" minLength={6} className="input-shell" value={data.confirmPassword} onChange={(event) => update({ confirmPassword: event.target.value })} placeholder="Enter password again" /></Field>
          <label className="flex items-center gap-2 text-xs text-[#657064]"><input type="checkbox" checked={passwordVisible} onChange={(event) => setPasswordVisible(event.target.checked)} className="h-4 w-4 accent-[#416244]" />Show passwords</label>
        </>}
        {activeStep.kind === "documents" && <div className="space-y-3">
          <p className="text-xs leading-5 text-[#697268]">Choose evidence relevant to your organisation. Files are stored in this browser demo; large files can exceed browser storage.</p>
          <UploadSlot title="Organisation registration evidence" description="CAC certificate or applicable registration evidence" required files={documents.filter((item) => item.category === "registration evidence")} onChange={(files) => addFiles(files, "registration evidence")} onRemove={removeFile} />
          {data.categories.some((category) => category === "Lending Institution" || category === "Insurance Provider") && <UploadSlot title="Operating licence or regulatory authorisation" description="Required for selected lending and/or insurance services" required files={documents.filter((item) => item.category === "operating licence")} onChange={(files) => addFiles(files, "operating licence")} onRemove={removeFile} />}
          {data.categories.includes("Grant Provider") && <UploadSlot title="Grant administration evidence" description="Evidence of authority to administer grants" required files={documents.filter((item) => item.category === "grant authority")} onChange={(files) => addFiles(files, "grant authority")} onRemove={removeFile} />}
          <UploadSlot title="Representative authority evidence" description="Add this where your organisation requires proof of authority" files={documents.filter((item) => item.category === "representative authority")} onChange={(files) => addFiles(files, "representative authority")} onRemove={removeFile} />
        </div>}
        {activeStep.kind === "review" && <Review data={data} documents={documents} logo={Boolean(logo)} agreed={data.agreed} onAgree={(agreed) => update({ agreed })} />}
      </div>

      {error && <div role="alert" className="rounded-xl bg-[#fbefeb] px-3.5 py-3 text-sm leading-5 text-[#9a493c]">{error}</div>}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={back} disabled={stepIndex === 0 || isSubmitting} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#5e6c5d] transition hover:bg-[#f1f3ee] disabled:invisible"><ArrowLeft size={16} /> Back</button>
        {activeStep.kind === "review" ? <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white transition hover:bg-[#193d2b] disabled:opacity-60">{isSubmitting ? "Submitting…" : "Submit for verification"}<Check size={16} /></button> : <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#244b35] px-5 text-sm font-semibold text-white transition hover:bg-[#193d2b]">Next<ArrowRight size={16} /></button>}
      </div>
    </form>
  </div>;
}

function requiredDocumentCategories(selected: InstitutionCategory[]) {
  return ["registration evidence", ...(selected.some((category) => category === "Lending Institution" || category === "Insurance Provider") ? ["operating licence"] : []), ...(selected.includes("Grant Provider") ? ["grant authority"] : [])];
}
function categorySummary(category: InstitutionCategory) {
  if (category === "Lending Institution") return "Agricultural loans and lending services";
  if (category === "Insurance Provider") return "Agricultural insurance and risk cover";
  return "Agricultural grants and support programmes";
}
function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unreadable file")); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <label className="block"><span className="label-text">{label}</span>{hint && <span className="-mt-1 mb-1.5 block text-[10px] leading-4 text-[#7b8478]">{hint}</span>}{children}</label>; }
function ServiceInput({ field, value, onChange }: { field: FieldSpec; value: string; onChange: (value: string) => void }) {
  const common = { required: !field.optional, className: "input-shell", value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), placeholder: field.placeholder || "Add details" };
  if (field.multiline) return <textarea {...common} className="input-shell min-h-[76px] resize-y" />;
  return <input {...common} type={field.type || "text"} min={field.type === "number" ? "0" : undefined} inputMode={field.type === "number" ? "decimal" : undefined} />;
}
function UploadSlot({ title, description, required = false, files, onChange, onRemove }: { title: string; description: string; required?: boolean; files: InstitutionVerificationDocument[]; onChange: (files: FileList | null) => void; onRemove: (id: string) => void }) {
  return <section className="rounded-2xl bg-[#f6f7f3] p-3.5"><div className="flex items-start gap-2"><UploadCloud size={17} className="mt-0.5 shrink-0 text-[#547253]" /><div><h3 className="text-xs font-semibold text-[#354237]">{title}{required && <span className="text-[#a04d3e]"> *</span>}</h3><p className="mt-0.5 text-[10px] leading-4 text-[#7b8478]">{description}</p></div></div><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(event) => onChange(event.target.files)} className="mt-2 w-full text-[10px] text-[#627060] file:mr-2 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-2 file:text-[10px] file:font-semibold file:text-[#35543a]" />{files.map((file) => <div key={file.id} className="mt-2 flex items-center gap-2 rounded-lg bg-white px-2.5 py-2 text-xs"><FileText size={14} className="shrink-0 text-[#71866d]" /><span className="min-w-0 flex-1 truncate">{file.name}</span><button type="button" onClick={() => onRemove(file.id)} className="rounded px-1.5 py-1 text-[#8b5146] hover:bg-[#fbefeb]">Remove</button></div>)}</section>;
}
function Review({ data, documents, logo, agreed, onAgree }: { data: WizardData; documents: InstitutionVerificationDocument[]; logo: boolean; agreed: boolean; onAgree: (agreed: boolean) => void }) {
  return <div className="space-y-3 text-xs">
    <ReviewSection title="Organisation">{[["Name", data.organisationName], ["Type", data.organisationType], ["Registration number", data.cacRegistrationNumber || "Not provided"], ["Established", data.yearEstablished], ["Email", data.officialEmail], ["Phone", data.officialPhone], ["Website", data.website || "Not provided"], ["Address", [data.officeAddress, data.lga, data.state].filter(Boolean).join(", ")], ["Logo", logo ? "Selected" : "Not provided"]]}</ReviewSection>
    <ReviewSection title="Services">{data.categories.flatMap((category) => serviceSteps.filter((step) => step.category === category).flatMap((step) => step.fields.map((field) => [`${category}: ${field.label}`, data.services[category]?.[field.key] || "Not provided"] as [string, string])))}</ReviewSection>
    <ReviewSection title="Authorised representative">{[["Name", data.representative.fullName], ["Title", data.representative.jobTitle], ["Email", data.representative.email], ["Phone", data.representative.phone]]}</ReviewSection>
    <ReviewSection title="Verification documents">{documents.map((document) => [document.category, document.name])}</ReviewSection>
    <div className="rounded-xl bg-[#f3f5ef] p-3 text-[11px] leading-5 text-[#667162]">Your profile will be saved as <strong>Pending Verification</strong>. This is a browser demo submission; it does not contact JARI or a regulator.</div>
    <label className="flex items-start gap-2 text-[11px] leading-5 text-[#5d685d]"><input type="checkbox" checked={agreed} onChange={(event) => onAgree(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#416244]" /><span>I am authorised to submit these organisation details and verification documents.</span></label>
  </div>;
}
function ReviewSection({ title, children }: { title: string; children: Array<[string, string]> }) { return <section className="rounded-xl bg-[#f6f7f3] p-3"><h3 className="mb-2 font-semibold text-[#354237]">{title}</h3><dl className="space-y-1.5">{children.map(([label, value]) => <div key={label} className="grid grid-cols-[105px_1fr] gap-2"><dt className="text-[#7b8478]">{label}</dt><dd className="break-words text-[#354237]">{value}</dd></div>)}</dl></section>; }
