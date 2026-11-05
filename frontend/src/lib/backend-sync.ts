/**
 * Backend Sync Service
 * Bridges FastAPI REST endpoints with the local reactive storage used by JARI UI components.
 * When authenticated, fetches real backend data, maps backend schemas to frontend types,
 * executes real backend mutations, and triggers event-based UI re-renders.
 */

import {
  farmApi,
  houseApi,
  flockApi,
  feedApi,
  productionApi,
  healthApi,
  financialApi,
  kycApi,
  documentApi,
  getStoredToken,
  ApiError,
} from "@/lib/api-client";
import {
  STORAGE_KEYS,
  defaultFarmProfile,
  type SavedFarmProfile,
  type FarmHouseRecord,
  type FlockRecord,
  type FarmFlockMovement,
  type FeedPurchaseRecord,
  type FeedUseRecord,
  type ProductionRecord,
  type HealthIncidentRecord,
  type VaccinationRecord,
  type TreatmentRecord,
  type SalesEntry,
  type ExpenseEntry,
  type KycApplication,
  type FarmDocumentRecord,
} from "@/lib/simulated-data";

const scopedStorageKey = (key: string) => `jari-demo:v1:${key}`;

function writeStorageDirect<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
}

function emitDataChanged(key = "*"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("jari:mock-data-changed", { detail: { key } }));
}

// ============================================================================
// DATA CONVERTERS (Backend Schemas <-> Frontend Types)
// ============================================================================

export function backendToFarmProfile(b: any): SavedFarmProfile {
  return {
    farmName: b.farm_name || "",
    ownerName: b.owner_name || "",
    phone: b.phone || "",
    community: b.community || "",
    lga: b.lga || "",
    state: b.state || "Plateau",
    establishmentDate: b.establishment_date || "",
    operationType: b.operation_type || "Broiler",
    productionSystem: b.production_system || "Deep litter",
    numberOfHouses: String(b.number_of_houses ?? 0),
    waterSource: b.water_source || "Borehole",
    numberOfWorkers: String(b.number_of_workers ?? 0),
    biosecurity: b.biosecurity || [],
  };
}

export function backendToHouse(b: any): FarmHouseRecord {
  return {
    id: b.id,
    name: b.name,
    system: b.system || "Deep litter",
    capacity: b.capacity || 0,
    water: b.water || "Borehole",
    feedStorage: b.feed_storage ?? true,
    ventilation: b.ventilation || "Natural ventilation",
    archived: b.is_archived ?? false,
    birds: b.current_birds ?? 0,
    availableCapacity: b.available_capacity ?? b.capacity,
  };
}

export function backendToFlock(b: any): FlockRecord {
  return {
    id: b.id,
    name: b.name,
    type: b.type,
    breed: b.breed || "",
    house: b.house_name || "House A",
    houseId: b.house_id,
    birds: b.current_birds ?? b.initial_birds,
    status: b.status as "Active" | "Completed",
    acquisitionDate: b.acquisition_date || "",
    cycleStart: b.cycle_start || "",
    source: b.source || "",
    ageAtAcquisition: b.age_at_acquisition,
    ageUnit: b.age_unit || "Days",
    purchaseCost: Number(b.purchase_cost) || 0,
  };
}

export function backendToFlockMovement(b: any): FarmFlockMovement {
  return {
    id: b.id,
    flock: b.flock_name || "",
    flockId: b.flock_id,
    house: b.house_name || "",
    type: b.movement_type,
    quantity: b.quantity,
    date: b.date,
    reason: b.reason || "",
    notes: b.notes || "",
  };
}

export function backendToFeedPurchase(b: any): FeedPurchaseRecord {
  return {
    id: b.id,
    date: b.date,
    feedType: b.feed_type,
    brand: b.brand || "",
    supplier: b.supplier || b.notes || "Supplier",
    quantity: b.quantity ?? b.quantity_bags ?? 0,
    unit: (b.unit as "bags" | "kg") || "bags",
    bagWeightKg: Number(b.bag_weight_kg) || 25,
    amount: Number(b.amount ?? b.cost) || 0,
    amountPaid: Number(b.amount_paid) || Number(b.amount ?? b.cost) || 0,
    flock: b.flock_name,
  };
}

