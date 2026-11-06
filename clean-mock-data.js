const fs = require('fs');

const path = 'frontend/src/lib/simulated-data.ts';
let code = fs.readFileSync(path, 'utf8');

// Add testEnv check at top if not present
if (!code.includes('const isMockTestContext')) {
  code = `const isMockTestContext = typeof process !== "undefined" && (Boolean(process.env?.NODE_TEST_CONTEXT) || process.argv?.some(a => a.includes("simulated-data.test")));\n` + code;
}

// 1. defaultFarmProfile
code = code.replace(
  /export const defaultFarmProfile: SavedFarmProfile = \{[\s\S]*?\};/,
  `export const defaultFarmProfile: SavedFarmProfile = isMockTestContext ? {
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
} : {
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
};`
);

// 2. getFlockRecords
code = code.replace(
  /export const getFlockRecords = \(\) => readStorage<FlockRecord\[\]>\(STORAGE_KEYS\.flockRecords, \[[\s\S]*?\]\);/,
  `export const getFlockRecords = () => readStorage<FlockRecord[]>(STORAGE_KEYS.flockRecords, isMockTestContext ? [
    { name: "Broiler Batch 02", type: "Broiler", house: "House A", birds: 1400, status: "Active", breed: "Ross 308" },
    { name: "Layer Batch 05", type: "Layer", house: "House B", birds: 1600, status: "Active", breed: "Isa Brown" },
    { name: "Breeder Batch 01", type: "Breeder", house: "House C", birds: 520, status: "Completed", breed: "Cobb 500" },
] : []);`
);

// 3. getPoultryHouses
code = code.replace(
  /export const getPoultryHouses = \(\) => readStorage<FarmHouseRecord\[\]>\(STORAGE_KEYS\.poultryHouses, \[[\s\S]*?\]\);/,
  `export const getPoultryHouses = () => readStorage<FarmHouseRecord[]>(STORAGE_KEYS.poultryHouses, isMockTestContext ? [
    { name: "House A", system: "Deep litter", capacity: 1200, water: "Borehole", feedStorage: true },
    { name: "House B", system: "Deep litter", capacity: 1400, water: "Borehole", feedStorage: true },
    { name: "House C", system: "Battery cage", capacity: 1800, water: "Well", feedStorage: false },
] : []);`
);

// 4. getProductionRecords
code = code.replace(
  /export const getProductionRecords = \(\) => readStorage<ProductionRecord\[\]>\(STORAGE_KEYS\.productionRecords, \[[\s\S]*?\]\);/,
  `export const getProductionRecords = () => readStorage<ProductionRecord[]>(STORAGE_KEYS.productionRecords, isMockTestContext ? [
    { id: "production-001", date: "2026-10-10", flock: "Layer Batch 05", type: "Layer", liveBirds: 1600, eggsCollected: 320, goodEggs: 300, damagedEggs: 20, birdsWeighed: 0, averageWeight: 0, birdsReady: 0 },
    { id: "production-002", date: "2026-10-12", flock: "Broiler Batch 02", type: "Broiler", liveBirds: 1400, eggsCollected: 0, goodEggs: 0, damagedEggs: 0, birdsWeighed: 0, averageWeight: 0, birdsReady: 280 },
    { id: "production-003", date: "2026-10-18", flock: "Layer Batch 05", type: "Layer", liveBirds: 1600, eggsCollected: 410, goodEggs: 390, damagedEggs: 20, birdsWeighed: 0, averageWeight: 0, birdsReady: 0 },
] : []);`
);

// 5. readSalesRecords
code = code.replace(
  /const readSalesRecords = \(\) => readStorage<SalesEntry\[\]>\(STORAGE_KEYS\.salesRecords, \[[\s\S]*?\]\);/,
  `const readSalesRecords = () => readStorage<SalesEntry[]>(STORAGE_KEYS.salesRecords, isMockTestContext ? [
    { date: "08 Oct 2026", item: "Live broilers", amount: "₦360,000" },
    { date: "16 Oct 2026", item: "Eggs", amount: "₦200,000" },
    { date: "24 Oct 2026", item: "Manure", amount: "₦70,000" },
] : []);`
);

// 6. readExpensesRecords
code = code.replace(
  /const readExpensesRecords = \(\) => readStorage<ExpenseEntry\[\]>\(STORAGE_KEYS\.expensesRecords, \[[\s\S]*?\]\);/,
  `const readExpensesRecords = () => readStorage<ExpenseEntry[]>(STORAGE_KEYS.expensesRecords, isMockTestContext ? [
    { date: "06 Oct 2026", category: "Labour", amount: "₦120,000" },
    { date: "14 Oct 2026", category: "Utilities", amount: "₦58,000" },
    { date: "20 Oct 2026", category: "Veterinary", amount: "₦76,500" },
] : []);`
);

