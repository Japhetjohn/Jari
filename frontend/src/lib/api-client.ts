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
    target_harvest_date?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/flocks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async recordMovement(payload: {
    flock_id: string;
    movement_type: string;
    quantity: number;
    date: string;
    reason?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/flocks/movement", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async transferFlock(payload: {
    flock_id: string;
    target_house_id: string;
    quantity: number;
    date: string;
    reason?: string;
  }) {
    return apiRequest<any>("/flocks/transfer", {
      method: "POST",
      body: JSON.stringify(payload),
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
    quantity_bags: number;
    bag_weight_kg?: number;
    cost: number;
    notes?: string;
  }) {
    return apiRequest<any>("/feed/purchases", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getConsumption() {
    return apiRequest<any[]>("/feed/consumption", { method: "GET" });
  },

  async recordConsumption(payload: {
    date: string;
    feed_type: string;
    quantity_kg: number;
    flock_id?: string;
    house_id?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/feed/consumption", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getInventory() {
    return apiRequest<{ items: any[]; total_bags: number; total_kg: number }>("/feed/inventory", {
      method: "GET",
    });
  },
};

export const productionApi = {
  async getRecords() {
    return apiRequest<any[]>("/production", { method: "GET" });
  },

  async createRecord(payload: {
    date: string;
    flock_id?: string;
    eggs_collected?: number;
    cracked_eggs?: number;
    average_bird_weight_kg?: number;
    notes?: string;
  }) {
    return apiRequest<any>("/production", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getSummary() {
    return apiRequest<{
      total_eggs_collected: number;
      total_cracked_eggs: number;
      crates_equivalent: number;
      record_count: number;
    }>("/production/summary", { method: "GET" });
  },
};

export const healthApi = {
  async getIncidents() {
    return apiRequest<any[]>("/health/incidents", { method: "GET" });
  },

  async createIncident(payload: {
    incident_date: string;
    flock_id?: string;
    title: string;
    severity?: string;
    symptoms?: string;
    affected_count?: number;
    mortality_count?: number;
    actions_taken?: string;
    resolved?: boolean;
  }) {
    return apiRequest<any>("/health/incidents", {
      method: "POST",
      body: JSON.stringify(payload),
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
    flock_id?: string;
    vaccine_name: string;
    date_administered: string;
    target_disease?: string;
    dosage?: string;
    administrator?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/health/vaccinations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getTreatments() {
    return apiRequest<any[]>("/health/treatments", { method: "GET" });
  },

  async createTreatment(payload: {
    flock_id?: string;
    incident_id?: string;
    medication_name: string;
    start_date: string;
    end_date?: string;
    dosage?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/health/treatments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getOverview() {
    return apiRequest<any>("/health/overview", { method: "GET" });
  },
};

export const financialApi = {
  async getSales() {
    return apiRequest<any[]>("/sales", { method: "GET" });
  },

  async createSale(payload: {
    date: string;
    product: string;
    quantity: number;
    unit?: string;
    unit_price: number;
    total_amount: number;
    amount_received?: number;
    flock_id?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/sales", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async recordSalePayment(saleId: string, payload: { amount: number; payment_date: string; payment_method?: string; notes?: string }) {
    return apiRequest<any>(`/sales/${saleId}/payments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getExpenses() {
    return apiRequest<any[]>("/expenses", { method: "GET" });
  },

  async createExpense(payload: {
    date: string;
    category: string;
    description: string;
    total_amount: number;
    amount_paid?: number;
    recipient?: string;
    notes?: string;
  }) {
    return apiRequest<any>("/expenses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async recordExpensePayment(expenseId: string, payload: { amount: number; payment_date: string; payment_method?: string; notes?: string }) {
    return apiRequest<any>(`/expenses/${expenseId}/payments`, {
      method: "POST",
      body: JSON.stringify(payload),
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

