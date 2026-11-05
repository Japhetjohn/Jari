export type SavedFarmProfile = {
    farmName: string;
    ownerName: string;
    phone: string;
    community: string;
    lga: string;
    state: string;
    establishmentDate: string;
    operationType: string;
    productionSystem: string;
    numberOfHouses: string;
    waterSource: string;
    numberOfWorkers: string;
    biosecurity: string[];
};

export type KycApplication = {
    farmName: string;
    location: string;
    phone: string;
    status: "pending" | "approved" | "needs_changes";
    submittedAt: string;
    reviewedAt?: string;
    reviewNote?: string;
};

export type FarmAssetRecord = {
    name: string;
    quantity: number;
    status: "Working" | "Needs repair";
    value: number;
    notes?: string;
};

export type FeedPurchaseRecord = {
    id: string;
    date: string;
    feedType: string;
    brand: string;
    supplier: string;
    quantity: number;
    unit: "bags" | "kg";
    bagWeightKg: number;
    amount: number;
    amountPaid: number;
    flock?: string;
};

export type FeedUseRecord = {
    id: string;
    date: string;
    feedType: string;
    quantityKg: number;
    flock: string;
    notes?: string;
};

export type ProductionRecord = {
    id: string;
    date: string;
    flock: string;
    type: string;
    liveBirds: number;
    eggsCollected: number;
    goodEggs: number;
    damagedEggs: number;
    birdsWeighed: number;
    averageWeight: number;
    birdsReady: number;
    notes?: string;
};

export type FarmHouseRecord = {
    name: string;
    system: string;
    capacity: number;
    water: string;
    feedStorage: boolean;
    ventilation?: string;
    condition?: string;
    notes?: string;
    archived?: boolean;
};

export type FlockRecord = {
    id?: string;
    name: string;
    type: string;
    house: string;
    birds: number;
    status: "Active" | "Completed";
    breed?: string;
    acquisitionDate?: string;
    cycleStart?: string;
    source?: string;
    ageAtAcquisition?: number;
    ageUnit?: string;
    purchaseCost?: number;
};

export type FarmFlockMovement = {
    id: string;
    flock: string;
    date: string;
    type: "Initial stocking" | "Bird acquisition" | "Additional stocking" | "Mortality" | "Sale" | "Transfer in" | "Transfer out" | "Adjustment";
    quantity: number;
    reason: string;
    notes?: string;
};

export type SalesEntry = { id?: string; date: string; item?: string; product?: string; amount: number | string; amountReceived?: number; quantity?: number; unit?: string; flock?: string; status?: string; outstanding?: number };
export type ExpenseEntry = { id?: string; date: string; category: string; amount: number | string; amountPaid?: number; outstanding?: number; flock?: string; note?: string };
export type OpportunityApplicationRecord = { id: string; opportunityId: string; opportunityName: string; type: string; status: "Interested" | "Preparing" | "Submitted"; note: string; createdAt: string };
export type UserPreferences = { productionReminders: boolean; healthReminders: boolean; financialUpdates: boolean; analyticsConsent: boolean };
export type FarmDocumentRecord = { id: string; name: string; type: string; size: number; addedAt: string; dataUrl: string };

const storageSchemaVersion = 1;
const storagePrefix = `jari-demo:v${storageSchemaVersion}:`;

const scopedStorageKey = (key: string) => `${storagePrefix}${key}`;

const emitDataChanged = (key: string) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key } }));
    }
};

const readStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const versioned = scopedStorageKey(key);
        const stored = window.localStorage.getItem(versioned);
        if (stored) return JSON.parse(stored) as T;

        // One-time migration keeps demo records created by earlier JARI builds.
        const legacy = window.localStorage.getItem(key);
        if (legacy) {
            window.localStorage.setItem(versioned, legacy);
            return JSON.parse(legacy) as T;
        }
        return fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = <T,>(key: string, value: T) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
        emitDataChanged(key);
    }
};

