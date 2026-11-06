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
    id?: string;
    name: string;
    system: string;
    capacity: number;
    water: string;
    feedStorage: boolean;
    ventilation?: string;
    condition?: string;
    notes?: string;
    archived?: boolean;
    birds?: number;
    availableCapacity?: number;
};

export type FlockRecord = {
    id?: string;
    houseId?: string;
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
    flockId?: string;
    house?: string;
    date: string;
    type: "Initial stocking" | "Bird acquisition" | "Additional stocking" | "Mortality" | "Sale" | "Transfer in" | "Transfer out" | "Adjustment";
    quantity: number;
    reason: string;
    notes?: string;
};
export type FinancialPaymentRecord = { id: string; date: string; amount: number; note?: string };

export type SalesEntry = { id?: string; date: string; item?: string; product?: string; amount: number | string; amountReceived?: number; payments?: FinancialPaymentRecord[]; quantity?: number; unit?: string; flock?: string; status?: string; outstanding?: number };
export type ExpenseEntry = { id?: string; date: string; category: string; amount: number | string; amountPaid?: number; payments?: FinancialPaymentRecord[]; outstanding?: number; flock?: string; note?: string };
export type OpportunityApplicationRecord = { id: string; opportunityId: string; opportunityName: string; type: string; status: "Interested" | "Preparing" | "Submitted" | "Reviewed" | "Needs information"; note: string; createdAt: string };
export type InstitutionRequestRecord = { id: string; institutionName: string; purpose: string; message: string; status: "Open" | "Acknowledged" | "Closed"; createdAt: string };
export type InstitutionCategory = "Lending Institution" | "Insurance Provider" | "Grant Provider";
export type InstitutionVerificationDocument = { id: string; name: string; type: string; size: number; dataUrl: string; category: string };
export type InstitutionRegistrationRecord = {
    id: string;
    userId: string;
    organisationName: string;
    organisationType: string;
    cacRegistrationNumber: string;
    yearEstablished: string;
    officialEmail: string;
    officialPhone: string;
    website: string;
    officeAddress: string;
    state: string;
    lga: string;
    logo?: string;
    categories: InstitutionCategory[];
    services: Partial<Record<InstitutionCategory, Record<string, string>>>;
    representative: { fullName: string; jobTitle: string; email: string; phone: string };
    documents: InstitutionVerificationDocument[];
    status: "Pending Verification";
    submittedAt: string;
};
export type UserPreferences = { productionReminders: boolean; healthReminders: boolean; financialUpdates: boolean; analyticsConsent: boolean };
export type FarmDocumentRecord = { id: string; name: string; type: string; size: number; addedAt: string; dataUrl: string };
export type InstitutionDemoAccess = { shared: boolean; updatedAt?: string };

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
    treatments: "jari-simulated-treatments",
    flockMovements: "jari-simulated-flock-movements",
    applications: "jari-simulated-applications",
    activity: "jari-simulated-activity",
    documents: "jari-simulated-documents",
    opportunityApplications: "jari-simulated-opportunity-applications",
    institutionRequests: "jari-simulated-institution-requests",
    userPreferences: "jari-simulated-user-preferences",
    institutionDemoAccess: "jari-simulated-institution-demo-access",
};
const INSTITUTION_REGISTRATIONS_KEY = "jari-simulated-institution-registrations";

export const defaultFarmProfile: SavedFarmProfile = {
    farmName: "",
    ownerName: "",
    phone: "",
    community: "",
    lga: "",
    state: "Plateau",
    establishmentDate: "",
    operationType: "Broiler",
    productionSystem: "Deep litter",
    numberOfHouses: "0",
    waterSource: "Borehole",
    numberOfWorkers: "0",
    biosecurity: [],
};

export const getFarmProfile = () => readStorage<SavedFarmProfile>(STORAGE_KEYS.farmProfile, defaultFarmProfile);
export const saveFarmProfile = (value: SavedFarmProfile) => writeWithActivity(STORAGE_KEYS.farmProfile, value);
export const getKycApplication = () => readStorage<KycApplication | null>(STORAGE_KEYS.kycApplication, null);
export const saveKycApplication = (value: KycApplication) => writeWithActivity(STORAGE_KEYS.kycApplication, value);

