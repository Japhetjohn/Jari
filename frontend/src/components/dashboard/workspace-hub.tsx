"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { addInstitutionRequest, getDashboardTotals, getDemoDatabaseSnapshot, getInstitutionDemoAccess, getInstitutionRequests, getOpportunityApplications, updateOpportunityApplication, type InstitutionRequestRecord, type OpportunityApplicationRecord } from "@/services";
import { InsuranceRiskProfiles } from "@/components/dashboard/insurance-risk-profiles";
import { adminApi, getStoredToken } from "@/lib/api-client";

const card = "rounded-[1.25rem] bg-white p-5";
const money = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount || 0);
const titles: Record<string, string> = {
  overview: "Workspace overview", farmers: "Farmer directory", farms: "Farm records", assessments: "Farm record review", opportunities: "Opportunity applications", institutions: "Institution partners", reports: "Farm reports", settings: "Workspace settings",
  "institution-risk-profiles": "Farmer risk profiles", "institution-farms": "Authorized farm summary", "institution-assessments": "Farm record coverage", "institution-reports": "Farm summary report", "institution-documents": "Shared documents", "institution-referrals": "Support referrals", "institution-requests": "Requests to the farm", "institution-settings": "Institution access",
};

export function WorkspaceHub({ section, institution = false }: { section: string; institution?: boolean }) {
  const [snapshot, setSnapshot] = useState<ReturnType<typeof getDemoDatabaseSnapshot> | null>(null);
  const [shared, setShared] = useState(false);
  const [applications, setApplications] = useState<OpportunityApplicationRecord[]>([]);
  const [requests, setRequests] = useState<InstitutionRequestRecord[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [request, setRequest] = useState({ purpose: "Finance discussion", message: "" });
  const [adminOverview, setAdminOverview] = useState<{
    total_farmers: number;
    total_farms: number;
    total_flocks: number;
    active_birds: number;
    pending_kyc_count: number;
    approved_kyc_count: number;
    total_institutions: number;
    pending_institutions_count: number;
  } | null>(null);
  const [farmersList, setFarmersList] = useState<any[]>([]);
  const [institutionsList, setInstitutionsList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sync = () => {
      setSnapshot(getDemoDatabaseSnapshot());
      setShared(getInstitutionDemoAccess().shared);
      setApplications(getOpportunityApplications());
      setRequests(getInstitutionRequests());
    };
    sync();
    window.addEventListener("jari:mock-data-changed", sync);

    if (getStoredToken() && !institution) {
      adminApi.getOverview().then(setAdminOverview).catch(() => {});
      adminApi.getFarmers().then(setFarmersList).catch(() => {});
      adminApi.getInstitutions().then(setInstitutionsList).catch(() => {});
    }

    return () => window.removeEventListener("jari:mock-data-changed", sync);
  }, [institution]);

  if (!snapshot) return null;
  const title = titles[institution ? `institution-${section}` : section] || "Workspace overview";
  const status = snapshot.kycApplication?.status === "approved" ? "Verified" : snapshot.kycApplication?.status === "pending" ? "Waiting for review" : snapshot.kycApplication?.status === "needs_changes" ? "More details needed" : "No request yet";
  const totals = getDashboardTotals();

  const review = (application: OpportunityApplicationRecord, decision: "Reviewed" | "Needs information") => {
    try {
      updateOpportunityApplication(application.id, decision, reviewNotes[application.id]?.trim() || application.note);
      setNotice(decision === "Reviewed" ? "Demo review recorded." : "Request for more information recorded.");
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save the review.");
    }
  };

  const addRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      addInstitutionRequest({ institutionName: "Plateau Agri Trust", purpose: request.purpose, message: request.message });
      setRequest((value) => ({ ...value, message: "" }));
      setNotice("Request saved in this browser. The farmer can see it after signing in here.");
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save the request.");
    }
  };

  if (institution && section === "risk-profiles") return <InsuranceRiskProfiles />;
  if (institution && !shared) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Header title="No farm shared with this demo account" intro="The farmer has not enabled institution demo access. This local workspace cannot bypass that choice." institution />
        <section className={`${card} space-y-3 text-sm leading-6 text-[#657064]`}>
          <p>To preview a limited summary, sign in to the farmer demo on this browser and open <Link className="font-semibold text-[#355a3c] underline" href="/settings">Settings</Link>. The farmer can turn sharing off at any time.</p>
          <p>With sharing enabled, this demo still hides phone numbers and document contents. Nothing is sent to a real organization or another device.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Header
        title={title}
        institution={institution}
        intro={institution ? "Read-only farm information authorized for institutional portfolio view." : "Manage platform records, farmer verifications, and partner institutions."}
      />
      {(error || notice) && <p role={error ? "alert" : "status"} className={`rounded-xl p-4 text-sm ${error ? "bg-red-50 text-red-800" : "bg-[#e9efe3] text-[#456346]"}`}>{error || notice}</p>}
      {institution ? (
        <InstitutionSection section={section} snapshot={snapshot} status={status} totals={totals} requests={requests} request={request} setRequest={setRequest} addRequest={addRequest} />
      ) : (
        <AdminSection
          section={section}
          snapshot={snapshot}
          status={status}
          totals={totals}
          adminOverview={adminOverview}
          farmersList={farmersList}
          institutionsList={institutionsList}
          applications={applications}
          reviewNotes={reviewNotes}
          setReviewNotes={setReviewNotes}
          review={review}
        />
      )}
    </div>
  );
}

