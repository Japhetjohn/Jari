/**
 * JARI Production API Automated Verification Suite
 * Executes end-to-end tests across all 22 modules against the live VPS deployment.
 */
const https = require("https");

const BASE_HOST = "72.61.97.210";
const BASE_PORT = 443;
const PREFIX = "/api/v1";

let passedCount = 0;
let failedCount = 0;
const testResults = [];

function request(options, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? (typeof data === "string" ? data : JSON.stringify(data)) : null;

    const reqOptions = {
      rejectUnauthorized: true,
      hostname: BASE_HOST,
      port: BASE_PORT,
      path: options.path,
      method: options.method || "GET",
      headers: {
        ...(postData
          ? {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          }
          : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers || {}),
      },
    };

    const req = https.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on("error", (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTest(name, fn) {
  try {
    const result = await fn();
    passedCount++;
    testResults.push({ name, status: "PASS", detail: result });
    console.log(`[PASS] ${name} -> ${result || "OK"}`);
  } catch (err) {
    failedCount++;
    testResults.push({ name, status: "FAIL", error: err.message });
    console.error(`[FAIL] ${name} -> ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

async function main() {
  console.log("=================================================================");
  console.log("   JARI PRODUCTION API AUTOMATED VERIFICATION MATRIX   ");
  console.log(`   Target: Direct HTTPS https://${BASE_HOST}:${BASE_PORT} (Trusted Let's Encrypt TLS)`);
  console.log("=================================================================\n");

  const runId = Date.now().toString().slice(-6);
  const farmerPhone = `0803${runId}`;
  const instPhone = `0806${runId}`;
  const password = "Password123!";

  let farmerToken = null;
  let adminToken = null;
  let instToken = null;

  let farmId = null;
  let house1Id = null;
  let house2Id = null;
  let flock1Id = null;
  let flock2Id = null;
  let purchaseId = null;
  let healthIncidentId = null;
  let saleId = null;
  let expenseId = null;
  let documentId = null;
  let kycId = null;
  let farmerUserId = null;

  // 1. HEALTH CHECK
  await runTest("01. Base /health endpoint", async () => {
    const res = await request({ path: "/health" });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.status === "ok", "Expected status ok");
    return "Health endpoint returned 200 OK";
  });

  // 2. AUTHENTICATION & USERS
  await runTest("02. Farmer Registration POST /api/v1/auth/register", async () => {
    const res = await request(
      { path: `${PREFIX}/auth/register`, method: "POST" },
      {
        full_name: `Farmer Test ${runId}`,
        phone: farmerPhone,
        password: password,
        role: "farmer",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.id, "Expected returned user id");
    farmerUserId = res.data.id;
    return `Farmer registered: ${res.data.phone}`;
  });

  await runTest("03. Duplicate Phone Registration Rejection", async () => {
    const res = await request(
      { path: `${PREFIX}/auth/register`, method: "POST" },
      {
        full_name: `Duplicate Farmer`,
        phone: farmerPhone,
        password: password,
      }
    );
    assert(res.status === 400, `Expected 400 for duplicate phone, got ${res.status}`);
    return "Duplicate registration successfully rejected with 400";
  });

  await runTest("04. Farmer Login POST /api/v1/auth/login", async () => {
    const res = await request(
      { path: `${PREFIX}/auth/login`, method: "POST" },
      { phone: farmerPhone, password: password }
    );
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.access_token, "Expected access_token in response");
    farmerToken = res.data.access_token;
    return "Farmer authenticated and JWT issued";
  });

  await runTest("05. Invalid Credentials Login Rejection", async () => {
    const res = await request(
      { path: `${PREFIX}/auth/login`, method: "POST" },
      { phone: farmerPhone, password: "WrongPassword" }
    );
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    return "Invalid credentials rejected with 401 Unauthorized";
  });

  await runTest("06. Get Current User GET /api/v1/auth/me", async () => {
    const res = await request({ path: `${PREFIX}/auth/me`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.phone === farmerPhone, "User phone matched");
    assert(res.data.role === "farmer", "User role matched farmer");
    return `User identity verified: ${res.data.full_name} (${res.data.role})`;
  });

  await runTest("07. Missing Token Authentication Protection", async () => {
    const res = await request({ path: `${PREFIX}/auth/me` });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
    return "Unauthenticated request correctly rejected with 401";
  });

  // Admin Login (using seeded account)
  await runTest("08. Admin Login POST /api/v1/auth/login", async () => {
    const loginRes = await request(
      { path: `${PREFIX}/auth/login`, method: "POST" },
      { phone: "08040000000", password: "admin123" }
    );
    assert(loginRes.status === 200, `Admin login failed: ${loginRes.status}`);
    assert(loginRes.data.user.role === "admin", "User role is admin");
    adminToken = loginRes.data.access_token;
    return `Admin authenticated: ${loginRes.data.user.full_name}`;
  });

  // Institutional Account Registration & Login
  await runTest("09. Institutional User Registration & Login", async () => {
    const res = await request(
      { path: `${PREFIX}/auth/register`, method: "POST" },
      {
        full_name: `Plateau Agri Bank ${runId}`,
        phone: instPhone,
        password: password,
        role: "institutional_user",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const loginRes = await request(
      { path: `${PREFIX}/auth/login`, method: "POST" },
      { phone: instPhone, password: password }
    );
    assert(loginRes.status === 200, "Institution login succeeded");
    instToken = loginRes.data.access_token;
    return "Institutional user registered and token obtained";
  });

  // 3. FARM & POULTRY HOUSES
  await runTest("10. Register Farmer's Primary Farm POST /api/v1/farms", async () => {
    const res = await request(
      { path: `${PREFIX}/farms`, method: "POST", token: farmerToken },
      {
        farm_name: `Sunrise Integrated Poultry ${runId}`,
        owner_name: `Farmer Test ${runId}`,
        phone: farmerPhone,
        state: "Plateau",
        lga: "Jos East",
        community: "Lamingo",
        operation_type: "Layer",
        production_system: "Deep litter",
        number_of_houses: 2,
        water_source: "Borehole",
        number_of_workers: 5,
        biosecurity: ["Footbaths", "Disinfection Gate"],
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.id, "Expected farm id");
    farmId = res.data.id;
    return `Farm created: ${res.data.farm_name} (ID: ${farmId})`;
  });

  await runTest("11. Retrieve Primary Farm GET /api/v1/farms/me", async () => {
    const res = await request({ path: `${PREFIX}/farms/me`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.id === farmId, "Farm ID matched");
    return `Farm retrieved successfully: ${res.data.farm_name}`;
  });

  await runTest("12. Update Primary Farm PUT /api/v1/farms/me", async () => {
    const res = await request(
      { path: `${PREFIX}/farms/me`, method: "PUT", token: farmerToken },
      {
        farm_name: `Sunrise Commercial Poultry ${runId}`,
        number_of_workers: 8,
      }
    );
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.number_of_workers === 8, "Updated workers verified");
    return "Farm profile updated";
  });

  await runTest("13. Create Poultry Houses POST /api/v1/houses", async () => {
    const res1 = await request(
      { path: `${PREFIX}/houses`, method: "POST", token: farmerToken },
      {
        name: "Layer House Alpha",
        system: "Deep litter",
        capacity: 5000,
        water: "Borehole",
        feed_storage: true,
      }
    );
    assert(res1.status === 201, `Expected 201, got ${res1.status}`);
    house1Id = res1.data.id;

    const res2 = await request(
      { path: `${PREFIX}/houses`, method: "POST", token: farmerToken },
      {
        name: "Broiler House Beta",
        system: "Deep litter",
        capacity: 3000,
        water: "Borehole",
        feed_storage: true,
      }
    );
    assert(res2.status === 201, `Expected 201, got ${res2.status}`);
    house2Id = res2.data.id;
    return `Houses created: Alpha (${house1Id}), Beta (${house2Id})`;
  });

  await runTest("14. List Poultry Houses GET /api/v1/houses", async () => {
    const res = await request({ path: `${PREFIX}/houses`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data) && res.data.length >= 2, "Expected at least 2 houses");
    return `Found ${res.data.length} houses with utilization tracking`;
  });

  // 4. FLOCKS & BIRD MOVEMENTS
  await runTest("15. Create Flocks POST /api/v1/flocks", async () => {
    const res1 = await request(
      { path: `${PREFIX}/flocks`, method: "POST", token: farmerToken },
      {
        name: `Batch-2026-Layers-${runId}`,
        type: "Layer",
        house_id: house1Id,
        breed: "Isa Brown",
        initial_birds: 2000,
        acquisition_date: "2026-10-01",
        source: "Chikun Hatcheries",
        age_at_acquisition: 16,
        age_unit: "Weeks",
        purchase_cost: 3200000,
      }
    );
    assert(res1.status === 201, `Expected 201, got ${res1.status}: ${JSON.stringify(res1.data)}`);
    flock1Id = res1.data.id;

    const res2 = await request(
      { path: `${PREFIX}/flocks`, method: "POST", token: farmerToken },
      {
        name: `Batch-2026-Broilers-${runId}`,
        type: "Broiler",
        house_id: house2Id,
        breed: "Cobb 500",
        initial_birds: 1000,
        acquisition_date: "2026-10-05",
        source: "Zartech Hatchery",
        age_at_acquisition: 1,
        age_unit: "Days",
        purchase_cost: 950000,
      }
    );
    assert(res2.status === 201, `Expected 201, got ${res2.status}`);
    flock2Id = res2.data.id;

    return `Flocks created: Layer Batch (${res1.data.current_birds} birds), Broiler Batch (${res2.data.current_birds} birds)`;
  });

  await runTest("16. Verify House Live Occupancy", async () => {
    const res = await request({ path: `${PREFIX}/houses`, token: farmerToken });
    const h1 = res.data.find((h) => h.id === house1Id);
    assert(h1 && h1.current_birds === 2000, `Expected 2000 birds in house 1, got ${h1?.current_birds}`);
    return `House Alpha occupancy: ${h1.current_birds}/${h1.capacity} birds`;
  });

  await runTest("17. Bird Inflow Movement POST /api/v1/flocks/movement", async () => {
    const res = await request(
      { path: `${PREFIX}/flocks/movement`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        type: "Additional stocking",
        quantity: 500,
        date: "2026-10-15",
        reason: "Supplementary layer stocking",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    const flockRes = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    assert(flockRes.data.current_birds === 2500, `Expected 2500 birds, got ${flockRes.data.current_birds}`);
    return `Flock population increased to 2,500 birds`;
  });

  await runTest("18. Inter-Flock Bird Transfer POST /api/v1/flocks/transfer", async () => {
    const res = await request(
      { path: `${PREFIX}/flocks/transfer`, method: "POST", token: farmerToken },
      {
        source_flock_id: flock1Id,
        destination_flock_id: flock2Id,
        quantity: 200,
        date: "2026-10-25",
        reason: "Space adjustment transfer",
      }
    );
    assert(res.status === 200 || res.status === 201, `Expected 200/201, got ${res.status}`);
    const f1 = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    const f2 = await request({ path: `${PREFIX}/flocks/${flock2Id}`, token: farmerToken });
    assert(f1.data.current_birds === 2300, `Expected 2300 in flock 1, got ${f1.data.current_birds}`);
    assert(f2.data.current_birds === 1200, `Expected 1200 in flock 2, got ${f2.data.current_birds}`);
    return `Transfer successful: Source Flock (2300), Destination Flock (1200)`;
  });

  // 5. FEED INVENTORY & CONSUMPTION
  await runTest("19. Record Feed Purchase POST /api/v1/feed/purchases", async () => {
    const res = await request(
      { path: `${PREFIX}/feed/purchases`, method: "POST", token: farmerToken },
      {
        date: "2026-10-10",
        feed_type: "Layer",
        brand: "Vital Feed",
        supplier: "Grand Cereals Bukuru",
        quantity: 50,
        unit: "bags",
        bag_weight_kg: 25,
        amount: 725000,
        amount_paid: 725000,
        flock_id: flock1Id,
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    purchaseId = res.data.id;
    return `Purchased 50 bags (1250 kg) of Vital Feed Layer Mash`;
  });

  await runTest("20. Feed Consumption POST /api/v1/feed/consumption", async () => {
    const res = await request(
      { path: `${PREFIX}/feed/consumption`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        date: "2026-10-12",
        feed_type: "Layer",
        quantity_kg: 250,
        notes: "Daily feeding log",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    return "Recorded consumption of 250 kg feed";
  });

  await runTest("21. Feed Inventory Balance GET /api/v1/feed/inventory", async () => {
    const res = await request({ path: `${PREFIX}/feed/inventory`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.items && res.data.items.length > 0, "Expected feed items in inventory");
    const item = res.data.items.find((i) => i.feed_type === "Layer");
    assert(item && item.available_kg === 1000, `Expected 1000 kg remaining, got ${item?.available_kg}`);
    return `Remaining stock: ${item.available_kg} kg (${res.data.total_available_kg} total available kg)`;
  });

  await runTest("22. Feed Over-Consumption Rejection", async () => {
    const res = await request(
      { path: `${PREFIX}/feed/consumption`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        date: "2026-10-14",
        feed_type: "Layer",
        quantity_kg: 99999,
      }
    );
    assert(res.status === 400, `Expected 400 for over-consumption, got ${res.status}`);
    return "Over-consumption correctly rejected with 400";
  });

  // 6. PRODUCTION RECORDS
  await runTest("23. Record Daily Production POST /api/v1/production", async () => {
    const res = await request(
      { path: `${PREFIX}/production`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        date: "2026-10-16",
        type: "Layer",
        eggs_collected: 1815,
        good_eggs: 1780,
        damaged_eggs: 35,
        live_birds: 2300,
        notes: "Morning egg collection",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.eggs_collected === 1815, "Eggs collected matched");
    return "Egg production logged: 1,815 eggs (1,780 good, 35 damaged)";
  });

  await runTest("24. Production Summary GET /api/v1/production/summary", async () => {
    const res = await request({ path: `${PREFIX}/production/summary`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.total_eggs_collected >= 1815, "Aggregated eggs collected matched");
    return `Production summary: ${res.data.total_eggs_collected} eggs collected`;
  });

  // 7. POULTRY HEALTH & MORTALITY
  await runTest("25. Health Incident with Mortality POST /api/v1/health/incidents", async () => {
    const flockBefore = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    const countBefore = flockBefore.data.current_birds;

    const res = await request(
      { path: `${PREFIX}/health/incidents`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        date: "2026-10-18",
        symptoms: "Midday heat stress and exhaustion",
        affected_birds: 25,
        birds_lost: 15,
        action: "Electrolytes administered in drinking water",
        outcome: "Stabilized",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    healthIncidentId = res.data.id;

    const flockAfter = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    assert(
      flockAfter.data.current_birds === countBefore - 15,
      `Expected ${countBefore - 15} birds, got ${flockAfter.data.current_birds}`
    );
    return `Health mortality deducted 15 birds (Live population: ${flockAfter.data.current_birds})`;
  });

  await runTest("26. Record Vaccination POST /api/v1/health/vaccinations", async () => {
    const res = await request(
      { path: `${PREFIX}/health/vaccinations`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        vaccine: "Lasota Newcastle Vaccine",
        date: "2026-10-20",
        birds: 2285,
        next_date: "2026-11-20",
        given_by: "Dr. Danladi DVM",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    return `Vaccination recorded for ${res.data.birds} birds`;
  });

  await runTest("27. Record Treatment POST /api/v1/health/treatments", async () => {
    const res = await request(
      { path: `${PREFIX}/health/treatments`, method: "POST", token: farmerToken },
      {
        flock_id: flock1Id,
        treatment: "Broad Spectrum Antibiotics",
        medicine: "Oxytetracycline 20%",
        date: "2026-10-21",
        birds_treated: 40,
        given_by: "Farm Manager",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    return `Treatment recorded: ${res.data.treatment}`;
  });

  await runTest("28. Health Overview GET /api/v1/health/overview", async () => {
    const res = await request({ path: `${PREFIX}/health/overview`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.total_birds_lost >= 15, "Total birds lost verified");
    return `Health Overview: Birds lost=${res.data.total_birds_lost}, Incidents=${res.data.total_incidents}`;
  });

  // 8. FINANCIAL OPERATIONS (SALES, EXPENSES, PAYMENTS)
  await runTest("29. Record Live Bird Sale POST /api/v1/sales", async () => {
    const flockBefore = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    const countBefore = flockBefore.data.current_birds;

    const res = await request(
      { path: `${PREFIX}/sales`, method: "POST", token: farmerToken },
      {
        date: "2026-10-22",
        product: "Live birds",
        quantity: 100,
        unit: "Birds",
        unit_price: 3500,
        total_amount: 350000,
        amount_received: 150000,
        flock_id: flock1Id,
        notes: "First batch cull live bird sale",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
    assert(res.data.status === "Part paid" || res.data.status === "Partial", `Unexpected status: ${res.data.status}`);
    saleId = res.data.id;

    const flockAfter = await request({ path: `${PREFIX}/flocks/${flock1Id}`, token: farmerToken });
    assert(
      flockAfter.data.current_birds === countBefore - 100,
      `Expected live bird sale to deduct 100 birds: ${countBefore - 100} vs ${flockAfter.data.current_birds}`
    );
    return `Live bird sale deducted 100 birds. Outstanding: 200,000 (Status: ${res.data.status})`;
  });

  await runTest("30. Record Second Partial Payment on Sale", async () => {
    const res = await request(
      { path: `${PREFIX}/sales/${saleId}/payments`, method: "POST", token: farmerToken },
      {
        amount: 200000,
        date: "2026-10-24",
        note: "Final balance settlement",
      }
    );
    assert(res.status === 200 || res.status === 201, `Expected 200/201, got ${res.status}`);
    assert(res.data.status === "Paid", `Expected Paid status, got ${res.data.status}`);
    assert(Number(res.data.outstanding) === 0, `Expected 0 balance, got ${res.data.outstanding}`);
    return "Sale settled. Status transitioned to Paid";
  });

  await runTest("31. Overpayment Rejection on Settled Sale", async () => {
    const res = await request(
      { path: `${PREFIX}/sales/${saleId}/payments`, method: "POST", token: farmerToken },
      { amount: 5000, date: "2026-10-25" }
    );
    assert(res.status === 400, `Expected 400 for overpayment, got ${res.status}`);
    return "Overpayment on settled sale correctly rejected with 400";
  });

  await runTest("32. Record Farm Expense POST /api/v1/expenses", async () => {
    const res = await request(
      { path: `${PREFIX}/expenses`, method: "POST", token: farmerToken },
      {
        date: "2026-10-23",
        category: "Veterinary",
        amount: 85000,
        amount_paid: 40000,
        note: "Monthly veterinary audit",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.status === "Part paid" || res.data.status === "Partial", `Unexpected status: ${res.data.status}`);
    expenseId = res.data.id;
    return `Expense recorded: 85,000 (Outstanding: 45,000)`;
  });

  await runTest("33. Record Expense Settlement Payment", async () => {
    const res = await request(
      { path: `${PREFIX}/expenses/${expenseId}/payments`, method: "POST", token: farmerToken },
      {
        amount: 45000,
        date: "2026-10-26",
        note: "Settling veterinary balance",
      }
    );
    assert(res.status === 200 || res.status === 201, `Expected 200/201, got ${res.status}`);
    assert(res.data.status === "Paid", `Expected Paid status, got ${res.data.status}`);
    return "Expense settled. Outstanding balance: 0 (Status: Paid)";
  });

  await runTest("34. Financial Overview & Ledgers GET /api/v1/financial/overview", async () => {
    const res = await request({ path: `${PREFIX}/financial/overview`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Number(res.data.total_sales) >= 350000, "Revenue aggregated");
    assert(Number(res.data.total_expenses) >= 85000, "Expenses aggregated");
    return `Overview: Sales=${res.data.total_sales}, Expenses=${res.data.total_expenses}, Net Cash Flow=${res.data.net_cash_flow}`;
  });

  // 9. FARMER KYC & DOCUMENT MANAGEMENT
  await runTest("35. Submit Farmer KYC Application POST /api/v1/kyc/submit", async () => {
    const res = await request(
      { path: `${PREFIX}/kyc/submit`, method: "POST", token: farmerToken },
      {
        farm_name: `Sunrise Integrated Poultry ${runId}`,
        location: "Jos East, Plateau State",
        phone: farmerPhone,
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.status === "pending", `Expected pending status, got ${res.data.status}`);
    kycId = res.data.id;
    return `KYC submitted successfully (ID: ${kycId}, Status: ${res.data.status})`;
  });

  await runTest("36. Retrieve Farmer KYC Status GET /api/v1/kyc/me", async () => {
    const res = await request({ path: `${PREFIX}/kyc/me`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.status === "pending", "Verified status is pending");
    return `Farmer KYC status retrieved: ${res.data.status}`;
  });

  await runTest("37. Upload Farm Document POST /api/v1/documents", async () => {
    const sampleBase64 = "data:application/pdf;base64,JVBERi0xLjQKJUZha2UgUERGIGNvbnRlbnQgZm9yIFZQUyBkZXBsb3ltZW50IHRlc3RpbmcuCg==";
    const res = await request(
      { path: `${PREFIX}/documents`, method: "POST", token: farmerToken },
      {
        name: "Farm_Land_Title.pdf",
        document_type: "Land Title",
        file_size: 15400,
        file_url: sampleBase64,
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.id, "Expected document id");
    documentId = res.data.id;
    return `Document uploaded and persisted: ${res.data.name} (${res.data.document_type})`;
  });

  await runTest("38. List Farm Documents GET /api/v1/documents", async () => {
    const res = await request({ path: `${PREFIX}/documents`, token: farmerToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data) && res.data.length >= 1, "Expected at least 1 document");
    return `Farm documents: ${res.data.length} document(s) retrieved`;
  });

  // 10. ADMIN MANAGEMENT & VERIFICATION WORKFLOWS
  await runTest("39. Non-Admin 403 Forbidden Access to Admin Endpoints", async () => {
    const res = await request({ path: `${PREFIX}/admin/overview`, token: farmerToken });
    assert(res.status === 403, `Expected 403 for farmer accessing admin, got ${res.status}`);
    return "Farmer access to admin portal successfully blocked with 403";
  });

  await runTest("40. Admin Platform Overview GET /api/v1/admin/overview", async () => {
    const res = await request({ path: `${PREFIX}/admin/overview`, token: adminToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.total_farmers >= 1, "Expected at least 1 farmer");
    assert(res.data.total_farms >= 1, "Expected at least 1 farm");
    return `Platform overview: ${res.data.total_farmers} farmers, ${res.data.total_farms} farms, ${res.data.pending_kyc} pending KYC`;
  });

  await runTest("41. Admin Verification Queue GET /api/v1/admin/verifications", async () => {
    const res = await request({ path: `${PREFIX}/admin/verifications`, token: adminToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data), "Expected array of verifications");
    const item = res.data.find((v) => v.id === kycId);
    assert(item, `Expected to find submitted KYC ${kycId} in admin queue`);
    return `Admin queue retrieved: ${res.data.length} pending verification(s)`;
  });

  await runTest("42. Admin Approve KYC Application POST /api/v1/admin/verifications/{id}/review", async () => {
    const res = await request(
      { path: `${PREFIX}/admin/verifications/${kycId}/review`, method: "POST", token: adminToken },
      {
        status: "approved",
        review_note: "Identity and farm documents verified against Plateau State registry",
      }
    );
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.status === "approved", `Expected approved status, got ${res.data.status}`);
    return `KYC approved by admin. Status updated to: ${res.data.status}`;
  });

  await runTest("43. Admin List Farmers GET /api/v1/admin/farmers", async () => {
    const res = await request({ path: `${PREFIX}/admin/farmers`, token: adminToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data) && res.data.length >= 1, "Expected at least 1 farmer");
    return `Admin farmer directory: ${res.data.length} farmers`;
  });

  await runTest("44. Admin List Institutions GET /api/v1/admin/institutions", async () => {
    const res = await request({ path: `${PREFIX}/admin/institutions`, token: adminToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    return `Admin institution directory: ${res.data.length} institutions`;
  });

  // 11. INSTITUTIONAL PORTAL & RISK PROFILING
  await runTest("45. Save Institution Profile POST /api/v1/institution/profile", async () => {
    const res = await request(
      { path: `${PREFIX}/institution/profile`, method: "POST", token: instToken },
      {
        organisation_name: `Plateau Agricultural Microfinance ${runId}`,
        organisation_type: "Lending Institution",
        cac_registration_number: `RC-${runId}`,
        year_established: 2018,
        official_email: `credit@plateauagritrust-${runId}.com`,
        official_phone: instPhone,
        state: "Plateau",
        categories: ["Lending Institution"],
      }
    );
    assert(res.status === 201 || res.status === 200, `Expected 200/201, got ${res.status}`);
    return "Institution profile successfully saved and persisted";
  });

  await runTest("46. Retrieve Institution Profile GET /api/v1/institution/me", async () => {
    const res = await request({ path: `${PREFIX}/institution/me`, token: instToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.data.organisation_name.includes("Plateau Agricultural"), "Organisation name matched");
    return `Institution profile retrieved: ${res.data.organisation_name}`;
  });

  await runTest("47. Institution Links Farm to Portfolio POST /api/v1/institution/farms/{id}/grant-access", async () => {
    const res = await request(
      { path: `${PREFIX}/institution/farms/${farmId}/grant-access?notes=Credit+Facility+Underwriting`, method: "POST", token: instToken }
    );
    assert(res.status === 200 || res.status === 201, `Expected 200, got ${res.status}`);
    return "Farm successfully added to institution portfolio";
  });

  await runTest("48. Retrieve Authorized Portfolio Farms GET /api/v1/institution/farms", async () => {
    const res = await request({ path: `${PREFIX}/institution/farms`, token: instToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data) && res.data.length >= 1, "Expected at least 1 authorized farm");
    const farmItem = res.data.find((f) => f.id === farmId);
    assert(farmItem, "Authorized farm present in institution portfolio");
    return `Institution portfolio contains ${res.data.length} authorized farm(s)`;
  });

  await runTest("49. Generate Deterministic Risk Profile GET /api/v1/institution/farms/{id}/risk-profile", async () => {
    const res = await request({ path: `${PREFIX}/institution/farms/${farmId}/risk-profile`, token: instToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(typeof res.data.risk_score === "number", "Composite risk score present");
    assert(res.data.risk_band, "Risk band present");
    return `Deterministic Risk Profile: Score=${res.data.risk_score}/100, Band=${res.data.risk_band}`;
  });

  await runTest("50. Create Underwriting Assessment POST /api/v1/institution/assessments", async () => {
    const res = await request(
      { path: `${PREFIX}/institution/assessments`, method: "POST", token: instToken },
      {
        farm_id: farmId,
        score: 82,
        risk_band: "Low Risk",
        metrics: { mortality_rate: 0.006, lay_rate: 0.72 },
        notes: "Approved based on solid historical egg production and low flock mortality",
      }
    );
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.data.risk_band === "Low Risk", "Risk band verified");
    return `Assessment recorded: Low Risk (Score: ${res.data.score}/100)`;
  });

  await runTest("51. List Assessments GET /api/v1/institution/assessments", async () => {
    const res = await request({ path: `${PREFIX}/institution/assessments`, token: instToken });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data) && res.data.length >= 1, "Expected at least 1 assessment in history");
    return `Assessment history retrieved: ${res.data.length} record(s)`;
  });

  // SUMMARY
  console.log("\n=================================================================");
  console.log(`   TEST EXECUTION SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED   `);
  console.log("=================================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("FATAL ERROR in test runner:", err);
  process.exit(1);
});
