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

const readStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const stored = window.localStorage.getItem(key);
        return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = <T,>(key: string, value: T) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
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
export const saveFarmProfile = (value: SavedFarmProfile) => writeStorage(STORAGE_KEYS.farmProfile, value);
export const getKycApplication = () => readStorage<KycApplication | null>(STORAGE_KEYS.kycApplication, null);
export const saveKycApplication = (value: KycApplication) => writeStorage(STORAGE_KEYS.kycApplication, value);

export const getFlockRecords = () => readStorage<any[]>(STORAGE_KEYS.flockRecords, [
    { name: "Broiler Batch 02", type: "Broiler", house: "House A", birds: 1400, status: "Active", breed: "Ross 308" },
    { name: "Layer Batch 05", type: "Layer", house: "House B", birds: 1600, status: "Active", breed: "Isa Brown" },
    { name: "Breeder Batch 01", type: "Breeder", house: "House C", birds: 520, status: "Completed", breed: "Cobb 500" },
]);
export const saveFlockRecords = (value: any[]) => writeStorage(STORAGE_KEYS.flockRecords, value);

export const getPoultryHouses = () => readStorage<any[]>(STORAGE_KEYS.poultryHouses, [
    { name: "House A", system: "Deep litter", capacity: 1200, water: "Borehole", feedStorage: true },
    { name: "House B", system: "Deep litter", capacity: 1400, water: "Borehole", feedStorage: true },
    { name: "House C", system: "Battery cage", capacity: 1800, water: "Well", feedStorage: false },
]);
export const savePoultryHouses = (value: any[]) => writeStorage(STORAGE_KEYS.poultryHouses, value);

export const getProductionRecords = () => readStorage<any[]>(STORAGE_KEYS.productionRecords, [
    { date: "10 Oct", type: "Layer", output: "320 eggs" },
    { date: "12 Oct", type: "Broiler", output: "280 birds ready" },
    { date: "18 Oct", type: "Layer", output: "410 eggs" },
]);
export const saveProductionRecords = (value: any[]) => writeStorage(STORAGE_KEYS.productionRecords, value);

export const getSalesRecords = () => readStorage<any[]>(STORAGE_KEYS.salesRecords, [
    { date: "08 Oct 2026", item: "Live broilers", amount: "₦360,000" },
    { date: "16 Oct 2026", item: "Eggs", amount: "₦200,000" },
    { date: "24 Oct 2026", item: "Manure", amount: "₦70,000" },
]);
export const saveSalesRecords = (value: any[]) => writeStorage(STORAGE_KEYS.salesRecords, value);

export const getExpensesRecords = () => readStorage<any[]>(STORAGE_KEYS.expensesRecords, [
    { date: "06 Oct 2026", category: "Labour", amount: "₦120,000" },
    { date: "14 Oct 2026", category: "Utilities", amount: "₦58,000" },
    { date: "20 Oct 2026", category: "Veterinary", amount: "₦76,500" },
]);
export const saveExpensesRecords = (value: any[]) => writeStorage(STORAGE_KEYS.expensesRecords, value);