export const getFlockRecords = () => readStorage<FlockRecord[]>(STORAGE_KEYS.flockRecords, []);
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
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Enter a whole number of birds greater than zero.");
    if (!movement.date || !movement.reason.trim()) throw new Error("Add the date and reason for this bird count change.");
    const flocks = getFlockRecords();
    const flockIndex = flocks.findIndex((flock) => flock.name === movement.flock);
    if (flockIndex < 0) throw new Error("Choose a bird group that exists on your farm.");
    const reducesBirds = ["Mortality", "Sale", "Transfer out"].includes(movement.type);
    const nextCount = flocks[flockIndex].birds + (reducesBirds ? -quantity : quantity);
    if (nextCount < 0) throw new Error("This record is greater than the number of birds in the group.");
    if (flocks[flockIndex].status === "Completed" && !reducesBirds) throw new Error("This bird group is finished. Start a new group to record new birds.");
    if (!reducesBirds && flocks[flockIndex].status === "Active") {
        const house = getPoultryHouses().find((item) => item.name === flocks[flockIndex].house);
        const houseBirds = flocks.filter((item) => item.house === flocks[flockIndex].house && item.status === "Active").reduce((sum, item) => sum + item.birds, 0);
        if (house && houseBirds + quantity > house.capacity) throw new Error(`There is only ${Math.max(0, house.capacity - houseBirds).toLocaleString()} spaces left in ${house.name}.`);
    }
    const nextFlocks = [...flocks];
    nextFlocks[flockIndex] = { ...nextFlocks[flockIndex], birds: nextCount, status: nextCount === 0 ? "Completed" : "Active" };
    const nextMovement: FarmFlockMovement = { ...movement, id: idFor("movement"), quantity };
    const movements = getFlockMovements();
    commitWithActivity([[STORAGE_KEYS.flockRecords, nextFlocks], [STORAGE_KEYS.flockMovements, [...movements, nextMovement]]], "Bird group record added");
    return nextMovement;
};

export const addFlockTransfer = (transfer: { source: string; destination: string; date: string; quantity: number; reason: string; notes?: string }) => {
    const quantity = Number(transfer.quantity);
    if (transfer.source === transfer.destination) throw new Error("Choose two different bird groups.");
    if (!transfer.date || !transfer.reason.trim() || !Number.isInteger(quantity) || quantity < 1) throw new Error("Enter a date, reason and whole number of birds to transfer.");
    const flocks = getFlockRecords();
    const source = flocks.find((flock) => flock.name === transfer.source && flock.status === "Active");
    const destination = flocks.find((flock) => flock.name === transfer.destination && flock.status === "Active");
    if (!source || !destination) throw new Error("Choose two active bird groups on your farm.");
    if (quantity > source.birds) throw new Error(`Only ${source.birds.toLocaleString()} birds are currently in ${source.name}.`);
    const destinationHouse = getPoultryHouses().find((house) => house.name === destination.house);
    const inDestinationHouse = flocks.filter((flock) => flock.house === destination.house && flock.status === "Active").reduce((sum, flock) => sum + flock.birds, 0);
    if (destinationHouse && inDestinationHouse + quantity > destinationHouse.capacity) throw new Error(`There is only ${Math.max(0, destinationHouse.capacity - inDestinationHouse).toLocaleString()} spaces left in ${destination.house}.`);

    const nextFlocks = flocks.map((flock) => flock.name === source.name ? { ...flock, birds: flock.birds - quantity, status: flock.birds === quantity ? "Completed" as const : flock.status } : flock.name === destination.name ? { ...flock, birds: flock.birds + quantity } : flock);
    const movements = getFlockMovements();
    const pairId = idFor("transfer");
    const notes = [transfer.notes, `Transfer reference: ${pairId}`].filter(Boolean).join("\n");
    const nextMovements: FarmFlockMovement[] = [
        { id: `${pairId}-out`, flock: source.name, date: transfer.date, type: "Transfer out", quantity, reason: transfer.reason.trim(), notes },
        { id: `${pairId}-in`, flock: destination.name, date: transfer.date, type: "Transfer in", quantity, reason: transfer.reason.trim(), notes },
    ];
    commitWithActivity([[STORAGE_KEYS.flockRecords, nextFlocks], [STORAGE_KEYS.flockMovements, [...movements, ...nextMovements]]], `Transferred ${quantity.toLocaleString()} birds from ${source.name} to ${destination.name}`);
    return { reference: pairId, movements: nextMovements };
};

export const createFlockRecord = (flock: Omit<FlockRecord, "id" | "birds" | "status"> & { birds: number }) => {
    const existing = getFlockRecords();
    if (!flock.name.trim()) throw new Error("Enter a name for this bird group.");
    if (existing.some((record) => record.name.trim().toLowerCase() === flock.name.trim().toLowerCase())) throw new Error("A bird group with this name already exists.");
    if (!Number.isInteger(flock.birds) || flock.birds <= 0) throw new Error("Enter a whole opening number of birds greater than zero.");
    if ((flock.ageAtAcquisition !== undefined && (!Number.isFinite(flock.ageAtAcquisition) || flock.ageAtAcquisition < 0)) || (flock.purchaseCost !== undefined && (!Number.isFinite(flock.purchaseCost) || flock.purchaseCost < 0))) throw new Error("Check the bird age and purchase cost.");
    const house = getPoultryHouses().find((item) => item.name === flock.house);
    if (!house) throw new Error("Choose a farm house that exists on your farm.");
    const alreadyInHouse = existing.filter((record) => record.house === flock.house && record.status === "Active").reduce((total, record) => total + record.birds, 0);
    if (alreadyInHouse + flock.birds > house.capacity) throw new Error("This group would be larger than the remaining space in that house.");
    const created: FlockRecord = { ...flock, id: idFor("flock"), name: flock.name.trim(), status: "Active", birds: flock.birds };
    const movements = getFlockMovements();
    const initialMovement: FarmFlockMovement = { id: idFor("movement"), flock: created.name, date: flock.acquisitionDate || flock.cycleStart || new Date().toISOString().slice(0, 10), type: "Initial stocking", quantity: flock.birds, reason: "Opening bird count" };
    commitWithActivity([[STORAGE_KEYS.flockRecords, [...existing, created]], [STORAGE_KEYS.flockMovements, [...movements, initialMovement]]], `Bird group ${created.name} added`);
    return created;
};

