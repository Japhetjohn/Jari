# SHARED CORE: AUTHORIZATION & ACCESS CONTROL
**Directory**: `shared/authorization/`  
**Ownership**: Shared (Developed in coordination with Developer 2)  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Authorization module enforces strict Role-Based Access Control (RBAC) and Consent-Based Scoped Access Grants in compliance with the Nigeria Data Protection Regulation (NDPR).

Commercial poultry farm records, financial statements, and veterinary documents are strictly confidential. No institutional user (insurer or lender) may access a farm's data without an active, explicit record in `institutional_access_grants`.

---

## 2. PROPOSED FILES & GUARDS
```
shared/authorization/
├── README.md                           # This orientation document
├── roleGuard.ts                        # Route middleware: requireRole(['INSURER_OFFICER'])
├── grantVerifier.ts                    # Consent checker: hasValidAccessGrant(farmId, instId, scope)
└── permissions.ts                      # Fine-grained permission bitmasks
```

---

## 3. CORE PERMISSION LOGIC
1. **Farmer Isolation**: A farmer can only read and mutate their own farm records (`farm.farmer_id === req.user.id`).
2. **Insurer Boundary**: An insurance officer can view farm operational logs, veterinary notes, and mortality histories **only** when adjudicating an active claim or reviewing an onboarding readiness request where an active grant exists.
3. **Lender Boundary**: A lending officer can view farm financial profiles, bird valuations, and loan applications **only** when the farm has granted credit assessment consent. Lenders do not have default access to raw veterinary autopsy notes.

---

## 4. INTEGRATION RULES
- Japhet's farm endpoints and Developer 2's institutional endpoints must wrap sensitive queries with `roleGuard()` and `grantVerifier()`.

