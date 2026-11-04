# AI ENGINEERING CONTEXT: WORKSTREAM 2 (DEVELOPER 2)
**Context Target**: ChatGPT / Antigravity / Claude Coding Assistant  
**Developer**: Developer 2  
**Assigned Workstream**: Finance Readiness, Credit Modeling & Institutional Operations  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026 | Initial Target: Jos South LGA, Plateau State, Nigeria  

---

## 1. PROJECT SUMMARY & DOMAIN PROBLEM

Commercial poultry farms in Jos South (Plateau State, Nigeria) face acute hurdles accessing formal agricultural credit. When requesting working capital or restocking loans from commercial banks or local microfinance banks (such as Gowans Microfinance Bank or Bank of Agriculture), poultry farmers encounter stringent collateral demands and high loan rejection rates.

The root problem is **not a shortage of capital**, but an acute **information asymmetry**:
- Lenders perceive commercial poultry as excessively risky due to disease mortality and fluctuating feed costs.
- Farmers maintain fragmented, informal paper records that cannot substantiate their operational track record, live flock valuations, or operating cash flows.
- Lenders lack real-time visibility into the farm's biosecurity discipline and operational health post-disbursement.

On the insurance side:
- Agricultural insurers (such as NAIC, AIICO, and Leadway) face high administrative costs and multi-week inspection delays when investigating poultry mortality claims.
- Insurers lack a standardized, auditable digital dossier to rapidly adjudicate claims.

### The Solution
Developer 2 builds the **Financial & Institutional Bridge**:
1. **Farm Financial Profiles**: Transforming raw flock counts, egg production records, and feed expense logs into audit-grade financial schedules and credit readiness benchmarks.
2. **De-Risked Loan Applications**: Enabling farmers to submit loan applications directly linked to active poultry insurance policies.
3. **Institutional Workbench**: Providing insurance adjusters with a high-density claims review portal to inspect frozen claim dossiers compiled by Japhet, and giving loan officers a dedicated credit evaluation interface with real-time portfolio monitoring.

---

## 2. DEVELOPER 2'S MODULE RESPONSIBILITIES & SCOPE BOUNDARIES

### What You Build:
You own **Workstream 2**, encompassing two core modules:
1. `modules/finance-readiness/`:
   - Farm Financial Profile generator (turnover, live bird valuation, gross margins, monthly feed burn rate).
   - Credit Readiness Score engine (0 - 100% benchmark score assessing cash flow, mortality risk, and insurance de-risking).
   - Financing Application wizard (`FIN-2026-001`) enabling farmers to apply to prospective lenders (Gowans MFB, Bank of Agriculture).
   - Farmer loan application status monitor.
2. `modules/institutional-dashboard/`:
   - Insurer Claims Review Portal: Displays submitted claims (`CLM-2026-001`), renders the frozen evidence dossier (`evidence_package_json`), and allows status updates (`UNDER_INSPECTION`, `SETTLEMENT_OFFERED`, `REPUDIATED`).
   - Lender Credit Assessment Portal: Displays submitted loan requests, verifies bird asset backing, inspects historical mortality rates, and checks active insurance status.
   - Financed & Insured Farm Monitoring: Portfolio-level dashboard streaming live flock counts, mortality spikes, and biosecurity alerts.
   - Institutional Access Consent Manager: Scoped permission system (`institutional_access_grants`) allowing farmers to authorize or revoke lender/insurer access.
   - Activity Audit Log: Tamper-evident NDPR-compliant log tracking institutional file views and status transitions.

### Scope Boundaries (What You Must NOT Build or Modify):
- **Do NOT build**: Farm registration forms, flock batch managers, daily mortality forms, or incident outbreak declaration forms. These belong to **Japhet**.
- **Do NOT modify**: `modules/farm-management/`, `modules/insurance-management/`, or `modules/incident-claims/`.
- **Do NOT touch**: `shared/` core files without explicit coordination.
- **Do NOT invent fake institutional partnerships**: Prospective partners in Jos South are *Gowans Microfinance Bank*, *Bank of Agriculture (BOA)*, *NIRSAL Microfinance Bank (NMFB)*, *FirstBank*, *NIRSAL Plc*, *Nigerian Agricultural Insurance Corporation (NAIC)*, *AIICO*, and *Leadway*. Always label them as prospective pilot partners.
- **Do NOT build an automated loan approval engine or automated credit scoring algorithm**: The platform assists in document preparation and risk visibility; lending institutions independently evaluate credit and determine loan approvals.

---

## 3. ARCHITECTURE & TECHNOLOGY STACK

- **Platform Core**: Node.js v25+ / TypeScript / SQLite (Prisma/Drizzle/SQL standard).
- **Architecture**: Modular Domain-Driven Architecture with shared contracts.
- **Data Flow**:
  1. Japhet captures daily farm operations and generates frozen claims dossiers.
  2. Developer 2 queries Japhet's database models to compute financial schedules and renders institutional review screens.
  3. Developer 2 writes to `farm_financial_profiles`, `financing_applications`, `institutional_access_grants`, and `activity_audit_logs`.