export const getPoultryHouses = () => readStorage<FarmHouseRecord[]>(STORAGE_KEYS.poultryHouses, []);
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
    if (updated.name !== previousName) commitWithActivity([[STORAGE_KEYS.poultryHouses, next], [STORAGE_KEYS.flockRecords, nextFlocks]], `Farm house ${previousName} updated`);
    else savePoultryHouses(next);
    return updated;
};

export const archivePoultryHouse = (name: string) => {
    const hasActiveBirds = getFlockRecords().some((flock) => flock.house === name && flock.status === "Active");
    if (hasActiveBirds) throw new Error("Move or finish the bird groups in this house before archiving it.");
    savePoultryHouses(getPoultryHouses().map((house) => house.name === name ? { ...house, archived: true } : house));
};

export const getProductionRecords = () => readStorage<ProductionRecord[]>(STORAGE_KEYS.productionRecords, []);
export const saveProductionRecords = (value: ProductionRecord[]) => writeWithActivity(STORAGE_KEYS.productionRecords, value);

const readSalesRecords = () => readStorage<SalesEntry[]>(STORAGE_KEYS.salesRecords, []);
export const getSalesRecords = () => readSalesRecords().map((record, index) => {
    const amount = numberFromAmount(record.amount);
    const amountReceived = record.amountReceived ?? Math.max(0, amount - (record.outstanding ?? amount));
    return { ...record, id: record.id || `legacy-sale-${index}`, amount, amountReceived, outstanding: record.outstanding ?? Math.max(0, amount - amountReceived), status: record.status || (amountReceived >= amount ? "Paid" : amountReceived > 0 ? "Part paid" : "Unpaid") };
});
export const saveSalesRecords = (value: SalesEntry[]) => writeWithActivity(STORAGE_KEYS.salesRecords, value);

const readExpensesRecords = () => readStorage<ExpenseEntry[]>(STORAGE_KEYS.expensesRecords, []);
export const getExpensesRecords = () => readExpensesRecords().map((record, index) => {
    const amount = numberFromAmount(record.amount);
    const amountPaid = record.amountPaid ?? Math.max(0, amount - (record.outstanding ?? amount));
    return { ...record, id: record.id || `legacy-expense-${index}`, amount, amountPaid, outstanding: record.outstanding ?? Math.max(0, amount - amountPaid) };
});
export const saveExpensesRecords = (value: ExpenseEntry[]) => writeWithActivity(STORAGE_KEYS.expensesRecords, value);

export const getFarmAssets = () => readStorage<FarmAssetRecord[]>(STORAGE_KEYS.farmAssets, []);
export const saveFarmAssets = (value: FarmAssetRecord[]) => {
    const names = new Set<string>();
    value.forEach((asset) => {
        const name = asset.name.trim().toLocaleLowerCase();
        if (!name || names.has(name)) throw new Error("Equipment names must be filled in and unique.");
        names.add(name);
        if (!Number.isInteger(asset.quantity) || asset.quantity < 0 || !Number.isFinite(asset.value) || asset.value < 0 || !["Working", "Needs repair"].includes(asset.status)) throw new Error("Check each equipment count, value and condition.");
    });
    writeWithActivity(STORAGE_KEYS.farmAssets, value);
};
export const addFarmAsset = (asset: FarmAssetRecord) => {
    if (getFarmAssets().some((item) => item.name.trim().toLocaleLowerCase() === asset.name.trim().toLocaleLowerCase())) throw new Error("Equipment with this name already exists.");
    saveFarmAssets([...getFarmAssets(), { ...asset, name: asset.name.trim() }]);
};

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
    [STORAGE_KEYS.treatments]: "Treatment record added",
    [STORAGE_KEYS.opportunityApplications]: "Opportunity application updated",
    [STORAGE_KEYS.institutionRequests]: "Institution request updated",
    [STORAGE_KEYS.documents]: "Farm document updated",
    [STORAGE_KEYS.institutionDemoAccess]: "Institution demo sharing updated",
};

export type ActivityRecord = { id: string; text: string; createdAt: string };
export const getActivityRecords = () => readStorage<ActivityRecord[]>(STORAGE_KEYS.activity, []);
export const saveActivityRecord = (text: string) => {
    const event = { id: idFor("activity"), text, createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.activity, [event, ...getActivityRecords()].slice(0, 100));
};

