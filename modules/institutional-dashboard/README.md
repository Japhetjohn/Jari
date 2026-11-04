# MODULE: INSTITUTIONAL DASHBOARD
**Workstream Owner**: Developer 2 (Workstream 2)  
**Directory**: `modules/institutional-dashboard/`  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. MODULE PURPOSE
The Institutional Dashboard module is the multi-tenant enterprise portal designed for agricultural insurance underwriters (such as NAIC, AIICO, Leadway) and agricultural lenders (such as Gowans Microfinance Bank, Bank of Agriculture). It provides insurance adjusters with an auditable workbench to adjudicate submitted claims dossiers (`CLM-2026-001`), equips loan officers with a credit assessment interface to review financed farm profiles, streams portfolio-level risk alerts (e.g. disease mortality spikes), and maintains an immutable compliance audit trail.

---

## 2. MAIN RESPONSIBILITIES
- Insurer Claims Adjudication Workbench:
  - Filtering and reviewing submitted claims packages.
  - Split-pane Dossier Viewer rendering the frozen `evidence_package_json` (30-day mortality logs, vaccine adherence, Dr. Pam Gyang's vet attestation, NVRI Vom reports).
  - Updating claim status (`UNDER_INSPECTION`, `DOCUMENTS_REQUESTED`, `SETTLEMENT_OFFERED`, `REPUDIATED`).
- Agricultural Lender Review Workbench:
  - Reviewing submitted credit applications (`FIN-2026-001`).
  - Inspecting verified live bird asset valuations, cash flow margins, and historical mortality loss rates.
  - Verifying the presence of an active insurance de-risking policy.
  - Updating loan application status (`SITE_INSPECTION_SCHEDULED`, `APPROVED_OFFERED`, `REJECTED`).
- Portfolio Risk Monitoring Stream:
  - Real-time institutional overview of active flocks, sudden mortality rate spikes (>1.5% daily), and biosecurity alerts across financed/insured farms.
- Consent & Access Grant Management:
  - Enforcing farm consent boundaries (`institutional_access_grants`) to protect farmer privacy in compliance with NDPR.
- Tamper-Evident Activity Audit Trail:
  - Immutable logging of institutional file views, report queries, and status updates.

---

## 3. PROPOSED FILES & SUBFOLDERS
```
modules/institutional-dashboard/
├── README.md                           # This orientation document
├── components/
│   ├── InsurerClaimsWorkbench.tsx      # Table and filter controls for insurer claims
│   ├── InsurerClaimDossierViewer.tsx   # Split-pane dossier review workspace
│   ├── LenderApplicationsWorkbench.tsx # Table and review workspace for agricultural loans
│   ├── FinancedFarmPortfolioMonitor.tsx # Portfolio health & mortality alert stream
│   ├── ConsentAccessManager.tsx        # Farmer consent grant management UI
│   ├── ActivityAuditLogTable.tsx       # Immutable NDPR compliance audit table
│   └── StatusTransitionModal.tsx       # Action modal to update claim/loan status
├── api/
│   ├── institutionalRoutes.ts          # Route handlers for institutional operations
│   └── institutionalController.ts      # Query controllers for claims, loans & alerts
└── types/
    └── index.ts                        # TypeScript interfaces for institutional views
```

---

## 4. DATABASE MODELS
Defined in `docs/DATABASE_SCHEMA.md`:
- `institutions`
- `institutional_access_grants`
- `activity_audit_logs`
- Reads: `claim_packages`, `financing_applications`, `farms`, `flocks`, `mortality_records`, `insurance_policies`

---

## 5. API ENDPOINTS
Defined in `docs/API_CONTRACTS.md`:
- `GET /api/v1/institutional/insurer/claims` — List claims assigned to underwriter
- `GET /api/v1/institutional/insurer/claims/:claimId` — Detailed claim view with frozen evidence
- `PATCH /api/v1/institutional/insurer/claims/:claimId/status` — Update claim review status
- `GET /api/v1/institutional/lender/applications` — List loan applications
- `PATCH /api/v1/institutional/lender/applications/:appId/status` — Update loan application status
- `GET /api/v1/institutional/portfolio/monitoring-summary` — Portfolio risk alerts
- `GET /api/v1/institutional/audit-logs` — Activity trail

---

## 6. COMPONENTS EXPOSED TO OTHER MODULES
- `<InsurerClaimDossierViewer />`: Primary adjudication workspace for insurance officers.
- `<ConsentAccessManager />`: Embedded in the Farmer Profile settings to manage third-party access permissions.

---

## 7. TESTING REQUIREMENTS
1. Enforce Role-Based Access Control: Farmers cannot access institutional workbench endpoints.
2. In compliance with NDPR, verify that an insurer cannot view bank statements and a lender cannot view unlinked vet incident reports without an active access grant.
3. Updating claim status must log an immutable entry into `activity_audit_logs`.

