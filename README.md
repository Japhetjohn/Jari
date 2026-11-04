# JARI: COMMERCIAL POULTRY INSURANCE & FINANCE INFRASTRUCTURE
**Hackathon**: HackJos 2026 | **Track**: Agri-Finance / Farmer Inclusion  
**Target Market**: Jos South LGA, Plateau State, Nigeria (Focus: Commercial Farms >2,000 birds)  
**Architecture Version**: 1.0 (Two-Developer Modular Monorepo Architecture)  

---

## 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT

Commercial poultry farming in Jos South LGA (Plateau State, Nigeria) represents hundreds of millions of Naira in private capital invested in day-old-chicks, compound feed, veterinary medications, automated battery cages, and biosecurity infrastructure.

However, poultry businesses operate under extreme financial exposure. When catastrophic events occur—such as virulent Newcastle Disease flare-ups during cold harmattan winds, Infectious Bursal Disease (Gumboro), Avian Influenza, or severe flooding:
- **69% of poultry farmers experience crippling delays in insurance indemnity**.
- **55% report protracted delays in physical loss assessment**.
- **50% suffer administrative bottlenecks** in proving flock counts, vaccination compliance, and purchase receipts.

Concurrently, **agricultural insurers** (such as NAIC and AIICO) and **agricultural lenders** (such as Gowans Microfinance Bank and Bank of Agriculture) face an acute **information asymmetry**: they lack structured, verifiable, and historical operational data to underwrite policies, adjudicate claims fairly, or extend restocking credit without excessive collateral demands.

### The Solution
**Jari** is an integrated digital infrastructure that connects commercial poultry farms with prospective insurance underwriters and agricultural lenders through structured farm records, biosecurity compliance tracking, immutable claims dossiers, and verified financial profiles.

> **Crucial Distinction**: Jari is **NOT** a standard flock inventory app. It is a financial and underwriting readiness infrastructure that turns daily farm operations into auditable, institutional-grade assets.

---

## 2. HIGH-LEVEL PRODUCT CAPABILITIES

```
+-----------------------------------------------------------------------------------------+
|                                JARI CORE INFRASTRUCTURE                                 |
+-----------------------------------------------------------------------------------------+
| [A] FARM MANAGEMENT                                                                     |
| Commercial onboarding, multi-house pen tracking, flock lifecycles, daily mortality     |
| logs, egg/production records, vaccination scheduling, and feed expense logs.          |
+-----------------------------------------------------------------------------------------+
| [B] INSURANCE READINESS & POLICIES                                                      |
| Automated readiness scoring (0-100%), biosecurity checklist audit, policy tracking      |
| with prospective underwriters (NAIC, AIICO, Leadway), and renewal tracking.           |
+-----------------------------------------------------------------------------------------+
| [C] INCIDENT & CLAIMS DOCUMENTATION                                                     |
| Rapid outbreak declaration, multimedia/lab evidence gathering (NVRI Vom, Dr. Pam Gyang  |
| VCN vet reports), and 1-click generation of immutable claims packages (CLM-2026-001).   |
+-----------------------------------------------------------------------------------------+
| [D] FINANCE READINESS                                                                   |
| Live bird asset valuation (e.g. 3,500 layers = ₦12.25M), turnover/margin schedules,     |
| credit readiness benchmark scores, and de-risked loan preparation for lenders.          |
+-----------------------------------------------------------------------------------------+
| [E] INSTITUTIONAL DASHBOARD                                                             |
| Multi-tenant workbench for insurance adjusters (split-pane claim dossier review) and   |
| loan officers (credit assessment & portfolio health monitoring) under NDPR consent.     |
+-----------------------------------------------------------------------------------------+
```

---

## 3. TWO-DEVELOPER WORKSTREAM ARCHITECTURE

The codebase is organized into **one integrated application** with two clearly separated developer workspaces and domain boundaries.