export function backendToFeedUse(b: any): FeedUseRecord {
  return {
    id: b.id,
    date: b.date,
    feedType: b.feed_type,
    quantityKg: Number(b.quantity_kg) || 0,
    flock: b.flock_name || "All flocks",
    notes: b.notes || "",
  };
}

export function backendToProduction(b: any): ProductionRecord {
  return {
    id: b.id,
    date: b.date,
    flock: b.flock_name || "Flock",
    type: (b.type as any) || "Daily collection",
    liveBirds: b.live_birds ?? 0,
    eggsCollected: b.eggs_collected || 0,
    goodEggs: b.good_eggs ?? Math.max(0, (b.eggs_collected || 0) - (b.damaged_eggs || 0)),
    damagedEggs: b.damaged_eggs ?? b.cracked_eggs ?? 0,
    birdsWeighed: b.birds_weighed ?? 0,
    averageWeight: Number(b.average_weight ?? b.average_bird_weight_kg) || 0,
    birdsReady: b.birds_ready ?? 0,
    notes: b.notes || "",
  };
}

export function backendToHealthIncident(b: any): HealthIncidentRecord {
  return {
    id: b.id,
    flock: b.flock_name || "",
    date: b.date || b.incident_date,
    symptoms: b.symptoms || b.title,
    affectedBirds: b.affected_birds ?? b.affected_count ?? 0,
    birdsLost: b.birds_lost ?? b.mortality_count ?? 0,
    action: b.action || b.actions_taken || "Action taken",
    confirmedDiagnosis: b.symptoms || b.title,
    outcome: (b.outcome as any) || (b.resolved ? "Resolved" : "Being monitored"),
    notes: b.notes || b.symptoms || "",
  };
}

export function backendToVaccination(b: any): VaccinationRecord {
  return {
    id: b.id,
    flock: b.flock_name || "",
    vaccine: b.vaccine || b.vaccine_name,
    date: b.date || b.date_administered,
    birds: b.birds ?? 0,
    givenBy: b.given_by || b.administrator || "",
    notes: b.notes || "",
  };
}

export function backendToTreatment(b: any): TreatmentRecord {
  return {
    id: b.id,
    flock: b.flock_name || "",
    date: b.date || b.start_date,
    treatment: b.treatment || b.medication_name,
    medicine: b.medicine || b.medication_name,
    birdsTreated: b.birds_treated ?? 0,
    givenBy: b.given_by || "Attendant",
    notes: b.notes || "",
  };
}

export function backendToSale(b: any): SalesEntry {
  return {
    id: b.id,
    date: b.date,
    item: b.product,
    product: b.product,
    quantity: b.quantity,
    unit: b.unit || "Units",
    amount: Number(b.total_amount) || 0,
    amountReceived: Number(b.amount_received) || 0,
    outstanding: Number(b.outstanding) || 0,
    status: (b.status as any) || "Unpaid",
    flock: b.flock_name,
    payments: (b.payments || []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount),
      date: p.date || p.payment_date,
      note: p.note || p.notes,
    })),
  };
}

export function backendToExpense(b: any): ExpenseEntry {
  return {
    id: b.id,
    date: b.date,
    category: b.category,
    amount: Number(b.amount ?? b.total_amount) || 0,
    amountPaid: Number(b.amount_paid) || 0,
    outstanding: Number(b.outstanding) || 0,
    note: b.note || b.description || b.notes || "",
    payments: (b.payments || []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount),
      date: p.date || p.payment_date,
      note: p.note || p.notes,
    })),
  };
}

export function backendToKyc(b: any): KycApplication {
  return {
    farmName: b.farm_name,
    location: b.location,
    phone: b.phone,
    status: b.status as any,
    submittedAt: b.submitted_at,
    reviewedAt: b.reviewed_at || undefined,
    reviewNote: b.review_note || undefined,
  };
}

export function backendToDocument(b: any): FarmDocumentRecord {
  return {
    id: b.id,
    name: b.name,
    type: b.document_type,
    size: b.file_size,
    dataUrl: b.file_url,
    addedAt: b.uploaded_at,
  };
}

// ============================================================================
// FULL REAL BACKEND SYNCHRONIZATION
// ============================================================================

let isSyncing = false;

