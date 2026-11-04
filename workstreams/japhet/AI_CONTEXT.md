# AI ENGINEERING CONTEXT: WORKSTREAM 1 (JAPHET)
**Context Target**: ChatGPT / Antigravity / Claude Coding Assistant  
**Developer**: Japhet  
**Assigned Workstream**: Farm Operations, Biosecurity & Insurance Infrastructure  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026 | Initial Target: Jos South LGA, Plateau State, Nigeria  

---

## 1. PROJECT SUMMARY & DOMAIN PROBLEM

Commercial poultry farms in Jos South (Plateau State, Nigeria) face severe financial exposure. Disease outbreaks (e.g., virulent Newcastle Disease, Infectious Bursal Disease / Gumboro, Avian Influenza) and environmental hazards can wipe out millions of Naira in invested flock capital within 48 to 72 hours.

Field research in Jos South reveals that:
- **69% of poultry farmers experience crippling delays in insurance indemnity**.
- **55% report severe delays in loss assessment**.
- **50% cite administrative bottlenecks** in assembling farm records, veterinary evidence, and post-mortem certifications.

Meanwhile, agricultural underwriters (such as NAIC, AIICO, and Leadway) and agricultural lenders (such as Gowans Microfinance Bank and Bank of Agriculture) struggle with an acute **information gap**: they lack structured, verifiable, and historical operational data to assess farm risk, underwrite policies, verify genuine claims, and extend working capital.

### The Solution
Jari is **NOT** a generic farm inventory app. It is a **Commercial Poultry Insurance & Finance Readiness Infrastructure**. It converts daily farm activities (flock lifecycle, daily mortality logs, vaccination adherence, veterinary inspections, biosecurity protocols, feed expenses) into:
1. **Underwriting Readiness**: Objective scores and checklists for insurance policy onboarding.
2. **Immutable Claims Evidence Dossiers**: 1-click structured packages linking pre-incident records to post-mortem evidence when disaster strikes.
3. **Credit Verification Data**: Auditable operational histories provided to Developer 2's financing modules.

---

## 2. JAPHET'S MODULE RESPONSIBILITIES & SCOPE BOUNDARIES

