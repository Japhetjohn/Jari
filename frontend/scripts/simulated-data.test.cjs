const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../src/lib/simulated-data.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const local = new Map();
const events = [];
const windowMock = {
  localStorage: {
    getItem: (key) => local.has(key) ? local.get(key) : null,
    setItem: (key, value) => local.set(key, String(value)),
    removeItem: (key) => local.delete(key),
  },
  dispatchEvent: (event) => events.push(event),
};
class CustomEventMock { constructor(type, options) { this.type = type; this.detail = options?.detail; } }
const commonModule = { exports: {} };
const sandbox = { exports: commonModule.exports, module: commonModule, window: windowMock, CustomEvent: CustomEventMock, crypto: require("node:crypto").webcrypto, console };
vm.runInNewContext(output, sandbox, { filename: "simulated-data.js" });
const data = sandbox.module.exports;

beforeEach(() => { local.clear(); events.length = 0; });

test("one-time migration preserves existing demo farm records", () => {
  local.set("jari-simulated-farm-profile", JSON.stringify({ farmName: "Existing demo", ownerName: "Farmer" }));
  assert.equal(data.getFarmProfile().farmName, "Existing demo");
  assert.equal(local.get("jari-demo:v1:jari-simulated-farm-profile"), local.get("jari-simulated-farm-profile"));
});

test("bird sale updates the shared flock count and records activity", () => {
  const before = data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds;
  data.addSaleRecord({ date: "2026-11-05", product: "Live birds", amount: 100000, amountReceived: 50000, quantity: 10, unit: "Birds", flock: "Broiler Batch 02" });
  assert.equal(data.getFlockRecords().find((flock) => flock.name === "Broiler Batch 02").birds, before - 10);
  assert.equal(data.getSalesRecords().at(-1).outstanding, 50000);
  assert.ok(data.getActivityRecords().length > 0);
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

test("backup validation rejects malformed sections before changing saved records", () => {
  const before = data.getFarmProfile();
  assert.throws(() => data.importDemoDatabase({ version: 1, farmProfile: { farmName: "Should not be saved" }, poultryHouses: "not a list" }), /must be a list/);
  assert.equal(data.getFarmProfile().farmName, before.farmName);
  data.importDemoDatabase({ version: 1, farmProfile: { ...before, farmName: "Restored demo" } });
  assert.equal(data.getFarmProfile().farmName, "Restored demo");
});