export async function syncAllFromBackend(): Promise<void> {
  const token = getStoredToken();
  if (!token || isSyncing) return;

  isSyncing = true;
  try {
    // 1. Fetch Farm
    let farmFound = false;
    try {
      const farmRes = await farmApi.getMyFarm();
      if (farmRes) {
        farmFound = true;
        writeStorageDirect(STORAGE_KEYS.farmProfile, backendToFarmProfile(farmRes));
      }
    } catch (e: any) {
      // 404 is normal if farm not registered yet
    }

    if (!farmFound) {
      writeStorageDirect(STORAGE_KEYS.farmProfile, defaultFarmProfile);
      writeStorageDirect(STORAGE_KEYS.poultryHouses, []);
      writeStorageDirect(STORAGE_KEYS.flockRecords, []);
      writeStorageDirect(STORAGE_KEYS.feedPurchases, []);
      writeStorageDirect(STORAGE_KEYS.feedUse, []);
      writeStorageDirect(STORAGE_KEYS.production, []);
      writeStorageDirect(STORAGE_KEYS.healthIncidents, []);
      writeStorageDirect(STORAGE_KEYS.vaccinations, []);
      writeStorageDirect(STORAGE_KEYS.treatments, []);
      writeStorageDirect(STORAGE_KEYS.salesRecords, []);
      writeStorageDirect(STORAGE_KEYS.expensesRecords, []);
      writeStorageDirect(STORAGE_KEYS.documents, []);

      try {
        const kycRes = await kycApi.getMyKyc();
        if (kycRes) {
          writeStorageDirect(STORAGE_KEYS.kycApplication, backendToKyc(kycRes));
        } else {
          writeStorageDirect(STORAGE_KEYS.kycApplication, null);
        }
      } catch {
        writeStorageDirect(STORAGE_KEYS.kycApplication, null);
      }
      emitDataChanged("*");
      return;
    }

    // 2. Fetch Houses
    try {
      const housesRes = await houseApi.getHouses();
      if (Array.isArray(housesRes)) {
        writeStorageDirect(STORAGE_KEYS.poultryHouses, housesRes.map(backendToHouse));
      }
    } catch { }

    // 3. Fetch Flocks
    try {
      const flocksRes = await flockApi.getFlocks();
      if (Array.isArray(flocksRes)) {
        writeStorageDirect(STORAGE_KEYS.flockRecords, flocksRes.map(backendToFlock));
      }
    } catch { }

    // 4. Fetch Feed Purchases & Consumption
    try {
      const [purchasesRes, useRes] = await Promise.all([
        feedApi.getPurchases(),
        feedApi.getConsumption(),
      ]);
      if (Array.isArray(purchasesRes)) {
        writeStorageDirect(STORAGE_KEYS.feedPurchases, purchasesRes.map(backendToFeedPurchase));
      }
      if (Array.isArray(useRes)) {
        writeStorageDirect(STORAGE_KEYS.feedUse, useRes.map(backendToFeedUse));
      }
    } catch { }

    // 5. Fetch Production
    try {
      const prodRes = await productionApi.getRecords();
      if (Array.isArray(prodRes)) {
        writeStorageDirect(STORAGE_KEYS.production, prodRes.map(backendToProduction));
      }
    } catch { }

    // 6. Fetch Health
    try {
      const [incidentsRes, vaccinationsRes, treatmentsRes] = await Promise.all([
        healthApi.getIncidents(),
        healthApi.getVaccinations(),
        healthApi.getTreatments(),
      ]);
      if (Array.isArray(incidentsRes)) {
        writeStorageDirect(STORAGE_KEYS.healthIncidents, incidentsRes.map(backendToHealthIncident));
      }
      if (Array.isArray(vaccinationsRes)) {
        writeStorageDirect(STORAGE_KEYS.vaccinations, vaccinationsRes.map(backendToVaccination));
      }
      if (Array.isArray(treatmentsRes)) {
        writeStorageDirect(STORAGE_KEYS.treatments, treatmentsRes.map(backendToTreatment));
      }
    } catch { }

    // 7. Fetch Sales & Expenses
    try {
      const [salesRes, expensesRes] = await Promise.all([
        financialApi.getSales(),
        financialApi.getExpenses(),
      ]);
      if (Array.isArray(salesRes)) {
        writeStorageDirect(STORAGE_KEYS.salesRecords, salesRes.map(backendToSale));
      }
      if (Array.isArray(expensesRes)) {
        writeStorageDirect(STORAGE_KEYS.expensesRecords, expensesRes.map(backendToExpense));
      }
    } catch { }

    // 8. Fetch KYC
    try {
      const kycRes = await kycApi.getMyKyc();
      if (kycRes) {
        writeStorageDirect(STORAGE_KEYS.kycApplication, backendToKyc(kycRes));
      }
    } catch { }

    // 9. Fetch Documents
    try {
      const docsRes = await documentApi.getDocuments();
      if (Array.isArray(docsRes)) {
        writeStorageDirect(STORAGE_KEYS.documents, docsRes.map(backendToDocument));
      }
    } catch { }

    emitDataChanged("*");
  } catch (globalSyncError) {
    // Non-fatal sync error
  } finally {
    isSyncing = false;
  }
}

