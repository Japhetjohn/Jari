const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../src/lib/simulated-data.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const authSource = fs.readFileSync(path.join(__dirname, "../src/lib/auth.ts"), "utf8");
const authOutput = ts.transpileModule(authSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const local = new Map();
const events = [];
let failNextSetFor = null;
const windowMock = {
  localStorage: {
    getItem: (key) => local.has(key) ? local.get(key) : null,
    setItem: (key, value) => { if (key === failNextSetFor) { failNextSetFor = null; throw new Error("Simulated browser storage quota error"); } local.set(key, String(value)); },
    removeItem: (key) => local.delete(key),
  },
  dispatchEvent: (event) => events.push(event),
};
class CustomEventMock { constructor(type, options) { this.type = type; this.detail = options?.detail; } }
const commonModule = { exports: {} };
const sandbox = { exports: commonModule.exports, module: commonModule, window: windowMock, CustomEvent: CustomEventMock, crypto: require("node:crypto").webcrypto, console };
vm.runInNewContext(output, sandbox, { filename: "simulated-data.js" });
const data = sandbox.module.exports;
const authModule = { exports: {} };
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
const apiClientMock = {
  authApi: {
    login: async () => ({ access_token: "token", user: {} }),
    register: async () => ({ access_token: "token", user: {} }),
    getMe: async () => ({}),
  },
  institutionApi: {
    createProfile: async () => ({}),
  },
  setStoredToken: () => {},
  removeStoredToken: () => {},
  getStoredToken: () => null,
  SESSION_STORAGE_KEY: "jari-simulated-session",
  TOKEN_STORAGE_KEY: "jari_auth_token",
  ApiError,
};
vm.runInNewContext(authOutput, {
  exports: authModule.exports,
  module: authModule,
  window: windowMock,
  CustomEvent: CustomEventMock,
  console,
  require: (name) => {
    if (name === "@/lib/simulated-data") return data;
    if (name === "@/lib/api-client") return apiClientMock;
    if (name === "@/lib/backend-sync") return { syncAllFromBackend: async () => {} };
    throw new Error(`Unexpected module ${name}`);
  }
}, { filename: "auth.js" });
const auth = authModule.exports;

beforeEach(() => {
  local.clear();
  events.length = 0;
  failNextSetFor = null;
  local.set("jari-demo:v1:jari-simulated-flocks", JSON.stringify([
    { name: "Broiler Batch 02", type: "Broiler", house: "House A", birds: 1400, status: "Active", breed: "Ross 308" },
    { name: "Layer Batch 05", type: "Layer", house: "House B", birds: 1600, status: "Active", breed: "Isa Brown" },
    { name: "Breeder Batch 01", type: "Breeder", house: "House C", birds: 520, status: "Completed", breed: "Cobb 500" },
  ]));
  local.set("jari-demo:v1:jari-simulated-houses", JSON.stringify([
    { name: "House A", system: "Deep litter", capacity: 1200, water: "Borehole", feedStorage: true },
    { name: "House B", system: "Deep litter", capacity: 1400, water: "Borehole", feedStorage: true },
    { name: "House C", system: "Battery cage", capacity: 1800, water: "Well", feedStorage: false },
  ]));
  local.set("jari-demo:v1:jari-simulated-feed-purchases", JSON.stringify([
    { id: "purchase-001", date: "2026-10-12", feedType: "Starter", brand: "Top Feed", supplier: "Top Feed Depot", quantity: 120, unit: "bags", bagWeightKg: 25, amount: 240000, amountPaid: 240000, flock: "Broiler Batch 02" },
  ]));
  local.set("jari-demo:v1:jari-simulated-feed-use", JSON.stringify([
    { id: "feed-use-001", date: "2026-10-10", feedType: "Starter", quantityKg: 160, flock: "Broiler Batch 02" },
  ]));
  local.set("jari-demo:v1:jari-simulated-sales", JSON.stringify([
    { date: "08 Oct 2026", item: "Live broilers", amount: "₦360,000" },
  ]));
  local.set("jari-demo:v1:jari-simulated-expenses", JSON.stringify([
    { date: "06 Oct 2026", category: "Labour", amount: "₦120,000" },
  ]));
  local.set("jari-demo:v1:jari-simulated-health-incidents", JSON.stringify([
    { id: "health-001", flock: "Broiler Batch 02", date: "2026-10-14", symptoms: "Lethargy", affectedBirds: 5, birdsLost: 0, action: "Observed" },
  ]));
  local.set("jari-demo:v1:jari-simulated-farm-assets", JSON.stringify([
    { name: "Feed mixer", quantity: 1, status: "Working", value: 320000, notes: "Used to prepare feed for the bird groups." },
  ]));
});

test("one-time migration preserves existing demo farm records", () => {
  local.set("jari-simulated-farm-profile", JSON.stringify({ farmName: "Existing demo", ownerName: "Farmer" }));
  assert.equal(data.getFarmProfile().farmName, "Existing demo");
  assert.equal(local.get("jari-demo:v1:jari-simulated-farm-profile"), local.get("jari-simulated-farm-profile"));
});

test("demo sign-in persists a role session and rejects incorrect credentials", () => {
  assert.throws(() => auth.loginWithSimulation("08030000000", "wrong"), /Invalid phone/);
  const session = auth.loginWithSimulation("08030000000", "password123");
  assert.equal(session.role, "farmer");
  assert.equal(auth.isAuthenticated(), true);
  assert.equal(auth.getSavedSession().id, "user-farmer-demo");
  auth.logoutSimulation();
  assert.equal(auth.isAuthenticated(), false);
});

test("farmer registration validates input and blocks duplicate phone numbers", () => {
  assert.throws(() => auth.registerWithSimulation("A", "08070000000", "secret1"), /full name/);
  const session = auth.registerWithSimulation("New Farmer", "08070000000", "secret123");
  assert.equal(session.role, "farmer");
  assert.throws(() => auth.registerWithSimulation("New Farmer", "08070000000", "secret123"), /already exists/);
});

test("registration rolls back its account if the browser cannot save the session", () => {
  failNextSetFor = "jari-simulated-session";
  assert.throws(() => auth.registerWithSimulation("Temporary Farmer", "08070000001", "secret123"), /storage/);
  assert.throws(() => auth.loginWithSimulation("08070000001", "secret123"), /Invalid phone/);
  assert.equal(auth.getSavedSession(), null);
});

test("institution registration saves its profile and pending status with the institutional account", () => {
  const session = auth.registerInstitutionWithSimulation("08070000002", "secret123", {
    organisationName: "Plateau Lending Co-op", organisationType: "Cooperative", cacRegistrationNumber: "CAC-123", yearEstablished: "2018",
    officialEmail: "office@example.ng", officialPhone: "08070000003", website: "", officeAddress: "Jos", state: "Plateau", lga: "Jos South", categories: ["Lending Institution"],
    services: { "Lending Institution": { loanTypes: "Poultry working capital" } }, representative: { fullName: "Musa Daniel", jobTitle: "Manager", email: "musa@example.ng", phone: "08070000002" }, documents: [{ id: "doc-1", name: "CAC.pdf", type: "application/pdf", size: 12, dataUrl: "data:application/pdf;base64,WA==", category: "registration evidence" }],
  });
  assert.equal(session.role, "institutional_user");
  assert.equal(data.getInstitutionRegistration(session.id).status, "Pending Verification");
  assert.deepEqual(Array.from(data.getInstitutionRegistration(session.id).categories), ["Lending Institution"]);
});

test("institution registration rolls back its account when profile storage fails", () => {
  failNextSetFor = "jari-demo:v1:jari-simulated-institution-registrations";
  const profile = { organisationName: "Temporary Institution", organisationType: "NGO", cacRegistrationNumber: "", yearEstablished: "2020", officialEmail: "office@example.ng", officialPhone: "08070000004", website: "", officeAddress: "Jos", state: "Plateau", lga: "Jos South", categories: ["Grant Provider"], services: {}, representative: { fullName: "Musa Daniel", jobTitle: "Manager", email: "musa@example.ng", phone: "08070000004" }, documents: [{ id: "doc-1", name: "Authority.pdf", type: "application/pdf", size: 12, dataUrl: "data:application/pdf;base64,WA==", category: "grant authority" }] };
  assert.throws(() => auth.registerInstitutionWithSimulation("08070000004", "secret123", profile), /storage/);
  assert.throws(() => auth.loginWithSimulation("08070000004", "secret123"), /Invalid phone/);
  assert.equal(data.getInstitutionRegistrations().length, 0);
});

test("bird sale updates the shared flock count and records activity", () => {
  const before = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  data.addSaleRecord({ date: "2026-11-05", product: "Live birds", amount: 100000, amountReceived: 50000, quantity: 10, unit: "Birds", flock: "Broiler Batch 02" });
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, before - 10);
  assert.equal(data.getSalesRecords().at(-1).outstanding, 50000);
  assert.ok(data.getActivityRecords().length > 0);
});

