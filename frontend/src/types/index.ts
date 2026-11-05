export type UserRole = "farmer" | "admin" | "verification_agent" | "institutional_user";

export type PoultryType = "Broiler" | "Layer" | "Breeder";
export type ProductionSystem = "Deep litter" | "Battery cage" | "Free range" | "Other";
export type WaterSource = "Borehole" | "Well" | "Municipal supply" | "Surface water" | "Other";

export interface FarmProfile {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    community: string;
    lga: string;
    state: string;
    establishmentDate: string;
    operationType: PoultryType;
    productionSystem: ProductionSystem;
    numberOfHouses: number;
    waterSource: WaterSource;
    numberOfWorkers: number;
    biosecurityMeasures: string[];
    housingCapacity: number;
}

export interface FlockRecord {
    id: string;
    name: string;
    type: PoultryType;
    breed: string;
    house: string;
    birds: number;
    status: "Active" | "Completed";
    acquisitionDate: string;
    cycleStart: string;
}

export interface FeedPurchase {
    id: string;
    date: string;
    feedType: "Starter" | "Grower" | "Finisher" | "Layer" | "Breeder";
    brand: string;
    quantity: string;
    amount: string;
}

export interface FeedConsumption {
    id: string;
    date: string;
    feedType: "Starter" | "Grower" | "Finisher" | "Layer" | "Breeder";
    quantity: string;
}

export interface SalesRecord {
    id: string;
    date: string;
    product: "Live birds" | "Eggs" | "Manure" | "Other poultry products";
    amount: string;
}

export interface ExpenseRecord {
    id: string;
    date: string;
    category: string;
    amount: string;
}

export interface AssetRecord {
    id: string;
    name: string;
    quantity: number;
    status: "Functional" | "Needs repair" | "Non-functional";
    value: string;
}

export interface DashboardSummary {
    activeFlocks: string;
    revenueThisMonth: string;
    feedCost: string;
    riskScore: string;
}

export interface OpportunityItem {
    id: string;
    name: string;
    type: "Grant" | "Loan" | "Insurance";
    match: "High match" | "Medium match" | "Low match";
}

export interface NotificationItem {
    id: string;
    title: string;
    detail: string;
    time: string;
}

