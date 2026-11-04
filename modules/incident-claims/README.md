# MODULE: INCIDENT & CLAIMS MANAGEMENT
**Workstream Owner**: Japhet (Workstream 1)  
**Directory**: `modules/incident-claims/`  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. MODULE PURPOSE
The Incident & Claims Management module is the emergency response and evidence collection engine of the platform. When a disease outbreak (e.g. virulent Newcastle Disease, Gumboro) or environmental disaster strikes a poultry farm in Jos South, this module enables rapid incident reporting, gathers multimedia and laboratory proof, and compiles pre-incident operational logs into an auditable, immutable claims dossier (`CLM-2026-001`) for the insurer.

---

## 2. MAIN RESPONSIBILITIES
- Enabling rapid farmer declaration of disease outbreaks, mass mortality events, or facility damage.
- Uploading and cataloging supporting evidence (NVRI Vom pathology reports, post-mortem photos, signed vet attestations from Dr. Pam Gyang, carcass disposal photos).
- Compiling the structured Claims Package (`claim_packages`):
  - Freezing a 30-day pre-incident mortality log.
  - Freezing historical vaccination adherence records.
  - Attaching veterinary certifications and lab results.
  - Computing estimated financial loss in Naira based on point-of-lay valuation.
  - Generating an immutable JSON manifest (`evidence_package_json`).
- Providing the farmer with real-time claims status tracking (`SUBMITTED`, `UNDER_REVIEW`, `INSPECTION_REQUESTED`, `SETTLED`).

---

## 3. PROPOSED FILES & SUBFOLDERS
```
modules/incident-claims/
├── README.md                           # This orientation document
├── components/
│   ├── IncidentDeclarationForm.tsx     # Fast incident logging form
│   ├── IncidentEvidenceUploader.tsx    # Multi-file drag & drop evidence zone
│   ├── ClaimDossierCompiler.tsx        # 1-click package assembly engine
│   ├── ClaimSummaryCard.tsx            # Farmer overview of active claim
│   └── ClaimStatusTracker.tsx          # Step progress indicator for claim adjudication
├── api/
│   ├── claimRoutes.ts                  # Route handlers for incidents and claims
│   ├── dossierCompilerService.ts       # Service aggregating operational logs into snapshot
│   └── claimController.ts              # Data operations controller
└── types/
    └── index.ts                        # TypeScript interfaces for incidents and claim packages
```

---

## 4. DATABASE MODELS
Defined in `docs/DATABASE_SCHEMA.md`:
- `incident_reports`
- `incident_evidence`
- `claim_packages`
- `flocks`
- `mortality_records`
- `vaccination_records`

---

## 5. API ENDPOINTS
Defined in `docs/API_CONTRACTS.md`:
- `POST /api/v1/farms/:farmId/incidents` — Declare incident
- `POST /api/v1/incidents/:incidentId/evidence` — Upload evidence file
- `POST /api/v1/incidents/:incidentId/compile-claim` — Compile and freeze claims package
- `GET /api/v1/claims/:id` — Fetch claim package details

---

## 6. COMPONENTS EXPOSED TO OTHER MODULES
- Frozen `claim_packages` Payload (`evidence_package_json`): Consumed by Developer 2's `modules/institutional-dashboard/` for rendering the Insurer Claims Review Dossier.
- `<ClaimStatusTracker />`: Rendered on the Farmer Dashboard.

---

## 7. TESTING REQUIREMENTS
1. Package snapshot must remain immutable once compiled (subsequent edits to daily logs must not mutate frozen claims).
2. Claim amount must accurately reflect bird valuation in Jos South (e.g. ₦3,500 per point-of-lay layer).
3. Evidence uploader must accept PDF lab reports and JPEG/PNG post-mortem photos.