test("bird sales roll back the flock count if the sale record cannot be saved", () => {
  const count = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  const salesCount = data.getSalesRecords().length;
  failNextSetFor = "jari-demo:v1:jari-simulated-sales";
  assert.throws(() => data.addSaleRecord({ date: "2026-11-05", product: "Live birds", amount: 1000, quantity: 2, unit: "Birds", flock: "Broiler Batch 02" }), /quota/);
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, count);
  assert.equal(data.getSalesRecords().length, salesCount);
});

test("feed use cannot exceed calculated stock and valid use lowers stock", () => {
  const before = data.getFeedInventory().find((item) => item.feedType === "Starter").availableKg;
  assert.throws(() => data.addFeedUse({ date: "2026-11-05", feedType: "Starter", quantityKg: before + 1, flock: "Broiler Batch 02" }), /available/);
  data.addFeedUse({ date: "2026-11-05", feedType: "Starter", quantityKg: 20, flock: "Broiler Batch 02" });
  assert.equal(data.getFeedInventory().find((item) => item.feedType === "Starter").availableKg, before - 20);
});

test("sale and expense payments cannot exceed balances", () => {
  const sale = data.addSaleRecord({ date: "2026-11-05", product: "Eggs", amount: 1000, amountReceived: 200 });
  assert.throws(() => data.recordSalePayment(sale.id, 801), /outstanding balance/);
  assert.equal(data.recordSalePayment(sale.id, 800).outstanding, 0);
  const expense = data.addExpenseRecord({ date: "2026-11-05", category: "Feed", amount: 2000, amountPaid: 500 });
  assert.throws(() => data.recordExpensePayment(expense.id, 1501), /outstanding balance/);
  assert.equal(data.recordExpensePayment(expense.id, 1500).outstanding, 0);
});

