# MODULE: FARM MANAGEMENT
**Workstream Owner**: Japhet (Workstream 1)  
**Directory**: `modules/farm-management/`  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. MODULE PURPOSE
The Farm Management module handles the foundation of agricultural data in the platform. It models commercial poultry farms in Jos South LGA (Plateau State), manages pen infrastructure, tracks flock production batches (Layers, Broilers, Pullets), and captures continuous daily operational logs (mortalities, egg collection, feed consumption, veterinary health visits, and operational expenses).

---

## 2. MAIN RESPONSIBILITIES
- Onboarding commercial poultry farms with location coordinates (Gyel, Bukuru, Kuru, Vwang), biosecurity levels, water/power utilities, and capacity (>2,000 birds).
- Registering physical housing structures (deep litter pens, battery cage systems, brooding pens).
- Managing flock batches (`flock_code` e.g. `FLK-2026-001`, stocking dates, hatchery sources, breeds).
- Daily mortality logging with clinical symptoms, suspected causes, and certified disposal methods (deep burial with lime).
- Daily egg production records (crates collected, broken/damaged eggs) and broiler weight monitoring.
- Vaccination schedule adherence logs (Newcastle Lasota, Gumboro IBD, Marek's).
- Veterinary visit logs recording Dr. Pam Gyang's VCN certification and pathology findings.
- Operational expense tracking for feed bags and medications in Nigerian Naira (NGN).

---

## 3. PROPOSED FILES & SUBFOLDERS
```
modules/farm-management/
├── README.md                           # This orientation document
├── components/
│   ├── FarmProfileCard.tsx             # Overview of farm location and capacity
│   ├── FarmOnboardingWizard.tsx        # Multi-step farm setup flow
│   ├── HouseManager.tsx                # Pen and housing inventory
│   ├── FlockBatchList.tsx              # Active and completed flock table
│   ├── FlockCreationModal.tsx          # New flock stocking dialog
│   ├── DailyMortalityLogger.tsx        # Daily mortality recording form
│   ├── DailyProductionLogger.tsx       # Daily egg/feed log form
│   ├── VaccinationTracker.tsx          # Vaccination calendar and history
│   ├── VeterinaryVisitLog.tsx          # Professional veterinary visit history
│   └── ExpenseTracker.tsx              # Feed & medical expense table
├── api/
│   ├── farmRoutes.ts                   # Express / Route Handlers for farm endpoints
│   └── farmController.ts               # Database query and mutation controllers
└── types/
    └── index.ts                        # TypeScript interface definitions for farm models
```

---

## 4. DATABASE MODELS
Defined in `docs/DATABASE_SCHEMA.md`:
- `farms`
- `poultry_houses`
- `flocks`
- `mortality_records`
- `production_records`
- `vaccination_records`
- `veterinary_visits`
- `operational_expenses`

---

## 5. API ENDPOINTS
Defined in `docs/API_CONTRACTS.md`:
- `POST /api/v1/farms` — Create farm
- `GET /api/v1/farms/:farmId` — Get farm profile
- `POST /api/v1/farms/:farmId/houses` — Add poultry house
- `POST /api/v1/farms/:farmId/flocks` — Stock new flock
- `POST /api/v1/flocks/:flockId/mortalities` — Log daily mortality
- `POST /api/v1/flocks/:flockId/production` — Log egg collection
- `POST /api/v1/flocks/:flockId/vaccinations` — Log administered vaccine
- `POST /api/v1/farms/:farmId/expenses` — Log feed/medical expenditure

---

## 6. COMPONENTS EXPOSED TO OTHER MODULES
- `<FarmProfileCard />`: Reused by `modules/finance-readiness/` to display farm background.
- Operational summary service (`getFarmOperationalSummary(farmId)`): Exposes live bird counts, 30-day mortality averages, and feed expense totals to Developer 2's financial profile calculation engine.

---

## 7. TESTING REQUIREMENTS
1. Mortality count cannot be negative and cannot exceed current flock count.
2. Production log requires either egg counts (for layers) or sample weights (for broilers).
3. Ensure currency values format as Naira (`₦`).

