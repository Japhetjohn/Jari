# COMPONENTS: NAVIGATION & SHELL
**Directory**: `components/navigation/`  
**Ownership**: Shared  
**Status**: DESIGN SYSTEM SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
This directory contains application shell and navigation components tailored for the two distinct platform interfaces:
1. **Farmer Portal**: Focused on daily farm operations, mortality logging, insurance readiness, incident reporting, and financing.
2. **Institutional Portal**: Focused on insurance claims adjudication, lender credit assessment, portfolio risk monitoring, and compliance audit logs.

---

## 2. COMPONENT INVENTORY
- `FarmerNavbar.tsx`: Top header navigation for commercial poultry operators (Links: Dashboard, Flocks & Pens, Daily Logs, Insurance Readiness, Incidents & Claims, Finance).
- `InstitutionalNavbar.tsx`: Professional Slate 900 header for underwriters and lenders (Links: Overview, Claims Workbench, Loan Applications, Financed Farms Monitor, Audit Log).
- `PersonaSwitcher.tsx`: Demo helper allowing hackathon evaluators to toggle seamlessly between Farmer, NAIC Insurer, and Gowans MFB Loan Officer personas.
- `Breadcrumbs.tsx`: Path indicator for deep dossier inspection screens (e.g. `Claims > CLM-2026-001 > Evidence Review`).

---

## 3. INTEGRATION RULES
- The `PersonaSwitcher` component is strictly for hackathon demonstration to let judges evaluate the multi-stakeholder workflow with one click.