export const STORAGE_KEYS = {
    farmProfile: "jari-simulated-farm-profile",
    flockRecords: "jari-simulated-flocks",
    poultryHouses: "jari-simulated-poultry-houses",
    productionRecords: "jari-simulated-production",
    salesRecords: "jari-simulated-sales",
    expensesRecords: "jari-simulated-expenses",
    kycApplication: "jari-simulated-kyc-application",
    farmAssets: "jari-simulated-farm-assets",
    feedPurchases: "jari-simulated-feed-purchases",
    feedUse: "jari-simulated-feed-use",
    production: "jari-simulated-production",
    vaccinations: "jari-simulated-vaccinations",
    healthIncidents: "jari-simulated-health-incidents",
    flockMovements: "jari-simulated-flock-movements",
    applications: "jari-simulated-applications",
    activity: "jari-simulated-activity",
    documents: "jari-simulated-documents",
    opportunityApplications: "jari-simulated-opportunity-applications",
    userPreferences: "jari-simulated-user-preferences",
};

export const defaultFarmProfile: SavedFarmProfile = {
    farmName: "Golden Feathers Poultry",
    ownerName: "Amina Daniel",
    phone: "08030000000",
    community: "Kuru",
    lga: "Jos South",
    state: "Plateau",
    establishmentDate: "2020-01-01",
    operationType: "Broiler",
    productionSystem: "Deep litter",
    numberOfHouses: "4",
    waterSource: "Borehole",
    numberOfWorkers: "6",
    biosecurity: ["Restricted farm access", "Footbath", "Disinfection", "Visitor control"],
};

export const getFarmProfile = () => readStorage<SavedFarmProfile>(STORAGE_KEYS.farmProfile, defaultFarmProfile);
export const saveFarmProfile = (value: SavedFarmProfile) => writeWithActivity(STORAGE_KEYS.farmProfile, value);
export const getKycApplication = () => readStorage<KycApplication | null>(STORAGE_KEYS.kycApplication, null);
export const saveKycApplication = (value: KycApplication) => writeWithActivity(STORAGE_KEYS.kycApplication, value);

export const getFlockRecords = () => readStorage<FlockRecord[]>(STORAGE_KEYS.flockRecords, [
    { name: "Broiler Batch 02", type: "Broiler", house: "House A", birds: 1400, status: "Active", breed: "Ross 308" },
    { name: "Layer Batch 05", type: "Layer", house: "House B", birds: 1600, status: "Active", breed: "Isa Brown" },
    { name: "Breeder Batch 01", type: "Breeder", house: "House C", birds: 520, status: "Completed", breed: "Cobb 500" },
]);
export const saveFlockRecords = (value: FlockRecord[]) => writeWithActivity(STORAGE_KEYS.flockRecords, value);

