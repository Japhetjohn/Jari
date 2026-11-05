import { getFarmNotifications } from "@/lib/notifications";
import {
    addExpenseRecord as simAddExpenseRecord,
    addFarmAsset as simAddFarmAsset,
    addFeedPurchase as simAddFeedPurchase,
    addFeedUse as simAddFeedUse,
    addFlockMovement as simAddFlockMovement,
    addFlockTransfer as simAddFlockTransfer,
    addHealthIncident as simAddHealthIncident,
    addTreatmentRecord as simAddTreatmentRecord,
    addProductionRecord as simAddProductionRecord,
    addSaleRecord as simAddSaleRecord,
    recordSalePayment as simRecordSalePayment,
    recordExpensePayment as simRecordExpensePayment,
    addVaccinationRecord as simAddVaccinationRecord,
    applyToOpportunity,
    addFarmDocument as simAddFarmDocument,
    archivePoultryHouse as simArchivePoultryHouse,
    createPoultryHouse as simCreatePoultryHouse,
    defaultFarmProfile,
    createFlockRecord as simCreateFlockRecord,
    getDashboardTotals,
    getExpensesRecords,
    getFarmAssets,
    getFarmProfile as getSavedFarmProfile,
    getFeedPurchases,
    getFeedInventory,
    getFeedUseRecords,
    getFlockRecords,
    getFlockMovements,
    getProductionRecords,
    getOpportunityApplications,
    getInstitutionRequests,
    getInstitutionRegistration,
    getInstitutionRegistrations,
    getUserPreferences,
    getInstitutionDemoAccess,
    getFarmDocuments,
    getPoultryHouses,
    getSalesRecords,
    saveExpensesRecords,
    saveFarmAssets,
    saveFarmProfile as simSaveFarmProfile,
    saveFeedPurchases,
    saveFeedUseRecords,
    saveFlockRecords,
    saveFlockMovements,
    saveProductionRecords,
    savePoultryHouses,
    saveSalesRecords,
    updatePoultryHouse as simUpdatePoultryHouse,
    updateOpportunityApplication,
    addInstitutionRequest,
    updateInstitutionRequest,
    saveUserPreferences,
    saveInstitutionDemoAccess,
    saveInstitutionRegistration,
    removeFarmDocument as simRemoveFarmDocument,
    getActivityRecords,
    getDemoDatabaseSnapshot,
    getHealthIncidents,
    getTreatmentRecords,
    getKycApplication,
    getVaccinationRecords,
    importDemoDatabase,
    resetDemoDatabase,
    saveHealthIncidents,
    saveTreatmentRecords,
    updateHealthIncident,
    deleteHealthIncident,
    saveKycApplication as simSaveKycApplication,
    saveVaccinationRecords,
} from "@/lib/simulated-data";
import type {
    ExpenseEntry,
    FarmAssetRecord,
    FeedPurchaseRecord,
    FeedUseRecord,
    FlockRecord,
    ProductionRecord,
    SavedFarmProfile,
} from "@/lib/simulated-data";
import type {
    AssetRecord,
    DashboardSummary,
    ExpenseRecord,
    FarmProfile,
    FeedConsumption,
    FeedPurchase,
    FlockRecord as ApiFlock,
    NotificationItem,
    OpportunityItem,
    SalesRecord,
} from "@/types";
import {
    syncAllFromBackend,
    backendSaveFarmProfile,
    backendCreatePoultryHouse,
    backendArchivePoultryHouse,
    backendCreateFlock,
    backendRecordFlockMovement,
    backendTransferFlock,
    backendAddFeedPurchase,
    backendAddFeedUse,
    backendAddProduction,
    backendAddHealthIncident,
    backendAddVaccination,
    backendAddTreatment,
    backendAddSale,
    backendRecordSalePayment,
    backendAddExpense,
    backendRecordExpensePayment,
    backendSubmitKyc,
    backendUploadDocument,
    backendDeleteDocument,
} from "@/lib/backend-sync";
import { getStoredToken } from "@/lib/api-client";

