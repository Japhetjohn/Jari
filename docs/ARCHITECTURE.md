# SYSTEM ARCHITECTURE & TECHNICAL BLUEPRINT
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026 | Track: Agri-Finance / Farmer Inclusion  
**Status**: APPROVED ARCHITECTURE BLUEPRINT (V1.0)

---

## 1. ARCHITECTURAL OVERVIEW

The Jari platform is an integrated, modular web infrastructure designed to connect commercial poultry farmers in Jos South, Plateau State, with prospective agricultural insurers and lenders.

```
+-----------------------------------------------------------------------------------------+
|                                      CLIENT LAYER                                       |
|  +-------------------------------------+       +-------------------------------------+  |
|  |     Farmer Operational Portal       |       |       Institutional Portal          |  |
|  |   - Farm Setup & Pen Management     |       |   - Insurer Claims Adjudication     |  |
|  |   - Daily Mortality & Egg Logging   |       |   - Lender Credit Assessment        |  |
|  |   - Incident Outbreak Declaration   |       |   - Financed Farm Risk Monitor      |  |
|  |   - Claims Dossier Compilation      |       |   - Audit & Compliance Trail        |  |
|  +-------------------------------------+       +-------------------------------------+  |
+-----------------------------------------------------------------------------------------+
                                             |
                                    REST API / JSON
                                             v
+-----------------------------------------------------------------------------------------+
|                                    APPLICATION LAYER                                    |
|                                                                                         |
|  [ modules/farm-management ]        [ modules/insurance-mgmt ]   [ modules/incident-claims ] |
|  - Farm & Pen Registry              - Readiness Evaluator         - Outbreak Logger        |
|  - Flock Lifecycle Batching         - Policy Document Tracker     - Evidence Uploader      |
|  - Daily Mortality & Production     - Biosecurity Audit           - Claims Dossier Packer  |
|                                                                                         |
|  [ modules/finance-readiness ]      [ modules/institutional-dashboard ]                 |
|  - Farm Business & Asset Valuation   - Insurer Review Workbench                         |
|  - Cashflow & Feed Expense Aggreg.   - Lender Loan Assessment Workbench                 |
|  - Loan Application Prep Engine      - Portfolio Health & Incident Alert Stream         |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                                  SHARED CORE                                      |  |
|  |  - shared/authentication : Session, JWT, Role Guard (Farmer, Insurer, Lender)     |  |
|  |  - shared/authorization  : Consent-based Scoped Access Grants                      |  |
|  |  - shared/database       : Schema, ORM / Query Client, Migration Engine           |  |
|  |  - shared/validation     : Zod / Schema Validator for Requests & Forms            |  |
|  |  - shared/middleware     : Audit Logger, Error Boundary, Request Context          |  |
|  |  - shared/utilities      : Currency Formatters, Date Math, Mock Data Fixtures     |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
                                             |
                                       DATABASE LAYER
                                             v
+-----------------------------------------------------------------------------------------+
|                    SQLite (Hackathon Local) / PostgreSQL (Production)                   |
|  - Tables: users, institutions, farms, poultry_houses, flocks, mortality_records,       |
|            production_records, vaccination_records, operational_expenses,               |
|            insurance_readiness, insurance_policies, incident_reports,                   |
|            incident_evidence, claim_packages, farm_financial_profiles,                  |
|            financing_applications, access_grants, audit_logs.                           |
+-----------------------------------------------------------------------------------------+
```

---

## 2. TECHNOLOGY STACK RECOMMENDATION

Following our codebase audit:
- The local environment possesses **Node.js (v25.7.0)**, **npm (11.11.1)**, **Python 3.14.3**, and **SQLite3**.
- For a fast 48-hour hackathon involving two developers sharing a single integrated repository, a **TypeScript full-stack architecture** (e.g., Next.js 14/15 App Router or Express + React + Tailwind CSS + SQLite via Prisma/Drizzle) offers the highest velocity, zero-serialization mismatch, and clean modular component reuse.
- All database schemas and API contracts in `docs/DATABASE_SCHEMA.md` and `docs/API_CONTRACTS.md` are defined using standard relational typing and REST JSON envelopes, enabling implementation in either:
  1. **Next.js Full-Stack (Recommended)**: React Server Components / Client Components for UI, Route Handlers (`/api/...`) for backend endpoints, and SQLite via Prisma/Drizzle.
  2. **Express.js API + Vite/React SPA**: Decoupled Node backend and React frontend.