// ============================================================================
// MUTATION WRAPPERS (Execute on FastAPI Backend, then sync store)
// ============================================================================

export async function backendSaveFarmProfile(profile: SavedFarmProfile): Promise<SavedFarmProfile> {
  const token = getStoredToken();
  if (!token) return profile;

  const payload = {
    farm_name: profile.farmName.trim(),
    owner_name: profile.ownerName.trim(),
    phone: profile.phone.trim(),
    state: profile.state.trim() || "Plateau",
    lga: profile.lga.trim(),
    community: profile.community.trim(),
    establishment_date: profile.establishmentDate || undefined,
    operation_type: profile.operationType || "Broiler",
    production_system: profile.productionSystem || "Deep litter",
    number_of_houses: parseInt(profile.numberOfHouses, 10) || 0,
    water_source: profile.waterSource || "Borehole",
    number_of_workers: parseInt(profile.numberOfWorkers, 10) || 0,
    biosecurity: profile.biosecurity || [],
  };

  try {
    let res: any;
    try {
      res = await farmApi.updateFarm(payload);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 404) {
        res = await farmApi.createFarm(payload);
      } else {
        throw err;
      }
    }
    const saved = backendToFarmProfile(res);
    writeStorageDirect(STORAGE_KEYS.farmProfile, saved);
    emitDataChanged(STORAGE_KEYS.farmProfile);
    return saved;
  } catch (e) {
    throw e;
  }
}

export async function backendCreatePoultryHouse(house: {
  name: string;
  system: string;
  capacity: number;
  water: string;
  feedStorage?: boolean;
  ventilation?: string;
  notes?: string;
}): Promise<FarmHouseRecord> {
  const token = getStoredToken();
  const payload = {
    name: house.name.trim(),
    system: house.system || "Deep litter",
    capacity: Number(house.capacity),
    water: house.water || "Borehole",
    feed_storage: house.feedStorage ?? true,
    ventilation: house.ventilation || "Natural ventilation",
    notes: house.notes,
  };

  if (!token) {
    return {
      name: house.name,
      system: house.system,
      capacity: house.capacity,
      water: house.water,
      feedStorage: house.feedStorage ?? true,
      ventilation: house.ventilation,
      archived: false,
      birds: 0,
      availableCapacity: house.capacity,
    };
  }

  const res = await houseApi.createHouse(payload);
  const created = backendToHouse(res);
  await syncAllFromBackend();
  return created;
}

export async function backendArchivePoultryHouse(houseIdOrName: string, houses: FarmHouseRecord[]): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  const target = houses.find((h) => h.id === houseIdOrName || h.name === houseIdOrName);
  if (!target || !target.id) return;

  await houseApi.deleteHouse(target.id);
  await syncAllFromBackend();
}

