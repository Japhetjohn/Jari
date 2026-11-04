# SHARED CORE: DATABASE & MIGRATIONS
**Directory**: `shared/database/`  
**Ownership**: Shared (Strict Schema Synchronization)  
**Status**: ARCHITECTURAL SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
The Database package manages database connection pooling, query execution, migrations, and demo seed data fixtures for the entire platform.

For the HackJos 2026 hackathon, the local environment uses **SQLite3** for rapid zero-dependency prototyping, while maintaining full compatibility with **PostgreSQL** for production deployment.

---

## 2. PROPOSED FILES & UTILITIES
```
shared/database/
├── README.md                           # This orientation document
├── client.ts                           # Database connection client (Prisma / Drizzle / SQLite wrapper)
├── schema.sql                          # Raw DDL statements matching docs/DATABASE_SCHEMA.md
├── migrations/                         # Migration scripts
└── seeds/
    ├── seedJosSouthFarms.ts            # Realistic demo data (Grace Heights, 3,500 layers)
    ├── seedInstitutions.ts             # Prospective partners (NAIC, Gowans MFB, AIICO, BOA)
    └── seedDemoIncident.ts             # Virulent Newcastle outbreak scenario (CLM-2026-001)
```

---

## 3. SEED DATA SPECIFICATION
The seed scripts populate:
- **Demo Farm**: *Grace Heights Integrated Poultry Farms*, Gyel, Jos South LGA.
- **Flock 1**: 3,500 Isa Brown Layers (Day 114, active lay).
- **Flock 2**: 2,000 Cobb 500 Broilers (Day 28).
- **Retained Vet**: Dr. Pam Gyang, DVM (VCN: 4421).
- **Demo Insurer**: Nigerian Agricultural Insurance Corporation (NAIC) — Plateau Zonal Office.
- **Demo Lender**: Gowans Microfinance Bank — Bukuru Branch.
- **Demo Incident**: Outbreak of Newcastle Disease (115 mortalities, ₦850,000 claim `CLM-2026-001`).

---

## 4. INTEGRATION RULES
- **Never alter table definitions in code without updating `docs/DATABASE_SCHEMA.md` first**.
- Both developers must run against the same seed data to ensure reproducible end-to-end testing.