const commitWithActivity = (writes: Array<[string, unknown]>, activityText: string) => {
    if (typeof window === "undefined") return;
    const event: ActivityRecord = { id: idFor("activity"), text: activityText, createdAt: new Date().toISOString() };
    const allWrites: Array<[string, unknown]> = [...writes, [STORAGE_KEYS.activity, [event, ...getActivityRecords()].slice(0, 100)]];
    const previous = allWrites.map(([key]) => [key, window.localStorage.getItem(scopedStorageKey(key))] as const);
    try {
        allWrites.forEach(([key, value]) => window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(value)));
    } catch (error) {
        previous.slice().reverse().forEach(([key, value]) => {
            try { if (value === null) window.localStorage.removeItem(scopedStorageKey(key)); else window.localStorage.setItem(scopedStorageKey(key), value); }
            catch { /* Preserve the original write error; rollback attempts continue for remaining keys. */ }
        });
        throw error;
    }
    allWrites.forEach(([key]) => emitDataChanged(key));
    window.dispatchEvent(new CustomEvent("jari:toast", { detail: { kind: "success", message: activityText } }));
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
export const getInstitutionRequests = () => readStorage<InstitutionRequestRecord[]>(STORAGE_KEYS.institutionRequests, []);
export const addInstitutionRequest = (request: Omit<InstitutionRequestRecord, "id" | "status" | "createdAt">) => {
    if (!request.institutionName.trim() || !request.purpose.trim() || !request.message.trim()) throw new Error("Add an institution name, request purpose and message.");
    const created: InstitutionRequestRecord = { ...request, institutionName: request.institutionName.trim(), purpose: request.purpose.trim(), message: request.message.trim(), id: idFor("institution-request"), status: "Open", createdAt: new Date().toISOString() };
    writeWithActivity(STORAGE_KEYS.institutionRequests, [...getInstitutionRequests(), created]);
    return created;
};
export const updateInstitutionRequest = (id: string, status: InstitutionRequestRecord["status"]) => {
    const records = getInstitutionRequests();
    if (!records.some((record) => record.id === id)) throw new Error("This request could not be found.");
    const next = records.map((record) => record.id === id ? { ...record, status } : record);
    writeWithActivity(STORAGE_KEYS.institutionRequests, next);
    return next;
};
export const getUserPreferences = () => readStorage<UserPreferences>(STORAGE_KEYS.userPreferences, { productionReminders: true, healthReminders: true, financialUpdates: true, analyticsConsent: false });
export const saveUserPreferences = (preferences: UserPreferences) => writeStorage(STORAGE_KEYS.userPreferences, preferences);
export const getInstitutionDemoAccess = () => {
    const access = readStorage<InstitutionDemoAccess>(STORAGE_KEYS.institutionDemoAccess, { shared: true });
    // Older builds could leave an unintentional false default without a timestamp.
    // Preserve explicit farmer choices, which are written with updatedAt.
    if (!access.shared && !access.updatedAt) return { shared: true };
    return access;
};
export const saveInstitutionDemoAccess = (shared: boolean) => writeWithActivity(STORAGE_KEYS.institutionDemoAccess, { shared, updatedAt: new Date().toISOString() });
export const getInstitutionRegistrations = () => readStorage<InstitutionRegistrationRecord[]>(INSTITUTION_REGISTRATIONS_KEY, []);
export const getInstitutionRegistration = (userId: string) => getInstitutionRegistrations().find((application) => application.userId === userId) || null;
export const saveInstitutionRegistration = (application: Omit<InstitutionRegistrationRecord, "id" | "submittedAt" | "status">) => {
    if (!application.userId || !application.organisationName.trim() || !application.categories.length || !application.representative.fullName.trim()) throw new Error("Complete the required institution details before submitting.");
    if (!application.documents.length) throw new Error("Add the verification documents required for the selected services.");
    const existing = getInstitutionRegistrations();
    const created: InstitutionRegistrationRecord = { ...application, id: idFor("institution"), status: "Pending Verification", submittedAt: new Date().toISOString() };
    const next = [...existing.filter((item) => item.userId !== application.userId), created];
    commitWithActivity([[INSTITUTION_REGISTRATIONS_KEY, next]], `${created.organisationName} institution application submitted`);
    return created;
};
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
    const label = activityLabels[key];
    if (label && key !== STORAGE_KEYS.activity) commitWithActivity([[key, value]], label);
    else originalWriteStorage(key, value);
};