### What You Build:
You own **Workstream 1**, encompassing three core modules:
1. `modules/farm-management/`:
   - Farm registration & onboarding (Plateau State, Jos South LGA, Gyel/Bukuru districts, 2,000+ commercial birds scale).
   - Poultry pen/housing registration (Deep litter, battery cages, ventilation).
   - Flock batch tracking (Isa Brown Layers, Cobb 500 Broilers, hatch date, stocking date).
   - Daily mortality logging (mortality count, symptoms, disposal method: deep burial with lime).
   - Production & egg collection tracking (crates, cracks, bird weights).
   - Vaccination scheduling & adherence logs (Newcastle Lasota/Clone 30, Gumboro IBD, Marek's).
   - Veterinary clinical visits & post-mortem records (Dr. Pam Gyang, VCN-4421).
   - Operational expenses (Feed bags, vaccines, biosecurity disinfectants).
2. `modules/insurance-management/`:
   - Insurance readiness calculator (0-100 score based on biosecurity, complete logs, vet retainer).
   - Policy records tracker (NAIC Poultry Mortality Scheme, AIICO Livestock Policy).
3. `modules/incident-claims/`:
   - Rapid incident outbreak declaration form.
   - Evidence uploader (NVRI Vom pathology reports, signed vet attestations, carcass disposal photos).
   - Claims package compilation engine (`claim_packages`) that freezes operational history into a JSON manifest (`evidence_package_json`).

### Scope Boundaries (What You Must NOT Build or Modify):
- **Do NOT build**: Loan application forms, lender credit assessment screens, or institutional dashboards. These belong to **Developer 2**.
- **Do NOT modify**: `modules/finance-readiness/` or `modules/institutional-dashboard/`.
- **Do NOT touch**: `shared/` core files without explicit coordination.
- **Do NOT invent fake insurance companies**: Prospective partners in Jos South are *Nigerian Agricultural Insurance Corporation (NAIC)*, *AIICO Insurance PLC*, and *Leadway Assurance*. Clearly label them as prospective pilot partners.
- **Do NOT build automated claim approval or underwriting**: The platform compiles documentation; the insurer retains exclusive legal authority to investigate and settle claims.

---

## 3. ARCHITECTURE & TECHNOLOGY STACK

- **Platform Core**: Node.js v25+ / TypeScript / SQLite (Prisma/Drizzle/SQL standard).
- **Architecture**: Modular Domain-Driven Architecture with shared contracts.
- **Data Flow**:
  1. Japhet captures farm operational and incident data.
  2. Japhet freezes and stores claims packages in `claim_packages`.
  3. Developer 2 consumes `claim_packages` and `farms` operational stats to render institutional views and financial profiles.

---

## 4. DATABASE MODELS ASSIGNED TO JAPHET

Review `docs/DATABASE_SCHEMA.md` for exact column definitions:
- `farms`: Primary agricultural business entity (Jos South, coordinates, biosecurity level).
- `poultry_houses`: Physical pen structures.
- `flocks`: Batch batches (`flock_code` e.g. `FLK-2026-001`, `initial_count`, `current_count`).
- `mortality_records`: Daily deaths (`mortality_count`, `suspected_cause`, `disposal_method`).
- `production_records`: Daily egg crates and feed consumption.
- `vaccination_records`: Vaccine name, batch number, date, route, vet verification.
- `veterinary_visits`: Dr. Pam Gyang VCN reports and pathology findings.
- `operational_expenses`: Feed purchases and medication expenses in NGN.
- `insurance_readiness_assessments`: Calculated score (0-100) and missing checklist items.
- `insurance_policies`: Policy numbers, underwriters, sum insured, inception/expiry dates.
- `incident_reports`: Outbreak notifications (`incident_code`, affected birds, dead birds).
- `incident_evidence`: Uploaded files (NVRI Vom lab reports, disposal photos).
- `claim_packages`: Compiled dossier (`CLM-2026-001`, `evidence_package_json`, status).

---

## 5. API CONTRACTS ASSIGNED TO JAPHET

Review `docs/API_CONTRACTS.md` for exact request and response schemas:
- `POST /api/v1/farms` — Register commercial poultry farm.
- `POST /api/v1/farms/:farmId/houses` — Create pen unit.
- `POST /api/v1/farms/:farmId/flocks` — Stock new flock.
- `POST /api/v1/flocks/:flockId/mortalities` — Log daily mortality.
- `POST /api/v1/flocks/:flockId/production` — Log egg collection.
- `POST /api/v1/flocks/:flockId/vaccinations` — Log administered vaccine.
- `POST /api/v1/farms/:farmId/expenses` — Log feed or medical expense.
- `GET /api/v1/farms/:farmId/insurance-readiness` — Fetch readiness audit.
- `POST /api/v1/farms/:farmId/incidents` — Declare outbreak.
- `POST /api/v1/incidents/:incidentId/evidence` — Upload evidence file.
- `POST /api/v1/incidents/:incidentId/compile-claim` — Compile and freeze claims package.

All endpoints must return the standardized envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "...",
  "timestamp": "2026-11-04T12:00:00.000Z"
}
```

---

## 6. SHARED DESIGN SYSTEM CONVENTIONS

- **Styling**: Tailwind CSS / CSS Modules following `docs/DESIGN_SYSTEM.md`.
- **Primary Agricultural Green**: `#059669` (Emerald 600), Hover: `#047857`.
- **Critical Outbreak Red**: `#DC2626` (Red 600) for mortality alerts.
- **Amber Warning**: `#D97706` for pending vaccines and incomplete readiness.
- **Currency**: Always format Nigerian Naira as `₦1,250,000.00` using `<CurrencyInput>` or `formatNaira()` utility.
- **Reference Codes**: Display flock and claim codes in monospace pills (`font-mono bg-slate-100 px-2 py-0.5 rounded text-xs`).
- **Reusable Components to Use**:
  - `components/common/Button.tsx`
  - `components/common/Card.tsx`
  - `components/common/Badge.tsx`
  - `components/common/Modal.tsx`
  - `components/forms/FormField.tsx`
  - `components/forms/CurrencyInput.tsx`
  - `components/tables/DataTable.tsx`

---

## 7. SIMULATED DEMO SCENARIO FOR JAPHET'S MODULES

For testing and demonstration at HackJos 2026:
- **Farm**: Grace Heights Integrated Poultry Farms, Gyel District, Jos South.
- **Flock 1**: 3,500 Isa Brown Layers (Day 114, active lay in Pen 1).
- **Incident**: Virulent Newcastle Outbreak causing 115 mortalities overnight.
- **Vet Attestation**: Signed by Dr. Pam Gyang (VCN-4421).
- **Lab Evidence**: NVRI Vom Preliminary Post-Mortem Report.
- **Claim Generated**: `CLM-2026-001` claiming ₦850,000 against prospective underwriter NAIC.

---

## 8. STRICT AI INSTRUCTIONS FOR JAPHET'S WORKSTREAM

When instructed to implement a feature:
1. **Read this file (`AI_CONTEXT.md`) and `docs/DATABASE_SCHEMA.md` first**.
2. **Inspect existing files in `modules/farm-management/`, `modules/insurance-management/`, and `modules/incident-claims/` before writing code**.
3. **Reuse existing components in `components/` and utilities in `shared/`**.
4. **Never create competing duplicate components** (e.g. do not create a custom button if `<Button />` exists in `components/common/Button.tsx`).
5. **Never touch Developer 2's modules** (`modules/finance-readiness/` or `modules/institutional-dashboard/`).
6. **Ensure all data types match `docs/DATABASE_SCHEMA.md`**.
7. **After implementing code, update `workstreams/japhet/PROGRESS.md`**.