export async function backendCreateFlock(flock: {
  name: string;
  type: string;
  breed?: string;
  house: string;
  birds: number;
  acquisitionDate?: string;
  cycleStart?: string;
  source?: string;
  ageAtAcquisition?: number;
  ageUnit?: string;
  purchaseCost?: number;
}, houses: FarmHouseRecord[]): Promise<FlockRecord> {
  const token = getStoredToken();
  if (!token) {
    return {
      name: flock.name,
      type: flock.type as any,
      breed: flock.breed,
      house: flock.house,
      birds: flock.birds,
      status: "Active",
      acquisitionDate: flock.acquisitionDate,
      cycleStart: flock.cycleStart,
      source: flock.source,
      purchaseCost: flock.purchaseCost,
    };
  }

  const matchedHouse = houses.find((h) => h.name === flock.house || h.id === flock.house);
  if (!matchedHouse || !matchedHouse.id) {
    throw new Error(`House '${flock.house}' not found. Please register the poultry house first.`);
  }

  const payload = {
    name: flock.name.trim(),
    type: flock.type || "Broiler",
    house_id: matchedHouse.id,
    initial_birds: Number(flock.birds),
    breed: flock.breed?.trim() || undefined,
    source: flock.source?.trim() || undefined,
    start_date: flock.acquisitionDate || new Date().toISOString().slice(0, 10),
    notes: `Cycle start: ${flock.cycleStart || flock.acquisitionDate}`,
  };

  const res = await flockApi.createFlock(payload);
  const created = backendToFlock(res);
  await syncAllFromBackend();
  return created;
}