export const getFeedPurchases = () => readStorage<FeedPurchaseRecord[]>(STORAGE_KEYS.feedPurchases, []);
export const saveFeedPurchases = (value: FeedPurchaseRecord[]) => writeWithActivity(STORAGE_KEYS.feedPurchases, value);
export const addFeedPurchase = (purchase: Omit<FeedPurchaseRecord, "id">) => {
    if (!purchase.date || !purchase.feedType.trim() || !purchase.brand.trim()) throw new Error("Choose a purchase date and feed type, then enter the brand.");
    if (!Number.isFinite(purchase.quantity) || purchase.quantity <= 0 || !Number.isFinite(purchase.amount) || purchase.amount < 0) throw new Error("Enter a feed quantity greater than zero and a valid cost.");
    if (purchase.unit === "bags" && (!Number.isFinite(purchase.bagWeightKg) || purchase.bagWeightKg <= 0)) throw new Error("Enter the weight of each feed bag.");
    if (purchase.amountPaid < 0 || purchase.amountPaid > purchase.amount) throw new Error("The amount paid cannot be greater than the purchase cost.");
    if (purchase.flock && !getFlockRecords().some((flock) => flock.name === purchase.flock)) throw new Error("Choose a bird group that exists on your farm.");
    const created = { ...purchase, id: idFor("feed-purchase") };
    saveFeedPurchases([...getFeedPurchases(), created]);
    return created;
};

export const getFeedUseRecords = () => readStorage<FeedUseRecord[]>(STORAGE_KEYS.feedUse, []);
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
    if (!entry.date || !entry.flock || !entry.feedType.trim()) throw new Error("Choose a date, bird group and feed type.");
    if (!getFlockRecords().some((flock) => flock.name === entry.flock)) throw new Error("Choose a bird group that exists on your farm.");
    if (!Number.isFinite(entry.quantityKg) || entry.quantityKg <= 0) throw new Error("Enter a quantity greater than zero.");
    const available = getFeedInventory().find((item) => item.feedType === entry.feedType)?.availableKg || 0;
    if (entry.quantityKg > available) throw new Error(`Only ${available.toLocaleString()} kg of ${entry.feedType} feed is available.`);
    const created = { ...entry, id: idFor("feed-use") };
    saveFeedUseRecords([...getFeedUseRecords(), created]);
    return created;
};

export type VaccinationRecord = { id: string; flock: string; vaccine: string; date: string; birds: number; nextDate?: string; givenBy?: string; notes?: string };
export type HealthIncidentRecord = { id: string; flock: string; date: string; symptoms: string; affectedBirds: number; birdsLost?: number; action: string; confirmedDiagnosis?: string; outcome?: string; notes?: string };
export type TreatmentRecord = { id: string; flock: string; date: string; treatment: string; medicine?: string; birdsTreated: number; givenBy?: string; notes?: string };
export const getVaccinationRecords = () => readStorage<VaccinationRecord[]>(STORAGE_KEYS.vaccinations, []);
export const saveVaccinationRecords = (value: VaccinationRecord[]) => writeWithActivity(STORAGE_KEYS.vaccinations, value);
export const addVaccinationRecord = (record: Omit<VaccinationRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock && item.status === "Active");
    if (!flock) throw new Error("Choose an active bird group on your farm.");
    if (!record.vaccine.trim() || !record.date || !Number.isInteger(record.birds) || record.birds < 1 || record.birds > flock.birds) throw new Error("Check the vaccine, date and number of birds covered.");
    const created = { ...record, id: idFor("vaccination") };
    saveVaccinationRecords([...getVaccinationRecords(), created]);
    return created;
};
export const getHealthIncidents = () => readStorage<HealthIncidentRecord[]>(STORAGE_KEYS.healthIncidents, []);
export const saveHealthIncidents = (value: HealthIncidentRecord[]) => writeWithActivity(STORAGE_KEYS.healthIncidents, value);
export const addHealthIncident = (record: Omit<HealthIncidentRecord, "id"> & { birdsLost?: number }) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock && item.status === "Active");
    if (!flock) throw new Error("Choose an active bird group on your farm.");
    const birdsLost = Number(record.birdsLost) || 0;
    if (!record.date || !record.symptoms.trim() || !Number.isInteger(record.affectedBirds) || record.affectedBirds < 1 || record.affectedBirds > flock.birds) throw new Error("Check the date, symptoms and number of affected birds.");
    if (!Number.isInteger(birdsLost) || birdsLost < 0 || birdsLost > record.affectedBirds || birdsLost > flock.birds) throw new Error("Birds lost must be a whole number no greater than birds affected or currently in the group.");
    const created: HealthIncidentRecord = { ...record, id: idFor("health"), birdsLost };
    if (birdsLost > 0) {
        const flocks = getFlockRecords();
        const nextFlocks = flocks.map((item) => item.name === flock.name ? { ...item, birds: item.birds - birdsLost, status: item.birds === birdsLost ? "Completed" as const : item.status } : item);
        const movements = [...getFlockMovements(), { id: idFor("movement"), flock: flock.name, date: record.date, type: "Mortality" as const, quantity: birdsLost, reason: record.symptoms, notes: record.notes }];
        commitWithActivity([[STORAGE_KEYS.flockRecords, nextFlocks], [STORAGE_KEYS.flockMovements, movements], [STORAGE_KEYS.healthIncidents, [...getHealthIncidents(), created]]], "Bird health record and loss recorded");
    } else saveHealthIncidents([...getHealthIncidents(), created]);
    return created;
};

