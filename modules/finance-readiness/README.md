# MODULE: FINANCE READINESS
**Workstream Owner**: Developer 2 (Workstream 2)  
**Directory**: `modules/finance-readiness/`  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. MODULE PURPOSE
The Finance Readiness module aggregates raw poultry production, flock asset values, operating margins, and feed expense histories into structured, lender-friendly financial schedules. It evaluates the farm's credit readiness, generates loan application dossiers (`FIN-2026-001`), and links active insurance policies to de-risk credit requests for prospective lenders (such as Gowans Microfinance Bank and Bank of Agriculture).

---

## 2. MAIN RESPONSIBILITIES
- Compiling Farm Business & Financial Profiles:
  - Estimating live flock asset value in NGN based on current live bird counts in active pens.
  - Summarizing annual turnover and monthly net cash flows.
  - Calculating monthly feed expenditure burn rate.
  - Determining historical flock mortality loss rates (a vital credit risk metric).
- Computing the dynamic Credit Readiness Score (0 - 100%) and categorizing the farm into readiness tiers (`LOW_READINESS`, `EMERGING`, `FINANCE_READY`, `INVESTMENT_GRADE`).
- Managing the Financing Application Wizard:
  - Capturing loan purpose (Flock restocking, bulk feed inventory, housing expansion, disease recovery).
  - Selecting prospective lenders (Gowans MFB, BOA, NMFB).
  - Tenor and repayment cycle preferences (Monthly, bullet post-harvest).
  - Auto-attaching active insurance coverage as a risk mitigation instrument.
- Tracking financing application progress (`DRAFT`, `SUBMITTED`, `UNDER_CREDIT_REVIEW`, `APPROVED`, `DISBURSED`).

---

## 3. PROPOSED FILES & SUBFOLDERS
```
modules/finance-readiness/
├── README.md                           # This orientation document
├── components/
│   ├── FarmFinancialProfileCard.tsx    # High-level financial metrics overview
│   ├── LiveBirdAssetValuator.tsx       # Live flock valuation based on breed & cycle
│   ├── CreditReadinessScoreGauge.tsx   # Credit benchmark visual gauge
│   ├── FinancingApplicationWizard.tsx  # Multi-step loan application form
│   ├── InsuranceDeriskingBadge.tsx     # Visual badge linking active NAIC/AIICO policy
│   └── LoanStatusTracker.tsx           # Progress tracker for submitted loan requests
├── api/
│   ├── financeRoutes.ts                # Route handlers for financial profiles & loans
│   ├── creditScoringService.ts         # Credit readiness calculation engine
│   └── valuationService.ts             # Flock asset valuation formulas
└── types/
    └── index.ts                        # TypeScript interfaces for financial profiles & loans
```

---

## 4. DATABASE MODELS
Defined in `docs/DATABASE_SCHEMA.md`:
- `farm_financial_profiles`
- `financing_applications`
- `institutions` (Filtered for `COMMERCIAL_BANK`, `MICROFINANCE_BANK`, `DEVELOPMENT_FINANCE`)
- Reads: `farms`, `flocks`, `operational_expenses`, `insurance_policies`

---

## 5. API ENDPOINTS
Defined in `docs/API_CONTRACTS.md`:
- `GET /api/v1/farms/:farmId/financial-profile` — Returns aggregated financials and readiness score.
- `POST /api/v1/financing/apply` — Submits a financing application to a lender.
- `GET /api/v1/financing/applications` — Lists loan applications for current farm.
- `GET /api/v1/financing/applications/:id` — Detailed application view.

---

## 6. COMPONENTS EXPOSED TO OTHER MODULES
- `<FarmFinancialProfileCard />`: Exposed to Developer 2's Lender Review Workbench.
- `<InsuranceDeriskingBadge />`: Displayed in the loan preparation summary.

---

## 7. TESTING REQUIREMENTS
1. Financial profile must gracefully handle zero operational history without dividing by zero.
2. Loan application must enforce positive numerical values for principal and tenor.
3. If farm has an active insurance policy, the de-risking badge must automatically render and link the policy ID.