export const getFlockMovements = () => readStorage<FarmFlockMovement[]>(STORAGE_KEYS.flockMovements, getFlockRecords().map((flock) => ({
    id: `opening-${flock.id || flock.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    flock: flock.name,
    date: flock.acquisitionDate || flock.cycleStart || "2026-01-01",
    type: "Initial stocking",
    quantity: Number(flock.birds) || 0,
    reason: "Opening population from the farm's demo records",
})));
export const saveFlockMovements = (value: FarmFlockMovement[]) => writeStorage(STORAGE_KEYS.flockMovements, value);

export const addFlockMovement = (movement: Omit<FarmFlockMovement, "id">) => {
    const quantity = Number(movement.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Enter a quantity greater than zero.");
    const flocks = getFlockRecords();
    const flockIndex = flocks.findIndex((flock) => flock.name === movement.flock);
    if (flockIndex < 0) throw new Error("Choose a bird group that exists on your farm.");
    const reducesBirds = ["Mortality", "Sale", "Transfer out"].includes(movement.type);
    const nextCount = flocks[flockIndex].birds + (reducesBirds ? -quantity : quantity);
    if (nextCount < 0) throw new Error("This record is greater than the number of birds in the group.");
    const nextFlocks = [...flocks];
    nextFlocks[flockIndex] = { ...nextFlocks[flockIndex], birds: nextCount, status: nextCount === 0 ? "Completed" : "Active" };
    const nextMovement: FarmFlockMovement = { ...movement, id: idFor("movement"), quantity };
    const movements = getFlockMovements();
    saveFlockRecords(nextFlocks);
    saveFlockMovements([...movements, nextMovement]);
    return nextMovement;
};

export const createFlockRecord = (flock: Omit<FlockRecord, "id" | "birds" | "status"> & { birds: number }) => {
    const existing = getFlockRecords();
    if (existing.some((record) => record.name.toLowerCase() === flock.name.trim().toLowerCase())) throw new Error("A bird group with this name already exists.");
    if (!Number.isFinite(flock.birds) || flock.birds <= 0) throw new Error("Enter an opening number of birds greater than zero.");
    const house = getPoultryHouses().find((item) => item.name === flock.house);
    if (!house) throw new Error("Choose a farm house that exists on your farm.");
    const alreadyInHouse = existing.filter((record) => record.house === flock.house && record.status === "Active").reduce((total, record) => total + record.birds, 0);
    if (alreadyInHouse <= house.capacity && alreadyInHouse + flock.birds > house.capacity) throw new Error("This group would be larger than the remaining space in that house.");
    const created: FlockRecord = { ...flock, id: idFor("flock"), name: flock.name.trim(), status: "Active", birds: flock.birds };
    const movements = getFlockMovements();
    const initialMovement: FarmFlockMovement = { id: idFor("movement"), flock: created.name, date: flock.acquisitionDate || flock.cycleStart || new Date().toISOString().slice(0, 10), type: "Initial stocking", quantity: flock.birds, reason: "Opening bird count" };
    saveFlockRecords([...existing, created]);
    saveFlockMovements([...movements, initialMovement]);
    return created;
};

export const getPoultryHouses = () => readStorage<FarmHouseRecord[]>(STORAGE_KEYS.poultryHouses, [
    { name: "House A", system: "Deep litter", capacity: 1200, water: "Borehole", feedStorage: true },
    { name: "House B", system: "Deep litter", capacity: 1400, water: "Borehole", feedStorage: true },
    { name: "House C", system: "Battery cage", capacity: 1800, water: "Well", feedStorage: false },
]);
export const savePoultryHouses = (value: FarmHouseRecord[]) => writeWithActivity(STORAGE_KEYS.poultryHouses, value);

export const createPoultryHouse = (house: FarmHouseRecord) => {
    const houses = getPoultryHouses();
    if (houses.some((item) => item.name.trim().toLowerCase() === house.name.trim().toLowerCase())) throw new Error("A farm house with this name already exists.");
    if (!house.name.trim() || !Number.isFinite(house.capacity) || house.capacity < 1) throw new Error("Add a house name and a capacity greater than zero.");
    const created = { ...house, name: house.name.trim() };
    savePoultryHouses([...houses, created]);
    return created;
};

export const updatePoultryHouse = (previousName: string, updated: FarmHouseRecord) => {
    const houses = getPoultryHouses();
    if (houses.some((item) => item.name !== previousName && item.name.trim().toLowerCase() === updated.name.trim().toLowerCase())) throw new Error("A farm house with this name already exists.");
    if (!updated.name.trim() || !Number.isFinite(updated.capacity) || updated.capacity < 1) throw new Error("Add a house name and a capacity greater than zero.");
    const assignedBirds = getFlockRecords().filter((flock) => flock.house === previousName && flock.status === "Active").reduce((total, flock) => total + flock.birds, 0);
    if (updated.capacity < assignedBirds) throw new Error(`This house has ${assignedBirds} birds. Its capacity cannot be set lower than that.`);
    const next = houses.map((item) => item.name === previousName ? { ...updated, name: updated.name.trim() } : item);
    if (!houses.some((item) => item.name === previousName)) throw new Error("This farm house could not be found.");
    const nextFlocks = getFlockRecords().map((flock) => flock.house === previousName ? { ...flock, house: updated.name.trim() } : flock);
    savePoultryHouses(next);
    if (updated.name !== previousName) saveFlockRecords(nextFlocks);
    return updated;
};

export const archivePoultryHouse = (name: string) => {
    const hasActiveBirds = getFlockRecords().some((flock) => flock.house === name && flock.status === "Active");
    if (hasActiveBirds) throw new Error("Move or finish the bird groups in this house before archiving it.");
    savePoultryHouses(getPoultryHouses().map((house) => house.name === name ? { ...house, archived: true } : house));
};

export const getProductionRecords = () => readStorage<ProductionRecord[]>(STORAGE_KEYS.productionRecords, [
    { id: "production-001", date: "2026-10-10", flock: "Layer Batch 05", type: "Layer", liveBirds: 1600, eggsCollected: 320, goodEggs: 300, damagedEggs: 20, birdsWeighed: 0, averageWeight: 0, birdsReady: 0 },
    { id: "production-002", date: "2026-10-12", flock: "Broiler Batch 02", type: "Broiler", liveBirds: 1400, eggsCollected: 0, goodEggs: 0, damagedEggs: 0, birdsWeighed: 0, averageWeight: 0, birdsReady: 280 },
    { id: "production-003", date: "2026-10-18", flock: "Layer Batch 05", type: "Layer", liveBirds: 1600, eggsCollected: 410, goodEggs: 390, damagedEggs: 20, birdsWeighed: 0, averageWeight: 0, birdsReady: 0 },
]);
export const saveProductionRecords = (value: ProductionRecord[]) => writeWithActivity(STORAGE_KEYS.productionRecords, value);

export const getSalesRecords = () => readStorage<SalesEntry[]>(STORAGE_KEYS.salesRecords, [
    { date: "08 Oct 2026", item: "Live broilers", amount: "₦360,000" },
    { date: "16 Oct 2026", item: "Eggs", amount: "₦200,000" },
    { date: "24 Oct 2026", item: "Manure", amount: "₦70,000" },
]);
export const saveSalesRecords = (value: SalesEntry[]) => writeWithActivity(STORAGE_KEYS.salesRecords, value);

export const getExpensesRecords = () => readStorage<ExpenseEntry[]>(STORAGE_KEYS.expensesRecords, [
    { date: "06 Oct 2026", category: "Labour", amount: "₦120,000" },
    { date: "14 Oct 2026", category: "Utilities", amount: "₦58,000" },
    { date: "20 Oct 2026", category: "Veterinary", amount: "₦76,500" },
]);
export const saveExpensesRecords = (value: ExpenseEntry[]) => writeWithActivity(STORAGE_KEYS.expensesRecords, value);

export const getFarmAssets = () => readStorage<FarmAssetRecord[]>(STORAGE_KEYS.farmAssets, [
    { name: "Feed mixer", quantity: 1, status: "Working", value: 320000, notes: "Used to prepare feed for the bird groups." },
    { name: "Water tank", quantity: 3, status: "Working", value: 180000, notes: "Stores water for the farm houses." },
    { name: "Generator", quantity: 1, status: "Needs repair", value: 410000, notes: "Needs a service check before regular use." },
]);
export const saveFarmAssets = (value: FarmAssetRecord[]) => writeWithActivity(STORAGE_KEYS.farmAssets, value);

const idFor = (prefix: string) => `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;

const activityLabels: Record<string, string> = {
    [STORAGE_KEYS.farmProfile]: "Farm details updated",
    [STORAGE_KEYS.flockRecords]: "Bird group records updated",
    [STORAGE_KEYS.poultryHouses]: "Farm house records updated",
    [STORAGE_KEYS.productionRecords]: "Production record added",
    [STORAGE_KEYS.salesRecords]: "Sale recorded",
    [STORAGE_KEYS.expensesRecords]: "Farm spending recorded",
    [STORAGE_KEYS.farmAssets]: "Equipment details updated",
    [STORAGE_KEYS.feedPurchases]: "Feed purchase recorded",
    [STORAGE_KEYS.feedUse]: "Feed use recorded",
    [STORAGE_KEYS.vaccinations]: "Vaccination record added",
    [STORAGE_KEYS.healthIncidents]: "Bird health record added",
    [STORAGE_KEYS.opportunityApplications]: "Opportunity application updated",
    [STORAGE_KEYS.documents]: "Farm document updated",
};

export type ActivityRecord = { id: string; text: string; createdAt: string };
export const getActivityRecords = () => readStorage<ActivityRecord[]>(STORAGE_KEYS.activity, []);
export const saveActivityRecord = (text: string) => {
    const event = { id: idFor("activity"), text, createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.activity, [event, ...getActivityRecords()].slice(0, 100));
};

export const getOpportunityApplications = () => readStorage<OpportunityApplicationRecord[]>(STORAGE_KEYS.opportunityApplications, []);
export const applyToOpportunity = (application: Omit<OpportunityApplicationRecord, "id" | "createdAt" | "status">) => {
    const records = getOpportunityApplications();
    if (records.some((record) => record.opportunityId === application.opportunityId)) throw new Error("You have already saved this opportunity.");
    const created: OpportunityApplicationRecord = { ...application, id: idFor("application"), status: "Interested", createdAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.opportunityApplications, [...records, created]);
    return created;
};
export const updateOpportunityApplication = (id: string, status: OpportunityApplicationRecord["status"], note?: string) => {
    const records = getOpportunityApplications();
    if (!records.some((record) => record.id === id)) throw new Error("Application not found.");
    const next = records.map((record) => record.id === id ? { ...record, status, note: note ?? record.note } : record);
    writeWithActivity(STORAGE_KEYS.opportunityApplications, next);
    return next;
};
export const getUserPreferences = () => readStorage<UserPreferences>(STORAGE_KEYS.userPreferences, { productionReminders: true, healthReminders: true, financialUpdates: true, analyticsConsent: false });
export const saveUserPreferences = (preferences: UserPreferences) => writeStorage(STORAGE_KEYS.userPreferences, preferences);
export const getFarmDocuments = () => readStorage<FarmDocumentRecord[]>(STORAGE_KEYS.documents, []);
export const addFarmDocument = (document: Omit<FarmDocumentRecord, "id" | "addedAt">) => {
    if (!document.name.trim() || !document.dataUrl.startsWith("data:")) throw new Error("Choose a valid file to upload.");
    if (document.size > 1_500_000) throw new Error("This demo supports files up to 1.5 MB.");
    const next: FarmDocumentRecord = { ...document, id: idFor("document"), name: document.name.trim(), addedAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.documents, [...getFarmDocuments(), next]);
    return next;
};
export const removeFarmDocument = (id: string) => writeWithActivity(STORAGE_KEYS.documents, getFarmDocuments().filter((item) => item.id !== id));

const baseWriteStorage = writeStorage;
// Wrap the storage writer once so every saved workflow leaves a visible activity trail.
const originalWriteStorage = baseWriteStorage;
const writeWithActivity = <T,>(key: string, value: T) => {
    originalWriteStorage(key, value);
    const label = activityLabels[key];
    if (label && key !== STORAGE_KEYS.activity) saveActivityRecord(label);
};

export const getFeedPurchases = () => readStorage<FeedPurchaseRecord[]>(STORAGE_KEYS.feedPurchases, [
    { id: "purchase-001", date: "2026-10-12", feedType: "Starter", brand: "Top Feed", supplier: "Top Feed Depot", quantity: 120, unit: "bags", bagWeightKg: 25, amount: 240000, amountPaid: 240000, flock: "Broiler Batch 02" },
    { id: "purchase-002", date: "2026-10-18", feedType: "Finisher", brand: "Unique Feeds", supplier: "Unique Feed Store", quantity: 90, unit: "bags", bagWeightKg: 25, amount: 180000, amountPaid: 180000, flock: "Broiler Batch 02" },
    { id: "purchase-003", date: "2026-10-29", feedType: "Grower", brand: "Tropical Feed", supplier: "Tropical Farm Supply", quantity: 80, unit: "bags", bagWeightKg: 25, amount: 120000, amountPaid: 120000, flock: "Layer Batch 05" },
]);
export const saveFeedPurchases = (value: FeedPurchaseRecord[]) => writeWithActivity(STORAGE_KEYS.feedPurchases, value);
export const addFeedPurchase = (purchase: Omit<FeedPurchaseRecord, "id">) => {
    if (!purchase.feedType.trim() || !purchase.brand.trim()) throw new Error("Choose a feed type and enter a brand.");
    if (!Number.isFinite(purchase.quantity) || purchase.quantity <= 0 || !Number.isFinite(purchase.amount) || purchase.amount < 0) throw new Error("Enter a feed quantity greater than zero and a valid cost.");
    if (purchase.amountPaid < 0 || purchase.amountPaid > purchase.amount) throw new Error("The amount paid cannot be greater than the purchase cost.");
    const created = { ...purchase, id: idFor("feed-purchase") };
    saveFeedPurchases([...getFeedPurchases(), created]);
    return created;
};

export const getFeedUseRecords = () => readStorage<FeedUseRecord[]>(STORAGE_KEYS.feedUse, [
    { id: "feed-use-001", date: "2026-10-10", feedType: "Starter", quantityKg: 160, flock: "Broiler Batch 02" },
    { id: "feed-use-002", date: "2026-10-14", feedType: "Grower", quantityKg: 250, flock: "Layer Batch 05" },
    { id: "feed-use-003", date: "2026-10-21", feedType: "Finisher", quantityKg: 300, flock: "Broiler Batch 02" },
]);
export const saveFeedUseRecords = (value: FeedUseRecord[]) => writeWithActivity(STORAGE_KEYS.feedUse, value);
export const getFeedInventory = () => {
    const purchases = getFeedPurchases();
    const consumed = getFeedUseRecords();
    const types = Array.from(new Set([...purchases.map((item) => item.feedType), ...consumed.map((item) => item.feedType)]));
    return types.map((feedType) => {
        const boughtKg = purchases.filter((item) => item.feedType === feedType).reduce((sum, item) => sum + item.quantity * (item.unit === "bags" ? item.bagWeightKg : 1), 0);
        const usedKg = consumed.filter((item) => item.feedType === feedType).reduce((sum, item) => sum + item.quantityKg, 0);
        return { feedType, boughtKg, usedKg, availableKg: Math.max(0, boughtKg - usedKg) };
    });
};
export const addFeedUse = (entry: Omit<FeedUseRecord, "id">) => {
    if (!Number.isFinite(entry.quantityKg) || entry.quantityKg <= 0) throw new Error("Enter a quantity greater than zero.");
    const available = getFeedInventory().find((item) => item.feedType === entry.feedType)?.availableKg || 0;
    if (entry.quantityKg > available) throw new Error(`Only ${available.toLocaleString()} kg of ${entry.feedType} feed is available.`);
    const created = { ...entry, id: idFor("feed-use") };
    saveFeedUseRecords([...getFeedUseRecords(), created]);
    return created;
};

export type VaccinationRecord = { id: string; flock: string; vaccine: string; date: string; birds: number; nextDate?: string; givenBy?: string; notes?: string };
export type HealthIncidentRecord = { id: string; flock: string; date: string; symptoms: string; affectedBirds: number; action: string; confirmedDiagnosis?: string; outcome?: string; notes?: string };
export const getVaccinationRecords = () => readStorage<VaccinationRecord[]>(STORAGE_KEYS.vaccinations, [
    { id: "vaccine-001", flock: "Broiler Batch 02", vaccine: "Newcastle disease vaccine", date: "2026-10-05", birds: 1400, nextDate: "2026-11-05", givenBy: "Farm manager", notes: "All birds covered." },
    { id: "vaccine-002", flock: "Layer Batch 05", vaccine: "Fowl pox vaccine", date: "2026-10-11", birds: 1600, nextDate: "2026-11-11", givenBy: "Animal health worker" },
]);
export const saveVaccinationRecords = (value: VaccinationRecord[]) => writeWithActivity(STORAGE_KEYS.vaccinations, value);
export const addVaccinationRecord = (record: Omit<VaccinationRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock);
    if (!flock) throw new Error("Choose a bird group that exists on your farm.");
    if (!record.vaccine.trim() || !record.date || record.birds < 1 || record.birds > flock.birds) throw new Error("Check the vaccine, date and number of birds covered.");
    const created = { ...record, id: idFor("vaccination") };
    saveVaccinationRecords([...getVaccinationRecords(), created]);
    return created;
};
export const getHealthIncidents = () => readStorage<HealthIncidentRecord[]>(STORAGE_KEYS.healthIncidents, [
    { id: "health-001", flock: "Broiler Batch 02", date: "2026-10-20", symptoms: "Reduced appetite", affectedBirds: 12, action: "Separated affected birds and contacted animal health worker", outcome: "Being monitored", notes: "Symptoms observed by farm staff; no diagnosis recorded." },
]);
export const saveHealthIncidents = (value: HealthIncidentRecord[]) => writeWithActivity(STORAGE_KEYS.healthIncidents, value);
export const addHealthIncident = (record: Omit<HealthIncidentRecord, "id"> & { birdsLost?: number }) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock);
    if (!flock) throw new Error("Choose a bird group that exists on your farm.");
    if (!record.date || !record.symptoms.trim() || record.affectedBirds < 1 || record.affectedBirds > flock.birds) throw new Error("Check the date, symptoms and number of affected birds.");
    if (record.birdsLost && record.birdsLost > record.affectedBirds) throw new Error("Birds lost cannot be greater than birds affected.");
    const { birdsLost, ...incident } = record;
    const created = { ...incident, id: idFor("health") };
    if (birdsLost && birdsLost > 0) addFlockMovement({ flock: record.flock, date: record.date, type: "Mortality", quantity: birdsLost, reason: record.symptoms, notes: record.notes });
    saveHealthIncidents([...getHealthIncidents(), created]);
    return created;
};

export const addProductionRecord = (record: Omit<ProductionRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock);
    if (!flock) throw new Error("Choose a bird group that exists on your farm.");
    if (!record.date) throw new Error("Choose the day you recorded production.");
    if (record.type === "Layer") {
        if (record.liveBirds < 1 || record.liveBirds > flock.birds) throw new Error("Enter a live bird count within the current group size.");
        if (record.eggsCollected < 0 || record.goodEggs + record.damagedEggs > record.eggsCollected) throw new Error("Good and damaged eggs cannot exceed the eggs collected.");
    }
    const created = { ...record, id: idFor("production") };
    saveProductionRecords([...getProductionRecords(), created]);
    return created;
};

