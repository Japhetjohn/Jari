const https = require("https");
const assert = require("assert");

const BASE_URL = "https://72.61.97.210";
const PREFIX = "/api/v1";

function request({ path, method = "GET", headers = {}, body = null, token = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
    const reqHeaders = { "Accept": "application/json", ...headers };
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
    if (body) reqHeaders["Content-Type"] = "application/json";

    const req = https.request(
      url,
      { method, headers: reqHeaders, rejectUnauthorized: true },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let data;
          try { data = JSON.parse(raw); } catch { data = raw; }
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
  console.log("   TESTING INSTITUTIONAL WORKFLOW ENDPOINTS (LIVE BACKEND)       ");
  console.log("=================================================================\n");

  // Login as Institutional User
  const loginRes = await request({
    path: `${PREFIX}/auth/login`,
    method: "POST",
    body: { phone: "08060000000", password: "institution123" },
  });
  assert(loginRes.status === 200, `Login failed: ${loginRes.status}`);
  const token = loginRes.data.access_token;
  console.log("[PASS] 1. Institutional Login successful (08060000000)");

  // Retrieve Profile
  const meRes = await request({ path: `${PREFIX}/institution/me`, token });
  assert(meRes.status === 200, `Expected 200 for institution/me, got ${meRes.status}`);
  assert(meRes.data.organisation_name === "Plateau Agri Trust");
  console.log(`[PASS] 2. Institution Profile retrieved: ${meRes.data.organisation_name}`);

  // Retrieve Portfolio Farms
  const farmsRes = await request({ path: `${PREFIX}/institution/farms`, token });
  assert(farmsRes.status === 200, `Expected 200 for institution/farms, got ${farmsRes.status}`);
  assert(Array.isArray(farmsRes.data), "Farms should be an array");
  console.log(`[PASS] 3. Portfolio Farms retrieved: ${farmsRes.data.length} authorized farm(s)`);
  const firstFarmId = farmsRes.data[0]?.id;

  // Retrieve Assessments (normal)
  const assRes = await request({ path: `${PREFIX}/institution/assessments`, token });
  assert(assRes.status === 200, `Expected 200 for institution/assessments, got ${assRes.status}`);
  assert(Array.isArray(assRes.data), "Assessments should be an array");
  console.log(`[PASS] 4. Assessments list retrieved: ${assRes.data.length} assessment(s) (200 OK)`);

  // Retrieve Assessments with query strings that previously caused 400 Bad Request
  const queryTests = ["?farm_id=undefined", "?farm_id=null", "?farm_id=", "?farm_id=all"];
  for (const q of queryTests) {
    const res = await request({ path: `${PREFIX}/institution/assessments${q}`, token });
    assert(res.status === 200, `Expected 200 for query ${q}, got ${res.status}: ${JSON.stringify(res.data)}`);
    console.log(`[PASS] 5. Query ${q} handled gracefully -> returned 200 OK (ZERO 400 errors)!`);
  }

  // Create an assessment (POST /institution/assessments)
  if (firstFarmId) {
    const createRes = await request({
      path: `${PREFIX}/institution/assessments`,
      method: "POST",
      token,
      body: {
        farm_id: firstFarmId,
        score: 85.0,
        risk_band: "Low Risk",
        notes: "Automated underwriting test assessment.",
        metrics: { birds: 1500, houses: 2, signalsCount: 3 },
      },
    });
    assert(createRes.status === 201, `Expected 201 for assessment creation, got ${createRes.status}: ${JSON.stringify(createRes.data)}`);
    console.log(`[PASS] 6. Assessment created successfully -> returned 201 Created!`);
  }

  console.log("\n=================================================================");
  console.log("   ALL INSTITUTIONAL WORKFLOW TESTS PASSED (0 ERRORS)!           ");
  console.log("=================================================================");
}

run().catch((err) => {
  console.error("\n[TEST FAILED]:", err.message);
  process.exit(1);
});

