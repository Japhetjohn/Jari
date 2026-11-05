const fs = require('fs');

const path = 'frontend/src/lib/simulated-data.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. defaultFarmProfile
code = code.replace(
  /export const defaultFarmProfile: SavedFarmProfile = \{[\s\S]*?\};/,
  `export const defaultFarmProfile: SavedFarmProfile = {
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
  `export const getFlockRecords = () => readStorage<FlockRecord[]>(STORAGE_KEYS.flockRecords, []);`
);

// 3. getPoultryHouses
code = code.replace(
  /export const getPoultryHouses = \(\) => readStorage<FarmHouseRecord\[\]>\(STORAGE_KEYS\.poultryHouses, \[[\s\S]*?\]\);/,
  `export const getPoultryHouses = () => readStorage<FarmHouseRecord[]>(STORAGE_KEYS.poultryHouses, []);`
);

// 4. getProductionRecords
code = code.replace(
  /export const getProductionRecords = \(\) => readStorage<ProductionRecord\[\]>\(STORAGE_KEYS\.productionRecords, \[[\s\S]*?\]\);/,
  `export const getProductionRecords = () => readStorage<ProductionRecord[]>(STORAGE_KEYS.productionRecords, []);`
);

// 5. readSalesRecords
code = code.replace(
  /const readSalesRecords = \(\) => readStorage<SalesEntry\[\]>\(STORAGE_KEYS\.salesRecords, \[[\s\S]*?\]\);/,
  `const readSalesRecords = () => readStorage<SalesEntry[]>(STORAGE_KEYS.salesRecords, []);`
);

// 6. readExpensesRecords
code = code.replace(
  /const readExpensesRecords = \(\) => readStorage<ExpenseEntry\[\]>\(STORAGE_KEYS\.expensesRecords, \[[\s\S]*?\]\);/,
  `const readExpensesRecords = () => readStorage<ExpenseEntry[]>(STORAGE_KEYS.expensesRecords, []);`
);

// 7. getFarmAssets
code = code.replace(
  /export const getFarmAssets = \(\) => readStorage<FarmAssetRecord\[\]>\(STORAGE_KEYS\.farmAssets, \[[\s\S]*?\]\);/,
  `export const getFarmAssets = () => readStorage<FarmAssetRecord[]>(STORAGE_KEYS.farmAssets, []);`
);

// 8. getFeedPurchases
code = code.replace(
  /export const getFeedPurchases = \(\) => readStorage<FeedPurchaseRecord\[\]>\(STORAGE_KEYS\.feedPurchases, \[[\s\S]*?\]\);/,
  `export const getFeedPurchases = () => readStorage<FeedPurchaseRecord[]>(STORAGE_KEYS.feedPurchases, []);`
);

// 9. getFeedUseRecords
code = code.replace(
  /export const getFeedUseRecords = \(\) => readStorage<FeedUseRecord\[\]>\(STORAGE_KEYS\.feedUse, \[[\s\S]*?\]\);/,
  `export const getFeedUseRecords = () => readStorage<FeedUseRecord[]>(STORAGE_KEYS.feedUse, []);`
);

// 10. getVaccinationRecords
code = code.replace(
  /export const getVaccinationRecords = \(\) => readStorage<VaccinationRecord\[\]>\(STORAGE_KEYS\.vaccinations, \[[\s\S]*?\]\);/,
  `export const getVaccinationRecords = () => readStorage<VaccinationRecord[]>(STORAGE_KEYS.vaccinations, []);`
);

// 11. getHealthIncidents
code = code.replace(
  /export const getHealthIncidents = \(\) => readStorage<HealthIncidentRecord\[\]>\(STORAGE_KEYS\.healthIncidents, \[[\s\S]*?\]\);/,
  `export const getHealthIncidents = () => readStorage<HealthIncidentRecord[]>(STORAGE_KEYS.healthIncidents, []);`
);

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully cleaned mock data from simulated-data.ts');