export const addSaleRecord = (record: Omit<SalesEntry, "id" | "outstanding" | "status">) => {
    const amount = numberFromAmount(record.amount);
    const received = Number(record.amountReceived) || 0;
    if (!record.date || amount <= 0 || received < 0 || received > amount) throw new Error("Check the sale date, total and amount received.");
    const product = record.product || record.item || "";
    if (product === "Live birds") {
        if (!record.flock || !record.quantity || record.quantity < 1) throw new Error("Choose the bird group and number of birds sold.");
        addFlockMovement({ flock: record.flock, date: record.date, type: "Sale", quantity: record.quantity, reason: `Sale of ${record.quantity} birds` });
    }
    const created = { ...record, id: idFor("sale"), outstanding: amount - received, status: received >= amount ? "Paid" : received > 0 ? "Part paid" : "Unpaid" };
    saveSalesRecords([...getSalesRecords(), created]);
    return created;
};

export const recordSalePayment = (id: string, payment: number) => {
    const records = getSalesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Sale record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountReceived) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    const amountReceived = paid + payment;
    const next = [...records];
    next[index] = { ...records[index], amount: total, amountReceived, outstanding: total - amountReceived, status: amountReceived >= total ? "Paid" : "Part paid" };
    saveSalesRecords(next);
    return next[index];
};