// Initiate background data sync with FastAPI backend on startup
if (typeof window !== "undefined") {
    if (getStoredToken()) {
        syncAllFromBackend().catch(() => { });
    }
}

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));
const currency = (amount: number | string) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
        Number(String(amount).replace(/[^\d.-]/g, "")) || 0
    );
const monthKey = (value: string) => {
    const direct = value.match(/^(\d{4})-(\d{2})/);
    if (direct) return `${direct[1]}-${direct[2]}`;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

const farmForApi = (farm: SavedFarmProfile): FarmProfile => ({
    id: "farm-primary",
    name: farm.farmName,
    ownerName: farm.ownerName,
    phone: farm.phone,
    community: farm.community,
    lga: farm.lga,
    state: farm.state,
    establishmentDate: farm.establishmentDate,
    operationType: farm.operationType as FarmProfile["operationType"],
    productionSystem: farm.productionSystem as FarmProfile["productionSystem"],
    numberOfHouses: Number(farm.numberOfHouses) || 0,
    waterSource: farm.waterSource as FarmProfile["waterSource"],
    numberOfWorkers: Number(farm.numberOfWorkers) || 0,
    biosecurityMeasures: farm.biosecurity,
    housingCapacity: getPoultryHouses().reduce((total, house) => total + house.capacity, 0),
});

const flockForApi = (flock: FlockRecord): ApiFlock => ({
    id: flock.id || flock.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: flock.name,
    type: flock.type as ApiFlock["type"],
    breed: flock.breed || "Not added",
    house: flock.house,
    birds: flock.birds,
    status: flock.status,
    acquisitionDate: flock.acquisitionDate || "",
    cycleStart: flock.cycleStart || "",
});

export const mockApi = {
    async getDashboardSummary(): Promise<DashboardSummary> {
        await delay();
        const totals = getDashboardTotals();
        const currentMonth = monthKey(new Date().toISOString());
        const revenueThisMonth = getSalesRecords()
            .filter((sale) => monthKey(sale.date) === currentMonth)
            .reduce((sum, sale) => sum + (Number(String(sale.amount).replace(/[^\d.-]/g, "")) || 0), 0);
        const feedCost = getFeedPurchases()
            .filter((purchase) => monthKey(purchase.date) === currentMonth)
            .reduce((sum, purchase) => sum + purchase.amount, 0);
        return { activeFlocks: String(totals.activeFlocks), revenueThisMonth: currency(revenueThisMonth), feedCost: currency(feedCost), riskScore: "Not assessed" };
    },
    async getFarmProfile(): Promise<FarmProfile> {
        await delay();
        return farmForApi(getSavedFarmProfile() || defaultFarmProfile);
    },
    async getFlocks(): Promise<ApiFlock[]> {
        await delay();
        return getFlockRecords().map(flockForApi);
    },
    async getFeedPurchases(): Promise<FeedPurchase[]> {
        await delay();
        return getFeedPurchases().map((purchase) => ({
            id: purchase.id,
            date: purchase.date,
            feedType: purchase.feedType as FeedPurchase["feedType"],
            brand: purchase.brand,
            quantity: `${purchase.quantity} ${purchase.unit}`,
            amount: currency(purchase.amount),
        }));
    },
    async getFeedConsumption(): Promise<FeedConsumption[]> {
        await delay();
        return getFeedUseRecords().map((entry) => ({
            id: entry.id,
            date: entry.date,
            feedType: entry.feedType as FeedConsumption["feedType"],
            quantity: `${entry.quantityKg} kg`,
        }));
    },
    async getSales(): Promise<SalesRecord[]> {
        await delay();
        return getSalesRecords().map((record) => ({
            id: record.id || record.date,
            date: record.date,
            product: (record.product || record.item || "Other poultry products") as SalesRecord["product"],
            amount: currency(record.amount),
        }));
    },
    async getExpenses(): Promise<ExpenseRecord[]> {
        await delay();
        return getExpensesRecords().map((record) => ({
            id: record.id || record.date,
            date: record.date,
            category: record.category,
            amount: currency(record.amount),
        }));
    },
    async getAssets(): Promise<AssetRecord[]> {
        await delay();
        return getFarmAssets().map((asset) => ({
            id: asset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: asset.name,
            quantity: asset.quantity,
            status: asset.status === "Working" ? "Functional" : asset.status,
            value: currency(asset.value),
        }));
    },
    async getOpportunities(): Promise<OpportunityItem[]> {
        await delay();
        return [
            { id: "opportunity-001", name: "Poultry Expansion Grant", type: "Grant", match: "Eligibility not assessed" },
            { id: "opportunity-002", name: "Working Capital Facility", type: "Loan", match: "Eligibility not assessed" },
            { id: "opportunity-003", name: "Poultry Health Cover", type: "Insurance", match: "Eligibility not assessed" },
        ];
    },
    async getNotifications(): Promise<NotificationItem[]> {
        await delay();
        return getFarmNotifications().map(({ id, title, detail, time }) => ({ id, title, detail, time }));
    },
    async updateFarm(profile: SavedFarmProfile) {
        return saveFarmProfile(profile);
    },
    async createFlock(flocks: FlockRecord[]) {
        await delay();
        saveFlockRecords(flocks);
        return flocks;
    },
    async createHouse(houses: ReturnType<typeof getPoultryHouses>) {
        await delay();
        savePoultryHouses(houses);
        return houses;
    },
    async addFarmHouse(house: Parameters<typeof createPoultryHouse>[0]) {
        return createPoultryHouse(house);
    },
    async archiveFarmHouse(name: string) {
        archivePoultryHouse(name);
    },
    async createFeedPurchase(purchases: FeedPurchaseRecord[]) {
        await delay();
        saveFeedPurchases(purchases);
        return purchases;
    },
    async createFeedUse(records: FeedUseRecord[]) {
        await delay();
        saveFeedUseRecords(records);
        return records;
    },
    async createProduction(records: ProductionRecord[]) {
        await delay();
        saveProductionRecords(records);
        return records;
    },
    async createSale(records: ReturnType<typeof getSalesRecords>) {
        await delay();
        saveSalesRecords(records);
        return records;
    },
    async createExpense(records: ExpenseEntry[]) {
        await delay();
        saveExpensesRecords(records);
        return records;
    },
    async updateAssets(records: FarmAssetRecord[]) {
        await delay();
        saveFarmAssets(records);
        return records;
    },
    async recordFeedPurchase(record: Parameters<typeof addFeedPurchase>[0]) {
        return addFeedPurchase(record);
    },
    async recordFeedUse(record: Parameters<typeof addFeedUse>[0]) {
        return addFeedUse(record);
    },
    async recordProduction(record: Parameters<typeof addProductionRecord>[0]) {
        return addProductionRecord(record);
    },
    async recordSale(record: Parameters<typeof addSaleRecord>[0]) {
        return addSaleRecord(record);
    },
    async recordExpense(record: Parameters<typeof addExpenseRecord>[0]) {
        return addExpenseRecord(record);
    },
    async collectSalePayment(id: string, amount: number, date?: string, note?: string) {
        return recordSalePayment(id, amount, date, note);
    },
    async payExpenseBalance(id: string, amount: number, date?: string, note?: string) {
        return recordExpensePayment(id, amount, date, note);
    },
    async recordVaccination(record: Parameters<typeof addVaccinationRecord>[0]) {
        return addVaccinationRecord(record);
    },
    async recordHealthIncident(record: Parameters<typeof addHealthIncident>[0]) {
        return addHealthIncident(record);
    },
};

export type MockApi = typeof mockApi;

// ============================================================================
// WRAPPED EXPORTS (REAL BACKEND FIRST + REACTIVE UI SYNC)
// ============================================================================

export function saveFarmProfile(profile: SavedFarmProfile): SavedFarmProfile {
    simSaveFarmProfile(profile);
    if (getStoredToken()) {
        backendSaveFarmProfile(profile).catch((e) => {
            console.error("Backend farm profile save failed:", e.message);
        });
    }
    return profile;
}

export function createPoultryHouse(house: Parameters<typeof simCreatePoultryHouse>[0]) {
    const created = simCreatePoultryHouse(house);
    if (getStoredToken()) {
        backendCreatePoultryHouse(house).catch((e) => {
            console.error("Backend house creation failed:", e.message);
        });
    }
    return created;
}

export function archivePoultryHouse(name: string) {
    simArchivePoultryHouse(name);
    if (getStoredToken()) {
        backendArchivePoultryHouse(name, getPoultryHouses()).catch((e) => {
            console.error("Backend house archive failed:", e.message);
        });
    }
}

export function updatePoultryHouse(name: string, draft: Parameters<typeof simUpdatePoultryHouse>[1]) {
    simUpdatePoultryHouse(name, draft);
    if (getStoredToken()) {
        syncAllFromBackend().catch(() => { });
    }
}

export function createFlockRecord(flock: Parameters<typeof simCreateFlockRecord>[0]) {
    const created = simCreateFlockRecord(flock);
    if (getStoredToken()) {
        backendCreateFlock(flock, getPoultryHouses()).catch((e) => {
            console.error("Backend flock creation failed:", e.message);
        });
    }
    return created;
}

export function addFlockMovement(movement: Parameters<typeof simAddFlockMovement>[0]) {
    simAddFlockMovement(movement);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === movement.flock || f.id === movement.flock);
        if (matched?.id) {
            backendRecordFlockMovement({
                flockId: matched.id,
                movementType: movement.type,
                quantity: movement.quantity,
                date: movement.date,
                reason: movement.reason,
                notes: movement.notes,
            }).catch((e) => {
                console.error("Backend flock movement failed:", e.message);
            });
        }
    }
}

