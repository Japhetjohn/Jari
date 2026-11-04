# SHARED CORE: UTILITIES & MOCK FIXTURES
**Directory**: `shared/utilities/`  
**Ownership**: Shared  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Utilities package provides common formatting helpers, date math, currency transformers, calculation routines, and static mock data fixtures to enable asynchronous decoupling between developers during the hackathon.

---

## 2. PROPOSED FILES & HELPERS
```
shared/utilities/
├── README.md                           # This orientation document
├── currency.ts                         # formatNaira(amount) -> "₦1,250,000.00"
├── dateUtils.ts                        # ISO date formatting, cycle day math, days-to-lay calculators
├── codeGenerators.ts                   # Generates human-readable codes (FLK-2026-001, CLM-2026-001)
└── mock-data/
    ├── mockFarm.json                   # Grace Heights Farm test fixture
    ├── mockClaimDossier.json           # Frozen Newcastle disease claim CLM-2026-001 fixture
    ├── mockFinancialProfile.json       # Farm financial statement fixture
    └── mockLoanApplication.json        # Gowans MFB loan request FIN-2026-001 fixture
```

---

## 3. KEY UTILITY FUNCTIONS
- `formatNaira(amount: number): string`: Formats numbers into Nigerian standard currency string (`₦2,500,000.00`).
- `generateReferenceCode(prefix: string, sequence: number): string`: Generates prefixed codes (`FLK-2026-001`, `CLM-2026-001`, `FIN-2026-001`).
- `calculateFlockAgeDays(stockedDate: string): number`: Computes flock age in days for broiler FCR or layer maturity stages.

---

## 4. INTEGRATION RULES
- Both developers must use `formatNaira` for all currency representations on the frontend and in documents to ensure visual consistency.
- Developers may use the mock fixtures in `shared/utilities/mock-data/` to test UI components before backend endpoints are merged.

