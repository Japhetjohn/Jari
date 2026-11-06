export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  farm: {
    me: ["farm", "me"] as const,
  },
  houses: {
    all: ["houses"] as const,
  },
  flocks: {
    all: ["flocks"] as const,
    detail: (id: string) => ["flocks", id] as const,
  },
  feed: {
    purchases: ["feed", "purchases"] as const,
    consumption: ["feed", "consumption"] as const,
    inventory: ["feed", "inventory"] as const,
  },
  production: {
    records: ["production", "records"] as const,
    summary: ["production", "summary"] as const,
  },
  health: {
    incidents: ["health", "incidents"] as const,
    vaccinations: ["health", "vaccinations"] as const,
    treatments: ["health", "treatments"] as const,
    overview: ["health", "overview"] as const,
  },
  financial: {
    sales: ["financial", "sales"] as const,
    expenses: ["financial", "expenses"] as const,
    overview: ["financial", "overview"] as const,
    transactions: ["financial", "transactions"] as const,
  },
  kyc: {
    me: ["kyc", "me"] as const,
  },
  documents: {
    all: (userId?: string) => ["documents", userId || "me"] as const,
  },
  admin: {
    overview: ["admin", "overview"] as const,
    verifications: (status?: string) => ["admin", "verifications", status || "all"] as const,
    farmers: ["admin", "farmers"] as const,
    institutions: (status?: string) => ["admin", "institutions", status || "all"] as const,
  },
  institution: {
    me: ["institution", "me"] as const,
    farms: ["institution", "farms"] as const,
    riskProfile: (farmId: string) => ["institution", "riskProfile", farmId] as const,
    assessments: (farmId?: string) => ["institution", "assessments", farmId || "all"] as const,
  },
};