```
+-----------------------------------------------------------------------------------------+
| WORKSTREAM 1: FARM OPERATIONS & INSURANCE     | WORKSTREAM 2: FINANCE & INSTITUTIONS     |
| Lead Developer: Japhet                        | Lead Developer: Developer 2              |
| Documentation: workstreams/japhet/            | Documentation: workstreams/developer-2/  |
+-----------------------------------------------+-----------------------------------------+
| Modules Owned:                                | Modules Owned:                          |
| - modules/farm-management/                    | - modules/finance-readiness/            |
| - modules/insurance-management/               | - modules/institutional-dashboard/      |
| - modules/incident-claims/                    |                                         |
|                                               |                                         |
| Key Deliverables:                             | Key Deliverables:                       |
| 1. Farm & poultry-house onboarding            | 1. Farm business & financial profile    |
| 2. Flock batch management & stocking          | 2. Live bird asset valuation engine     |
| 3. Daily mortality & production logger        | 3. Credit readiness score calculator    |
| 4. Vaccination & Dr. Pam Gyang vet logs       | 4. Financing application preparation    |
| 5. Feed & operational expense tracking        | 5. Insurer Claims Review Workbench      |
| 6. Insurance readiness score gauge            | 6. Split-pane Claim Dossier Viewer      |
| 7. Incident outbreak declaration              | 7. Lender Credit Assessment Workbench   |
| 8. 1-Click Claims Package (CLM-2026-001)      | 8. Financed-farm portfolio monitor      |
|                                               | 9. Consent grant & audit log viewer     |
+-----------------------------------------------------------------------------------------+
| SHARED INFRASTRUCTURE (Mutual Agreement Required):                                      |
| - shared/authentication/ : Role guards (Farmer, Insurer, Lender, Vet)                   |
| - shared/authorization/  : NDPR consent-based scoped access grants                      |
| - shared/database/       : Relational schema, SQLite/Postgres client, seed data         |
| - shared/validation/     : Zod schemas for forms and API payloads                       |
| - components/            : Common UI atoms, form inputs, navigation, and tables         |
| - routes/ & config/      : Global URL routing topology and Jos South constants          |
+-----------------------------------------------------------------------------------------+
```

---

## 4. MASTER REPOSITORY DIRECTORY MAP

```
Jari/
├── docs/                               # Master architectural & product documentation
│   ├── ARCHITECTURE.md                 # Technical blueprint & system diagram
│   ├── DATABASE_SCHEMA.md              # Complete relational schema & data types
│   ├── API_CONTRACTS.md                # Standardized REST endpoint specifications
│   ├── INTEGRATION_RULES.md            # Git branching, merge protocols, commit rules
│   ├── DESIGN_SYSTEM.md                # Design tokens, palette, and component styles
│   └── MVP_SCOPE.md                    # 48-Hour prioritized scope & demo scenarios
│
├── workstreams/                        # Developer onboarding & AI context workspaces
│   ├── japhet/                         # Japhet's workspace (Operations & Insurance)
│   │   ├── README.md                   # Workstream 1 onboarding
│   │   ├── AI_CONTEXT.md               # Context file for ChatGPT / Antigravity
│   │   ├── MODULE_OWNERSHIP.md         # Detailed file and API ownership list
│   │   ├── TASK_PROMPT_TEMPLATE.md     # Reusable prompt for feature coding
│   │   ├── INTEGRATION_GUIDE.md        # Cross-module communication guide
│   │   └── PROGRESS.md                 # Live task status and checklist
│   │
│   └── developer-2/                    # Developer 2's workspace (Finance & Institutional)
│       ├── README.md                   # Workstream 2 onboarding
│       ├── AI_CONTEXT.md               # Context file for ChatGPT / Antigravity
│       ├── MODULE_OWNERSHIP.md         # Detailed file and API ownership list
│       ├── TASK_PROMPT_TEMPLATE.md     # Reusable prompt for feature coding
│       ├── INTEGRATION_GUIDE.md        # Cross-module communication guide
│       └── PROGRESS.md                 # Live task status and checklist
│
├── modules/                            # Application domain modules
│   ├── farm-management/                # Farm setup, pen inventory, flocks, mortality, feed
│   ├── insurance-management/           # Readiness score gauge, biosecurity audit, policies
│   ├── incident-claims/                # Outbreak reporting, evidence upload, claim dossiers
│   ├── finance-readiness/              # Asset valuation, financial profiles, loan apps
│   └── institutional-dashboard/        # Insurer & lender review workbenches, audit log
│
├── shared/                             # Reusable core infrastructure
│   ├── authentication/                 # Session, JWT, and multi-role context
│   ├── authorization/                  # Consent access grant verifiers
│   ├── database/                       # Database client, migrations, and seed scripts
│   ├── middleware/                     # Error handling, logging, and audit tracking
│   ├── utilities/                      # Naira currency formatters, date math, mock fixtures
│   └── validation/                     # Zod input validation schemas
│
├── components/                         # Shared UI component library
│   ├── common/                         # Button, Card, Badge, Modal, LoadingSpinner
│   ├── forms/                          # FormField, CurrencyInput (₦), FileUploadZone
│   ├── navigation/                     # FarmerNavbar, InstitutionalNavbar, PersonaSwitcher
│   └── tables/                         # DataTable, DossierView split-pane layout
│
├── routes/                             # Application URL topology and route declarations
├── config/                             # Regional defaults (Jos South) and partner registry
└── README.md                           # This master guide
```