function AdminSection({
  section,
  snapshot,
  status,
  totals,
  adminOverview,
  farmersList,
  institutionsList,
  applications,
  reviewNotes,
  setReviewNotes,
  review,
}: {
  section: string;
  snapshot: ReturnType<typeof getDemoDatabaseSnapshot>;
  status: string;
  totals: ReturnType<typeof getDashboardTotals>;
  adminOverview: any;
  farmersList: any[];
  institutionsList: any[];
  applications: OpportunityApplicationRecord[];
  reviewNotes: Record<string, string>;
  setReviewNotes: (next: Record<string, string>) => void;
  review: (application: OpportunityApplicationRecord, decision: "Reviewed" | "Needs information") => void;
}) {
  const farm = snapshot.farmProfile;

  if (section === "farmers") {
    return (
      <section className="space-y-3">
        <div className={card}>
          <h2 className="text-base font-semibold text-[#29352a]">Registered Platform Farmers</h2>
          <p className="mt-1 text-xs text-[#788174]">Live accounts registered in the database.</p>
          <div className="mt-4 divide-y divide-[#edf0e9]">
            {farmersList.length ? (
              farmersList.map((farmer) => (
                <div key={farmer.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#2f3c30]">{farmer.full_name}</p>
                    <p className="text-xs text-[#7a8678]">{farmer.phone}</p>
                  </div>
                  <span className="rounded-full bg-[#eef3eb] px-2.5 py-1 text-[11px] font-semibold text-[#3e5e40]">
                    {farmer.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-xs text-[#788174]">Farmer records will appear here as they register.</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section === "institutions") {
    return (
      <section className="space-y-3">
        <div className={card}>
          <h2 className="text-base font-semibold text-[#29352a]">Registered Financial & Insurance Partners</h2>
          <p className="mt-1 text-xs text-[#788174]">Institutions verified to access portfolios and risk assessments.</p>
          <div className="mt-4 divide-y divide-[#edf0e9]">
            {institutionsList.length ? (
              institutionsList.map((inst) => (
                <div key={inst.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#2f3c30]">{inst.organisation_name}</p>
                    <p className="text-xs text-[#7a8678]">{inst.organisation_type} · CAC: {inst.cac_registration_number}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    inst.status === "approved" ? "bg-[#eef3eb] text-[#3e5e40]" : "bg-[#f5f0e4] text-[#806c3d]"
                  }`}>
                    {inst.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-xs text-[#788174]">Institutions will appear here upon submission.</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section === "opportunities") {
    return (
      <section className="space-y-3">
        {applications.map((item) => (
          <article key={item.id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7a8778]">{item.type} · {new Date(item.createdAt).toLocaleDateString()}</p>
                <h2 className="mt-1 text-lg font-semibold text-[#29352a]">{item.opportunityName}</h2>
                <p className="mt-1 text-sm leading-6 text-[#697368]">Farmer note: {item.note}</p>
              </div>
              <span className="rounded-full bg-[#edf2e8] px-3 py-1.5 text-xs font-semibold text-[#486649]">{item.status}</span>
            </div>
            <label className="label-text mt-4 block">
              Demo review note
              <textarea
                value={reviewNotes[item.id] ?? ""}
                onChange={(event) => setReviewNotes({ ...reviewNotes, [item.id]: event.target.value })}
                maxLength={500}
                placeholder="A note the farmer can see in their demo workspace"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => review(item, "Reviewed")} className="min-h-10 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Record review</button>
              <button type="button" onClick={() => review(item, "Needs information")} className="min-h-10 rounded-full bg-[#f4eddd] px-4 text-xs font-semibold text-[#705c35]">Ask for more information</button>
            </div>
          </article>
        ))}
        {!applications.length && <Empty message="No farmer opportunity interests are saved in this browser yet." />}
      </section>
    );
  }

  if (section === "assessments") {
    return (
      <section className={card}>
        <h2 className="font-semibold">Farm record coverage</h2>
        <p className="mt-1 text-sm text-[#697368]">Coverage assessment of operational records.</p>
        <Coverage snapshot={snapshot} status={status} />
      </section>
    );
  }

  if (section === "reports") {
    return (
      <section className={`${card} space-y-4`}>
        <Metrics values={[
          ["Active birds", adminOverview ? adminOverview.active_birds.toLocaleString() : totals.birds.toLocaleString()],
          ["Farms", String(adminOverview ? adminOverview.total_farms : totals.houses)],
          ["Sales volume", money(totals.salesTotal)],
          ["Farm spending", money(totals.expenseTotal)],
        ]} />
        <a download="jari-demo-farm-summary.json" href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ farm: farm.farmName, generatedAt: new Date().toISOString(), totals, flockCount: snapshot.flocks.length, reviewStatus: status }, null, 2))}`} className="inline-flex min-h-10 items-center rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white">Download summary</a>
      </section>
    );
  }

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Registered farmers"
          value={adminOverview ? String(adminOverview.total_farmers) : "1"}
        />
        <Metric
          label="Active bird population"
          value={adminOverview ? adminOverview.active_birds.toLocaleString() : totals.birds.toLocaleString()}
        />
        <Metric
          label="Pending verifications"
          value={adminOverview ? String(adminOverview.pending_kyc_count + adminOverview.pending_institutions_count) : status}
        />
        <Metric
          label="Partner institutions"
          value={adminOverview ? String(adminOverview.total_institutions) : "1"}
        />
      </section>

      <section className={`${card} flex flex-wrap gap-2`}>
        <Link href="/admin/verification" className={actionPrimary}>Verification queue</Link>
        <Link href="/admin/farmers" className={actionSecondary}>Farmers directory</Link>
        <Link href="/admin/institutions" className={actionSecondary}>Institutions</Link>
        <Link href="/admin/reports" className={actionSecondary}>Platform reports</Link>
      </section>

      <section className={card}>
        <h2 className="font-semibold">Platform overview</h2>
        <p className="mt-1 text-xs text-[#788174]">Live aggregates across registered farms and flocks in the database.</p>
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ["Platform registered farms", adminOverview ? String(adminOverview.total_farms) : farm.farmName],
            ["Active poultry flocks", adminOverview ? String(adminOverview.total_flocks) : String(snapshot.flocks.length)],
            ["Pending farmer KYC reviews", adminOverview ? String(adminOverview.pending_kyc_count) : "0"],
            ["Verified KYC farms", adminOverview ? String(adminOverview.approved_kyc_count) : "0"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#f5f7f2] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#84907e]">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-[#354237]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

function InstitutionSection({ section, snapshot, status, totals, requests, request, setRequest, addRequest }: { section: string; snapshot: ReturnType<typeof getDemoDatabaseSnapshot>; status: string; totals: ReturnType<typeof getDashboardTotals>; requests: InstitutionRequestRecord[]; request: { purpose: string; message: string }; setRequest: (value: { purpose: string; message: string }) => void; addRequest: (event: FormEvent<HTMLFormElement>) => void }) {
  if (section === "requests" || section === "referrals") {
    return (
      <>
        <section className={card}>
          <h2 className="font-semibold text-[#29352a]">Create an inquiry request</h2>
          <p className="mt-1 text-sm leading-6 text-[#697368]">Send an advisory or financial request to the authorized farmer.</p>
          <form onSubmit={addRequest} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="label-text">
              Purpose
              <select value={request.purpose} onChange={(event) => setRequest({ ...request, purpose: event.target.value })}>
                <option>Finance discussion</option>
                <option>Insurance discussion</option>
                <option>Farm records clarification</option>
                <option>Advisory follow-up</option>
              </select>
            </label>
            <label className="label-text sm:col-span-2">
              Message
              <textarea required minLength={5} maxLength={500} value={request.message} onChange={(event) => setRequest({ ...request, message: event.target.value })} placeholder="Explain what you would like to discuss with the farmer." />
            </label>
            <div><button className={actionPrimary}>Send inquiry</button></div>
          </form>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold">Recent requests</h2>
          {requests.map((item) => (
            <article key={item.id} className={card}>
              <h3 className="font-medium">{item.purpose}</h3>
              <p className="mt-1 text-sm text-[#697368]">{item.message}</p>
              <p className="mt-2 text-[10px] text-[#84907e]">{new Date(item.createdAt).toLocaleString()} · {item.status}</p>
            </article>
          ))}
          {!requests.length && <Empty message="No inquiry requests recorded yet." />}
        </section>
      </>
    );
  }

  if (section === "documents") return <section className={card}><h2 className="font-semibold">Shared Documents</h2><p className="mt-2 text-sm leading-6 text-[#697368]">Verified KYC and agricultural evidence documents authorized by farmers.</p></section>;
  if (section === "assessments") return <section className={card}><h2 className="font-semibold">Record coverage analysis</h2><p className="mt-1 text-sm text-[#697368]">Operational records supporting risk analysis.</p><Coverage snapshot={snapshot} status={status} /></section>;
  if (section === "reports") return <section className={card}><h2 className="font-semibold">Portfolio summary</h2><SharedSummary snapshot={snapshot} totals={totals} /></section>;

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        <Metric label="Verification status" value={status} />
        <Metric label="Active bird population" value={totals.birds.toLocaleString()} />
        <Metric label="Poultry houses" value={String(totals.houses)} />
      </section>
      <section className={card}>
        <h2 className="font-semibold">Authorized farm portfolio</h2>
        <p className="mt-1 text-sm text-[#697368]">{snapshot.farmProfile.farmName} · {[snapshot.farmProfile.community, snapshot.farmProfile.lga, snapshot.farmProfile.state].filter(Boolean).join(", ")}</p>
        <Coverage snapshot={snapshot} status={status} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/institution/risk-profiles" className={actionPrimary}>Open risk profiles</Link>
          <Link href="/institution/requests" className={actionSecondary}>Send inquiry</Link>
        </div>
      </section>
    </>
  );
}

function Header({ title, intro, institution }: { title: string; intro: string; institution: boolean }) {
  return (
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">{institution ? "Institution workspace" : "JARI platform management"}</p>
      <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">{intro}</p>
    </header>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.1rem] bg-white p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#84907e]">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-[#29352a] sm:text-lg">{value}</p>
    </article>
  );
}

function Metrics({ values }: { values: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {values.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <div className="rounded-[1.25rem] bg-white p-7 text-center text-sm text-[#697368]">{message}</div>;
}

function Coverage({ snapshot, status }: { snapshot: ReturnType<typeof getDemoDatabaseSnapshot>; status: string }) {
  return (
    <ul className="mt-4 divide-y divide-[#edf0e9]">
      {[
        ["Farm review", status],
        ["Bird groups", `${snapshot.flocks.length} recorded`],
        ["Vaccinations", `${snapshot.vaccinations.length} recorded`],
        ["Health records", `${snapshot.healthIncidents.length} recorded`],
        ["Production entries", `${snapshot.production.length} recorded`],
        ["Sales and expenses", `${snapshot.sales.length} sales · ${snapshot.expenses.length} expenses`],
      ].map(([label, value]) => (
        <li key={label} className="flex justify-between gap-3 py-3 text-sm">
          <span className="text-[#697368]">{label}</span>
          <span className="font-medium text-[#354237]">{value}</span>
        </li>
      ))}
    </ul>
  );
}

function SharedSummary({ snapshot, totals }: { snapshot: ReturnType<typeof getDemoDatabaseSnapshot>; totals: ReturnType<typeof getDashboardTotals> }) {
  return (
    <>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          ["Birds in active groups", totals.birds.toLocaleString()],
          ["Farm houses", String(totals.houses)],
          ["Recorded sales", money(totals.salesTotal)],
          ["Recorded farm spending", money(totals.expenseTotal)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[#f5f7f2] p-4">
            <dt className="text-xs text-[#697368]">{label}</dt>
            <dd className="mt-1 font-semibold text-[#354237]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-5 text-[#788174]">{snapshot.farmProfile.farmName} · {[snapshot.farmProfile.community, snapshot.farmProfile.lga, snapshot.farmProfile.state].filter(Boolean).join(", ")}</p>
    </>
  );
}

const actionPrimary = "inline-flex min-h-10 items-center rounded-full bg-[#244b35] px-4 py-2.5 text-xs font-semibold text-white";
const actionSecondary = "inline-flex min-h-10 items-center rounded-full bg-[#edf2e8] px-4 py-2.5 text-xs font-semibold text-[#355a3c]";
