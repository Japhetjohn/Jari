# DEVELOPER 2'S WORKSTREAM: FINANCE READINESS & INSTITUTIONAL OPERATIONS
**Developer**: Developer 2  
**Role**: Lead Engineer — Agricultural Finance, Credit Readiness & Institutional Dashboards  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026 | Jos South Focus  

---

## 1. MISSION & OVERVIEW

Welcome to Workstream 2. You are responsible for the financial enablement, credit readiness, and institutional integration layers of the Jari platform.

Your primary objective is to build the digital infrastructure that transforms raw agricultural operations into **bankable financial profiles**, coordinates **de-risked loan applications** for prospective lenders (such as Gowans Microfinance Bank and Bank of Agriculture), and provides institutional officers (insurers and lenders) with dedicated, audit-grade **institutional dashboards** for claims adjudication, loan underwriting reviews, and post-disbursement farm monitoring.

---

## 2. YOUR ASSIGNED RESPONSIBILITIES

You are the primary owner and lead developer for:
1. **Farm Business & Financial Profiles**: Aggregating flock assets, operational turnover, monthly margins, and bird valuations into structured financial statements.
2. **Financial Record Organisation**: Structuring operating cash flows and feed expense records into lender-ready schedules.
3. **Financing Readiness Engine**: Calculating the farm's credit readiness benchmark score (0 - 100%) and financial health grade.
4. **Financing Application Preparation**: Enabling farmers to assemble loan applications (`FIN-2026-001`) with attached insurance de-risking indicators.
5. **Loan Application Status Tracking**: Farmer-facing status monitor (Draft, Submitted, Under Credit Review, Inspection Scheduled, Approved/Disbursed).
6. **Lender-Facing Review Views**: Dedicated portal for loan officers at Gowans MFB / BOA to inspect farm capacity, historical mortality trends, and insurance coverage.
7. **Institutional Dashboard Suite**: Multi-tenant institutional workspace supporting insurer claims reviewers and lender credit officers.
8. **Authorised Insurer & Lender Access Grants**: Explicit, consent-based permission system (`institutional_access_grants`) controlling which institution can view farm data.
9. **Institutional Document & Evidence Review**: Split-pane dossier viewer allowing insurers to scrutinize compiled claim evidence packages (`CLM-2026-001`).
10. **Financed-Farm & Insured-Farm Monitoring**: Portfolio health dashboard streaming active flock counts, mortality surges, and operational alerts across financed farms.
11. **Institutional Activity History & Audit Trail**: Immutable logging of institutional access, document reviews, and status changes in compliance with NDPR.

---

## 3. CODEBASE DIRECTORY OWNERSHIP

### What You Own (Your Implementation Workspaces):
- `modules/finance-readiness/`: All financial profile calculations, asset valuation widgets, and loan application flows.
- `modules/institutional-dashboard/`: Insurer claims review portals, lender credit assessment screens, portfolio monitoring charts, and access consent management.

### What You Depend On (Shared Infrastructure & Japhet's Data):
- `shared/authentication/`: For current user session, role switching (`LENDER_OFFICER`, `INSURER_OFFICER`, `FARMER`), and institution context.
- `shared/authorization/`: For checking `institutional_access_grants` before rendering farm data.
- `shared/database/`: For query execution and persistence.
- `modules/farm-management/` (Japhet): For querying live flock counts, mortality rates, and feed expenses.
- `modules/incident-claims/` (Japhet): For loading the frozen `claim_packages` dossier on the Insurer Claims Review screen.
- `components/common/`: Reusable `<Button>`, `<Card>`, `<Badge>`, `<Modal>`, `<LoadingSpinner>`.
- `components/forms/`: Reusable `<FormField>`, `<CurrencyInput>`, `<SelectDropdown>`.
- `components/tables/`: Reusable `<DataTable>` and `<DossierView>`.
- `components/navigation/`: `<InstitutionalNavbar>`.

### What You Must NOT Modify Without Coordination:
- `modules/farm-management/` (Owned by Japhet)
- `modules/insurance-management/` (Owned by Japhet)
- `modules/incident-claims/` (Owned by Japhet)
- `docs/DATABASE_SCHEMA.md` and `docs/API_CONTRACTS.md` (Update only by mutual agreement)

---

## 4. HOW YOUR WORK CONNECTS WITH JAPHET'S WORK

Japhet captures the operational reality of commercial poultry farms in Jos South. You consume that reality and package it for financial institutions.

1. **Insurer Claims Adjudication**: When Japhet's module generates claim `CLM-2026-001`, your **Insurer Review Portal** loads that record from `claim_packages`. You render the frozen evidence snapshot (`evidence_package_json`), showing the 30-day mortality graph, vaccine compliance, and Dr. Pam Gyang's vet notes.
2. **Credit Assessment & Valuation**: When compiling the **Farm Financial Profile**, your module aggregates Japhet's `flocks` table to compute live bird asset value (e.g. 3,500 layers @ ₦3,500 = ₦12,250,000) and checks average mortality to gauge biological risk.
3. **Loan De-risking**: When a farmer submits a loan application to Gowans Microfinance Bank, your module checks Japhet's `insurance_policies` table. If an active policy exists, you display the prominent "De-risked by Insurance" tag, which significantly improves loan review confidence.

---

## 5. LOCAL TESTING & VERIFICATION GUIDE

### 5.1 Unit / Model Verification
1. Verify that `annual_turnover_ngn` and `requested_amount_ngn` correctly validate positive values.
2. Verify that `institutional_access_grants` properly blocks institutional users if the grant is expired or revoked.
3. Verify that the Credit Readiness Score properly computes:
   - Positive operating margin = 30 pts
   - Historical mortality under 5% = 25 pts
   - Active insurance policy attached = 25 pts
   - Complete 6-month operational history = 20 pts

### 5.2 End-to-End Golden Flow Verification
1. Log in as Farmer (`usr_farmer_01`) -> Navigate to Finance Readiness -> Verify generated `FarmFinancialProfile`.
2. Submit Loan Application to *Gowans Microfinance Bank* for ₦3,500,000 with NAIC insurance policy linked.
3. Switch session to Lender Officer (`usr_lender_01`, Institution: Gowans MFB) -> Navigate to `/institutional/lender/applications`.
4. Open the application -> Verify that farm operational history, bird asset valuation, and insurance de-risking badge render correctly.
5. Update application status to `SITE_INSPECTION_SCHEDULED`.
6. Switch session to Insurer Officer (`usr_insurer_01`, Institution: NAIC) -> Open claim `CLM-2026-001` compiled by Japhet -> Verify split-screen dossier view renders the post-mortem report and mortality audit logs.

---

## 6. WORKSTREAM QUICK LINKS
- [AI_CONTEXT.md](file:///home/japhet/Desktop/Jari/workstreams/developer-2/AI_CONTEXT.md): Copyable master context for ChatGPT / Antigravity.
- [MODULE_OWNERSHIP.md](file:///home/japhet/Desktop/Jari/workstreams/developer-2/MODULE_OWNERSHIP.md): Granular file inventory.
- [TASK_PROMPT_TEMPLATE.md](file:///home/japhet/Desktop/Jari/workstreams/developer-2/TASK_PROMPT_TEMPLATE.md): Reusable prompt template for generating features.
- [INTEGRATION_GUIDE.md](file:///home/japhet/Desktop/Jari/workstreams/developer-2/INTEGRATION_GUIDE.md): Interface guide with Japhet.
- [PROGRESS.md](file:///home/japhet/Desktop/Jari/workstreams/developer-2/PROGRESS.md): Live checklist and status tracker.