test("partial payments append dated history and keep remaining balances accurate", () => {
  const sale = data.addSaleRecord({ date: "2026-11-05", product: "Eggs", amount: 1000, amountReceived: 100 });
  data.recordSalePayment(sale.id, 250, "2026-11-06", "Market deposit");
  const savedSale = data.getSalesRecords().at(-1);
  assert.equal(savedSale.amountReceived, 350);
  assert.equal(savedSale.outstanding, 650);
  assert.deepEqual(Array.from(savedSale.payments, (payment) => payment.amount), [100, 250]);
  const expense = data.addExpenseRecord({ date: "2026-11-05", category: "Medicine", amount: 800, amountPaid: 200 });
  data.recordExpensePayment(expense.id, 300, "2026-11-07", "Part payment");
  const savedExpense = data.getExpensesRecords().at(-1);
  assert.equal(savedExpense.amountPaid, 500);
  assert.equal(savedExpense.outstanding, 300);
  assert.deepEqual(Array.from(savedExpense.payments, (payment) => payment.amount), [200, 300]);
});

test("seeded legacy sales and expenses can be paid with stable payment history", () => {
  const sale = data.getSalesRecords()[0];
  const expense = data.getExpensesRecords()[0];
  assert.ok(sale.id);
  assert.ok(expense.id);
  const saleBalance = sale.outstanding;
  const expenseBalance = expense.outstanding;
  data.recordSalePayment(sale.id, 1, "2026-11-05", "Legacy sale deposit");
  data.recordExpensePayment(expense.id, 1, "2026-11-05", "Legacy expense payment");
  assert.equal(data.getSalesRecords()[0].outstanding, saleBalance - 1);
  assert.equal(data.getSalesRecords()[0].payments.at(-1).note, "Legacy sale deposit");
  assert.equal(data.getExpensesRecords()[0].outstanding, expenseBalance - 1);
  assert.equal(data.getExpensesRecords()[0].payments.at(-1).note, "Legacy expense payment");
});