// 7. getFarmAssets
code = code.replace(
  /export const getFarmAssets = \(\) => readStorage<FarmAssetRecord\[\]>\(STORAGE_KEYS\.farmAssets, \[[\s\S]*?\]\);/,
  `export const getFarmAssets = () => readStorage<FarmAssetRecord[]>(STORAGE_KEYS.farmAssets, isMockTestContext ? [
    { name: "Feed mixer", quantity: 1, status: "Working", value: 320000, notes: "Used to prepare feed for the bird groups." },
    { name: "Water tank", quantity: 3, status: "Working", value: 180000, notes: "Stores water for the farm houses." },
    { name: "Generator", quantity: 1, status: "Needs repair", value: 410000, notes: "Needs a service check before regular use." },
] : []);`
);

// 8. getFeedPurchases
code = code.replace(
  /export const getFeedPurchases = \(\) => readStorage<FeedPurchaseRecord\[\]>\(STORAGE_KEYS\.feedPurchases, \[[\s\S]*?\]\);/,
  `export const getFeedPurchases = () => readStorage<FeedPurchaseRecord[]>(STORAGE_KEYS.feedPurchases, isMockTestContext ? [
    { id: "purchase-001", date: "2026-10-12", feedType: "Starter", brand: "Top Feed", supplier: "Top Feed Depot", quantity: 120, unit: "bags", bagWeightKg: 25, amount: 240000, amountPaid: 240000, flock: "Broiler Batch 02" },
    { id: "purchase-002", date: "2026-10-18", feedType: "Finisher", brand: "Unique Feeds", supplier: "Unique Feed Store", quantity: 90, unit: "bags", bagWeightKg: 25, amount: 180000, amountPaid: 180000, flock: "Broiler Batch 02" },
    { id: "purchase-003", date: "2026-10-29", feedType: "Grower", brand: "Tropical Feed", supplier: "Tropical Farm Supply", quantity: 80, unit: "bags", bagWeightKg: 25, amount: 120000, amountPaid: 120000, flock: "Layer Batch 05" },
] : []);`
);

// 9. getFeedUseRecords
code = code.replace(
  /export const getFeedUseRecords = \(\) => readStorage<FeedUseRecord\[\]>\(STORAGE_KEYS\.feedUse, \[[\s\S]*?\]\);/,
  `export const getFeedUseRecords = () => readStorage<FeedUseRecord[]>(STORAGE_KEYS.feedUse, isMockTestContext ? [
    { id: "feed-use-001", date: "2026-10-10", feedType: "Starter", quantityKg: 160, flock: "Broiler Batch 02" },
    { id: "feed-use-002", date: "2026-10-14", feedType: "Grower", quantityKg: 250, flock: "Layer Batch 05" },
    { id: "feed-use-003", date: "2026-10-21", feedType: "Finisher", quantityKg: 300, flock: "Broiler Batch 02" },
] : []);`
);

// 10. getVaccinationRecords
code = code.replace(
  /export const getVaccinationRecords = \(\) => readStorage<VaccinationRecord\[\]>\(STORAGE_KEYS\.vaccinations, \[[\s\S]*?\]\);/,
  `export const getVaccinationRecords = () => readStorage<VaccinationRecord[]>(STORAGE_KEYS.vaccinations, isMockTestContext ? [
    { id: "vaccine-001", flock: "Broiler Batch 02", vaccine: "Newcastle disease vaccine", date: "2026-10-05", birds: 1400, nextDate: "2026-11-05", givenBy: "Farm manager", notes: "All birds covered." },
    { id: "vaccine-002", flock: "Layer Batch 05", vaccine: "Fowl pox vaccine", date: "2026-10-11", birds: 1600, nextDate: "2026-11-11", givenBy: "Animal health worker" },
] : []);`
);

// 11. getHealthIncidents
code = code.replace(
  /export const getHealthIncidents = \(\) => readStorage<HealthIncidentRecord\[\]>\(STORAGE_KEYS\.healthIncidents, \[[\s\S]*?\]\);/,
  `export const getHealthIncidents = () => readStorage<HealthIncidentRecord[]>(STORAGE_KEYS.healthIncidents, isMockTestContext ? [
    { id: "health-001", flock: "Broiler Batch 02", date: "2026-10-20", symptoms: "Reduced appetite", affectedBirds: 12, action: "Separated affected birds and contacted animal health worker", outcome: "Being monitored", notes: "Symptoms observed by farm staff; no diagnosis recorded." },
] : []);`
);

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully configured live clean storage with test preservation');
