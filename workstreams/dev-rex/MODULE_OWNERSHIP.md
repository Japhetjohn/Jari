# MODULE OWNERSHIP & FILE MAP: WORKSTREAM 2 (DEVELOPER 2)
**Developer**: Developer 2  
**Assigned Workstream**: Finance Readiness, Credit Modeling & Institutional Operations  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  

---

## 1. PRIMARY MODULES OWNED

Developer 2 has exclusive implementation ownership over the following directories:

### 1.1 `modules/finance-readiness/`
- **Purpose**: Farm business and financial profile generation, asset valuation, credit readiness scoring, and loan application preparation.
- **Files & Components to Implement**:
  - `FarmFinancialProfileCard.tsx`: Visual dashboard showing annual turnover, bird asset valuation, gross operating margin, and average feed cost.
  - `CreditReadinessScoreGauge.tsx`: Visual gauge (0-100%) grading the farm's credit readiness (Low, Emerging, Finance-Ready, Investment Grade).
  - `FinancingApplicationWizard.tsx`: Multi-step loan application form to prospective lenders (Gowans MFB, BOA) with purpose, tenor, and amount.
  - `InsuranceDeriskingBadge.tsx`: Visual indicator linking active NAIC/AIICO insurance policy to the loan application.
  - `LoanStatusTracker.tsx`: Farmer's view of active and historical financing requests.
  - `api/financeRoutes.ts`: Endpoints for financial profile calculation and loan submission.

### 1.2 `modules/institutional-dashboard/`
- **Purpose**: Multi-tenant institutional workspace for insurance claim adjudicators and agricultural loan officers, featuring portfolio health monitoring, consent management, and audit logs.
- **Files & Components to Implement**:
  - `InsurerClaimsWorkbench.tsx`: Table and filter view of submitted claims for current insurance company.
  - `InsurerClaimDossierViewer.tsx`: Split-screen dossier viewer rendering the frozen evidence snapshot (`evidence_package_json` from Japhet's module), mortality audit graph, and vet reports.
  - `LenderApplicationsWorkbench.tsx`: Table and review screen for agricultural loan officers inspecting farm capacity and credit indicators.
  - `FinancedFarmPortfolioMonitor.tsx`: Real-time portfolio monitoring streaming active flock counts, mortality surges, and operational flags across financed farms.
  - `ConsentAccessManager.tsx`: Farm consent administration allowing farmers to grant or revoke scoped visibility to lenders/insurers.
  - `ActivityAuditLogTable.tsx`: Immutable access log table recording institutional dossier reviews.
  - `api/institutionalRoutes.ts`: Endpoints for institutional claims, applications, and monitoring.

---

## 2. EXPOSED INTERFACES & OUTPUT CONTRACTS

Developer 2's modules expose the following data models and contracts to the rest of the application:

1. **`GET /api/v1/farms/:farmId/financial-profile`**:
   - Exposed To: Farmer Dashboard overview and Lender review screens.
2. **`GET /api/v1/institutional/portfolio/monitoring-summary`**:
   - Exposed To: Institutional Portal executive overview.
3. **`institutional_access_grants` Enforcement**:
   - Developer 2 provides the verification helper (`hasValidAccessGrant(farmId, institutionId, scope)`) consumed by authorization middleware.

---

## 3. DEPENDENCIES ON SHARED CODE & JAPHET'S MODULES

Developer 2 imports and reuses:
- `shared/authentication/`: `useAuthContext()` or `req.user` for current role (`INSURER_OFFICER`, `LENDER_OFFICER`, `FARMER`).
- `shared/authorization/`: Role-based access guards (`requireRole(['INSURER_OFFICER'])`).
- `shared/database/`: Database query interface / ORM client.
- `modules/farm-management/` (Japhet): Queries flock counts, mortality rates, and feed expenses for financial schedules.
- `modules/incident-claims/` (Japhet): Consumes `claim_packages` to render `CLM-2026-001` inside `InsurerClaimDossierViewer.tsx`.
- `components/common/`: `<Button>`, `<Card>`, `<Badge>`, `<Modal>`, `<LoadingSpinner>`.
- `components/forms/`: `<FormField>`, `<CurrencyInput>`, `<SelectDropdown>`.
- `components/tables/`: `<DataTable>` and `<DossierView>`.
- `components/navigation/`: `<InstitutionalNavbar>`.

---

## 4. STRICT BOUNDARY RULES

| Action | Permitted? | Protocol |
| :--- | :--- | :--- |
| Create files inside `modules/finance-readiness/` | **YES** | Autonomous implementation |
| Create files inside `modules/institutional-dashboard/` | **YES** | Autonomous implementation |
| Modify files inside `modules/farm-management/` | **NO** | Owned exclusively by Japhet |
| Modify files inside `modules/insurance-management/` | **NO** | Owned exclusively by Japhet |
| Modify files inside `modules/incident-claims/` | **NO** | Owned exclusively by Japhet |
| Modify files in `shared/` or `components/` | **RESTRICTED** | Must confer with Japhet first |
| Modify `docs/DATABASE_SCHEMA.md` or `docs/API_CONTRACTS.md` | **RESTRICTED** | Requires formal agreement with Japhet |

