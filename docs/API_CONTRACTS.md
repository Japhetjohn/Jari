# SHARED API CONTRACTS & PROTOCOLS
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Target Market**: Jos South LGA, Plateau State, Nigeria  
**Hackathon**: HackJos 2026 | Track: Agri-Finance / Farmer Inclusion  
**Status**: PROPOSED MASTER SPECIFICATION (V1.0)

---

## 1. API DESIGN CONVENTIONS

### 1.1 Base URL & Content Negotiation
- **Base Route**: `/api/v1`
- **Default Format**: `application/json`
- **Time Representation**: ISO 8601 UTC strings (`YYYY-MM-DDTHH:mm:ssZ`)
- **Currency Convention**: All monetary figures represent Nigerian Naira (`NGN`), formatted as decimals with 2 decimal places.

### 1.2 Unified Envelope Structure

#### Standard Success Response Envelope (`HTTP 200, 201`)
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  },
  "timestamp": "2026-11-04T12:00:00.000Z"
}
```

#### Standard Error Response Envelope (`HTTP 400, 401, 403, 404, 422, 500`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'flock_code' is required and must follow format FLK-YYYY-XXX",
    "details": [
      {
        "field": "flock_code",
        "issue": "Invalid pattern"
      }
    ]
  },
  "timestamp": "2026-11-04T12:00:00.000Z"
}
```

---

## 2. AUTHENTICATION & CORE CONTRACTS (SHARED)

### `POST /api/v1/auth/login`
- **Status**: PROPOSED
- **Owner**: Shared (Authentication Team)
- **Purpose**: Authenticates a user (Farmer, Insurer, Lender, Vet) and issues session/JWT.
- **Request Body**:
```json
{
  "email": "farmer@graceheights.ng",
  "password": "Password123!"
}
```
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr_99812",
      "full_name": "Japhet Dung",
      "role": "FARMER",
      "institution_id": null
    }
  },
  "message": "Authentication successful"
}
```

### `GET /api/v1/auth/me`
- **Status**: PROPOSED
- **Owner**: Shared
- **Purpose**: Returns current active session and scoped role permissions.

---

## 3. WORKSTREAM 1: FARM OPERATIONS & INSURANCE (OWNED BY JAPHET)

### 3.1 Farm & Pen Housing APIs

#### `POST /api/v1/farms`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Required Role**: `FARMER`, `ADMIN`
- **Purpose**: Onboard and register a commercial poultry farm in Jos South.
- **Request Body**:
```json
{
  "farm_name": "Grace Heights Integrated Farms",
  "registration_number": "BN-PL-2024-991",
  "state": "Plateau State",
  "lga": "Jos South",
  "community_address": "Along Zawan Road, Gyel District, Jos South",
  "gps_latitude": 9.79941,
  "gps_longitude": 8.87812,
  "total_capacity_birds": 5500,
  "biosecurity_level": "STANDARD",
  "water_source": "BOREHOLE",
  "power_backup": "SOLAR_INVERTER",
  "established_year": 2021
}
```
- **Response (`201 Created`)**: Returns created `Farm` record with auto-assigned `id`.

#### `POST /api/v1/farms/:farmId/houses`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Add poultry housing pen or brooder unit to a farm.

---

### 3.2 Flock, Mortality & Production APIs

#### `POST /api/v1/farms/:farmId/flocks`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Required Role**: `FARMER`
- **Purpose**: Register a new flock batch.
- **Request Body**:
```json
{
  "poultry_house_id": "hse_101",
  "flock_code": "FLK-2026-001",
  "bird_type": "LAYER",
  "breed": "Isa Brown",
  "initial_count": 3500,
  "hatch_date": "2026-07-15",
  "stocked_date": "2026-07-16",
  "hatchery_source": "Chi Farms Ltd",
  "status": "LAYING"
}
```

#### `POST /api/v1/flocks/:flockId/mortalities`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Log daily mortality. If mortality exceeds critical threshold (e.g., >1.5% in 24h), system raises biosecurity alert.
- **Request Body**:
```json
{
  "record_date": "2026-11-04",
  "mortality_count": 28,
  "cull_count": 4,
  "suspected_cause": "Suspected Newcastle Disease",
  "symptoms_observed": "Respiratory distress, greenish diarrheal stool, sudden egg drop",
  "disposal_method": "DEEP_BURIAL_WITH_LIME",
  "vet_notified": true
}
```

#### `POST /api/v1/flocks/:flockId/production`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Track daily egg crates/counts, broiler weight samples, and feed consumption.

#### `POST /api/v1/flocks/:flockId/vaccinations`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Log administered vaccination (Lasota, Gumboro, Marek's) with batch number and route.

---

### 3.3 Insurance Readiness & Policy APIs

#### `GET /api/v1/farms/:farmId/insurance-readiness`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Consumer**: Farmer Dashboard, Institutional Insurer Onboarding
- **Purpose**: Calculate insurance readiness score, compliance checks, and missing requirements.
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "farm_id": "frm_4401",
    "readiness_score": 85,
    "status": "INSURANCE_READY",
    "checklist": {
      "biosecurity_compliant": true,
      "mortality_log_current": true,
      "vaccination_compliant": true,
      "vet_retainer_verified": true,
      "required_documents_uploaded": false
    },
    "missing_items": [
      "Upload Veterinary Retainer Agreement with VCN Number"
    ],
    "eligible_underwriters": [
      {
        "name": "Nigerian Agricultural Insurance Corporation (NAIC)",
        "product": "Poultry Mortality Insurance Scheme",
        "partnership_type": "Prospective Pilot"
      },
      {
        "name": "AIICO Insurance PLC",
        "product": "Livestock Multi-Peril Cover",
        "partnership_type": "Prospective Pilot"
      }
    ]
  }
}
```