export async function backendRecordFlockMovement(payload: {
  flockId: string;
  movementType: string;
  quantity: number;
  date: string;
  reason?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await flockApi.recordMovement({
    flock_id: payload.flockId,
    movement_type: payload.movementType,
    quantity: payload.quantity,
    date: payload.date,
    reason: payload.reason,
    notes: payload.notes,
  });
  await syncAllFromBackend();
}

export async function backendTransferFlock(payload: {
  sourceFlockId: string;
  destinationFlockId: string;
  quantity: number;
  date: string;
  reason?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await flockApi.transferFlock({
    source_flock_id: payload.sourceFlockId,
    destination_flock_id: payload.destinationFlockId,
    quantity: payload.quantity,
    date: payload.date,
    reason: payload.reason || "Inter-flock bird transfer",
    notes: payload.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddFeedPurchase(purchase: {
  date: string;
  feedType: string;
  brand?: string;
  supplier?: string;
  quantity: number;
  unit?: string;
  bagWeightKg?: number;
  amount: number;
  amountPaid?: number;
  flockId?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await feedApi.createPurchase({
    date: purchase.date,
    feed_type: purchase.feedType,
    brand: purchase.brand || "Vital Feed",
    supplier: purchase.supplier,
    quantity: Number(purchase.quantity),
    unit: purchase.unit || "bags",
    bag_weight_kg: Number(purchase.bagWeightKg) || 25,
    amount: Number(purchase.amount),
    amount_paid: Number(purchase.amountPaid) || Number(purchase.amount),
    flock_id: purchase.flockId,
    notes: purchase.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddFeedUse(use: {
  date: string;
  feedType: string;
  quantityKg: number;
  flockId?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  if (!use.flockId) {
    throw new Error("A bird group must be selected for recording feed use.");
  }

  await feedApi.recordConsumption({
    date: use.date,
    feed_type: use.feedType,
    quantity_kg: Number(use.quantityKg),
    flock_id: use.flockId,
    notes: use.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddProduction(prod: {
  date: string;
  flockId?: string;
  type?: string;
  liveBirds?: number;
  eggsCollected?: number;
  goodEggs?: number;
  damagedEggs?: number;
  birdsWeighed?: number;
  averageWeight?: number;
  birdsReady?: number;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  if (!prod.flockId) {
    throw new Error("A bird group must be selected for recording production.");
  }

  await productionApi.createRecord({
    date: prod.date,
    flock_id: prod.flockId,
    type: prod.type || "Broiler",
    live_birds: prod.liveBirds ? Number(prod.liveBirds) : 0,
    eggs_collected: prod.eggsCollected ? Number(prod.eggsCollected) : 0,
    good_eggs: prod.goodEggs ? Number(prod.goodEggs) : 0,
    damaged_eggs: prod.damagedEggs ? Number(prod.damagedEggs) : 0,
    birds_weighed: prod.birdsWeighed ? Number(prod.birdsWeighed) : 0,
    average_weight: prod.averageWeight ? Number(prod.averageWeight) : 0,
    birds_ready: prod.birdsReady ? Number(prod.birdsReady) : 0,
    notes: prod.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddHealthIncident(inc: {
  date: string;
  flockId?: string;
  title?: string;
  symptoms: string;
  affectedBirds: number;
  birdsLost?: number;
  action?: string;
  outcome?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  if (!inc.flockId) {
    throw new Error("A bird group must be selected for recording a health incident.");
  }

  await healthApi.createIncident({
    flock_id: inc.flockId,
    date: inc.date,
    symptoms: inc.symptoms,
    affected_birds: Number(inc.affectedBirds) || 1,
    birds_lost: Number(inc.birdsLost) || 0,
    action: inc.action || "Monitoring",
    outcome: inc.outcome || "Being monitored",
    notes: inc.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddVaccination(vacc: {
  flockId?: string;
  vaccine: string;
  date: string;
  birds?: number;
  nextDate?: string;
  givenBy?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  if (!vacc.flockId) {
    throw new Error("A bird group must be selected for recording a vaccination.");
  }

  await healthApi.createVaccination({
    flock_id: vacc.flockId,
    vaccine: vacc.vaccine,
    date: vacc.date,
    birds: Number(vacc.birds) || 100,
    next_date: vacc.nextDate,
    given_by: vacc.givenBy,
    notes: vacc.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddTreatment(treat: {
  flockId?: string;
  treatment: string;
  medicine?: string;
  date: string;
  birdsTreated?: number;
  givenBy?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  if (!treat.flockId) {
    throw new Error("A bird group must be selected for recording a treatment.");
  }

  await healthApi.createTreatment({
    flock_id: treat.flockId,
    treatment: treat.treatment,
    medicine: treat.medicine,
    date: treat.date,
    birds_treated: Number(treat.birdsTreated) || 10,
    given_by: treat.givenBy,
    notes: treat.notes,
  });
  await syncAllFromBackend();
}

export async function backendAddSale(sale: {
  date: string;
  product: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  totalAmount: number;
  amountReceived?: number;
  flockId?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await financialApi.createSale({
    date: sale.date,
    product: sale.product,
    quantity: Number(sale.quantity),
    unit: sale.unit || "Units",
    unit_price: Number(sale.unitPrice ?? (sale.quantity ? sale.totalAmount / sale.quantity : sale.totalAmount)),
    total_amount: Number(sale.totalAmount),
    amount_received: sale.amountReceived ? Number(sale.amountReceived) : 0,
    flock_id: sale.flockId,
    notes: sale.notes,
  });
  await syncAllFromBackend();
}

export async function backendRecordSalePayment(saleId: string, amount: number, date?: string, note?: string): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await financialApi.recordSalePayment(saleId, {
    amount: Number(amount),
    date: date || new Date().toISOString().slice(0, 10),
    note,
  });
  await syncAllFromBackend();
}

export async function backendAddExpense(expense: {
  date: string;
  category: string;
  totalAmount: number;
  amountPaid?: number;
  description?: string;
  flockId?: string;
  notes?: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await financialApi.createExpense({
    date: expense.date,
    category: expense.category,
    amount: Number(expense.totalAmount),
    amount_paid: expense.amountPaid ? Number(expense.amountPaid) : 0,
    flock_id: expense.flockId,
    note: expense.description || expense.notes || expense.category,
  });
  await syncAllFromBackend();
}

export async function backendRecordExpensePayment(expenseId: string, amount: number, date?: string, note?: string): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await financialApi.recordExpensePayment(expenseId, {
    amount: Number(amount),
    date: date || new Date().toISOString().slice(0, 10),
    note,
  });
  await syncAllFromBackend();
}

export async function backendSubmitKyc(application: KycApplication): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await kycApi.submitKyc({
    farm_name: application.farmName.trim(),
    location: application.location.trim(),
    phone: application.phone.trim(),
  });
  await syncAllFromBackend();
}

export async function backendUploadDocument(doc: {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await documentApi.uploadDocument({
    name: doc.name,
    document_type: doc.type,
    file_size: doc.size,
    file_url: doc.dataUrl,
  });
  await syncAllFromBackend();
}

export async function backendDeleteDocument(docId: string): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  await documentApi.deleteDocument(docId);
  await syncAllFromBackend();
}
