import type {
    AssetRecord,
    DashboardSummary,
    ExpenseRecord,
    FarmProfile,
    FeedConsumption,
    FeedPurchase,
    FlockRecord,
    NotificationItem,
    OpportunityItem,
    SalesRecord,
} from "@/types";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const mockFarmProfile: FarmProfile = {
    id: "farm-001",
    name: "Golden Feathers Poultry",
    ownerName: "Amina Daniel",
    phone: "08030000000",
    community: "Kuru",
    lga: "Jos South",
    state: "Plateau",
    establishmentDate: "2020-01-01",
    operationType: "Broiler",
    productionSystem: "Deep litter",
    numberOfHouses: 4,
    waterSource: "Borehole",
    numberOfWorkers: 6,
    biosecurityMeasures: ["Restricted farm access", "Footbath", "Disinfection", "Visitor control"],
    housingCapacity: 5000,
};

const mockFlocks: FlockRecord[] = [
    {
        id: "flock-001",
        name: "Broiler Batch 02",
        type: "Broiler",
        breed: "Ross 308",
        house: "House A",
        birds: 1400,
        status: "Active",
        acquisitionDate: "2026-09-10",
        cycleStart: "2026-09-12",
    },
    {
        id: "flock-002",
        name: "Layer Batch 05",
        type: "Layer",
        breed: "Isa Brown",
        house: "House B",
        birds: 1600,
        status: "Active",
        acquisitionDate: "2026-08-08",
        cycleStart: "2026-08-11",
    },
    {
        id: "flock-003",
        name: "Breeder Batch 01",
        type: "Breeder",
        breed: "Cobb 500",
        house: "House C",
        birds: 520,
        status: "Completed",
        acquisitionDate: "2026-05-14",
        cycleStart: "2026-05-20",
    },
];

const mockFeedPurchases: FeedPurchase[] = [
    { id: "feed-purchase-001", date: "2026-10-12", feedType: "Starter", brand: "Top Feed", quantity: "120 bags", amount: "₦240,000" },
    { id: "feed-purchase-002", date: "2026-10-18", feedType: "Finisher", brand: "Unique Feeds", quantity: "90 bags", amount: "₦180,000" },
    { id: "feed-purchase-003", date: "2026-10-29", feedType: "Grower", brand: "Tropical Feed", quantity: "80 bags", amount: "₦120,000" },
];

const mockFeedConsumption: FeedConsumption[] = [
    { id: "feed-consumption-001", date: "2026-10-10", feedType: "Starter", quantity: "160 kg" },
    { id: "feed-consumption-002", date: "2026-10-14", feedType: "Grower", quantity: "250 kg" },
    { id: "feed-consumption-003", date: "2026-10-21", feedType: "Finisher", quantity: "300 kg" },
];

const mockSales: SalesRecord[] = [
    { id: "sale-001", date: "2026-10-08", product: "Live birds", amount: "₦360,000" },
    { id: "sale-002", date: "2026-10-16", product: "Eggs", amount: "₦200,000" },
    { id: "sale-003", date: "2026-10-24", product: "Manure", amount: "₦70,000" },
];

const mockExpenses: ExpenseRecord[] = [
    { id: "expense-001", date: "2026-10-06", category: "Labour", amount: "₦120,000" },
    { id: "expense-002", date: "2026-10-14", category: "Utilities", amount: "₦58,000" },
    { id: "expense-003", date: "2026-10-20", category: "Veterinary", amount: "₦76,500" },
];

const mockAssets: AssetRecord[] = [
    { id: "asset-001", name: "Feed mixer", quantity: 1, status: "Functional", value: "₦320,000" },
    { id: "asset-002", name: "Water tank", quantity: 3, status: "Functional", value: "₦180,000" },
    { id: "asset-003", name: "Generator", quantity: 1, status: "Needs repair", value: "₦410,000" },
];

const mockDashboard: DashboardSummary = {
    activeFlocks: "8",
    revenueThisMonth: "₦1.8M",
    feedCost: "₦420k",
    riskScore: "Low",
};

const mockOpportunities: OpportunityItem[] = [
    { id: "opportunity-001", name: "Poultry Expansion Grant", type: "Grant", match: "High match" },
    { id: "opportunity-002", name: "Working Capital Facility", type: "Loan", match: "Medium match" },
    { id: "opportunity-003", name: "Broiler Health Insurance", type: "Insurance", match: "Medium match" },
];

const mockNotifications: NotificationItem[] = [
    { id: "notif-001", title: "Vaccination reminder", detail: "Newcastle vaccine is due in 3 days.", time: "2 hours ago" },
    { id: "notif-002", title: "Feed stock update", detail: "Starter feed inventory is running low.", time: "Today" },
    { id: "notif-003", title: "Opportunity match", detail: "A poultry expansion grant matches your farm profile.", time: "Yesterday" },
];

export const mockApi = {
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        await delay();
        return mockDashboard;
    },
    getFarmProfile: async (): Promise<FarmProfile> => {
        await delay();
        return mockFarmProfile;
    },
    getFlocks: async (): Promise<FlockRecord[]> => {
        await delay();
        return mockFlocks;
    },
    getFeedPurchases: async (): Promise<FeedPurchase[]> => {
        await delay();
        return mockFeedPurchases;
    },
    getFeedConsumption: async (): Promise<FeedConsumption[]> => {
        await delay();
        return mockFeedConsumption;
    },
    getSales: async (): Promise<SalesRecord[]> => {
        await delay();
        return mockSales;
    },
    getExpenses: async (): Promise<ExpenseRecord[]> => {
        await delay();
        return mockExpenses;
    },
    getAssets: async (): Promise<AssetRecord[]> => {
        await delay();
        return mockAssets;
    },
    getOpportunities: async (): Promise<OpportunityItem[]> => {
        await delay();
        return mockOpportunities;
    },
    getNotifications: async (): Promise<NotificationItem[]> => {
        await delay();
        return mockNotifications;
    },
};

export type MockApi = typeof mockApi;