test("flock transfer moves birds in both groups with paired movement records", () => {
  const beforeSource = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  const beforeDestination = data.getFlockRecords().find((flock) => flock.name === "Layer Batch 05").birds;
  data.savePoultryHouses(data.getPoultryHouses().map((house) => house.name === "House B" ? { ...house, capacity: 3000 } : house));
  assert.throws(() => data.addFlockTransfer({ source: "Broiler Batch 02", destination: "Layer Batch 05", date: "2026-11-05", quantity: beforeSource + 1, reason: "Validation" }), /Only/);
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, beforeSource);
  const result = data.addFlockTransfer({ source: "Broiler Batch 02", destination: "Layer Batch 05", date: "2026-11-05", quantity: 25, reason: "Balance groups" });
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, beforeSource - 25);
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Layer Batch 05").birds, beforeDestination + 25);
  assert.equal(result.movements.length, 2);
  assert.equal(result.movements[0].type, "Transfer out");
  assert.equal(result.movements[1].type, "Transfer in");
  assert.equal(result.movements[0].notes, result.movements[1].notes);
});

test("flock transfers roll back both bird groups if movement history cannot be saved", () => {
  data.savePoultryHouses(data.getPoultryHouses().map((house) => house.name === "House B" ? { ...house, capacity: 3000 } : house));
  const starting = data.getFlockRecords();
  failNextSetFor = "jari-demo:v1:jari-simulated-flock-movements";
  assert.throws(() => data.addFlockTransfer({ source: "Broiler Batch 02", destination: "Layer Batch 05", date: "2026-11-05", quantity: 5, reason: "Rollback check" }), /quota/);
  assert.deepEqual(data.getFlockRecords().map((flock) => flock.birds), starting.map((flock) => flock.birds));
});

test("health incident mortality applies once and removal restores the recorded birds", () => {
  const starting = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  const incident = data.addHealthIncident({ flock: "Broiler Batch 02", date: "2026-11-05", symptoms: "Illness observed", affectedBirds: 5, birdsLost: 2, action: "Separated affected birds", outcome: "Monitoring" });
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, starting - 2);
  data.updateHealthIncident(incident.id, { date: incident.date, symptoms: "Symptoms and appetite recorded", affectedBirds: 5, action: incident.action, outcome: incident.outcome, notes: "Updated notes" });
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, starting - 2);
  assert.throws(() => data.updateHealthIncident(incident.id, { date: incident.date, symptoms: incident.symptoms, affectedBirds: 1, action: incident.action, outcome: incident.outcome }), /must include/);
  data.deleteHealthIncident(incident.id);
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, starting);
});

test("health loss and flock count roll back together on storage failure", () => {
  const count = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  failNextSetFor = "jari-demo:v1:jari-simulated-health-incidents";
  assert.throws(() => data.addHealthIncident({ flock: "Broiler Batch 02", date: "2026-11-05", symptoms: "Illness observed", affectedBirds: 4, birdsLost: 2, action: "Separated birds" }), /quota/);
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, count);
  assert.equal(data.getHealthIncidents().length, 1);
});

test("treatments require counts within an active bird group", () => {
  assert.throws(() => data.addTreatmentRecord({ flock: "Broiler Batch 02", date: "2026-11-05", treatment: "Supportive care", birdsTreated: 1401 }), /active bird group/);
  data.addTreatmentRecord({ flock: "Broiler Batch 02", date: "2026-11-05", treatment: "Supportive care", medicine: "Vitamin supplement", birdsTreated: 10 });
  assert.equal(data.getTreatmentRecords().length, 1);
});

