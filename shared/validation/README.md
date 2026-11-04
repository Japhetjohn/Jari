# SHARED CORE: VALIDATION SCHEMAS
**Directory**: `shared/validation/`  
**Ownership**: Shared  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Validation module centralizes input validation schemas (e.g. using Zod or standard JSON schema validators). It guarantees that client-side forms and server-side API endpoints enforce identical validation logic, rejecting malformed inputs before database persistence.

---

## 2. PROPOSED SCHEMAS
```
shared/validation/
├── README.md                           # This orientation document
├── farmSchemas.ts                      # Onboarding, house, and flock input validators
├── operationalSchemas.ts               # Mortality, egg production, and expense validators
├── incidentSchemas.ts                  # Disease outbreak and evidence upload validators
├── financeSchemas.ts                   # Loan application and financial profile validators
└── authSchemas.ts                      # Login and user registration validators
```

---

## 3. CORE VALIDATION RULES
- **Mortality Record**:
  - `mortality_count >= 0`
  - `cull_count >= 0`
  - `record_date` must not be in the future.
  - `disposal_method` must be one of `['DEEP_BURIAL_WITH_LIME', 'INCINERATION', 'CARCASS_PIT']`.
- **Loan Application**:
  - `requested_amount_ngn >= 100000`
  - `proposed_tenor_months` between 1 and 36.
  - `target_institution_id` must match a valid institution.
- **Flock Code**:
  - Must follow regex pattern `/^FLK-[0-9]{4}-[0-9]{3,}$/`.

---

## 4. INTEGRATION RULES
- Both frontend form components and backend API controllers must import the same schemas from `shared/validation/`.