export const updateHealthIncident = (id: string, changes: Pick<HealthIncidentRecord, "date" | "symptoms" | "affectedBirds" | "action" | "outcome" | "notes">) => {
    const records = getHealthIncidents();
    const current = records.find((record) => record.id === id);
    if (!current) throw new Error("Health record not found.");
    const flock = getFlockRecords().find((item) => item.name === current.flock);
    const birdsLost = current.birdsLost || 0;
    if (!flock || !changes.date || !changes.symptoms.trim() || !Number.isInteger(changes.affectedBirds) || changes.affectedBirds < 1 || changes.affectedBirds > flock.birds + birdsLost || birdsLost > changes.affectedBirds) throw new Error("Check the date, symptoms and birds affected. Birds affected must include any recorded losses.");
    const updated = { ...current, ...changes };
    saveHealthIncidents(records.map((record) => record.id === id ? updated : record));
    return updated;
};

export const deleteHealthIncident = (id: string) => {
    const records = getHealthIncidents();
    const current = records.find((record) => record.id === id);
    if (!current) throw new Error("Health record not found.");
    const birdsLost = current.birdsLost || 0;
    const flocks = getFlockRecords();
    const flock = flocks.find((item) => item.name === current.flock);
    if (birdsLost && !flock) throw new Error("The bird group for this loss could not be found; the record was kept.");
    if (birdsLost && flock) {
        // Restore the flock and remove the incident in one rollback-safe write set.
        const nextFlocks = flocks.map((item) => item.name === flock.name ? { ...item, birds: item.birds + birdsLost, status: "Active" as const } : item);
        const nextMovements = [...getFlockMovements(), { id: idFor("movement"), flock: flock.name, date: new Date().toISOString().slice(0, 10), type: "Adjustment" as const, quantity: birdsLost, reason: "Health loss record removed; bird count restored", notes: `Restored ${birdsLost} birds from health record ${id}.` }];
        commitWithActivity([[STORAGE_KEYS.flockRecords, nextFlocks], [STORAGE_KEYS.flockMovements, nextMovements], [STORAGE_KEYS.healthIncidents, records.filter((record) => record.id !== id)]], "Health record removed and bird count restored");
    } else saveHealthIncidents(records.filter((record) => record.id !== id));
    return current;
};

export const getTreatmentRecords = () => readStorage<TreatmentRecord[]>(STORAGE_KEYS.treatments, []);
export const saveTreatmentRecords = (records: TreatmentRecord[]) => writeWithActivity(STORAGE_KEYS.treatments, records);
export const addTreatmentRecord = (record: Omit<TreatmentRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock && item.status === "Active");
    if (!flock || !record.date || !record.treatment.trim() || !Number.isInteger(record.birdsTreated) || record.birdsTreated < 1 || record.birdsTreated > flock.birds) throw new Error("Choose an active bird group and check the treatment date and bird count.");
    const created = { ...record, id: idFor("treatment"), treatment: record.treatment.trim() };
    saveTreatmentRecords([...getTreatmentRecords(), created]);
    return created;
};

export const addProductionRecord = (record: Omit<ProductionRecord, "id">) => {
    const flock = getFlockRecords().find((item) => item.name === record.flock);
    if (!flock) throw new Error("Choose a bird group that exists on your farm.");
    if (!record.date) throw new Error("Choose the day you recorded production.");
    if (record.type !== flock.type) throw new Error("The production record type must match the selected bird group.");
    const countFields = [record.liveBirds, record.eggsCollected, record.goodEggs, record.damagedEggs, record.birdsWeighed, record.birdsReady];
    if (countFields.some((value) => !Number.isInteger(value) || value < 0) || !Number.isFinite(record.averageWeight) || record.averageWeight < 0) throw new Error("Enter whole counts of zero or more and a valid average weight.");
    if (record.liveBirds > flock.birds || record.birdsWeighed > flock.birds || record.birdsReady > flock.birds) throw new Error("Production bird counts cannot be greater than the group's current size.");
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
    if (!record.date || amount <= 0 || received < 0 || received > amount || (record.quantity !== undefined && (!Number.isInteger(record.quantity) || record.quantity < 0))) throw new Error("Check the sale date, total, amount received and quantity.");
    const product = record.product || record.item || "";
    const flock = product === "Live birds" ? getFlockRecords().find((item) => item.name === record.flock && item.status === "Active") : undefined;
    if (product === "Live birds" && (!flock || !Number.isInteger(record.quantity) || !record.quantity || record.quantity < 1 || record.quantity > flock.birds)) throw new Error("Choose an active bird group and a number of birds within its current count.");
    const payments = received > 0 ? [{ id: idFor("payment"), date: record.date, amount: received, note: "Payment received when sale was recorded" }] : [];
    const created = { ...record, amount, amountReceived: received, payments, id: idFor("sale"), outstanding: amount - received, status: received >= amount ? "Paid" : received > 0 ? "Part paid" : "Unpaid" };
    if (flock && record.quantity) {
        const nextFlocks = getFlockRecords().map((item) => item.name === flock.name ? { ...item, birds: item.birds - record.quantity!, status: item.birds === record.quantity ? "Completed" as const : item.status } : item);
        const nextMovements = [...getFlockMovements(), { id: idFor("movement"), flock: flock.name, date: record.date, type: "Sale" as const, quantity: record.quantity, reason: `Sale of ${record.quantity} birds` }];
        commitWithActivity([[STORAGE_KEYS.flockRecords, nextFlocks], [STORAGE_KEYS.flockMovements, nextMovements], [STORAGE_KEYS.salesRecords, [...getSalesRecords(), created]]], "Bird sale recorded");
    } else saveSalesRecords([...getSalesRecords(), created]);
    return created;
};