export function addFlockTransfer(transfer: Parameters<typeof simAddFlockTransfer>[0]) {
    simAddFlockTransfer(transfer);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const houses = getPoultryHouses();
        const matchedFlock = flocks.find((f) => f.name === transfer.source || f.id === transfer.source);
        const matchedHouse = houses.find((h) => h.name === transfer.destination || h.id === transfer.destination);
        if (matchedFlock?.id && matchedHouse?.id) {
            backendTransferFlock({
                flockId: matchedFlock.id,
                targetHouseId: matchedHouse.id,
                quantity: transfer.quantity,
                date: transfer.date,
                reason: transfer.reason,
            }).catch((e) => {
                console.error("Backend flock transfer failed:", e.message);
            });
        }
    }
}

export function addFeedPurchase(purchase: Parameters<typeof simAddFeedPurchase>[0]) {
    const created = simAddFeedPurchase(purchase);
    if (getStoredToken()) {
        backendAddFeedPurchase(purchase).catch((e) => {
            console.error("Backend feed purchase failed:", e.message);
        });
    }
    return created;
}

export function addFeedUse(use: Parameters<typeof simAddFeedUse>[0]) {
    const created = simAddFeedUse(use);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === use.flock || f.id === use.flock);
        backendAddFeedUse({
            date: use.date,
            feedType: use.feedType,
            quantityKg: use.quantityKg,
            flockId: matched?.id,
            notes: use.notes,
        }).catch((e) => {
            console.error("Backend feed consumption failed:", e.message);
        });
    }
    return created;
}