export const addExpenseRecord = (record: Omit<ExpenseEntry, "id" | "outstanding">) => {
    const amount = numberFromAmount(record.amount);
    const amountPaid = Number(record.amountPaid) || 0;
    if (!record.date || !record.category.trim() || amount <= 0 || amountPaid < 0 || amountPaid > amount) throw new Error("Check the date, category, total and amount paid.");
    const created = { ...record, id: idFor("expense"), amount, amountPaid, outstanding: amount - amountPaid };
    saveExpensesRecords([...getExpensesRecords(), created]);
    return created;
};

export const recordExpensePayment = (id: string, payment: number) => {
    const records = getExpensesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Expense record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountPaid) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    const amountPaid = paid + payment;
    const next = [...records];
    next[index] = { ...records[index], amount: total, amountPaid, outstanding: total - amountPaid };
    saveExpensesRecords(next);
    return next[index];
};

const numberFromAmount = (value: unknown) => Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;

export const getDashboardTotals = () => {
    const flocks = getFlockRecords();
    const activeFlocks = flocks.filter((flock) => flock.status === "Active");
    const sales = getSalesRecords();
    const expenses = getExpensesRecords();
    const feedPurchases = getFeedPurchases();
    const salesTotal = sales.reduce((sum, item) => sum + numberFromAmount(item.amount), 0);
    const expenseTotal = expenses.reduce((sum, item) => sum + numberFromAmount(item.amount), 0);
    const feedTotal = feedPurchases.reduce((sum, item) => sum + item.amount, 0);
    const birds = activeFlocks.reduce((sum, flock) => sum + Number(flock.birds || 0), 0);
    const stockKg = getFeedInventory().reduce((sum, item) => sum + item.availableKg, 0);
    return { activeFlocks: activeFlocks.length, birds, salesTotal, expenseTotal, feedTotal, stockKg: Math.max(0, stockKg), houses: getPoultryHouses().length, productionRecords: getProductionRecords().length };
};

