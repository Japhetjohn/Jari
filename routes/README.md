# APPLICATION ROUTES & URL TOPOLOGY
**Directory**: `routes/`  
**Ownership**: Shared  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. ROUTING OVERVIEW

The application utilizes a single integrated routing table divided into two primary zones:
1. **Farmer Portal (`/dashboard`, `/flocks`, `/incidents`, `/finance`)**
2. **Institutional Portal (`/institutional/...`)**

A demo helper route (`/persona-switcher`) allows one-click persona switching during the HackJos 2026 presentation.

---

## 2. APPLICATION ROUTE MAP

| Route Path | View / Component | Assigned Owner | Role Access | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Shared | Public | Problem overview, mission, and demo launcher |
| `/login` | `LoginPage` | Shared | Public | Multi-role authentication entrypoint |
| `/dashboard` | `FarmerDashboardPage` | Japhet | `FARMER` | Farm overview, active flocks, readiness score |
| `/farm/setup` | `FarmOnboardingPage` | Japhet | `FARMER` | Jos South farm and pen registration |
| `/flocks` | `FlockManagementPage` | Japhet | `FARMER` | Batch inventory, stocking, and pen allocation |
| `/daily-logs` | `DailyOperationsPage` | Japhet | `FARMER` | Daily mortality, egg crates, and feed entry |
| `/insurance` | `InsuranceReadinessPage`| Japhet | `FARMER` | Dynamic readiness audit & prospective policies |
| `/incidents` | `IncidentClaimsPage` | Japhet | `FARMER` | Outbreak declaration & 1-click claim compiler |
| `/finance` | `FinanceReadinessPage` | Dev 2 | `FARMER` | Financial profile & loan application wizard |
| `/institutional/insurer/claims` | `InsurerWorkbenchPage` | Dev 2 | `INSURER_OFFICER` | Claims table with filter and status management |
| `/institutional/insurer/claims/:claimId` | `InsurerDossierPage` | Dev 2 | `INSURER_OFFICER` | Split-pane review of frozen evidence package |
| `/institutional/lender/applications` | `LenderWorkbenchPage` | Dev 2 | `LENDER_OFFICER` | Loan applications with verified farm track records |
| `/institutional/lender/applications/:appId` | `LenderReviewPage` | Dev 2 | `LENDER_OFFICER` | In-depth credit assessment & insurance verification |
| `/institutional/portfolio-monitor` | `PortfolioMonitorPage`| Dev 2 | Institutional | Live risk streaming across financed/insured farms |
| `/institutional/audit-logs` | `AuditLogsPage` | Dev 2 | Institutional | Immutable NDPR compliance log |

---

## 3. INTEGRATION RULES
- No developer may add a top-level route without registering it in this table and notifying their peer.
- Institutional routes must enforce the `INSURER_OFFICER` or `LENDER_OFFICER` role check.