export function addProductionRecord(record: Parameters<typeof simAddProductionRecord>[0]) {
    const created = simAddProductionRecord(record);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === record.flock || f.id === record.flock);
        backendAddProduction({
            date: record.date,
            flockId: matched?.id,
            eggsCollected: record.eggsCollected,
            crackedEggs: record.damagedEggs,
            averageBirdWeightKg: record.averageWeight,
            notes: record.notes,
        }).catch((e) => {
            console.error("Backend production record failed:", e.message);
        });
    }
    return created;
}

export function addHealthIncident(incident: Parameters<typeof simAddHealthIncident>[0]) {
    const created = simAddHealthIncident(incident);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === incident.flock || f.id === incident.flock);
        backendAddHealthIncident({
            date: incident.date,
            flockId: matched?.id,
            title: incident.symptoms,
            severity: "Mild",
            symptoms: incident.notes,
            affectedCount: incident.affectedBirds,
            mortalityCount: incident.birdsLost,
            actionsTaken: incident.action,
            resolved: incident.outcome === "Resolved",
        }).catch((e) => {
            console.error("Backend health incident failed:", e.message);
        });
    }
    return created;
}

export function addVaccinationRecord(vacc: Parameters<typeof simAddVaccinationRecord>[0]) {
    const created = simAddVaccinationRecord(vacc);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === vacc.flock || f.id === vacc.flock);
        backendAddVaccination({
            flockId: matched?.id,
            vaccineName: vacc.vaccine,
            dateAdministered: vacc.date,
            administrator: vacc.givenBy,
            notes: vacc.notes,
        }).catch((e) => {
            console.error("Backend vaccination failed:", e.message);
        });
    }
    return created;
}

