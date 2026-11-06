"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, Bird, CalendarDays, Check, ClipboardList, MapPin, Search, ShieldCheck, Stethoscope, Wheat, Award } from "lucide-react";
import { institutionApi, getStoredToken } from "@/lib/api-client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SignalStatus = "On record" | "Follow up" | "Not recorded";
type ProfileSignal = { area: string; status: SignalStatus; detail: string };
type InsuranceDemoProfile = {
  id: string;
  farmer: string;
  farm: string;
  location: string;
  lga: string;
  state: string;
  production: string;
  birds: number;
  houses: number;
  cycle: string;
  updated: string;
  feedRecords: number;
  healthRecords: number;
  vaccinationRecords: number;
  productionRecords: number;
  financialRecords: number;
  assets: string[];
  signals: ProfileSignal[];
  riskScore?: number;
  riskBand?: string;
  isLive?: boolean;
};

// Fallback fictional consented sample records
const fallbackProfiles: InsuranceDemoProfile[] = [
  {
    id: "demo-kuru-01", farmer: "Demo Farmer 01", farm: "Kuru Layers Demo Farm", location: "Kuru, Jos South", lga: "Jos South", state: "Plateau", production: "Layers", birds: 3200, houses: 4,
    cycle: "Active layer cycle", updated: "4 November 2026", feedRecords: 8, healthRecords: 3, vaccinationRecords: 6, productionRecords: 12, financialRecords: 9,
    assets: ["Generator", "Water tank", "Egg trays", "Feed store"], signals: [
      { area: "Vaccination history", status: "On record", detail: "6 vaccination entries saved for active groups." },
      { area: "Bird health", status: "Follow up", detail: "3 health entries are recorded; review the latest incident notes with the farmer." },
      { area: "Flock movements", status: "On record", detail: "Opening counts and bird movements are available." },
      { area: "Farm operations", status: "On record", detail: "Feed and production records are available for the current cycle." },
      { area: "Financial records", status: "On record", detail: "Sales and expenses have been recorded in the demo profile." },
    ],
    riskScore: 82.0,
    riskBand: "Low Risk",
  },
  {
    id: "demo-barkin-02", farmer: "Demo Farmer 02", farm: "Barkin Ridge Poultry Demo", location: "Heipang, Barkin Ladi", lga: "Barkin Ladi", state: "Plateau", production: "Broilers", birds: 1850, houses: 3,
    cycle: "Broiler cycle · week 5", updated: "2 November 2026", feedRecords: 5, healthRecords: 2, vaccinationRecords: 4, productionRecords: 5, financialRecords: 4,
    assets: ["Brooder", "Water tank", "Feed store"], signals: [
      { area: "Vaccination history", status: "On record", detail: "4 vaccination entries saved for the current cycle." },
      { area: "Bird health", status: "Follow up", detail: "2 health entries are available for review." },
      { area: "Flock movements", status: "On record", detail: "Flock opening count and subsequent movement entries are saved." },
      { area: "Farm operations", status: "Follow up", detail: "Feed and production records are present, with gaps between some dates." },
      { area: "Financial records", status: "On record", detail: "Sales and expense entries are available." },
    ],
    riskScore: 68.0,
    riskBand: "Moderate Risk",
  },
];

const number = (value: number) => new Intl.NumberFormat("en-NG").format(value);

