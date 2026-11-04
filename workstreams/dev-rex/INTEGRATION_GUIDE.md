# CROSS-WORKSTREAM INTEGRATION GUIDE: DEVELOPER 2'S MODULES
**Author**: Developer 2  
**Peer Collaborator**: Japhet  
**Workstream**: Finance Readiness, Credit Modeling & Institutional Operations  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  

---

## 1. INTEGRATION ARCHITECTURE

Developer 2's modules (`finance-readiness`, `institutional-dashboard`) serve as the **credit modeling and institutional consumer layer** for the platform.

Developer 2 relies heavily on the operational logs, incident records, and claims packages compiled by Japhet (`farm-management`, `insurance-management`, `incident-claims`).

```
[ Japhet's Data Models ]
  │
  ├── 1. claim_packages (CLM-2026-001 + evidence_package_json)
  │      └──> Consumed By: [ Insurer Claims Adjudication Workbench ]
  │
  ├── 2. flocks & operational_expenses
  │      └──> Consumed By: [ Farm Financial Profile & Credit Readiness ]
  │
  └── 3. insurance_policies (Status: ACTIVE)
         └──> Consumed By: [ Loan Application De-risking Badge ]
```

---

## 2. KEY CONSUMPTION POINTS & CONTRACTS

### 2.1 Consumption Point 1: Insurer Review of Claims Dossier
- **Source**: Japhet's `claim_packages` table (`evidence_package_json`).
- **Consumer**: `InsurerClaimDossierViewer.tsx` (`GET /api/v1/institutional/insurer/claims/:claimId`).
- **Contract Details**:
  Developer 2 renders the frozen snapshot containing:
  - 30-day daily mortality history line chart.
  - Vaccination compliance checklist.
  - Attached veterinary post-mortem report (Dr. Pam Gyang).
  - Attached NVRI Vom lab result PDF.
  - Field photos of carcass disposal with lime treatment.
- **Independence Principle**: Even if Japhet's module continues logging new daily mortalities for the farm, the claim package snapshot remains immutable.

---

### 2.2 Consumption Point 2: Farm Financial Valuation Calculation
- **Source**: Japhet's `flocks` and `operational_expenses` tables.
- **Consumer**: `FarmFinancialProfileCard.tsx` (`GET /api/v1/farms/:farmId/financial-profile`).
- **Calculation Formula**:
  - Live Bird Valuation = `Sum of (flock.current_count * standard_bird_market_rate)`
    - Layers (Point of Lay): ₦3,500 / bird
    - Broilers (Market Weight): ₦3,000 / bird
  - Monthly Feed Cost = `Average monthly expenditure from operational_expenses WHERE category = 'FEED'`
  - Historical Mortality Rate = `(Total dead birds / Initial bird stocking count) * 100`

---

### 2.3 Consumption Point 3: Loan Application Insurance De-Risking Link
- **Source**: Japhet's `insurance_policies` table.
- **Consumer**: `FinancingApplicationWizard.tsx` (`POST /api/v1/financing/apply`).
- **Logic**:
  When a farmer initiates a loan application to Gowans Microfinance Bank:
  1. Developer 2 queries active policies for the farm (`status = 'ACTIVE'`).
  2. If found, Developer 2 auto-selects the policy and links `insurance_policy_id`.
  3. The loan review card renders a high-visibility badge: `"DE-RISKED: Active NAIC Mortality Cover"`.

---

### 2.4 Handoff to Japhet: Institutional Consent Grants
- **Producer**: Developer 2 (`institutional_access_grants`)
- **Consumer**: Japhet's farm endpoints
- **Logic**:
  Before an institutional user can query farm details or flock history, authorization middleware calls:
  `hasValidAccessGrant(farmId, user.institution_id, scope)`
  If no active grant exists, access is refused with `HTTP 403 Forbidden`.

---

## 3. INTEGRATION TESTING PROTOCOL

1. **Mock Data Compatibility**:
   - While Japhet is completing the farm onboarding and incident uploader, Developer 2 can test the Insurer Review Workbench using `shared/utilities/mock-data/mockClaimDossier.json`.
   - Test that the split-pane dossier viewer cleanly handles all evidence attachment types (PDFs, images).
2. **Smoke Test Sequence**:
   - Verify that updating claim status in Developer 2's portal (`PATCH /api/v1/institutional/insurer/claims/:claimId/status`) updates the database and reflects immediately on Japhet's `ClaimStatusTracker.tsx`.
   - Verify that creating a loan application reflects the live bird counts recorded in Japhet's `flocks` table.