---

### 3.4 Incident Reporting & Claims Generation APIs

#### `POST /api/v1/farms/:farmId/incidents`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Rapid incident declaration by farmer during outbreak or loss event.
- **Request Body**:
```json
{
  "flock_id": "flk_3500_01",
  "incident_date": "2026-11-04",
  "discovery_time": "06:30",
  "incident_type": "DISEASE_OUTBREAK",
  "birds_affected": 320,
  "birds_dead": 115,
  "suspected_cause": "Acute Newcastle Disease Outbreak",
  "narrative": "Sudden sharp drop in feed intake followed by greenish diarrhea and 115 mortalities in Pen 1 overnight.",
  "immediate_actions": "Quarantined Pen 1, summoned Dr. Pam Gyang (VCN 4421), isolated sick birds."
}
```

#### `POST /api/v1/incidents/:incidentId/evidence`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Purpose**: Upload post-mortem photos, carcass disposal proofs, NVRI Vom pathology reports.

#### `POST /api/v1/incidents/:incidentId/compile-claim`
- **Status**: PROPOSED
- **Owner**: Japhet
- **Consumer**: Insurer Review Portal (Developer 2)
- **Purpose**: Assemble farm operational history, 30-day mortality records, vaccine records, vet reports, and loss valuation into an immutable claims dossier.
- **Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "claim_number": "CLM-2026-001",
    "incident_id": "inc_9901",
    "claimed_amount_ngn": 850000.00,
    "compiled_records": {
      "mortality_total": 115,
      "vaccination_adherence_percent": 100,
      "vet_attestation_present": true,
      "evidence_documents_count": 4
    },
    "submission_status": "SUBMITTED"
  },
  "message": "Structured claim package compiled and ready for authorized insurer review"
}
```

---

## 4. WORKSTREAM 2: FINANCE READINESS & INSTITUTIONAL DASHBOARD (OWNED BY DEVELOPER 2)

### 4.1 Farm Financial Profiles & Loan Applications

#### `GET /api/v1/farms/:farmId/financial-profile`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Purpose**: Compute and display farm financial readiness, bird asset valuation, cash flow trends, and mortality loss risk.
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "farm_id": "frm_4401",
    "evaluation_year": 2026,
    "annual_turnover_ngn": 24500000.00,
    "estimated_flock_asset_value_ngn": 12250000.00,
    "fixed_infrastructure_value_ngn": 18000000.00,
    "average_monthly_feed_cost_ngn": 1150000.00,
    "average_monthly_net_margin_ngn": 520000.00,
    "historical_mortality_rate_percent": 2.1,
    "finance_readiness_score": 78,
    "readiness_level": "FINANCE_READY"
  }
}
```

