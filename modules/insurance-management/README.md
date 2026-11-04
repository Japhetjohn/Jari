# MODULE: INSURANCE MANAGEMENT
**Workstream Owner**: Japhet (Workstream 1)  
**Directory**: `modules/insurance-management/`  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. MODULE PURPOSE
The Insurance Management module bridges commercial poultry operations with prospective agricultural insurance underwriters (such as NAIC, AIICO, and Leadway). It performs dynamic insurance readiness audits based on biosecurity and operational logs, displays required pre-underwriting documentation, tracks active policy records, and monitors policy expiration and renewal dates.

---

## 2. MAIN RESPONSIBILITIES
- Calculating the dynamic Insurance Readiness Score (0 - 100%) by auditing:
  - Biosecurity infrastructure (perimeter fence, disinfection footbaths, bird isolation pens).
  - Continuous mortality record compliance (no unrecorded days in past 30 days).
  - Preventative vaccination schedule adherence (Newcastle, Gumboro, Marek's).
  - Retained veterinary oversight (Dr. Pam Gyang / VCN registration).
- Tracking required pre-insurance documents (CAC certificate, farm survey, vet agreement).
- Managing policy records (Policy number, prospective underwriter, sum insured, premium in NGN, validity period).
- Monitoring policy renewal alerts and coverage status (`ACTIVE`, `PENDING_UNDERWRITING`, `EXPIRED`).

---

## 3. PROPOSED FILES & SUBFOLDERS
```
modules/insurance-management/
├── README.md                           # This orientation document
├── components/
│   ├── InsuranceReadinessScoreGauge.tsx # Circular or bar gauge rendering 0-100% score
│   ├── BiosecurityChecklistCard.tsx    # Interactive compliance audit checklist
│   ├── PolicySummaryCard.tsx           # Active insurance coverage summary
│   ├── PolicyListTable.tsx             # Table of policies and renewal dates
│   └── UnderwriterShowcase.tsx         # Cards displaying prospective pilot underwriters (NAIC, AIICO)
├── api/
│   ├── insuranceRoutes.ts              # Route handlers for readiness and policies
│   └── readinessCalculator.ts          # Pure logic scoring engine
└── types/
    └── index.ts                        # TypeScript interfaces for readiness and policies
```

---

## 4. DATABASE MODELS
Defined in `docs/DATABASE_SCHEMA.md`:
- `insurance_readiness_assessments`
- `insurance_policies`
- `institutions` (Filtered for `INSURANCE_UNDERWRITER`)

---

## 5. API ENDPOINTS
Defined in `docs/API_CONTRACTS.md`:
- `GET /api/v1/farms/:farmId/insurance-readiness` — Returns calculated score, checklist, and missing requirements.
- `GET /api/v1/farms/:farmId/policies` — Lists all policies for farm.
- `POST /api/v1/farms/:farmId/policies` — Records a new insurance policy.

---

## 6. COMPONENTS EXPOSED TO OTHER MODULES
- `<InsuranceReadinessScoreGauge />`: Reused on the Farmer Dashboard overview and Institutional Onboarding preview.
- Active Insurance Verification Query: Used by Developer 2's `modules/finance-readiness/` to attach the "De-risked by Insurance" badge to loan applications.

---

## 7. TESTING REQUIREMENTS
1. Readiness score must correctly drop if mortality records have gaps.
2. Ensure prospective partners (NAIC, AIICO) are clearly labeled as "Prospective Pilot Partners".
3. Verify that expired policies do not return `is_active: true`.

