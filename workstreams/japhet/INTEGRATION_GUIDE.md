# CROSS-WORKSTREAM INTEGRATION GUIDE: JAPHET'S MODULES
**Author**: Japhet  
**Peer Collaborator**: Developer 2  
**Workstream**: Farm Operations, Biosecurity & Insurance Infrastructure  
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  

---

## 1. INTEGRATION ARCHITECTURE

Japhet's modules (`farm-management`, `insurance-management`, `incident-claims`) serve as the primary **data generation and evidence assembly engine** for the platform.

Developer 2's modules (`finance-readiness`, `institutional-dashboard`) consume this data to facilitate credit underwriting, policy assessment, and institutional risk oversight.

```
[ Japhet's Modules ]
  │
  ├── 1. Farm Operational Stats (Mortality rate, Live bird count, Feed expense)
  │      └──> Consumed by Dev 2: [ FarmFinancialProfile & Credit Readiness ]
  │
  ├── 2. Active Insurance Policy Record
  │      └──> Consumed by Dev 2: [ De-risking Badge on Financing Application ]
  │
  └── 3. Compiled Claim Package (CLM-2026-001 + evidence_package_json)
         └──> Consumed by Dev 2: [ Insurer Claims Adjudication Portal ]
```

---

## 2. KEY DATA HANDOFFS & CONTRACTS

### 2.1 Handoff 1: Claims Dossier to Insurer Review Portal
- **Producer**: Japhet (`POST /api/v1/incidents/:id/compile-claim`)
- **Consumer**: Developer 2 (`GET /api/v1/institutional/insurer/claims/:claimId`)
- **Payload Contract**:
```typescript
interface ClaimPackagePayload {
  claim_number: string; // e.g. "CLM-2026-001"
  incident_id: string;
  farm_id: string;
  claimed_amount_ngn: number;
  compiled_at: string;
  submission_status: "SUBMITTED" | "UNDER_REVIEW" | "INSPECTION_REQUESTED" | "SETTLED" | "REPUDIATED";
  evidence_package_json: {
    incident_details: {
      type: string;
      date: string;
      dead_birds: number;
      affected_birds: number;
      suspected_cause: string;
    };
    mortality_audit_30_days: Array<{
      date: string;
      mortality_count: number;
      disposal_method: string;
    }>;
    vaccination_adherence: Array<{
      vaccine_name: string;
      scheduled_date: string;
      administered_date: string;
      batch_number: string;
      vet_verified: boolean;
    }>;
    veterinary_evidence: {
      vet_name: string;
      vcn_number: string;
      clinical_diagnosis: string;
      report_url: string;
    };
    supporting_files: Array<{
      type: string;
      url: string;
      uploaded_at: string;
    }>;
  };
}
```
- **Rule**: Once compiled, `evidence_package_json` is frozen. Developer 2 renders this exact object on the Insurer Claims Review screen.

---

### 2.2 Handoff 2: Operational History to Farm Financial Profile
- **Producer**: Japhet (`modules/farm-management/`)
- **Consumer**: Developer 2 (`modules/finance-readiness/`)
- **Contract**:
  Developer 2 queries:
  1. Current live bird asset count: `SUM(flocks.current_count WHERE status IN ('BROODING', 'GROWING', 'LAYING'))`
  2. Average monthly feed cost: `SUM(operational_expenses.total_amount_ngn WHERE category = 'FEED') / months`
  3. Historical mortality rate: `(SUM(mortality_records.mortality_count) / SUM(flocks.initial_count)) * 100`

---

### 2.3 Handoff 3: Active Insurance Indicator on Loan Applications
- **Producer**: Japhet (`insurance_policies`)
- **Consumer**: Developer 2 (`financing_applications`)
- **Contract**:
  When a farmer prepares a loan application to Gowans Microfinance Bank, Developer 2 checks if `farm.insurance_policies` contains an `ACTIVE` policy. If true, the loan application automatically attaches `insurance_policy_id` and displays the high-priority badge: **"DE-RISKED BY NAIC POULTRY POLICY"**.

---

## 3. INTEGRATION TESTING PROTOCOL

1. **Mock Data Compatibility**:
   - While Developer 2 is building the Institutional Portal, they will use mock fixture `shared/utilities/mock-data/mockClaimDossier.json`.
   - Japhet must ensure that `POST /api/v1/incidents/:id/compile-claim` produces a payload that matches this exact schema structure.
2. **Smoke Test Sequence**:
   - Japhet registers farm -> creates flock -> logs mortality -> logs incident -> compiles claim.
   - Switch user session to `role: INSURER_OFFICER`.
   - Navigate to Developer 2's `/institutional/insurer/claims`.
   - Verify that the newly compiled claim appears with all 4 evidence documents and 30-day mortality graph.

