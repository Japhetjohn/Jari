/**
 * Centralized Typed API Client for JARI FastAPI Backend
 * Handles authentication headers, error normalization, file uploads, and resource methods.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "jari_access_token";
export const SESSION_STORAGE_KEY = "jari-simulated-session";

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function parseFastApiError(data: any, status: number): string {
  if (!data) return `Request failed with status ${status}`;

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    // FastAPI validation errors (422 Unprocessable Entity)
    const messages = data.detail.map((err: any) => {
      const field = Array.isArray(err.loc) ? err.loc.slice(1).join(".") : "field";
      return field ? `${field}: ${err.msg}` : err.msg;
    });
    return messages.join("; ") || `Validation failed (${status})`;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return `Request failed with status ${status}`;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach token if present and not already provided
  const token = getStoredToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set Content-Type only if body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null as T;
    }

    let responseData: any = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (!response.ok) {
      const errorMessage = parseFastApiError(responseData, response.status);

      if (response.status === 401) {
        // Expired or invalid token
        removeStoredToken();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("jari:auth-expired"));
        }
      }

      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const msg = error instanceof Error ? error.message : "Network request failed";
    throw new ApiError(msg, 0);
  }
}

// ============================================================================
// RESOURCE-SPECIFIC TYPED API CLIENTS
// ============================================================================

export const authApi = {
  async register(payload: { full_name: string; phone: string; password: string; role?: string }) {
    return apiRequest<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { phone: string; password: string }) {
    return apiRequest<{ access_token: string; token_type: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMe() {
    return apiRequest<any>("/auth/me", {
      method: "GET",
    });
  },
};

export const farmApi = {
  async getMyFarm() {
    return apiRequest<any>("/farms/me", { method: "GET" });
  },

  async createFarm(payload: any) {
    return apiRequest<any>("/farms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateFarm(payload: any) {
    return apiRequest<any>("/farms/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const houseApi = {
  async getHouses() {
    return apiRequest<any[]>("/houses", { method: "GET" });
  },

  async createHouse(payload: { name: string; capacity: number; description?: string; water_source?: string }) {
    return apiRequest<any>("/houses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateHouse(id: string, payload: { name?: string; capacity?: number; description?: string; water_source?: string }) {
    return apiRequest<any>(`/houses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteHouse(id: string) {
    return apiRequest<any>(`/houses/${id}`, {
      method: "DELETE",
    });
  },
};

export const flockApi = {
  async getFlocks() {
    return apiRequest<any[]>("/flocks", { method: "GET" });
  },

  async getFlock(id: string) {
    return apiRequest<any>(`/flocks/${id}`, { method: "GET" });
  },

  async createFlock(payload: {
    name: string;
    house_id: string;
    initial_birds: number;
    type?: string;
    breed?: string;
    source?: string;
    start_date?: string;
    acquisition_date?: string;
    cycle_start?: string;
    age_at_acquisition?: number;
    age_unit?: string;
    purchase_cost?: number;
    notes?: string;
  }) {
    const body = {
      name: payload.name,
      type: payload.type || "Broiler",
      house_id: payload.house_id,
      initial_birds: payload.initial_birds,
      breed: payload.breed,
      source: payload.source,
      acquisition_date: payload.acquisition_date || payload.start_date || new Date().toISOString().slice(0, 10),
      cycle_start: payload.cycle_start,
      age_at_acquisition: payload.age_at_acquisition,
      age_unit: payload.age_unit || "Days",
      purchase_cost: payload.purchase_cost ?? 0,
    };
    return apiRequest<any>("/flocks", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async recordMovement(payload: {
    flock_id: string;
    type?: string;
    movement_type?: string;
    quantity: number;
    date: string;
    reason?: string;
    notes?: string;
  }) {
    const body = {
      flock_id: payload.flock_id,
      type: payload.type || payload.movement_type || "Additional stocking",
      quantity: payload.quantity,
      date: payload.date,
      reason: payload.reason || "Flock count update",
      notes: payload.notes,
    };
    return apiRequest<any>("/flocks/movement", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async transferFlock(payload: {
    source_flock_id: string;
    destination_flock_id: string;
    quantity: number;
    date: string;
    reason?: string;
    notes?: string;
  }) {
    const body = {
      source_flock_id: payload.source_flock_id,
      destination_flock_id: payload.destination_flock_id,
      quantity: payload.quantity,
      date: payload.date,
      reason: payload.reason || "Inter-flock bird transfer",
      notes: payload.notes,
    };
    return apiRequest<any>("/flocks/transfer", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

export const feedApi = {
  async getPurchases() {
    return apiRequest<any[]>("/feed/purchases", { method: "GET" });
  },

  async createPurchase(payload: {
    date: string;
    feed_type: string;
    brand?: string;
    supplier?: string;
    quantity?: number;
    quantity_bags?: number;
    unit?: string;
    bag_weight_kg?: number;
    amount?: number;
    cost?: number;
    amount_paid?: number;
    flock_id?: string;
    notes?: string;
  }) {
    const body = {
      date: payload.date,
      feed_type: payload.feed_type,
      brand: payload.brand || "Standard Feed",
      supplier: payload.supplier,
      quantity: payload.quantity ?? payload.quantity_bags ?? 1,
      unit: payload.unit || "bags",
      bag_weight_kg: payload.bag_weight_kg ?? 25,
      amount: payload.amount ?? payload.cost ?? 0,
      amount_paid: payload.amount_paid ?? payload.amount ?? payload.cost ?? 0,
      flock_id: payload.flock_id,
      notes: payload.notes,
    };
    return apiRequest<any>("/feed/purchases", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getConsumption() {
    return apiRequest<any[]>("/feed/consumption", { method: "GET" });
  },

  async recordConsumption(payload: {
    flock_id: string;
    date: string;
    feed_type: string;
    quantity_kg: number;
    notes?: string;
  }) {
    return apiRequest<any>("/feed/consumption", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getInventory() {
    return apiRequest<{
      total_bought_kg: number;
      total_used_kg: number;
      total_available_kg: number;
      total_spent: number;
      items: any[];
    }>("/feed/inventory", {
      method: "GET",
    });
  },
};

export const productionApi = {
  async getRecords() {
    return apiRequest<any[]>("/production", { method: "GET" });
  },

  async createRecord(payload: {
    flock_id: string;
    date: string;
    type?: string;
    live_birds?: number;
    eggs_collected?: number;
    good_eggs?: number;
    damaged_eggs?: number;
    cracked_eggs?: number;
    birds_weighed?: number;
    average_weight?: number;
    average_bird_weight_kg?: number;
    birds_ready?: number;
    notes?: string;
  }) {
    const body = {
      flock_id: payload.flock_id,
      date: payload.date,
      type: payload.type || "Broiler",
      live_birds: payload.live_birds ?? 0,
      eggs_collected: payload.eggs_collected ?? 0,
      good_eggs: payload.good_eggs ?? (payload.eggs_collected ? Math.max(0, payload.eggs_collected - (payload.damaged_eggs ?? payload.cracked_eggs ?? 0)) : 0),
      damaged_eggs: payload.damaged_eggs ?? payload.cracked_eggs ?? 0,
      birds_weighed: payload.birds_weighed ?? 0,
      average_weight: payload.average_weight ?? payload.average_bird_weight_kg ?? 0,
      birds_ready: payload.birds_ready ?? 0,
      notes: payload.notes,
    };
    return apiRequest<any>("/production", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getSummary() {
    return apiRequest<{
      total_records: number;
      total_eggs_collected: number;
      total_good_eggs: number;
      total_damaged_eggs: number;
      total_birds_ready: number;
      overall_average_weight: number;
    }>("/production/summary", { method: "GET" });
  },
};

export const healthApi = {
  async getIncidents() {
    return apiRequest<any[]>("/health/incidents", { method: "GET" });
  },

  async createIncident(payload: {
    flock_id: string;
    date?: string;
    incident_date?: string;
    symptoms?: string;
    title?: string;
    affected_birds?: number;
    affected_count?: number;
    birds_lost?: number;
    mortality_count?: number;
    action?: string;
    actions_taken?: string;
    outcome?: string;
    notes?: string;
  }) {
    const body = {
      flock_id: payload.flock_id,
      date: payload.date || payload.incident_date || new Date().toISOString().slice(0, 10),
      symptoms: payload.symptoms || payload.title || "Health incident observation",
      affected_birds: payload.affected_birds ?? payload.affected_count ?? 1,
      birds_lost: payload.birds_lost ?? payload.mortality_count ?? 0,
      action: payload.action || payload.actions_taken || "Monitoring",
      outcome: payload.outcome || "Being monitored",
      notes: payload.notes,
    };
    return apiRequest<any>("/health/incidents", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async updateIncident(id: string, payload: any) {
    return apiRequest<any>(`/health/incidents/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteIncident(id: string) {
    return apiRequest<any>(`/health/incidents/${id}`, {
      method: "DELETE",
    });
  },

  async getVaccinations() {
    return apiRequest<any[]>("/health/vaccinations", { method: "GET" });
  },

  async createVaccination(payload: {
    flock_id: string;
    vaccine?: string;
    vaccine_name?: string;
    date?: string;
    date_administered?: string;
    birds?: number;
    next_date?: string;
    given_by?: string;
    administrator?: string;
    notes?: string;
  }) {
    const body = {
      flock_id: payload.flock_id,
      vaccine: payload.vaccine || payload.vaccine_name || "Vaccine",
      date: payload.date || payload.date_administered || new Date().toISOString().slice(0, 10),
      birds: payload.birds ?? 100,
      next_date: payload.next_date,
      given_by: payload.given_by || payload.administrator,
      notes: payload.notes,
    };
    return apiRequest<any>("/health/vaccinations", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getTreatments() {
    return apiRequest<any[]>("/health/treatments", { method: "GET" });
  },

  async createTreatment(payload: {
    flock_id: string;
    treatment?: string;
    medication_name?: string;
    medicine?: string;
    date?: string;
    start_date?: string;
    birds_treated?: number;
    given_by?: string;
    notes?: string;
  }) {
    const body = {
      flock_id: payload.flock_id,
      treatment: payload.treatment || payload.medication_name || "Treatment",
      medicine: payload.medicine || payload.medication_name,
      date: payload.date || payload.start_date || new Date().toISOString().slice(0, 10),
      birds_treated: payload.birds_treated ?? 10,
      given_by: payload.given_by || "Attendant",
      notes: payload.notes,
    };
    return apiRequest<any>("/health/treatments", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getOverview() {
    return apiRequest<{
      total_incidents: number;
      total_birds_affected: number;
      total_birds_lost: number;
      total_vaccinations: number;
      total_treatments: number;
    }>("/health/overview", { method: "GET" });
  },
};

export const financialApi = {
  async getSales() {
    return apiRequest<any[]>("/sales", { method: "GET" });
  },

  async createSale(payload: {
    date: string;
    product: string;
    quantity?: number;
    unit?: string;
    unit_price?: number;
    unitPrice?: number;
    total_amount?: number;
    totalAmount?: number;
    amount_received?: number;
    amountReceived?: number;
    flock_id?: string;
    flockId?: string;
    notes?: string;
  }) {
    const qty = payload.quantity ?? 1;
    const total = payload.total_amount ?? payload.totalAmount ?? 0;
    const unitPrice = payload.unit_price ?? payload.unitPrice ?? (qty > 0 ? total / qty : total);
    const body = {
      date: payload.date,
      product: payload.product,
      quantity: qty,
      unit: payload.unit || "Units",
      unit_price: unitPrice,
      total_amount: total,
      amount_received: payload.amount_received ?? payload.amountReceived ?? 0,
      flock_id: payload.flock_id ?? payload.flockId,
      notes: payload.notes,
    };
    return apiRequest<any>("/sales", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async recordSalePayment(saleId: string, payload: { amount: number; payment_date?: string; date?: string; payment_method?: string; notes?: string; note?: string }) {
    const body = {
      amount: payload.amount,
      date: payload.date || payload.payment_date || new Date().toISOString().slice(0, 10),
      note: payload.note || payload.notes,
    };
    return apiRequest<any>(`/sales/${saleId}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getExpenses() {
    return apiRequest<any[]>("/expenses", { method: "GET" });
  },

  async createExpense(payload: {
    date: string;
    category: string;
    description?: string;
    note?: string;
    notes?: string;
    total_amount?: number;
    totalAmount?: number;
    amount?: number;
    amount_paid?: number;
    amountPaid?: number;
    recipient?: string;
    flock_id?: string;
    flockId?: string;
  }) {
    const body = {
      date: payload.date,
      category: payload.category,
      amount: payload.amount ?? payload.total_amount ?? payload.totalAmount ?? 0,
      amount_paid: payload.amount_paid ?? payload.amountPaid ?? 0,
      flock_id: payload.flock_id ?? payload.flockId,
      note: payload.note || payload.description || payload.notes,
    };
    return apiRequest<any>("/expenses", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async recordExpensePayment(expenseId: string, payload: { amount: number; payment_date?: string; date?: string; payment_method?: string; notes?: string; note?: string }) {
    const body = {
      amount: payload.amount,
      date: payload.date || payload.payment_date || new Date().toISOString().slice(0, 10),
      note: payload.note || payload.notes,
    };
    return apiRequest<any>(`/expenses/${expenseId}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getOverview() {
    return apiRequest<{
      total_revenue: number;
      total_direct_expenses: number;
      total_feed_expenses: number;
      total_combined_expenses: number;
      net_cash_flow: number;
      outstanding_sales_receivable: number;
      outstanding_expenses_payable: number;
    }>("/financial/overview", { method: "GET" });
  },

  async getTransactions() {
    return apiRequest<any[]>("/financial/transactions", { method: "GET" });
  },
};

export const kycApi = {
  async getMyKyc() {
    return apiRequest<any>("/kyc/me", { method: "GET" });
  },

  async submitKyc(payload: { farm_name: string; location: string; phone: string }) {
    return apiRequest<any>("/kyc/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const documentApi = {
  async getDocuments(userId?: string) {
    const query = userId ? `?user_id=${userId}` : "";
    return apiRequest<any[]>(`/documents${query}`, { method: "GET" });
  },

  async uploadDocument(payload: {
    name: string;
    document_type: string;
    file_size: number;
    file_url: string;
  }) {
    return apiRequest<any>("/documents", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteDocument(documentId: string) {
    return apiRequest<any>(`/documents/${documentId}`, {
      method: "DELETE",
    });
  },
};

export const adminApi = {
  async getOverview() {
    return apiRequest<{
      total_farmers: number;
      total_farms: number;
      total_flocks: number;
      active_birds: number;
      pending_kyc_count: number;
      approved_kyc_count: number;
      total_institutions: number;
      pending_institutions_count: number;
    }>("/admin/overview", { method: "GET" });
  },

  async getVerifications(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiRequest<any[]>(`/admin/verifications${query}`, { method: "GET" });
  },

  async reviewVerification(itemId: string, payload: { status: string; review_note?: string }) {
    return apiRequest<any>(`/admin/verifications/${itemId}/review`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getFarmers() {
    return apiRequest<any[]>("/admin/farmers", { method: "GET" });
  },

  async getInstitutions(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiRequest<any[]>(`/admin/institutions${query}`, { method: "GET" });
  },
};

export const institutionApi = {
  async getMyInstitution() {
    return apiRequest<any>("/institution/me", { method: "GET" });
  },

  async saveProfile(payload: any) {
    return apiRequest<any>("/institution/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getPortfolioFarms() {
    return apiRequest<any[]>("/institution/farms", { method: "GET" });
  },

  async grantFarmAccess(farmId: string, notes?: string) {
    const query = notes ? `?notes=${encodeURIComponent(notes)}` : "";
    return apiRequest<any>(`/institution/farms/${farmId}/grant-access${query}`, {
      method: "POST",
    });
  },

  async getFarmRiskProfile(farmId: string) {
    return apiRequest<{
      farm_id: string;
      farmer_name: string;
      farm_name: string;
      location: string;
      lga: string;
      state: string;
      production_type: string;
      total_birds: number;
      houses_count: number;
      feed_records_count: number;
      health_records_count: number;
      vaccination_records_count: number;
      production_records_count: number;
      financial_records_count: number;
      mortality_rate_percent: number;
      risk_score: number;
      risk_band: string;
      signals: Array<{ area: string; status: string; detail: string }>;
    }>(`/institution/farms/${farmId}/risk-profile`, { method: "GET" });
  },

  async createAssessment(payload: {
    farm_id: string;
    score: number;
    risk_band: string;
    metrics?: any;
    notes?: string;
  }) {
    return apiRequest<any>("/institution/assessments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getAssessments(farmId?: string) {
    const query = farmId ? `?farm_id=${farmId}` : "";
    return apiRequest<any[]>(`/institution/assessments${query}`, { method: "GET" });
  },
};

