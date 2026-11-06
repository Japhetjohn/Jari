const https = require("https");
const assert = require("assert");

const BASE_URL = "https://72.61.97.210";
const PREFIX = "/api/v1";

function request({ path, method = "GET", headers = {}, body = null, token = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
    const reqHeaders = {
      "Accept": "application/json",
      ...headers,
    };
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
    if (body) {
      reqHeaders["Content-Type"] = "application/json";
    }

    const req = https.request(
      url,
      {
        method,
        headers: reqHeaders,
        rejectUnauthorized: true, // Strict genuine CA validation
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("=================================================================");
  console.log("   TESTING REAL BROWSER WORKFLOW REQUESTS AGAINST LIVE BACKEND   ");
  console.log("=================================================================\n");

  // TEST 1: Farmer Demo Account (08030000000)
  console.log("--- 1. Testing Seeded Demo Farmer (08030000000) ---");
  const loginRes = await request({
    path: `${PREFIX}/auth/login`,
    method: "POST",
    body: { phone: "08030000000", password: "password123" },
  });
  assert(loginRes.status === 200, `Login failed: ${loginRes.status}`);
  const token = loginRes.data.access_token;
  console.log("[PASS] 1. Farmer Login successful, token obtained");

  const endpoints = [
    { name: "My Farm", path: `${PREFIX}/farms/me`, expectedKey: "farm_name" },
    { name: "Poultry Houses", path: `${PREFIX}/houses`, isArray: true },
    { name: "Flocks", path: `${PREFIX}/flocks`, isArray: true },
    { name: "Feed Purchases", path: `${PREFIX}/feed/purchases`, isArray: true },
    { name: "Feed Consumption", path: `${PREFIX}/feed/consumption`, isArray: true },
    { name: "Feed Inventory", path: `${PREFIX}/feed/inventory`, expectedKey: "items" },
    { name: "Production Records", path: `${PREFIX}/production`, isArray: true },
    { name: "Production Summary", path: `${PREFIX}/production/summary`, expectedKey: "total_records" },
    { name: "Health Incidents", path: `${PREFIX}/health/incidents`, isArray: true },
    { name: "Vaccinations", path: `${PREFIX}/health/vaccinations`, isArray: true },
    { name: "Treatments", path: `${PREFIX}/health/treatments`, isArray: true },
    { name: "Health Overview", path: `${PREFIX}/health/overview`, expectedKey: "total_incidents" },
    { name: "Sales Records", path: `${PREFIX}/sales`, isArray: true },
    { name: "Expense Records", path: `${PREFIX}/expenses`, isArray: true },
    { name: "Financial Overview", path: `${PREFIX}/financial/overview`, expectedKey: "total_sales" },
    { name: "KYC Application", path: `${PREFIX}/kyc/me`, expectedKey: "status" },
  ];

  for (const ep of endpoints) {
    const res = await request({ path: ep.path, token });
    assert(res.status === 200, `Expected 200 for ${ep.name} (${ep.path}), got ${res.status}: ${JSON.stringify(res.data)}`);
    if (ep.isArray) {
      assert(Array.isArray(res.data), `${ep.name} should be an array`);
      assert(res.data.length > 0, `${ep.name} should have seeded data`);
      console.log(`[PASS] Demo Farmer ${ep.name}: returned ${res.data.length} records (200 OK)`);
    } else if (ep.expectedKey) {
      assert(res.data[ep.expectedKey] !== undefined, `${ep.name} missing key ${ep.expectedKey}`);
      console.log(`[PASS] Demo Farmer ${ep.name}: verified (200 OK)`);
    }
  }

  // TEST 2: Newly Registered Farmer with NO Farm
  console.log("\n--- 2. Testing Fresh Farmer with NO Farm (Verify ZERO 400 Bad Requests) ---");
  const randomPhone = `080399${Math.floor(1000 + Math.random() * 9000)}`;
  const regRes = await request({
    path: `${PREFIX}/auth/register`,
    method: "POST",
    body: {
      phone: randomPhone,
      password: "password123",
      full_name: "Fresh Farmer Test",
      role: "farmer",
    },
  });
  assert(regRes.status === 201, `Registration failed: ${regRes.status}`);
  console.log(`[PASS] Fresh Farmer registered: ${randomPhone}`);

  const freshLogin = await request({
    path: `${PREFIX}/auth/login`,
    method: "POST",
    body: { phone: randomPhone, password: "password123" },
  });
  assert(freshLogin.status === 200, `Login failed: ${freshLogin.status}`);
  const freshToken = freshLogin.data.access_token;

  // Test every single sub-resource endpoint that previously returned 400!
  const freshEndpoints = [
    { name: "Poultry Houses", path: `${PREFIX}/houses` },
    { name: "Flocks", path: `${PREFIX}/flocks` },
    { name: "Feed Purchases", path: `${PREFIX}/feed/purchases` },
    { name: "Feed Consumption", path: `${PREFIX}/feed/consumption` },
    { name: "Feed Inventory", path: `${PREFIX}/feed/inventory` },
    { name: "Production Records", path: `${PREFIX}/production` },
    { name: "Production Summary", path: `${PREFIX}/production/summary` },
    { name: "Health Incidents", path: `${PREFIX}/health/incidents` },
    { name: "Vaccinations", path: `${PREFIX}/health/vaccinations` },
    { name: "Treatments", path: `${PREFIX}/health/treatments` },
    { name: "Health Overview", path: `${PREFIX}/health/overview` },
    { name: "Sales Records", path: `${PREFIX}/sales` },
    { name: "Expense Records", path: `${PREFIX}/expenses` },
    { name: "Financial Overview", path: `${PREFIX}/financial/overview` },
  ];

  for (const ep of freshEndpoints) {
    const res = await request({ path: ep.path, token: freshToken });
    assert(res.status === 200, `Expected 200 (graceful empty result) for ${ep.name} (${ep.path}), got ${res.status}: ${JSON.stringify(res.data)}`);
    console.log(`[PASS] Fresh Farmer ${ep.name}: ZERO 400 errors -> returned 200 OK cleanly!`);
  }

  // Verify /farms/me returns 404 for fresh farmer
  const farmMeRes = await request({ path: `${PREFIX}/farms/me`, token: freshToken });
  assert(farmMeRes.status === 404, `Expected 404 for farm before creation, got ${farmMeRes.status}`);
  console.log("[PASS] Fresh Farmer /farms/me: returns 404 (handled by frontend sync as uncreated farm)");

  // Verify /kyc/me returns 404 for fresh farmer
  const kycMeRes = await request({ path: `${PREFIX}/kyc/me`, token: freshToken });
  assert(kycMeRes.status === 404, `Expected 404 for KYC before creation, got ${kycMeRes.status}`);
  console.log("[PASS] Fresh Farmer /kyc/me: returns 404 (handled by frontend sync as unsubmitted KYC)");

  console.log("\n=================================================================");
  console.log("   ALL BROWSER WORKFLOW TESTS PASSED CLEANLY (0 ERRORS)!   ");
  console.log("=================================================================");
}

run().catch((err) => {
  console.error("\n[TEST FAILED]:", err.message);
  process.exit(1);
});
