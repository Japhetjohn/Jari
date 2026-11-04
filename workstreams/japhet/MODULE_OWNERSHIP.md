# MODULE OWNERSHIP & FILE MAP: WORKSTREAM 1 (JAPHET)
**Developer**: Japhet  
**Assigned Workstream**: Farm Operations, Biosecurity & Insurance Infrastructure  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  

---

## 1. PRIMARY MODULES OWNED

Japhet has exclusive implementation ownership over the following directories:

### 1.1 `modules/farm-management/`
- **Purpose**: Farm onboarding, pen housing, flock lifecycles, daily mortality logging, egg and production tracking, veterinary visits, and operational expenses.
- **Files & Components to Implement**:
  - `FarmProfileCard.tsx` / `FarmOnboardingWizard.tsx`: Multi-step onboarding for Jos South farms.
  - `HouseManager.tsx`: Adding/managing pens, brooding units, and battery cages.
  - `FlockBatchList.tsx` & `FlockCreationModal.tsx`: Registering layer and broiler batches.
  - `DailyMortalityLogger.tsx`: Quick log for daily dead/culled birds with symptoms and disposal method.
  - `DailyProductionLogger.tsx`: Logging egg crates collected, damaged eggs, and bird weights.
  - `VaccinationTracker.tsx`: Compliance calendar showing scheduled vs. administered vaccines.
  - `VeterinaryVisitLog.tsx`: Clinical inspection notes from Dr. Pam Gyang with VCN number.
  - `ExpenseTracker.tsx`: Feed and medication purchase log with Naira formatting.
  - `api/farmRoutes.ts`: Endpoints for farms, houses, and operational records.

### 1.2 `modules/insurance-management/`
- **Purpose**: Dynamic calculation of insurance underwriting readiness, biosecurity checklist audit, and policy record tracking.
- **Files & Components to Implement**:
  - `InsuranceReadinessScoreGauge.tsx`: Visual 0-100% score gauge with status badge.
  - `BiosecurityChecklistCard.tsx`: Verification list (footbaths, perimeter fence, clean water, mortality records).
  - `PolicySummaryCard.tsx`: Active/pending policies with prospective underwriters (NAIC, AIICO).
  - `api/insuranceRoutes.ts`: Readiness evaluation logic and policy endpoints.

### 1.3 `modules/incident-claims/`
- **Purpose**: Rapid incident outbreak reporting, evidence gathering, and 1-click structured claims package compilation.
- **Files & Components to Implement**:
  - `IncidentDeclarationForm.tsx`: Fast form declaring outbreak type, affected birds, and narrative.
  - `IncidentEvidenceUploader.tsx`: Multi-file uploader for post-mortem photos and NVRI Vom reports.
  - `ClaimDossierCompiler.tsx`: The core engine that aggregates 30-day mortality records, vaccine compliance, and vet attestations into `CLM-2026-001`.
  - `ClaimStatusTracker.tsx`: Farmer's view of submitted claim package and underwriter status.
  - `api/claimRoutes.ts`: Incident and claim compilation endpoints.

---

## 2. EXPOSED INTERFACES & OUTPUT CONTRACTS

Japhet's modules expose the following data models and contracts to the rest of the application:

1. **`claim_packages` Data Record**:
   - Exposed To: Developer 2 (`modules/institutional-dashboard/`)
   - Schema: Includes `evidence_package_json` which holds frozen snapshots of mortality, vaccines, and vet notes.
2. **`GET /api/v1/farms/:farmId/insurance-readiness`**:
   - Exposed To: Developer 2's Institutional Onboarding Workbench.
3. **`GET /api/v1/farms/:farmId/operational-summary`**:
   - Exposed To: Developer 2's `FarmFinancialProfile` generator (returns total live birds, average mortality rate, and monthly feed expenses).

---

## 3. DEPENDENCIES ON SHARED CODE

Japhet imports and reuses:
- `shared/authentication/`: `useAuthContext()` or `req.user` for farmer identity.
- `shared/database/`: Database query interface / ORM client.
- `shared/validation/`: Form validation schemas (Zod).
- `components/common/`: `<Button>`, `<Card>`, `<Badge>`, `<Modal>`, `<LoadingSpinner>`.
- `components/forms/`: `<FormField>`, `<CurrencyInput>`, `<SelectDropdown>`, `<FileUploadZone>`.
- `components/tables/`: `<DataTable>`.
- `components/navigation/`: `<FarmerNavbar>`.

---

## 4. STRICT BOUNDARY RULES

| Action | Permitted? | Protocol |
| :--- | :--- | :--- |
| Create files inside `modules/farm-management/` | **YES** | Autonomous implementation |
| Create files inside `modules/insurance-management/` | **YES** | Autonomous implementation |
| Create files inside `modules/incident-claims/` | **YES** | Autonomous implementation |
| Modify files inside `modules/finance-readiness/` | **NO** | Owned exclusively by Developer 2 |
| Modify files inside `modules/institutional-dashboard/` | **NO** | Owned exclusively by Developer 2 |
| Modify files in `shared/` or `components/` | **RESTRICTED** | Must confer with Developer 2 first |
| Modify `docs/DATABASE_SCHEMA.md` or `docs/API_CONTRACTS.md` | **RESTRICTED** | Requires formal agreement with Developer 2 |