---

## 5. GETTING STARTED & LOCAL DEVELOPMENT

### 5.1 Prerequisites
- **Node.js**: v20+ (Environment has Node.js v25.7.0 and npm 11.11.1)
- **SQLite3**: Pre-installed on Linux environment

### 5.2 Starting a Development Session as a Developer
1. **Enter your assigned workspace**:
   - For Japhet: Open `workstreams/japhet/README.md`.
   - For Developer 2: Open `workstreams/developer-2/README.md`.
2. **Review your AI Context**:
   - When using ChatGPT, Claude, or Antigravity, open `AI_CONTEXT.md` in your workspace and copy it as the initial system prompt.
3. **Use the Task Prompt Template**:
   - Copy `TASK_PROMPT_TEMPLATE.md`, fill in `<FEATURE_NAME>` and `<TASK_DESCRIPTION>`, and instruct your AI assistant.

### 5.3 Git Branching Workflow (48-Hour Protocol)
Strictly follow `docs/INTEGRATION_RULES.md`:
- Never commit directly to `main`.
- Create feature branches:
  - Japhet: `git checkout -b feat/japhet/<feature-name>`
  - Developer 2: `git checkout -b feat/dev2/<feature-name>`
- Merge into `integration` once tested.
- `main` is reserved strictly for verified demo milestones.

---

## 6. REGULATORY SAFEGUARDS & PROSPECTIVE PARTNERS

1. **Prospective Partners**:
   - The platform features prospective pilot collaborations with:
     - **Insurers**: *Nigerian Agricultural Insurance Corporation (NAIC)*, *AIICO Insurance PLC*, *Leadway Assurance*.
     - **Lenders**: *Gowans Microfinance Bank* (Bukuru, Jos South), *Bank of Agriculture (BOA)*, *NIRSAL Microfinance Bank (NMFB)*, *FirstBank*.
     - **Strategic Facilitator**: *NIRSAL Plc* (Agricultural de-risking and credit guarantees).
     - **Regulator**: *National Insurance Commission (NAICOM)* (Operating under August 2025 Insurtech Guidelines).
   - *These institutions are prospective pilot entities; they are not confirmed contractual clients.*
2. **Legal & Institutional Boundaries**:
   - The platform is **NOT** an insurance company and **NOT** a bank.
   - We do not conduct automated claim settlements, insurance underwriting, or automated loan approvals. All underwriting and credit decisions remain exclusively with licensed financial institutions.
   - Farm operational and financial data is private and governed by explicit farmer consent grants (`institutional_access_grants`) in accordance with the Nigeria Data Protection Regulation (NDPR).

---

## 7. CRITICAL DOCUMENTATION QUICK LINKS
- [docs/ARCHITECTURE.md](file:///home/japhet/Desktop/Jari/docs/ARCHITECTURE.md): Technical architecture and data flows.
- [docs/DATABASE_SCHEMA.md](file:///home/japhet/Desktop/Jari/docs/DATABASE_SCHEMA.md): Complete database entities and relations.
- [docs/API_CONTRACTS.md](file:///home/japhet/Desktop/Jari/docs/API_CONTRACTS.md): Standardized REST API endpoints and error envelopes.
- [docs/INTEGRATION_RULES.md](file:///home/japhet/Desktop/Jari/docs/INTEGRATION_RULES.md): Branching, commit conventions, and merge protocols.
- [docs/DESIGN_SYSTEM.md](file:///home/japhet/Desktop/Jari/docs/DESIGN_SYSTEM.md): Palette tokens, typography, and UI component standards.
- [docs/MVP_SCOPE.md](file:///home/japhet/Desktop/Jari/docs/MVP_SCOPE.md): 48-Hour scope triage and demo script.
- [workstreams/japhet/](file:///home/japhet/Desktop/Jari/workstreams/japhet/README.md): Japhet's development workspace.
- [workstreams/developer-2/](file:///home/japhet/Desktop/Jari/workstreams/developer-2/README.md): Developer 2's development workspace.