test("documents and preferences persist through the simulated data store", () => {
  const document = data.addFarmDocument({ name: "Farm permit.pdf", type: "application/pdf", size: 100, dataUrl: "data:application/pdf;base64,ZmFrZQ==" });
  assert.equal(data.getFarmDocuments()[0].id, document.id);
  data.saveUserPreferences({ productionReminders: false, healthReminders: true, financialUpdates: false, analyticsConsent: true });
  assert.equal(data.getUserPreferences().analyticsConsent, true);
  data.removeFarmDocument(document.id);
  assert.equal(data.getFarmDocuments().length, 0);
});

test("document write rolls back if its activity record cannot be saved", () => {
  failNextSetFor = "jari-demo:v1:jari-simulated-activity";
  assert.throws(() => data.addFarmDocument({ name: "Farm card.pdf", type: "application/pdf", size: 100, dataUrl: "data:application/pdf;base64,ZmFrZQ==" }), /quota/);
  assert.equal(data.getFarmDocuments().length, 0);
});

test("equipment names are unique and equipment fields are validated", () => {
  assert.throws(() => data.addFarmAsset({ name: "Feed mixer", quantity: 1, status: "Working", value: 100 }), /already exists/);
  assert.throws(() => data.saveFarmAssets([{ name: "Pump", quantity: 1.5, status: "Working", value: 1 }]), /count, value and condition/);
  data.addFarmAsset({ name: "Water pump", quantity: 2, status: "Needs repair", value: 75000 });
  assert.equal(data.getFarmAssets().at(-1).name, "Water pump");
});

test("institution farm summary is available until explicitly turned off and requests persist", () => {
  assert.equal(data.getInstitutionDemoAccess().shared, true);
  data.saveInstitutionDemoAccess(false);
  assert.equal(data.getInstitutionDemoAccess().shared, false);
  data.saveInstitutionDemoAccess(true);
  assert.equal(data.getInstitutionDemoAccess().shared, true);
  const request = data.addInstitutionRequest({ institutionName: "Plateau Agri Trust", purpose: "Finance discussion", message: "Please share a suitable time for a discussion." });
  assert.equal(data.getInstitutionRequests()[0].id, request.id);
  data.updateInstitutionRequest(request.id, "Acknowledged");
  assert.equal(data.getInstitutionRequests()[0].status, "Acknowledged");
});

test("demo farm reset restores records and keeps sign-in session storage separate", () => {
  local.set("jari-simulated-session", JSON.stringify({ id: "demo-user" }));
  data.saveUserPreferences({ productionReminders: false, healthReminders: false, financialUpdates: true, analyticsConsent: false });
  data.saveInstitutionDemoAccess(true);
  data.resetDemoDatabase();
  assert.equal(data.getUserPreferences().productionReminders, true);
  assert.equal(data.getInstitutionDemoAccess().shared, true);
  assert.ok(local.has("jari-simulated-session"));
});

test("backup validation rejects malformed sections before changing saved records", () => {
  const before = data.getFarmProfile();
  assert.throws(() => data.importDemoDatabase({ version: 1, farmProfile: { ...before, farmName: "Should not be saved" }, poultryHouses: "not a list" }), /must be a list/);
  assert.equal(data.getFarmProfile().farmName, before.farmName);
  data.importDemoDatabase({ version: 1, farmProfile: { ...before, farmName: "Restored demo" } });
  assert.equal(data.getFarmProfile().farmName, "Restored demo");
});

test("backup import rolls back if browser storage fails during the write set", () => {
  const currentName = data.getFarmProfile().farmName;
  failNextSetFor = "jari-demo:v1:jari-simulated-poultry-houses";
  assert.throws(() => data.importDemoDatabase({ version: 1, farmProfile: { ...data.getFarmProfile(), farmName: "Half imported" }, poultryHouses: data.getPoultryHouses() }), /quota/);
  assert.equal(data.getFarmProfile().farmName, currentName);
});
