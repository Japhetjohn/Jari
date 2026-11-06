import { getFeedInventory, getInstitutionRequests, getKycApplication, getOpportunityApplications, getVaccinationRecords } from "@/lib/simulated-data";

export type FarmNotification = { id: string; title: string; detail: string; time: string; fullText: string; href: string; requestId?: string };

export function getFarmNotifications(): FarmNotification[] {
  const items: FarmNotification[] = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const vaccinationDate = (value: string) => new Date(`${value}T00:00:00`);
  const due = getVaccinationRecords().filter((record) => record.nextDate && !Number.isNaN(vaccinationDate(record.nextDate).getTime())).sort((a, b) => (a.nextDate || "").localeCompare(b.nextDate || ""))[0];
  if (due?.nextDate) { const overdue = vaccinationDate(due.nextDate) < today; items.push({ id: `vaccine-${due.id}`, title: overdue ? "Vaccination follow-up is due" : "Vaccination date coming up", detail: `${due.flock} · ${due.nextDate}`, time: "Farm record", fullText: `Your saved vaccination record lists ${due.vaccine} for ${due.nextDate}. Check the timing with your animal health worker.`, href: "/health/vaccinations" }); }
  const stock = getFeedInventory().reduce((sum, item) => sum + item.availableKg, 0);
  items.push({ id: "feed-stock", title: stock < 100 ? "Check feed stock" : "Feed stock recorded", detail: `${Math.round(stock).toLocaleString()} kg available in saved records`, time: "Farm record", fullText: "This figure is calculated from feed purchases and usage entered in the demo. Update those records if the physical stock is different.", href: "/feed" });
  const kyc = getKycApplication();
  if (kyc?.status === "pending") items.push({ id: "farm-review", title: "Farm review request saved", detail: "Your request is waiting for review in this demo.", time: "Farm record", fullText: "The request is stored in this browser only. It has not been sent to a JARI server or team member.", href: "/kyc" });
  else if (kyc?.status === "needs_changes") items.push({ id: "farm-review", title: "Farm details need an update", detail: kyc.reviewNote || "Open your farm review request for details.", time: "Farm record", fullText: kyc.reviewNote || "Check the farm review page for the recorded note, update your details and send the request again.", href: "/kyc" });
  else if (!kyc) items.push({ id: "farm-review", title: "Farm review is available", detail: "You can ask for a review of your farm details.", time: "JARI", fullText: "A farm review is required before JARI can prepare a reviewed farm profile. No automated risk rating is currently available.", href: "/kyc" });
  const request = getInstitutionRequests().find((record) => record.status === "Open");
  if (request) items.push({ id: `institution-request-${request.id}`, requestId: request.id, title: `Request from ${request.institutionName}`, detail: request.purpose, time: new Date(request.createdAt).toLocaleDateString(), fullText: request.message, href: "/notifications" });
  const reviewed = getOpportunityApplications().find((record) => record.status === "Needs information" || record.status === "Reviewed");
  if (reviewed) items.push({ id: `opportunity-${reviewed.id}`, title: "Opportunity update", detail: `${reviewed.opportunityName} · ${reviewed.status}`, time: new Date(reviewed.createdAt).toLocaleDateString(), fullText: reviewed.note, href: "/opportunities" });
  return items.slice(0, 8);
}