export const getDemoDatabaseSnapshot = () => ({
    version: storageSchemaVersion,
    exportedAt: new Date().toISOString(),
    farmProfile: getFarmProfile(),
    poultryHouses: getPoultryHouses(),
    flocks: getFlockRecords(),
    flockMovements: getFlockMovements(),
    feedPurchases: getFeedPurchases(),
    feedUse: getFeedUseRecords(),
    production: getProductionRecords(),
    vaccinations: getVaccinationRecords(),
    healthIncidents: getHealthIncidents(),
    sales: getSalesRecords(),
    expenses: getExpensesRecords(),
    assets: getFarmAssets(),
    opportunityApplications: getOpportunityApplications(),
    userPreferences: getUserPreferences(),
    documents: getFarmDocuments(),
    kycApplication: getKycApplication(),
    activity: getActivityRecords(),
});

export const resetDemoDatabase = () => {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(scopedStorageKey(key));
        window.localStorage.removeItem(key);
    });
    window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: "*" } }));
};

export const importDemoDatabase = (value: unknown) => {
    if (!value || typeof value !== "object") throw new Error("Choose a valid JARI backup file.");
    const snapshot = value as Record<string, unknown>;
    if (snapshot.version !== storageSchemaVersion) throw new Error("This backup version is not supported.");
    const collections: Array<[string, string]> = [
        ["farmProfile", STORAGE_KEYS.farmProfile], ["poultryHouses", STORAGE_KEYS.poultryHouses], ["flocks", STORAGE_KEYS.flockRecords], ["flockMovements", STORAGE_KEYS.flockMovements],
        ["feedPurchases", STORAGE_KEYS.feedPurchases], ["feedUse", STORAGE_KEYS.feedUse], ["production", STORAGE_KEYS.productionRecords],
        ["vaccinations", STORAGE_KEYS.vaccinations], ["healthIncidents", STORAGE_KEYS.healthIncidents], ["sales", STORAGE_KEYS.salesRecords],
        ["expenses", STORAGE_KEYS.expensesRecords], ["assets", STORAGE_KEYS.farmAssets], ["activity", STORAGE_KEYS.activity], ["opportunityApplications", STORAGE_KEYS.opportunityApplications], ["userPreferences", STORAGE_KEYS.userPreferences], ["documents", STORAGE_KEYS.documents],
    ];
    // Validate every provided section before writing any values so a malformed
    // backup never leaves a half-imported farm profile.
    collections.forEach(([property]) => {
        const valueToWrite = snapshot[property];
        if (valueToWrite === undefined) return;
        if (property === "farmProfile") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The farmProfile section must be a farm profile.");
            return;
        }
        if (property === "userPreferences") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The userPreferences section must be an object.");
            return;
        }
        if (!Array.isArray(valueToWrite)) throw new Error(`The ${property} section must be a list.`);
    });
    if (snapshot.kycApplication !== undefined && snapshot.kycApplication !== null && (typeof snapshot.kycApplication !== "object" || Array.isArray(snapshot.kycApplication))) throw new Error("The kycApplication section must be an object or null.");
    const writes = collections.filter(([property]) => snapshot[property] !== undefined).map(([property, key]) => [key, snapshot[property]] as const);
    if (snapshot.kycApplication !== undefined) writes.push([STORAGE_KEYS.kycApplication, snapshot.kycApplication] as const);
    const previousValues = writes.map(([key]) => [key, window.localStorage.getItem(scopedStorageKey(key))] as const);
    try {
        writes.forEach(([key, content]) => window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(content)));
    } catch (error) {
        previousValues.forEach(([key, previous]) => {
            if (previous === null) window.localStorage.removeItem(scopedStorageKey(key));
            else window.localStorage.setItem(scopedStorageKey(key), previous);
        });
        throw error;
    }
    window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key: "*" } }));
};

export const getStorageSchemaVersion = () => storageSchemaVersion;