---

## 4. DATABASE MODELS ASSIGNED TO DEVELOPER 2

Review `docs/DATABASE_SCHEMA.md` for exact column definitions:
- `institutions`: Master registry of prospective insurance companies and lending banks.
- `farm_financial_profiles`: Financial metrics (`annual_turnover_ngn`, `estimated_flock_asset_value_ngn`, `finance_readiness_score`).
- `financing_applications`: Loan requests (`application_code`, `requested_amount_ngn`, `loan_purpose`, `repayment_cycle`, `status`).
- `institutional_access_grants`: Explicit consent records (`scope`, `can_view_financials`, `can_view_operational_logs`, `expires_at`, `is_revoked`).
- `activity_audit_logs`: Audit trail (`user_id`, `institution_id`, `action`, `target_entity`, `ip_address`).

### Japhet's Models Read by Developer 2:
- `farms`: Primary farm info, location, biosecurity level.
- `flocks`: Used to compute total live birds and asset valuations.
- `mortality_records`: Aggregated to compute historical mortality rate (critical lender risk metric).
- `operational_expenses`: Aggregated to compute monthly feed cost burn rate.
- `insurance_policies`: Checked to verify if farm has active insurance to de-risk loan applications.
- `claim_packages`: Read by the Insurer Claims Review Portal to display frozen evidence packages.

---

## 5. API CONTRACTS ASSIGNED TO DEVELOPER 2

Review `docs/API_CONTRACTS.md` for exact request and response schemas:
- `GET /api/v1/farms/:farmId/financial-profile` — Fetch computed financial profile.
- `POST /api/v1/financing/apply` — Submit loan application to prospective lender.
- `POST /api/v1/farms/:farmId/access-grants` — Grant consent access to an institution.
- `GET /api/v1/institutional/insurer/claims` — List claims submitted to current insurer.
- `GET /api/v1/institutional/insurer/claims/:claimId` — Detailed claim adjudication view with evidence dossier.
- `PATCH /api/v1/institutional/insurer/claims/:claimId/status` — Update claim review status.
- `GET /api/v1/institutional/lender/applications` — List loan applications submitted to current lender.
- `GET /api/v1/institutional/portfolio/monitoring-summary` — Portfolio risk stream.
- `GET /api/v1/institutional/audit-logs` — Fetch compliance audit trail.

---

## 6. SHARED DESIGN SYSTEM CONVENTIONS

- **Styling**: Tailwind CSS / CSS Modules following `docs/DESIGN_SYSTEM.md`.
- **Institutional Slate Navy**: `#0F172A` (Slate 900) for headers and institutional cards.
- **Agricultural Primary Green**: `#059669` (Emerald 600) for verified assets and active loans.
- **Amber Warning**: `#D97706` for applications under review or pending site inspections.
- **Currency**: Always format Nigerian Naira as `₦3,500,000.00` using `<CurrencyInput>` or `formatNaira()` utility.
- **Reference Codes**: Display loan and claim references in monospace pills (`font-mono bg-slate-100 px-2 py-0.5 rounded text-xs`).
- **Reusable Components to Use**:
  - `components/common/Button.tsx`
  - `components/common/Card.tsx`
  - `components/common/Badge.tsx`
  - `components/common/Modal.tsx`
  - `components/forms/FormField.tsx`
  - `components/forms/CurrencyInput.tsx`
  - `components/tables/DataTable.tsx`
  - `components/tables/DossierView.tsx`

---

## 7. SIMULATED DEMO SCENARIO FOR DEVELOPER 2'S MODULES

For testing and demonstration at HackJos 2026:
- **Prospective Lender**: Gowans Microfinance Bank, Bukuru Branch, Jos South.
- **Prospective Insurer**: Nigerian Agricultural Insurance Corporation (NAIC), Plateau Zonal Office.
- **Loan Application**: `FIN-2026-001` requesting ₦3,500,000 for flock restocking and bulk feed procurement for Grace Heights Farms.
- **Asset Backing**: 3,500 live layers valued at ₦12,250,000 + NAIC active poultry insurance policy attached.
- **Claims Adjudication**: Reviewing claim `CLM-2026-001` (₦850,000) for the Newcastle outbreak in Pen 1.

---

## 8. STRICT AI INSTRUCTIONS FOR DEVELOPER 2'S WORKSTREAM

When instructed to implement a feature:
1. **Read this file (`AI_CONTEXT.md`) and `docs/DATABASE_SCHEMA.md` first**.
2. **Inspect existing files in `modules/finance-readiness/` and `modules/institutional-dashboard/` before writing code**.
3. **Reuse existing components in `components/` and utilities in `shared/`**.
4. **Never create competing duplicate components** (e.g. do not create a custom table if `<DataTable />` exists in `components/tables/DataTable.tsx`).
5. **Never touch Japhet's modules** (`modules/farm-management/`, `modules/insurance-management/`, `modules/incident-claims/`).
6. **Ensure all data types match `docs/DATABASE_SCHEMA.md`**.
7. **After implementing code, update `workstreams/developer-2/PROGRESS.md`**.