export function InstitutionPortfolioStatistics() {
  const sampleFarmCount = fallbackProfiles.length;
  const totalBirds = fallbackProfiles.reduce((sum, profile) => sum + profile.birds, 0);
  const totalHouses = fallbackProfiles.reduce((sum, profile) => sum + profile.houses, 0);
  const farmsForFollowUp = fallbackProfiles.filter((profile) => profile.signals.some((signal) => signal.status === "Follow up" || signal.status === "Not recorded")).length;
  const recordRows = [
    ["Vaccination entries", fallbackProfiles.reduce((sum, profile) => sum + profile.vaccinationRecords, 0)],
    ["Health entries", fallbackProfiles.reduce((sum, profile) => sum + profile.healthRecords, 0)],
    ["Feed entries", fallbackProfiles.reduce((sum, profile) => sum + profile.feedRecords, 0)],
    ["Production entries", fallbackProfiles.reduce((sum, profile) => sum + profile.productionRecords, 0)],
    ["Financial entries", fallbackProfiles.reduce((sum, profile) => sum + profile.financialRecords, 0)],
  ] as const;
  const riskMix = [
    { name: "Lower follow-up", value: fallbackProfiles.filter((profile) => profile.riskBand === "Low Risk").length, color: "#55734f" },
    { name: "Needs review", value: fallbackProfiles.filter((profile) => profile.riskBand !== "Low Risk").length, color: "#d2a64d" },
  ].filter((item) => item.value > 0);
  const flockMix = Object.entries(fallbackProfiles.reduce<Record<string, number>>((groups, profile) => {
    groups[profile.production] = (groups[profile.production] || 0) + profile.birds;
    return groups;
  }, {})).map(([name, birds]) => ({ name, birds }));

  return <div className="mx-auto max-w-5xl space-y-5">
    <header>
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Institution workspace · Portfolio overview</p>
      <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Poultry portfolio statistics</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">A quick view of sample farm, flock and record patterns for the institution demo.</p>
    </header>

    {/* <section className="rounded-[1.25rem] bg-[#eaf0e5] p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#55734f]"><Activity size={17} /></span><div><h2 className="text-sm font-semibold text-[#344a36]">Statistics are available by default</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-[#687664]">These totals use fictional sample farms only. They are not calculated from a farmer’s private records. Individual farm details stay hidden until that farmer enables sharing.</p></div></div>
    </section> */}

    <section aria-label="Sample portfolio totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Sample farms" value={number(sampleFarmCount)} detail="Fictional demo profiles" />
      <StatCard label="Birds across sample farms" value={number(totalBirds)} detail="Active poultry groups" />
      <StatCard label="Poultry houses" value={number(totalHouses)} detail="Across the sample farms" />
      <StatCard label="Farms with follow-up signals" value={number(farmsForFollowUp)} detail="Record gaps or items to review" />
    </section>

    <section aria-label="Sample portfolio charts" className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <div className="mb-4"><h2 className="text-sm font-semibold text-[#344236]">Farm record coverage</h2><p className="mt-1 text-xs leading-5 text-[#778173]">Entries saved across the sample portfolio.</p></div>
        <div className="h-64 w-full" role="img" aria-label="Bar chart showing sample vaccination, health, feed, production, and financial records">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recordRows.map(([name, entries]) => ({ name: name.replace(" entries", ""), entries }))} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
              <CartesianGrid stroke="#edf0e9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#778173", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#92998e", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f5f7f2" }} contentStyle={{ border: "0", borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} />
              <Bar dataKey="entries" name="Saved entries" fill="#55734f" radius={[6, 6, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="rounded-[1.25rem] bg-white p-5 sm:p-6">
        <div className="mb-2"><h2 className="text-sm font-semibold text-[#344236]">Flock types and review signals</h2><p className="mt-1 text-xs leading-5 text-[#778173]">Bird counts by production type, with profile review status.</p></div>
        <div className="grid items-center gap-3 sm:grid-cols-[1fr_180px]">
          <div className="h-56 min-w-0" role="img" aria-label="Bar chart comparing sample bird counts by production type">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flockMix} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid stroke="#edf0e9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#778173", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#92998e", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f5f7f2" }} contentStyle={{ border: "0", borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} />
                <Bar dataKey="birds" name="Birds" fill="#8aa17d" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex min-w-0 items-center gap-3 sm:block">
            <div className="h-36 w-36 shrink-0" role="img" aria-label="Donut chart showing sample profiles by follow-up status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={riskMix} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={4} stroke="none">{riskMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ border: "0", borderRadius: 12, boxShadow: "0 8px 24px rgba(35,52,37,.12)", fontSize: 12 }} /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="min-w-0 space-y-2 text-[10px] text-[#687465]"><p className="font-semibold text-[#344236]">Profile review</p><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#55734f]" />Lower follow-up <b className="ml-auto text-[#344236]">{riskMix.find((item) => item.name === "Lower follow-up")?.value || 0}</b></div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d2a64d]" />Needs review <b className="ml-auto text-[#344236]">{riskMix.find((item) => item.name === "Needs review")?.value || 0}</b></div></div>
          </div>
        </div>
      </article>
    </section>

    <section className="rounded-[1.25rem] bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-[#344236]">Records represented in the sample</h2>
      <p className="mt-1 text-xs leading-5 text-[#778173]">Combined record counts across the fictional profiles; no farm names or farmer contact details are included here.</p>
      <div className="mt-3 divide-y divide-[#edf0e9]">{recordRows.map(([label, count]) => <div key={label} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="text-[#697368]">{label}</span><span className="font-semibold text-[#354237]">{number(count)}</span></div>)}</div>
      <Link href="/institution/risk-profiles" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#244b35] px-4 text-xs font-semibold text-white transition hover:bg-[#193d2b]">Explore sample profiles<ArrowRight size={14} /></Link>
    </section>
    <p className="text-[10px] leading-5 text-[#8a9285]">Sample portfolio statistics demonstrate the product only. They are not a market estimate, insurance assessment, or underwriting decision.</p>
  </div>;
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded-[1.15rem] bg-white p-4 sm:p-5"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#84907e]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-[#29352a]">{value}</p><p className="mt-1 text-[10px] leading-4 text-[#7b8478]">{detail}</p></article>;
}

export function InsuranceRiskProfiles() {
  const [profiles, setProfiles] = useState<InsuranceDemoProfile[]>(fallbackProfiles);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assessing, setAssessing] = useState(false);
  const [assessmentNote, setAssessmentNote] = useState("");
  const [assessmentSuccess, setAssessmentSuccess] = useState("");

  useEffect(() => {
    async function loadPortfolio() {
      if (!getStoredToken()) return;
      setLoading(true);
      try {
        const farms = await institutionApi.getPortfolioFarms();
        if (Array.isArray(farms) && farms.length > 0) {
          const liveProfiles = await Promise.all(
            farms.map(async (farm) => {
              try {
                const rp = await institutionApi.getFarmRiskProfile(farm.id);
                return {
                  id: String(farm.id),
                  farmer: rp.farmer_name || farm.owner_name,
                  farm: rp.farm_name || farm.farm_name,
                  location: rp.location || `${farm.community}, ${farm.lga}`,
                  lga: rp.lga || farm.lga,
                  state: rp.state || farm.state,
                  production: rp.production_type || farm.production_system,
                  birds: rp.total_birds,
                  houses: rp.houses_count,
                  cycle: `${rp.production_type} cycle`,
                  updated: "Live from backend",
                  feedRecords: rp.feed_records_count,
                  healthRecords: rp.health_records_count,
                  vaccinationRecords: rp.vaccination_records_count,
                  productionRecords: rp.production_records_count,
                  financialRecords: rp.financial_records_count,
                  assets: farm.biosecurity || ["Water system", "Fencing"],
                  signals: rp.signals as ProfileSignal[],
                  riskScore: rp.risk_score,
                  riskBand: rp.risk_band,
                  isLive: true,
                };
              } catch {
                return null;
              }
            })
          );
          const valid = liveProfiles.filter(Boolean) as InsuranceDemoProfile[];
          if (valid.length > 0) {
            setProfiles(valid);
          }
        }
      } catch (err) {
        // Fall back gracefully to sample profiles
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return profiles.filter((profile) => !search || `${profile.farm} ${profile.location} ${profile.production}`.toLocaleLowerCase().includes(search));
  }, [profiles, query]);

  const selected = profiles.find((profile) => profile.id === selectedId);

  const handleCreateAssessment = async () => {
    if (!selected || !selected.isLive) return;
    setAssessing(true);
    setAssessmentSuccess("");
    try {
      await institutionApi.createAssessment({
        farm_id: selected.id,
        score: selected.riskScore || 75.0,
        risk_band: selected.riskBand || "Low Risk",
        notes: assessmentNote.trim() || undefined,
        metrics: {
          birds: selected.birds,
          houses: selected.houses,
          signalsCount: selected.signals.length,
        },
      });
      setAssessmentSuccess("Assessment record saved successfully to the institutional database.");
      setAssessmentNote("");
    } catch (e: any) {
      alert(e.message || "Could not save assessment.");
    } finally {
      setAssessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#587354]">Institution workspace · Portfolio records</p>
        <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-[#20291f] sm:text-3xl">Farmer risk profiles</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d70]">Explore verified farm operations, flock status, biosecurity, and health records supporting underwriting.</p>
      </header>

      <section className="flex flex-col gap-3 rounded-[1.25rem] bg-[#eaf0e5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#55734f]">
            <ShieldCheck size={17} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#344a36]">
              {profiles.some((p) => p.isLive) ? "Live authorized farm portfolios" : "Sample profiles for the institution demo"}
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#687664]">
              {profiles.some((p) => p.isLive)
                ? "Risk scores and signal indicators are computed deterministically from operational records in the JARI database."
                : "These sample poultry farms demonstrate the profile view with signal breakdown."}
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-[#547253]">
          {loading ? "Loading..." : `${profiles.length} farms available`}
        </div>
      </section>

      <label className="relative block max-w-lg">
        <span className="sr-only">Search farm or location</span>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85907f]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by farm or location" className="input-shell pl-10" />
      </label>

      {selected ? (
        <div className="space-y-4">
          <ProfileDetails profile={selected} onBack={() => { setSelectedId(null); setAssessmentSuccess(""); }} />
          {selected.isLive && (
            <section className="rounded-[1.25rem] bg-white p-5 sm:p-6 space-y-3 border border-[#e0e8db]">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#3b593f]" />
                <h3 className="text-sm font-semibold text-[#29352a]">Save Underwriting Assessment</h3>
              </div>
              <p className="text-xs text-[#717b6e]">
                Persist a formal assessment decision with calculated score ({selected.riskScore?.toFixed(1)} / 100 - {selected.riskBand}).
              </p>
              {assessmentSuccess && (
                <p className="rounded-lg bg-[#edf4ea] p-3 text-xs text-[#3b593f] font-medium">{assessmentSuccess}</p>
              )}
              <textarea
                value={assessmentNote}
                onChange={(e) => setAssessmentNote(e.target.value)}
                placeholder="Underwriter notes, policy terms, or verification conditions..."
                className="input-shell min-h-[70px]"
              />
              <button
                type="button"
                disabled={assessing}
                onClick={handleCreateAssessment}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#244b35] px-5 text-xs font-semibold text-white hover:bg-[#193d2b] disabled:opacity-50"
              >
                {assessing ? "Saving..." : "Record Assessment Decision"}
              </button>
            </section>
          )}
        </div>
      ) : filtered.length ? (
        <section aria-label="Farmer risk profiles" className="grid gap-3 sm:grid-cols-2">
          {filtered.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onOpen={() => setSelectedId(profile.id)} />
          ))}
        </section>
      ) : (
        <div className="rounded-[1.25rem] bg-white p-8 text-center text-sm text-[#697368]">No profiles match that search.</div>
      )}

      <p className="text-[10px] leading-5 text-[#8a9285]">
        JARI deterministic risk models analyze mortality, biosecurity, KYC verification, and operations continuity.
      </p>
    </div>
  );
}

function ProfileCard({ profile, onOpen }: { profile: InsuranceDemoProfile; onOpen: () => void }) {
  const followUps = profile.signals.filter((signal) => signal.status === "Follow up" || signal.status === "Not recorded").length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-[1.25rem] bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-[#fbfcf9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8c67] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]">
            <Bird size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#799071]">{profile.farmer} · {profile.production}</p>
            <h2 className="mt-1 truncate font-serif text-lg font-medium text-[#2f3c30]">{profile.farm}</h2>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
          profile.riskBand === "Low Risk" ? "bg-[#e8f1e4] text-[#3c5d3a]" : "bg-[#f5f0e4] text-[#806c3d]"
        }`}>
          {profile.riskBand || "Assessed"}
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-[#70796e]"><MapPin size={13} className="text-[#799071]" />{profile.location}, {profile.state}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniMetric icon={<Bird size={13} />} label="Active birds" value={number(profile.birds)} />
        <MiniMetric icon={<Activity size={13} />} label="Houses" value={String(profile.houses)} />
        <MiniMetric icon={<ClipboardList size={13} />} label="Follow-ups" value={String(followUps)} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-[#85907f]">
        <span>Score: {profile.riskScore ? `${profile.riskScore.toFixed(0)}/100` : "Calculated"}</span>
        <span className="font-semibold text-[#47674a] transition group-hover:text-[#244b35]">View profile <span aria-hidden="true">→</span></span>
      </div>
    </button>
  );
}

function ProfileDetails({ profile, onBack }: { profile: InsuranceDemoProfile; onBack: () => void }) {
  return (
    <article className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[#4f694e] transition hover:bg-[#eaf0e5]">
        <ArrowLeft size={15} />All profiles
      </button>
      <section className="rounded-[1.35rem] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#55734f]">
              <Bird size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#799071]">Risk Assessment Profile · {profile.farmer}</p>
              <h2 className="mt-1 font-serif text-xl font-medium text-[#2f3c30] sm:text-2xl">{profile.farm}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#737d70]"><MapPin size={13} />{profile.location}, {profile.state}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#edf2e8] px-3 py-1.5 text-xs font-semibold text-[#3b593f]">
              <Check size={14} /> Score: {profile.riskScore?.toFixed(1) || "80.0"} ({profile.riskBand || "Low Risk"})
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailMetric label="Production type" value={profile.production} />
          <DetailMetric label="Active birds" value={number(profile.birds)} />
          <DetailMetric label="Farm houses" value={String(profile.houses)} />
          <DetailMetric label="Current cycle" value={profile.cycle} />
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[1.25rem] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Stethoscope size={16} className="text-[#607d58]" />
            <h3 className="text-sm font-semibold text-[#344236]">Farm record signals</h3>
          </div>
          <p className="mt-1 text-xs leading-5 text-[#778173]">Evaluates record continuity across operational and health ledgers.</p>
          <div className="mt-4 space-y-2">
            {profile.signals.map((signal) => (
              <SignalRow key={signal.area} signal={signal} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <section className="rounded-[1.25rem] bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[#344236]">Records on file</h3>
            <div className="mt-3 space-y-1">
              {[
                [<ShieldCheck size={14} />, "Vaccination entries", profile.vaccinationRecords],
                [<Stethoscope size={14} />, "Health entries", profile.healthRecords],
                [<Wheat size={14} />, "Feed entries", profile.feedRecords],
                [<Activity size={14} />, "Production entries", profile.productionRecords],
                [<CalendarDays size={14} />, "Sales and expenses", profile.financialRecords],
              ].map(([icon, label, value]) => (
                <div key={String(label)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs">
                  <span className="text-[#819378]">{icon}</span>
                  <span className="flex-1 text-[#667162]">{label}</span>
                  <span className="font-semibold text-[#39483a]">{value}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[1.25rem] bg-[#f0f3ed] p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[#344236]">Biosecurity & Assets</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.assets.map((asset) => (
                <span key={asset} className="rounded-full bg-white px-3 py-1.5 text-[10px] text-[#667162]">{asset}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </article>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f6f7f3] p-2.5">
      <span className="flex items-center gap-1.5 text-[#7c8a75]">
        {icon}
        <span className="text-[9px] font-medium text-[#7c8578]">{label}</span>
      </span>
      <span className="mt-1 block text-sm font-semibold text-[#364438]">{value}</span>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f5f7f2] p-3.5">
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#81907a]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#354237]">{value}</p>
    </div>
  );
}

function SignalRow({ signal }: { signal: ProfileSignal }) {
  const tone = signal.status === "On record" ? "bg-[#edf3e9] text-[#4f714b]" : signal.status === "Follow up" ? "bg-[#f5f0e4] text-[#806c3d]" : "bg-[#f1f2ef] text-[#72796f]";
  return (
    <div className="rounded-xl bg-[#f8f9f6] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#3f4b40]">{signal.area}</p>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${tone}`}>{signal.status}</span>
      </div>
      <p className="mt-1.5 text-[11px] leading-5 text-[#707a6d]">{signal.detail}</p>
    </div>
  );
}
