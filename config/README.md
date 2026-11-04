# CONFIGURATION & ENVIRONMENT SPECIFICATION
**Directory**: `config/`  
**Ownership**: Shared  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Config directory contains application configuration, environment variable definitions, agricultural domain constants, and prospective partner institution metadata.

---

## 2. PROPOSED FILES
```
config/
├── README.md                           # This orientation document
├── env.ts                              # Type-safe environment variable parser
├── agriculturalConstants.ts            # Standard rates (bird salvage value, feed weights)
├── institutions.ts                     # Prospective pilot partner profiles (NAIC, Gowans MFB, BOA)
└── regionalDefaults.ts                 # Jos South LGA defaults (coordinates, districts)
```

---

## 3. REGIONAL & AGRICULTURAL DEFAULTS (JOS SOUTH)
- **Target LGA**: Jos South LGA, Plateau State, Nigeria.
- **Districts**: Gyel, Bukuru, Kuru, Du, Vwang.
- **Standard Geo-Coordinates**: Latitude `9.79941`, Longitude `8.87812`.
- **Target Scale**: Commercial poultry farms with >2,000 birds.
- **Bird Salvage / Valuation Rates**:
  - Point-of-lay Layer: ₦3,500
  - Mature Broiler: ₦3,000
  - Day-Old-Chick: ₦900
- **Standard Feed Bag Size**: 25kg (TopFeeds, Hybrid, Animal Care).
- **Critical Daily Mortality Alert Threshold**: `>1.5%` of live birds in 24 hours.

---

## 4. PROSPECTIVE PARTNER REGISTRY
The following prospective pilot partners are registered in `config/institutions.ts`:
1. **Nigerian Agricultural Insurance Corporation (NAIC)** (Plateau Zonal Office) — Insurance Partner
2. **AIICO Insurance PLC** — Insurance Partner
3. **Leadway Assurance Company Limited** — Insurance Partner
4. **Gowans Microfinance Bank** (Bukuru Branch, Jos South) — Local Lending Partner
5. **Bank of Agriculture (BOA)** (Plateau Branch) — Agricultural Development Bank
6. **NIRSAL Microfinance Bank (NMFB)** — SME / Agribusiness Lending Partner
7. **NIRSAL Plc** — De-risking & Credit Risk Guarantees (Strategic Facilitation Partner)
8. **National Insurance Commission (NAICOM)** — Regulatory Body

*All UI displays must clearly mark these institutions as prospective pilot partners.*