export const recordSalePayment = (id: string, payment: number, date = new Date().toISOString().slice(0, 10), note?: string) => {
    const records = getSalesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Sale record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountReceived) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    if (!date) throw new Error("Choose the date the payment was received.");
    const amountReceived = paid + payment;
    const next = [...records];
    const payments = [...(records[index].payments || (paid > 0 ? [{ id: idFor("payment"), date: records[index].date, amount: paid, note: "Previously recorded payment" }] : [])), { id: idFor("payment"), date, amount: payment, note }];
    next[index] = { ...records[index], amount: total, amountReceived, payments, outstanding: total - amountReceived, status: amountReceived >= total ? "Paid" : "Part paid" };
    saveSalesRecords(next);
    return next[index];
};

export const addExpenseRecord = (record: Omit<ExpenseEntry, "id" | "outstanding">) => {
    const amount = numberFromAmount(record.amount);
    const amountPaid = Number(record.amountPaid) || 0;
    if (!record.date || !record.category.trim() || amount <= 0 || amountPaid < 0 || amountPaid > amount) throw new Error("Check the date, category, total and amount paid.");
    const payments = amountPaid > 0 ? [{ id: idFor("payment"), date: record.date, amount: amountPaid, note: "Payment made when expense was recorded" }] : [];
    const created = { ...record, id: idFor("expense"), amount, amountPaid, payments, outstanding: amount - amountPaid };
    saveExpensesRecords([...getExpensesRecords(), created]);
    return created;
};