export function addTreatmentRecord(treat: Parameters<typeof simAddTreatmentRecord>[0]) {
    const created = simAddTreatmentRecord(treat);
    if (getStoredToken()) {
        const flocks = getFlockRecords();
        const matched = flocks.find((f) => f.name === treat.flock || f.id === treat.flock);
        backendAddTreatment({
            flockId: matched?.id,
            medicationName: treat.medicine || treat.treatment,
            startDate: treat.date,
            notes: treat.notes,
        }).catch((e) => {
            console.error("Backend treatment failed:", e.message);
        });
    }
    return created;
}

export function addSaleRecord(sale: Parameters<typeof simAddSaleRecord>[0]) {
    const created = simAddSaleRecord(sale);
    if (getStoredToken()) {
        const numAmount = typeof sale.amount === "number" ? sale.amount : parseFloat(String(sale.amount).replace(/[^\d.-]/g, "")) || 0;
        const numReceived = typeof sale.amountReceived === "number" ? sale.amountReceived : numAmount;
        backendAddSale({
            date: sale.date,
            product: sale.product || sale.item || "Other poultry products",
            quantity: sale.quantity || 1,
            unit: sale.unit || "Units",
            unitPrice: (sale.quantity && numAmount) ? (numAmount / sale.quantity) : numAmount,
            totalAmount: numAmount,
            amountReceived: numReceived,
            notes: sale.item || sale.product,
        }).catch((e) => {
            console.error("Backend sale record failed:", e.message);
        });
    }
    return created;
}

export function recordSalePayment(id: string, amount: number, date?: string, note?: string) {
    const res = simRecordSalePayment(id, amount, date, note);
    if (getStoredToken()) {
        backendRecordSalePayment(id, amount, date, note).catch((e) => {
            console.error("Backend sale payment failed:", e.message);
        });
    }
    return res;
}

export function addExpenseRecord(expense: Parameters<typeof simAddExpenseRecord>[0]) {
    const created = simAddExpenseRecord(expense);
    if (getStoredToken()) {
        const numAmount = typeof expense.amount === "number" ? expense.amount : parseFloat(String(expense.amount).replace(/[^\d.-]/g, "")) || 0;
        const numPaid = typeof expense.amountPaid === "number" ? expense.amountPaid : numAmount;
        backendAddExpense({
            date: expense.date,
            category: expense.category,
            description: expense.note || expense.category,
            totalAmount: numAmount,
            amountPaid: numPaid,
            recipient: "Vendor",
            notes: expense.note,
        }).catch((e) => {
            console.error("Backend expense record failed:", e.message);
        });
    }
    return created;
}

