# JAPHET'S WORKSTREAM: FARM OPERATIONS & INSURANCE INFRASTRUCTURE
**Developer**: Japhet  
**Role**: Lead Engineer — Agricultural Operations, Biosecurity & Insurance Workstream  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026 | Jos South Focus  

---

## 1. MISSION & OVERVIEW

Welcome to Workstream 1. You are responsible for the operational and risk engine of the Jari platform.

Your primary objective is to build the digital infrastructure that captures commercial poultry farm operations in Jos South LGA (Plateau State) and transforms daily operational reality—bird stock, pen hygiene, daily mortalities, feed expenses, and vaccination adherence—into an auditable record that makes the farm **insurable** and enables **rapid claims documentation** when disease outbreaks occur.

---

## 2. YOUR ASSIGNED RESPONSIBILITIES

You are the primary owner and lead developer for:
1. **Farm Registration & Onboarding**: Capturing farm location in Jos South (Gyel, Bukuru, Kuru, Vwang), biosecurity levels, water sources, and capacity (>2,000 birds).
2. **Farm Profiles**: High-level operational summary cards and facility specs.
3. **Poultry-House Management**: Defining physical houses (Deep litter, battery cages), dimensions, and capacity.
4. **Flock & Production-Cycle Management**: Batch tracking for Layers, Broilers, and Breeders (breed, hatchery source, placement date).
5. **Mortality Records**: Daily mortality logging, clinical symptoms, and disposal methods (burial with lime, carcass pit).
6. **Vaccination & Veterinary Records**: Adherence tracking for Newcastle (Lasota, Clone 30), Gumboro, Marek's, and Dr. Pam Gyang's VCN-registered vet visits.
7. **Feed & Operational Expenses**: Daily/weekly feed purchases (TopFeeds, Hybrid, Animal Care), veterinary drugs, and biosecurity chemicals (Virkon S).
8. **Insurance Readiness Engine**: Dynamic calculation of the farm's underwriting readiness score (0 - 100%) and missing compliance item checks.
9. **Insurance Policy Records**: Displaying prospective insurance coverage (e.g., NAIC Poultry Mortality Scheme, AIICO) and status.
10. **Incident Reporting**: Fast declaration of disease outbreaks, flooding, or heat stress mortality spikes.
11. **Claims Documentation & Evidence Assembly**: 1-click generation of the structured claims package (`CLM-2026-001`), linking 30-day mortality logs, vaccine compliance proof, NVRI Vom lab reports, and post-mortem photos.

---

## 3. CODEBASE DIRECTORY OWNERSHIP

### What You Own (Your Implementation Workspaces):
- `modules/farm-management/`: All farm, house, flock, mortality, and egg production components and business logic.
- `modules/insurance-management/`: Readiness checklist calculation, biosecurity audit cards, and policy display.
- `modules/incident-claims/`: Incident outbreak form, evidence uploaders, and the claim dossier compiler.

### What You Depend On (Shared Infrastructure):
- `shared/authentication/`: For current logged-in farmer user context (`req.user`).
- `shared/database/`: For database client / ORM instance to persist records.
- `shared/validation/`: For Zod schemas validating mortality, flock, and incident inputs.
- `components/common/`: Reusable `<Button>`, `<Card>`, `<Badge>`, `<Modal>`, `<LoadingSpinner>`.
- `components/forms/`: Reusable `<FormField>`, `<CurrencyInput>`, `<SelectDropdown>`, `<FileUploadZone>`.
- `components/tables/`: Reusable `<DataTable>`.
- `components/navigation/`: `<FarmerNavbar>`.

### What You Must NOT Modify Without Coordination:
- `modules/finance-readiness/` (Owned by Developer 2)
- `modules/institutional-dashboard/` (Owned by Developer 2)
- `shared/authorization/` (Developer 2 implements consent access grants)
- `docs/DATABASE_SCHEMA.md` and `docs/API_CONTRACTS.md` (Update only by mutual agreement)

---

## 4. HOW YOUR WORK CONNECTS WITH DEVELOPER 2

Developer 2 builds the **Financial Profiles**, **Loan Applications**, and the **Institutional Dashboard** (Insurer & Lender portals).

They depend directly on your data:
1. **Claims Dossier**: When you implement `POST /api/v1/incidents/:id/compile-claim`, the generated `claim_packages` record (with `evidence_package_json`) is what Developer 2 loads inside the **Insurer Claims Review** screen.
2. **Operational Track Record**: Developer 2's **Farm Financial Profile** and **Loan Application** queries your flock counts, average mortality rate, and feed expense totals to calculate the farm's credit readiness.
3. **Insurance Status**: Developer 2 checks `insurance_policies.status === 'ACTIVE'` to display the "De-risked by Insurance" badge on loan applications to Gowans Microfinance Bank.

---

## 5. LOCAL TESTING & VERIFICATION GUIDE

### 5.1 Unit / Model Verification
1. Verify that `mortality_count` cannot be negative and cannot exceed current live bird count.
2. Verify that `flock_code` generates formatted codes (e.g. `FLK-2026-001`).
3. Verify that the Insurance Readiness score properly computes:
   - Biosecurity = 25 pts
   - 30-day continuous mortality logging = 25 pts
   - Complete vaccination schedule = 25 pts
   - Registered Vet attached = 25 pts

### 5.2 End-to-End Golden Flow Verification
1. Register farm: *Grace Heights Integrated Farms, Jos South*.
2. Add Pen 1 (Deep litter, 4,000 capacity).
3. Stock Flock: 3,500 Isa Brown Layers.
4. Record 3 daily mortality logs (e.g., 2 birds, 3 birds, 4 birds).
5. Trigger Incident: Log 115 mortalities due to Newcastle disease.
6. Upload mock NVRI Vom lab report and Dr. Pam Gyang vet note.
7. Click **"Assemble Claim Package"** -> Confirm package `CLM-2026-001` is created in database with full snapshot.

---

## 6. WORKSTREAM QUICK LINKS
- [AI_CONTEXT.md](file:///home/japhet/Desktop/Jari/workstreams/japhet/AI_CONTEXT.md): Copyable master context for ChatGPT / Antigravity.
- [MODULE_OWNERSHIP.md](file:///home/japhet/Desktop/Jari/workstreams/japhet/MODULE_OWNERSHIP.md): Granular file inventory.
- [TASK_PROMPT_TEMPLATE.md](file:///home/japhet/Desktop/Jari/workstreams/japhet/TASK_PROMPT_TEMPLATE.md): Reusable prompt template for generating features.
- [INTEGRATION_GUIDE.md](file:///home/japhet/Desktop/Jari/workstreams/japhet/INTEGRATION_GUIDE.md): Interface guide with Developer 2.
- [PROGRESS.md](file:///home/japhet/Desktop/Jari/workstreams/japhet/PROGRESS.md): Live checklist and status tracker.