export const recordExpensePayment = (id: string, payment: number, date = new Date().toISOString().slice(0, 10), note?: string) => {
    const records = getExpensesRecords();
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Expense record not found.");
    const total = numberFromAmount(records[index].amount);
    const paid = Number(records[index].amountPaid) || Math.max(0, total - (records[index].outstanding ?? total));
    const outstanding = Math.max(0, total - paid);
    if (!Number.isFinite(payment) || payment <= 0 || payment > outstanding) throw new Error("Payment must be greater than zero and no more than the outstanding balance.");
    if (!date) throw new Error("Choose the date the payment was made.");
    const amountPaid = paid + payment;
    const next = [...records];
    const payments = [...(records[index].payments || (paid > 0 ? [{ id: idFor("payment"), date: records[index].date, amount: paid, note: "Previously recorded payment" }] : [])), { id: idFor("payment"), date, amount: payment, note }];
    next[index] = { ...records[index], amount: total, amountPaid, payments, outstanding: total - amountPaid };
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
    return { activeFlocks: activeFlocks.length, birds, salesTotal, expenseTotal, feedTotal, stockKg: Math.max(0, stockKg), houses: getPoultryHouses().filter((house) => !house.archived).length, productionRecords: getProductionRecords().length };
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
    treatments: getTreatmentRecords(),
    sales: getSalesRecords(),
    expenses: getExpensesRecords(),
    assets: getFarmAssets(),
    opportunityApplications: getOpportunityApplications(),
    institutionRequests: getInstitutionRequests(),
    userPreferences: getUserPreferences(),
    institutionDemoAccess: getInstitutionDemoAccess(),
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
    const schemas: Record<string, Record<string, "string" | "number" | "boolean">> = {
        poultryHouses: { name: "string", system: "string", capacity: "number", water: "string", feedStorage: "boolean" },
        flocks: { name: "string", type: "string", house: "string", birds: "number", status: "string" },
        flockMovements: { id: "string", flock: "string", date: "string", type: "string", quantity: "number", reason: "string" },
        feedPurchases: { id: "string", date: "string", feedType: "string", brand: "string", supplier: "string", quantity: "number", unit: "string", bagWeightKg: "number", amount: "number", amountPaid: "number" },
        feedUse: { id: "string", date: "string", feedType: "string", quantityKg: "number", flock: "string" },
        production: { id: "string", date: "string", flock: "string", type: "string", liveBirds: "number", eggsCollected: "number", goodEggs: "number", damagedEggs: "number", birdsWeighed: "number", averageWeight: "number", birdsReady: "number" },
        vaccinations: { id: "string", flock: "string", vaccine: "string", date: "string", birds: "number" },
        healthIncidents: { id: "string", flock: "string", date: "string", symptoms: "string", affectedBirds: "number", action: "string" },
        treatments: { id: "string", flock: "string", date: "string", treatment: "string", birdsTreated: "number" },
        sales: { date: "string" }, expenses: { date: "string", category: "string" },
        assets: { name: "string", quantity: "number", status: "string", value: "number" },
        activity: { id: "string", text: "string", createdAt: "string" },
        opportunityApplications: { id: "string", opportunityId: "string", opportunityName: "string", type: "string", status: "string", note: "string", createdAt: "string" },
        institutionRequests: { id: "string", institutionName: "string", purpose: "string", message: "string", status: "string", createdAt: "string" },
        documents: { id: "string", name: "string", type: "string", size: "number", addedAt: "string", dataUrl: "string" },
    };
    const collections: Array<[string, string]> = [
        ["farmProfile", STORAGE_KEYS.farmProfile], ["poultryHouses", STORAGE_KEYS.poultryHouses], ["flocks", STORAGE_KEYS.flockRecords], ["flockMovements", STORAGE_KEYS.flockMovements],
        ["feedPurchases", STORAGE_KEYS.feedPurchases], ["feedUse", STORAGE_KEYS.feedUse], ["production", STORAGE_KEYS.productionRecords],
        ["vaccinations", STORAGE_KEYS.vaccinations], ["healthIncidents", STORAGE_KEYS.healthIncidents], ["treatments", STORAGE_KEYS.treatments], ["sales", STORAGE_KEYS.salesRecords],
        ["expenses", STORAGE_KEYS.expensesRecords], ["assets", STORAGE_KEYS.farmAssets], ["activity", STORAGE_KEYS.activity], ["opportunityApplications", STORAGE_KEYS.opportunityApplications], ["institutionRequests", STORAGE_KEYS.institutionRequests], ["userPreferences", STORAGE_KEYS.userPreferences], ["institutionDemoAccess", STORAGE_KEYS.institutionDemoAccess], ["documents", STORAGE_KEYS.documents],
    ];
    // Validate every provided section before writing any values so a malformed
    // backup never leaves a half-imported farm profile.
    collections.forEach(([property]) => {
        const valueToWrite = snapshot[property];
        if (valueToWrite === undefined) return;
        if (property === "farmProfile") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The farmProfile section must be a farm profile.");
            const profile = valueToWrite as Record<string, unknown>;
            ["farmName", "ownerName", "phone", "community", "lga", "state", "establishmentDate", "operationType", "productionSystem", "numberOfHouses", "waterSource", "numberOfWorkers"].forEach((field) => { if (typeof profile[field] !== "string") throw new Error(`farmProfile.${field} must be a string.`); });
            if (!Array.isArray(profile.biosecurity) || !profile.biosecurity.every((item) => typeof item === "string")) throw new Error("farmProfile.biosecurity must be a list of text values.");
            return;
        }
        if (property === "userPreferences") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite)) throw new Error("The userPreferences section must be an object.");
            const preferences = valueToWrite as Record<string, unknown>;
            ["productionReminders", "healthReminders", "financialUpdates", "analyticsConsent"].forEach((field) => { if (typeof preferences[field] !== "boolean") throw new Error(`userPreferences.${field} must be a boolean.`); });
            return;
        }
        if (property === "institutionDemoAccess") {
            if (!valueToWrite || typeof valueToWrite !== "object" || Array.isArray(valueToWrite) || typeof (valueToWrite as Record<string, unknown>).shared !== "boolean") throw new Error("The institutionDemoAccess section must contain a sharing choice.");
            return;
        }
        if (!Array.isArray(valueToWrite)) throw new Error(`The ${property} section must be a list.`);
        const schema = schemas[property];
        if (!schema) return;
        valueToWrite.forEach((entry, index) => {
            if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`${property}[${index}] must be an object.`);
            const item = entry as Record<string, unknown>;
            Object.entries(schema).forEach(([field, expected]) => {
                if (typeof item[field] !== expected || (expected === "number" && !Number.isFinite(item[field]))) throw new Error(`${property}[${index}].${field} must be a ${expected}.`);
            });
            if ((property === "sales" || property === "expenses") && typeof item.amount !== "number" && typeof item.amount !== "string") throw new Error(`${property}[${index}].amount must be a number or string.`);
            if (property === "documents" && ((item.size as number) < 0 || (item.size as number) > 1_500_000 || !(item.dataUrl as string).startsWith("data:") || (item.dataUrl as string).length > 2_100_000)) throw new Error(`${property}[${index}] contains invalid file data.`);
        });
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
