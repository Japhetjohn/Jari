# COMPONENTS: TABLES & DOSSIER DATA PRESENTATION
**Directory**: `components/tables/`  
**Ownership**: Shared  
**Status**: DESIGN SYSTEM SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
This directory contains high-density tabular presentation components and the specialized split-pane dossier viewer used by institutional adjusters and lenders to audit farm records.

---

## 2. COMPONENT INVENTORY
- `DataTable.tsx`: Generic, accessible data table supporting column sorting, pagination, empty states, and status pill rendering.
- `DossierView.tsx`: Two-column split-pane review layout:
  - Left pane: Metadata, claim/loan details, and structured operational history (e.g. 30-day mortality graph).
  - Right pane: Document and evidence viewer (displaying post-mortem photos, signed vet attestations, NVRI Vom pathology PDF).
- `StatusTimeline.tsx`: Vertical milestone timeline displaying historical state transitions with timestamps and user attributions.

---

## 3. INTEGRATION RULES
- Developer 2 relies on `<DossierView />` to render Japhet's compiled claim dossiers.
- All numbers and currency values rendered in `<DataTable />` must be right-aligned.