---

## 3. UNIFIED PROJECT DIRECTORY BLUEPRINT

```
Jari/
├── docs/                               # Shared architectural & product source of truth
│   ├── ARCHITECTURE.md                 # System overview and technology blueprints
│   ├── DATABASE_SCHEMA.md              # Relational models, constraints, data types
│   ├── API_CONTRACTS.md                # Standardized REST endpoint specifications
│   ├── INTEGRATION_RULES.md            # Git branching, merge protocols, commit rules
│   ├── DESIGN_SYSTEM.md                # Design tokens, color palette, component styles
│   └── MVP_SCOPE.md                    # 48-hour prioritized scope and demo scenarios
│
├── workstreams/                        # Dedicated developer workspaces
│   ├── japhet/                         # Workstream 1: Farm Operations & Insurance
│   │   ├── README.md                   # Japhet workspace orientation
│   │   ├── AI_CONTEXT.md               # Context file for AI assistants (Antigravity/ChatGPT)
│   │   ├── MODULE_OWNERSHIP.md         # File boundaries, dependencies, assigned tasks
│   │   ├── TASK_PROMPT_TEMPLATE.md     # Reusable prompt for feature implementation
│   │   ├── INTEGRATION_GUIDE.md        # Communication with Shared Core & Dev 2
│   │   └── PROGRESS.md                 # Live checklist, status, and blockers
│   │
│   └── developer-2/                    # Workstream 2: Finance Readiness & Institutions
│       ├── README.md                   # Developer 2 workspace orientation
│       ├── AI_CONTEXT.md               # Context file for AI assistants
│       ├── MODULE_OWNERSHIP.md         # File boundaries, dependencies, assigned tasks
│       ├── TASK_PROMPT_TEMPLATE.md     # Reusable prompt for feature implementation
│       ├── INTEGRATION_GUIDE.md        # Communication with Shared Core & Japhet
│       └── PROGRESS.md                 # Live checklist, status, and blockers
│
├── modules/                            # Domain-driven functional modules
│   ├── farm-management/                # Farms, pens, flocks, mortality, egg tracking
│   ├── insurance-management/           # Readiness score, biosecurity, policy tracking
│   ├── incident-claims/                # Incident declaration, evidence upload, claim packs
│   ├── finance-readiness/              # Asset valuation, cash flows, loan applications
│   └── institutional-dashboard/        # Insurer & lender reviews, portfolio monitoring
│
├── shared/                             # Reusable foundational infrastructure
│   ├── authentication/                 # Auth tokens, password hashing, session context
│   ├── authorization/                  # RBAC guards & consent access grants
│   ├── database/                       # Database client, migrations, seed fixtures
│   ├── middleware/                     # Error handling, request logging, audit tracking
│   ├── utilities/                      # Date/currency helpers, calculation math
│   └── validation/                     # Request validation schemas
│
├── components/                         # Shared UI component library
│   ├── common/                         # Buttons, badges, modals, cards, spinners
│   ├── forms/                          # Text inputs, currency inputs, dropzones
│   ├── navigation/                     # Navbar, breadcrumbs, sidebar navigation
│   └── tables/                         # Data tables, pagination, dossier split-views
│
├── routes/                             # Top-level application routing definitions
├── config/                             # Global app config, environment variables
└── README.md                           # Master repository orientation
```

---

## 4. SECURITY, DATA PRIVACY & COMPLIANCE

1. **Nigeria Data Protection Regulation (NDPR)**:
   - Farmer records, veterinary reports, and farm financials are private by default.
   - Access to any institutional party requires an explicit, active `institutional_access_grants` record granted by the farm owner.
2. **Access Isolation (Lender vs. Insurer)**:
   - An insurance officer has **no default access** to a farm's bank statements or detailed loan application.
   - A loan officer has **no default access** to detailed incident post-mortem lab notes unless linked to a declared insurance de-risking claim.
3. **Immutability of Claim Packages**:
   - When a claim package (`claim_packages`) is compiled, a snapshot of the linked mortality logs, flock records, and vet attestations is serialized into `evidence_package_json`. Subsequent edits to the daily logs do not alter the frozen claim evidence.