#### `POST /api/v1/financing/apply`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `FARMER`
- **Purpose**: Farmer packages financial profile and submits a credit application to a prospective agricultural lender.
- **Request Body**:
```json
{
  "farm_id": "frm_4401",
  "target_institution_id": "inst_gowans_mfb",
  "requested_amount_ngn": 3500000.00,
  "loan_purpose": "FLOCK_RESTOCKING",
  "proposed_tenor_months": 12,
  "repayment_cycle": "MONTHLY",
  "attach_insurance_policy": true,
  "insurance_policy_id": "pol_naic_001"
}
```

---

### 4.2 Consent & Access Grant Management

#### `POST /api/v1/farms/:farmId/access-grants`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `FARMER`
- **Purpose**: Explicit consent-based access granting an insurer or lender visibility into selected farm data.
- **Request Body**:
```json
{
  "institution_id": "inst_gowans_mfb",
  "scope": "LOAN_ASSESSMENT",
  "can_view_financials": true,
  "can_view_operational_logs": true,
  "validity_days": 60
}
```

---

### 4.3 Institutional Portals (Insurer & Lender Dashboards)

#### `GET /api/v1/institutional/insurer/claims`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `INSURER_OFFICER`
- **Purpose**: Insurer dashboard view of incoming claims submitted by authorized farms.

#### `GET /api/v1/institutional/insurer/claims/:claimId`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Consumer**: Insurer Claims Officer
- **Purpose**: Detailed claims adjudication view showing the frozen evidence dossier (compiled by Japhet's module), mortality logs, vaccination logs, and vet reports.

#### `PATCH /api/v1/institutional/insurer/claims/:claimId/status`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `INSURER_OFFICER`
- **Purpose**: Update status (e.g. `UNDER_INSPECTION`, `DOCUMENTS_REQUESTED`, `SETTLEMENT_OFFERED`, `REPUDIATED`).
- *Note: Underwriting decisions remain strictly with the institutional partner.*

#### `GET /api/v1/institutional/lender/applications`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `LENDER_OFFICER`
- **Purpose**: Agricultural loan officer dashboard (e.g. Gowans MFB, Bank of Agriculture) listing submitted loan applications with verified operational and insurance de-risking indicators.

#### `GET /api/v1/institutional/portfolio/monitoring-summary`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Required Role**: `INSURER_OFFICER`, `LENDER_OFFICER`
- **Purpose**: Portfolio-level health monitoring of financed/insured farms (mortality alerts, active flocks, operational flags).

#### `GET /api/v1/institutional/audit-logs`
- **Status**: PROPOSED
- **Owner**: Developer 2
- **Purpose**: Tamper-evident activity trail for compliance and data-access audits.

---

## 5. CROSS-WORKSTREAM API DEPENDENCY MATRIX

| Endpoint | Creator / Owner | Dependent Consumer | Purpose of Connection |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/farms/:farmId/insurance-readiness` | Japhet | Developer 2 | Institutional dashboard displays farm underwriting score |
| `POST /api/v1/incidents/:id/compile-claim` | Japhet | Developer 2 | Compiles frozen dossier consumed by Insurer Claims Review screen |
| `GET /api/v1/farms/:farmId/operational-summary` | Japhet | Developer 2 | Provides mortality and flock asset data for Finance Profile calculation |
| `POST /api/v1/farms/:farmId/access-grants` | Developer 2 | Japhet | Access control middleware checks grants before serving farm data to institutions |

