const https = require("https");
const assert = require("assert");

const BASE_URL = "https://72.61.97.210";
const PREFIX = "/api/v1";
const agent = new https.Agent({ keepAlive: true });

function request({ path, method = "GET", headers = {}, body = null, token = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
    const reqHeaders = { "Accept": "application/json", ...headers };
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
    if (body) reqHeaders["Content-Type"] = "application/json";

    const req = https.request(
      url,
      { method, headers: reqHeaders, agent, rejectUnauthorized: true },
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
  const phone = "0803" + Math.floor(100000 + Math.random() * 900000);
  console.log("Testing Upsert and Farm Save for fresh user:", phone);

  // 1. Register & Login
  const reg = await request({
    path: `${PREFIX}/auth/register`,
    method: "POST",
    body: { phone, password: "password123", full_name: "Upsert Tester", role: "farmer" },
  });
  assert(reg.status === 201, `Registration failed: ${reg.status}`);

  const login = await request({
    path: `${PREFIX}/auth/login`,
    method: "POST",
    body: { phone, password: "password123" },
  });
  assert(login.status === 200, `Login failed: ${login.status}`);
  const token = login.data.access_token;
  console.log("[PASS] 1. User registered and logged in");

  // 2. Initial farm check should be 200 null
  const initial = await request({ path: `${PREFIX}/farms/me`, token });
  assert(initial.status === 200 && initial.data === null, `Initial farm should be null, got: ${initial.status}`);
  console.log("[PASS] 2. Initial farm is null (200 OK)");

  // 3. User saves farm details via PUT /farms/me directly without existing farm (UPSERT)
  const upsertRes = await request({
    path: `${PREFIX}/farms/me`,
    method: "PUT",
    token,
    body: {
      farm_name: "Upserted Poultry Farm",
      owner_name: "Upsert Tester",
      phone,
      state: "Plateau",
      lga: "Jos South",
      community: "Rayfield",
      operation_type: "Broiler",
      production_system: "Deep litter",
      number_of_houses: 3,
      number_of_workers: 4,
    },
  });
  assert(upsertRes.status === 200, `PUT /farms/me upsert failed: ${upsertRes.status} ${JSON.stringify(upsertRes.data)}`);
  assert(upsertRes.data.farm_name === "Upserted Poultry Farm", "Farm name mismatch");
  console.log("[PASS] 3. PUT /farms/me upsert succeeded without existing farm (200 OK)");

  // 4. Verify GET /farms/me now returns the farm
  const getRes = await request({ path: `${PREFIX}/farms/me`, token });
  assert(getRes.status === 200 && getRes.data.farm_name === "Upserted Poultry Farm", "Farm retrieval failed");
  console.log("[PASS] 4. GET /farms/me returns the upserted farm");

  // 5. User submits POST /farms again (idempotency check)
  const postRes = await request({
    path: `${PREFIX}/farms`,
    method: "POST",
    token,
    body: {
      farm_name: "Updated via POST Farm",
      owner_name: "Upsert Tester",
      phone,
      state: "Plateau",
      lga: "Jos South",
      community: "Rayfield",
      operation_type: "Layer",
      production_system: "Deep litter",
      number_of_houses: 5,
      water_source: "Borehole",
      number_of_workers: 6,
    },
  });
  assert(postRes.status === 201 || postRes.status === 200, `POST /farms duplicate failed: ${postRes.status} ${JSON.stringify(postRes.data)}`);
  assert(postRes.data.farm_name === "Updated via POST Farm", "Farm name update mismatch");
  console.log("[PASS] 5. POST /farms updated existing farm cleanly (ZERO 400 errors)");

  // 6. User edits farm via PUT /farms/me
  const editRes = await request({
    path: `${PREFIX}/farms/me`,
    method: "PUT",
    token,
    body: {
      farm_name: "Final Name Poultry Farm",
    },
  });
  assert(editRes.status === 200 && editRes.data.farm_name === "Final Name Poultry Farm", "Edit failed");
  console.log("[PASS] 6. PUT /farms/me updated farm successfully");

  console.log("\n*** ALL FARM UPSERT & SAVE TESTS PASSED (0 ERRORS)! ***");
}

run().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