export function recordExpensePayment(id: string, amount: number, date?: string, note?: string) {
    const res = simRecordExpensePayment(id, amount, date, note);
    if (getStoredToken()) {
        backendRecordExpensePayment(id, amount, date, note).catch((e) => {
            console.error("Backend expense payment failed:", e.message);
        });
    }
    return res;
}

export function saveKycApplication(application: Parameters<typeof simSaveKycApplication>[0]) {
    simSaveKycApplication(application);
    if (getStoredToken()) {
        backendSubmitKyc(application).catch((e) => {
            console.error("Backend KYC submission failed:", e.message);
        });
    }
}

export function addFarmDocument(doc: Parameters<typeof simAddFarmDocument>[0]) {
    const created = simAddFarmDocument(doc);
    if (getStoredToken()) {
        backendUploadDocument(doc).catch((e) => {
            console.error("Backend document upload failed:", e.message);
        });
    }
    return created;
}

export function removeFarmDocument(id: string) {
    simRemoveFarmDocument(id);
    if (getStoredToken()) {
        backendDeleteDocument(id).catch((e) => {
            console.error("Backend document removal failed:", e.message);
        });
    }
}

// Re-export other simulated helpers
export {
    applyToOpportunity,
    simAddFarmAsset as addFarmAsset,
    defaultFarmProfile,
    getDashboardTotals,
    getExpensesRecords,
    getFarmAssets,
    getSavedFarmProfile as getFarmProfile,
    getFeedPurchases,
    getFeedInventory,
    getFeedUseRecords,
    getFlockRecords,
    getFlockMovements,
    getProductionRecords,
    getOpportunityApplications,
    getInstitutionRequests,
    getInstitutionRegistration,
    getInstitutionRegistrations,
    getUserPreferences,
    getInstitutionDemoAccess,
    getFarmDocuments,
    getPoultryHouses,
    getSalesRecords,
    saveExpensesRecords,
    saveFarmAssets,
    saveFeedPurchases,
    saveFeedUseRecords,
    saveFlockRecords,
    saveFlockMovements,
    saveProductionRecords,
    savePoultryHouses,
    saveSalesRecords,
    updateOpportunityApplication,
    addInstitutionRequest,
    updateInstitutionRequest,
    saveUserPreferences,
    saveInstitutionDemoAccess,
    saveInstitutionRegistration,
    getActivityRecords,
    getDemoDatabaseSnapshot,
    getHealthIncidents,
    getTreatmentRecords,
    getKycApplication,
    getVaccinationRecords,
    importDemoDatabase,
    resetDemoDatabase,
    saveHealthIncidents,
    saveTreatmentRecords,
    updateHealthIncident,
    deleteHealthIncident,
    saveVaccinationRecords,
    syncAllFromBackend,
};

export type {
    ActivityRecord,
    ExpenseEntry,
    FarmAssetRecord,
    FarmHouseRecord,
    FarmFlockMovement,
    FarmDocumentRecord,
    FinancialPaymentRecord,
    FeedPurchaseRecord,
    FeedUseRecord,
    FlockRecord,
    KycApplication,
    OpportunityApplicationRecord,
    ProductionRecord,
    SalesEntry,
    SavedFarmProfile,
    UserPreferences,
    VaccinationRecord,
    HealthIncidentRecord,
    TreatmentRecord,
    InstitutionDemoAccess,
    InstitutionRequestRecord,
    InstitutionCategory,
    InstitutionRegistrationRecord,
    InstitutionVerificationDocument,
} from "@/lib/simulated-data";
