import type { getDemoDatabaseSnapshot } from "@/lib/simulated-data";

export type OpportunityKind = "Grant" | "Loan" | "Insurance";
export type RequirementResult = { label: string; met: boolean };
type FarmSnapshot = ReturnType<typeof getDemoDatabaseSnapshot>;

export function getOpportunityRequirementChecks(snapshot: FarmSnapshot, type: OpportunityKind): RequirementResult[] {
  const activeBirds = snapshot.flocks.filter((flock) => flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0);
  const farmLocationSaved = Boolean(snapshot.farmProfile.farmName.trim() && snapshot.farmProfile.community.trim() && snapshot.farmProfile.state.trim());
  const hasFeedRecords = snapshot.feedPurchases.length > 0 || snapshot.feedUse.length > 0;
  const hasHealthAndVaccination = snapshot.vaccinations.length > 0 && (snapshot.healthIncidents.length > 0 || snapshot.treatments.length > 0);
  const criteria: Record<string, boolean> = {
    farm: farmLocationSaved,
    birds: farmLocationSaved && activeBirds > 0,
    production: snapshot.production.length > 0,
    housing: farmLocationSaved && snapshot.poultryHouses.some((house) => !house.archived),
    plan: snapshot.poultryHouses.some((house) => !house.archived) || snapshot.assets.length > 0,
    sales: snapshot.sales.length > 0,
    costs: hasFeedRecords && snapshot.expenses.length > 0,
    flock: snapshot.flocks.length > 0 && snapshot.flockMovements.length > 0,
    care: hasHealthAndVaccination,
  };
  const requirementIds: Record<OpportunityKind, string[]> = {
    Grant: ["farm", "production", "plan"],
    Loan: ["birds", "sales", "costs"],
    Insurance: ["housing", "flock", "care"],
  };
  const labels: Record<string, string> = {
    farm: "Farm profile and location",
    birds: "Farm profile and bird numbers",
    production: "Recent production records",
    housing: "Farm profile and house details",
    plan: "Housing or equipment plan",
    sales: "Recent sales records",
    costs: "Feed and operating expense records",
    flock: "Bird groups and movement records",
    care: "Vaccination and bird health records",
  };
  return requirementIds[type].map((id) => ({ label: labels[id], met: criteria[id] }));
}

export function getJariProfileScore(snapshot: FarmSnapshot) {
  const activeBirds = snapshot.flocks.some((flock) => flock.status === "Active" && flock.birds > 0);
  const domains = [
    Boolean(snapshot.farmProfile.farmName.trim() && snapshot.farmProfile.community.trim() && snapshot.farmProfile.state.trim()),
    activeBirds,
    snapshot.vaccinations.length > 0 && (snapshot.healthIncidents.length > 0 || snapshot.treatments.length > 0),
    snapshot.production.length > 0 && (snapshot.feedPurchases.length > 0 || snapshot.feedUse.length > 0),
    snapshot.sales.length > 0 && snapshot.expenses.length > 0,
  ];
  return Math.round((domains.filter(Boolean).length / domains.length) * 100);
}
