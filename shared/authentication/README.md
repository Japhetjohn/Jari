# SHARED CORE: AUTHENTICATION
**Directory**: `shared/authentication/`  
**Ownership**: Shared (Mutual Alignment Required)  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Authentication package provides unified identity management across all user personas on the platform:
- `FARMER`: Commercial poultry farm owners and managers in Jos South.
- `VET_OFFICER`: Registered veterinary practitioners (e.g. Dr. Pam Gyang, VCN 4421).
- `INSURER_OFFICER`: Claims adjusters and underwriters at prospective insurance partners (NAIC, AIICO, Leadway).
- `LENDER_OFFICER`: Agricultural credit officers at prospective lending institutions (Gowans MFB, Bank of Agriculture).
- `ADMIN`: System administrators.

---

## 2. PROPOSED FILES & INTERFACES
```
shared/authentication/
├── README.md                           # This orientation document
├── authTypes.ts                        # User session, JWT payload, and role enums
├── passwordHash.ts                     # Bcrypt / Argon2 hashing helper
├── tokenService.ts                     # JWT generation and verification utility
└── AuthContext.tsx                     # React client context provider for active user state
```

---

## 3. CORE CONTRACTS
- `POST /api/v1/auth/login`: Authenticates credentials and returns a signed token and user profile.
- `GET /api/v1/auth/me`: Validates session and returns current authenticated user details.
- Standard User Session Payload:
```typescript
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'FARMER' | 'VET_OFFICER' | 'INSURER_OFFICER' | 'LENDER_OFFICER' | 'ADMIN';
  institution_id: string | null;
}
```

---

## 4. INTEGRATION RULES
- Both Japhet and Developer 2 consume `useAuthContext()` or `req.user` to scope database queries to the active user.
- Any modification to `AuthUser` or token claims requires prior mutual agreement between both developers.

